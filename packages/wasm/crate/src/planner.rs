use anyhow::anyhow;
use decaf377::{Fq, Fr};
use penumbra_asset::asset::{Denom, Id, Metadata};
use penumbra_asset::Value;
use penumbra_auction::auction::dutch::actions::ActionDutchAuctionWithdrawPlan;
use penumbra_auction::auction::dutch::{
    ActionDutchAuctionEnd, ActionDutchAuctionSchedule, DutchAuctionDescription,
};
use penumbra_auction::auction::{AuctionId, AuctionNft};
use penumbra_dex::lp::plan::{PositionOpenPlan, PositionWithdrawPlan};
use penumbra_dex::lp::PositionMetadata;
use penumbra_dex::swap_claim::SwapClaimPlan;
use penumbra_dex::{
    swap::{SwapPlaintext, SwapPlan},
    PositionClose, TradingPair,
};
use penumbra_fee::FeeTier;
use penumbra_funding::liquidity_tournament::ActionLiquidityTournamentVotePlan;
use penumbra_governance::DelegatorVotePlan;
use penumbra_keys::keys::AddressIndex;
use penumbra_keys::{Address, FullViewingKey};
use penumbra_num::Amount;
use penumbra_proto::core::app::v1::AppParameters;
use penumbra_proto::core::component::ibc;
use penumbra_proto::view::v1::{
    transaction_planner_request as tpr, NotesRequest, TransactionPlannerRequest,
};
use penumbra_proto::{DomainType, Message};
use penumbra_sct::params::SctParameters;
use penumbra_shielded_pool::{fmd, Note, OutputPlan, SpendPlan};
use penumbra_stake::rate::RateData;
use penumbra_stake::{IdentityKey, Penalty, Undelegate, UndelegateClaimPlan};
use penumbra_tct::Position;
use penumbra_transaction::gas::swap_claim_gas_cost;
use penumbra_transaction::memo::MemoPlaintext;
use penumbra_transaction::{plan::MemoPlan, ActionPlan, TransactionParameters};
use penumbra_transaction::{ActionList, TransactionPlan};
use rand_core::{OsRng, RngCore};
use std::collections::BTreeMap;
use std::mem;
use std::num::{NonZero, NonZeroU32};
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsValue;

use crate::database::interface::Database;
use crate::error::WasmError;
use crate::metadata::customize_symbol_inner;
use crate::note_record::SpendableNoteRecord;
use crate::storage::{init_idb_storage, DbConstants, OutstandingReserves, Storage};
use crate::utils;
use crate::{error::WasmResult, swap_record::SwapRecord};

/// Prioritize notes to spend to release value of a specific transaction.
///
/// Various logic is possible for note selection. Currently, this method
/// prioritizes notes sent to a one-time address, then notes with the largest
/// value:
///
/// - Prioritizing notes sent to one-time addresses optimizes for a future in
///    which we implement DAGSync keyed by fuzzy message detection (which will not
///    be able to detect notes sent to one-time addresses). Spending these notes
///    immediately converts them into change notes, sent to the default address for
///    the users' account, which are detectable.
///
/// - Prioritizing notes with the largest value optimizes for gas used by the
///    transaction.
///
/// We may want to make note prioritization configurable in the future. For
/// instance, a user might prefer a note prioritization strategy that harvested
/// capital losses when possible, using cost basis information retained by the
/// view server.
fn prioritize_and_filter_spendable_notes(
    records: Vec<SpendableNoteRecord>,
) -> Vec<SpendableNoteRecord> {
    let mut filtered = records
        .into_iter()
        .filter(|record| record.note.amount() > Amount::zero())
        .collect::<Vec<_>>();

    filtered.sort_by(|a, b| {
        // Sort by whether the note was sent to an ephemeral address...
        match (
            a.address_index.is_ephemeral(),
            b.address_index.is_ephemeral(),
        ) {
            (true, false) => std::cmp::Ordering::Less,
            (false, true) => std::cmp::Ordering::Greater,
            // ... then by largest amount.
            _ => b.note.amount().cmp(&a.note.amount()),
        }
    });

    filtered
}

/// When planning an undelegate action, there may not be metadata yet in the
/// IndexedDB database for the unbonding token that the transaction will output.
/// That's because unbonding tokens are tied to a specific height. If unbonding
/// token metadata for a given validator and a given height doesn't exist yet,
/// we'll generate it here and save it to the database, so that the undelegate
/// action renders correctly in the transaction approval dialog.
async fn save_unbonding_token_metadata_if_needed<Db: Database>(
    undelegate: &Undelegate,
    storage: &Storage<Db>,
) -> WasmResult<()> {
    let metadata = undelegate.unbonding_token().denom();

    save_metadata_if_needed(metadata, storage).await
}

/// When planning Dutch auction-related actions, there will not be metadata yet
/// in the IndexedDB database for the auction NFT that the transaction will
/// output. That's because auction NFTs are derived from information about the
/// auction (for example, an NFT corresponding to a newly started auction is
/// dervived from the auction description parameters, which include a nonce). So
/// we'll generate the metadata here and save it to the database, so that the
/// action renders correctly in the transaction approval dialog.
async fn save_auction_nft_metadata_if_needed<Db: Database>(
    id: AuctionId,
    storage: &Storage<Db>,
    seq: u64,
) -> WasmResult<()> {
    let nft = AuctionNft::new(id, seq);
    let metadata = nft.metadata;

    save_metadata_if_needed(metadata, storage).await
}

async fn save_metadata_if_needed<Db: Database>(
    metadata: Metadata,
    storage: &Storage<Db>,
) -> WasmResult<()> {
    if storage.get_asset(&metadata.id()).await?.is_none() {
        let metadata_proto = metadata.to_proto();
        let customized_metadata_proto = customize_symbol_inner(metadata_proto)?;
        let customized_metadata = Metadata::try_from(customized_metadata_proto)?;
        storage.add_asset(&customized_metadata).await
    } else {
        Ok(())
    }
}

// Used to augment error message with denom metadata for a more readable error
pub async fn insufficient_funds_err<Db: Database>(
    storage: &Storage<Db>,
    required: &Value,
) -> WasmError {
    let metadata_result = storage.get_asset(&required.asset_id).await;
    let error_message = match metadata_result {
        Ok(Some(asset_metadata)) => {
            let display_unit = asset_metadata.default_unit();
            format!(
                "Transaction failed due to insufficient funds. Required amount: {} {}.",
                display_unit.format_value(required.amount),
                display_unit
            )
        }
        // Gracefully handle cases when database errors or does not have metadata for asset
        _ => "Transaction failed due to insufficient funds".to_string(),
    };
    anyhow!(error_message).into()
}

/// Process a `TransactionPlannerRequest`, returning a `TransactionPlan`
#[wasm_bindgen]
pub async fn plan_transaction(
    idb_constants: JsValue,
    request: &[u8],
    full_viewing_key: &[u8],
    gas_fee_token: &[u8],
) -> WasmResult<JsValue> {
    utils::set_panic_hook();

    let tx_planner_req = TransactionPlannerRequest::decode(request)
        .expect("transaction planner request is malformed");
    let fvk: FullViewingKey = FullViewingKey::decode(full_viewing_key)?;
    let fee_asset_id = Id::decode(gas_fee_token)?;
    let constants: DbConstants = serde_wasm_bindgen::from_value(idb_constants)?;
    let storage = init_idb_storage(constants).await?;

    let plan = plan_transaction_inner(storage, tx_planner_req, fvk, fee_asset_id).await?;

    Ok(serde_wasm_bindgen::to_value(&plan)?)
}

pub async fn plan_transaction_inner<Db: Database>(
    storage: Storage<Db>,
    request: TransactionPlannerRequest,
    fvk: FullViewingKey,
    fee_asset_id: Id,
) -> WasmResult<TransactionPlan> {
    let expiry_height: u64 = request.expiry_height;

    let mut source_address_index: AddressIndex = request
        .source
        .clone()
        .map(TryInto::try_into)
        .transpose()?
        .unwrap_or_default();

    // Wipe out the randomizer for the provided source, since
    // 1. All randomizers correspond to the same account
    // 2. Using one-time addresses for change addresses is undesirable.
    source_address_index.randomizer = [0u8; 12];

    // Compute the change address for this transaction.
    let (mut change_address, _) = fvk
        .incoming()
        .payment_address(source_address_index.account.into());

    let fmd_params: fmd::Parameters = storage
        .get_fmd_params()
        .await?
        .ok_or_else(|| anyhow!("FmdParameters not available"))?;

    let app_parameters: AppParameters = storage
        .get_app_params()
        .await?
        .ok_or_else(|| anyhow!("AppParameters not available"))?;

    let sct_params: SctParameters = app_parameters
        .sct_params
        .ok_or_else(|| anyhow!("SctParameters not available"))?
        .try_into()?;

    let chain_id: String = app_parameters.chain_id;

    // Request information about current gas prices
    let gas_prices = storage
        .get_gas_prices_by_asset_id(&fee_asset_id)
        .await?
        .ok_or_else(|| anyhow!("GasPrices not available"))?;

    let fee_tier = match request.fee_mode {
        None => FeeTier::default(),
        Some(tpr::FeeMode::AutoFee(tier)) => tier.try_into()?,
        Some(tpr::FeeMode::ManualFee(_)) => {
            return Err(anyhow!("Manual fee mode not yet implemented").into());
        }
    };

    let mut transaction_parameters = TransactionParameters {
        chain_id,
        expiry_height,
        ..Default::default()
    };
    transaction_parameters.fee.0.asset_id = fee_asset_id;

    let mut actions_list = ActionList::default();

    let mut notes_by_asset_id: BTreeMap<Id, Vec<SpendableNoteRecord>> = BTreeMap::new();

    // Phase 1: process all of the user-supplied intents into complete action plans.

    for tpr::Output { value, address } in request.outputs {
        let value = value
            .ok_or_else(|| anyhow!("missing value in output"))?
            .try_into()?;
        let address = address
            .ok_or_else(|| anyhow!("missing address in output"))?
            .try_into()?;
        let output = OutputPlan::new(&mut OsRng, value, address);

        actions_list.push(output);
    }

    for tpr::Swap {
        value,
        target_asset,
        // The prepaid fee will instead be calculated directly in the rust planner logic.
        //
        // TODO: external consumers of prax may decide to enable manaual fees, and there may be
        // additional checks required to make sure the fees satisfy to the balancing checks
        // for swap claims.
        fee: _,
        claim_address,
    } in request.swaps
    {
        let value: Value = value
            .ok_or_else(|| anyhow!("missing value in swap"))?
            .try_into()?;
        let target_asset = target_asset
            .ok_or_else(|| anyhow!("missing target asset in swap"))?
            .try_into()?;
        let claim_address = claim_address
            .ok_or_else(|| anyhow!("missing claim address in swap"))?
            .try_into()?;

        // This is the prepaid fee for the swap claim. We don't expect much of a drift in gas
        // prices in a few blocks, and the fee tier adjustments should be enough to cover it.
        let estimated_claim_fee = gas_prices.fee(&swap_claim_gas_cost()).apply_tier(fee_tier);

        // Determine the canonical order for the assets being swapped.
        // This will determine whether the input amount is assigned to delta_1 or delta_2.
        let trading_pair = TradingPair::new(value.asset_id, target_asset);

        // If `trading_pair.asset_1` is the input asset, then `delta_1` is the input amount,
        // and `delta_2` is 0.
        //
        // Otherwise, `delta_1` is 0, and `delta_2` is the input amount.
        let (delta_1, delta_2) = if trading_pair.asset_1() == value.asset_id {
            (value.amount, 0u64.into())
        } else {
            (0u64.into(), value.amount)
        };

        // If there is no input, then there is no swap.
        if delta_1 == Amount::zero() && delta_2 == Amount::zero() {
            return Err(anyhow!("No input value for swap").into());
        }

        // Create the `SwapPlaintext` representing the swap to be performed:
        let swap_plaintext = SwapPlaintext::new(
            &mut OsRng,
            trading_pair,
            delta_1,
            delta_2,
            estimated_claim_fee,
            claim_address,
        );
        let swap = SwapPlan::new(&mut OsRng, swap_plaintext);

        actions_list.push(swap);
    }

    for tpr::SwapClaim { swap_commitment } in request.swap_claims {
        let swap_commitment =
            swap_commitment.ok_or_else(|| anyhow!("missing swap commitment in swap claim"))?;

        let swap_record: SwapRecord = storage
            .get_swap_by_commitment(swap_commitment)
            .await?
            .ok_or_else(|| anyhow!("Swap record not found"))?
            .try_into()?;

        let swap_claim = SwapClaimPlan {
            swap_plaintext: swap_record.swap,
            position: swap_record.position,
            output_data: swap_record.output_data,
            epoch_duration: sct_params.epoch_duration,
            proof_blinding_r: Fq::rand(&mut OsRng),
            proof_blinding_s: Fq::rand(&mut OsRng),
        };

        actions_list.push(swap_claim);
    }

    for tpr::Delegate { amount, rate_data } in request.delegations {
        let epoch = storage.get_latest_known_epoch().await?.unwrap();
        let amount = amount
            .ok_or_else(|| anyhow!("missing amount in delegation"))?
            .try_into()?;
        let rate_data: RateData = rate_data
            .ok_or_else(|| anyhow!("missing rate data in delegation"))?
            .try_into()?;
        let delegate = rate_data.build_delegate(epoch.into(), amount);

        actions_list.push(delegate);
    }

    for tpr::Undelegate { value, rate_data } in request.undelegations {
        let epoch = storage.get_latest_known_epoch().await?.unwrap();
        let value: Value = value
            .ok_or_else(|| anyhow!("missing value in undelegation"))?
            .try_into()?;
        let rate_data: RateData = rate_data
            .ok_or_else(|| anyhow!("missing rate data in undelegation"))?
            .try_into()?;
        let undelegate = rate_data.build_undelegate(epoch.into(), value.amount);
        save_unbonding_token_metadata_if_needed(&undelegate, &storage).await?;

        actions_list.push(undelegate);
    }

    for tpr::UndelegateClaim {
        validator_identity,
        unbonding_start_height,
        penalty,
        unbonding_amount,
        ..
    } in request.undelegation_claims
    {
        let validator_identity: IdentityKey = validator_identity
            .ok_or_else(|| anyhow!("missing validator identity in undelegation claim"))?
            .try_into()?;
        let penalty: Penalty = penalty
            .ok_or_else(|| anyhow!("missing penalty in undelegation claim"))?
            .try_into()?;
        let unbonding_amount: Amount = unbonding_amount
            .ok_or_else(|| anyhow!("missing unbonding amount in undelegation claim"))?
            .try_into()?;

        let undelegate_claim_plan = UndelegateClaimPlan {
            validator_identity,
            unbonding_start_height,
            penalty,
            unbonding_amount,
            balance_blinding: Fr::rand(&mut OsRng),
            proof_blinding_r: Fq::rand(&mut OsRng),
            proof_blinding_s: Fq::rand(&mut OsRng),
        };

        actions_list.push(ActionPlan::UndelegateClaim(undelegate_claim_plan));
    }

    #[allow(clippy::never_loop)]
    for ibc::v1::IbcRelay { .. } in request.ibc_relay_actions {
        return Err(anyhow!("IbcRelay not yet implemented").into());
    }

    for ics20_withdrawal in request.ics20_withdrawals {
        actions_list.push(ActionPlan::Ics20Withdrawal(ics20_withdrawal.try_into()?));
    }

    // Generate a shared bundle_identifier for positions actions. The Relationship here is
    // that all positions with the same `bundle_id` must share the same `strategy_tag`.
    let bundle_identifier = NonZeroU32::new(OsRng.next_u32()).expect("randomizer for identifier");

    // Note: during action creation, a convenience method is invoked that generates the `PositionMetadatakey`
    // derived from the outgoing viewing key (OVK), and encrypt the plaintext `PositionMetadata`
    // with the `PositionMetadatakey`.
    for tpr::PositionOpen {
        position,
        position_meta,
    } in request.position_opens
    {
        let metadata = position_meta.expect("invalid or malformed position metadata");
        let strategy = NonZero::new(metadata.strategy).unwrap();
        let metadata_reconstructed = PositionMetadata {
            identifier: bundle_identifier,
            strategy,
        };

        actions_list.push(ActionPlan::PositionOpen(PositionOpenPlan {
            position: position
                .ok_or_else(|| anyhow!("missing position in PositionOpenPlan"))?
                .try_into()?,
            metadata: Some(metadata_reconstructed),
        }));
    }

    for tpr::PositionClose { position_id } in request.position_closes {
        actions_list.push(ActionPlan::PositionClose(PositionClose {
            position_id: position_id
                .ok_or_else(|| anyhow!("missing position_id in PositionClose"))?
                .try_into()?,
        }));
    }

    // Note: Currently this only supports an initial withdrawal from Closed, with no rewards.
    for tpr::PositionWithdraw {
        position_id,
        reserves,
        trading_pair,
    } in request.position_withdraws
    {
        actions_list.push(ActionPlan::PositionWithdraw(PositionWithdrawPlan {
            position_id: position_id
                .ok_or_else(|| anyhow!("missing position_id in PositionWithdraw"))?
                .try_into()?,
            reserves: reserves
                .ok_or_else(|| anyhow!("missing reserves in PositionWithdraw"))?
                .try_into()?,
            pair: trading_pair
                .ok_or_else(|| anyhow!("missing trading_pair in PositionWithdraw"))?
                .try_into()?,
            sequence: 0,
            rewards: vec![],
        }));
    }

    for tpr::ActionDutchAuctionSchedule { description } in request.dutch_auction_schedule_actions {
        let description = description
            .ok_or_else(|| anyhow!("missing description in Dutch auction schedule action"))?;
        let input: Value = description
            .input
            .ok_or_else(|| anyhow!("missing input in Dutch auction schedule action"))?
            .try_into()?;
        let output_id: Id = description
            .output_id
            .ok_or_else(|| anyhow!("missing output ID in Dutch auction schedule action"))?
            .try_into()?;
        let min_output: Amount = description
            .min_output
            .ok_or_else(|| anyhow!("missing min output in Dutch auction schedule action"))?
            .try_into()?;
        let max_output: Amount = description
            .max_output
            .ok_or_else(|| anyhow!("missing max output in Dutch auction schedule action"))?
            .try_into()?;
        let mut nonce = [0u8; 32];
        OsRng.fill_bytes(&mut nonce);

        let description = DutchAuctionDescription {
            start_height: description.start_height,
            end_height: description.end_height,
            step_count: description.step_count,
            input,
            output_id,
            min_output,
            max_output,
            nonce,
        };

        save_auction_nft_metadata_if_needed(description.id(), &storage, 0).await?;

        actions_list.push(ActionPlan::ActionDutchAuctionSchedule(
            ActionDutchAuctionSchedule { description },
        ));
    }

    for tpr::ActionDutchAuctionEnd { auction_id } in request.dutch_auction_end_actions {
        let auction_id: AuctionId = auction_id
            .ok_or_else(|| anyhow!("missing auction ID in Dutch auction end action"))?
            .try_into()?;

        save_auction_nft_metadata_if_needed(
            auction_id, &storage,
            // When ending a Dutch auction, the sequence number is always 1
            1,
        )
        .await?;

        actions_list.push(ActionPlan::ActionDutchAuctionEnd(ActionDutchAuctionEnd {
            auction_id,
        }));
    }

    for tpr::ActionDutchAuctionWithdraw { auction_id, seq } in
        request.dutch_auction_withdraw_actions
    {
        let auction_id: AuctionId = auction_id
            .ok_or_else(|| anyhow!("missing auction ID in Dutch auction withdraw action"))?
            .try_into()?;

        save_auction_nft_metadata_if_needed(auction_id, &storage, seq).await?;
        let outstanding_reserves: OutstandingReserves =
            storage.get_auction_outstanding_reserves(auction_id).await?;

        actions_list.push(ActionPlan::ActionDutchAuctionWithdraw(
            ActionDutchAuctionWithdrawPlan {
                auction_id,
                seq,
                reserves_input: outstanding_reserves.input.try_into()?,
                reserves_output: outstanding_reserves.output.try_into()?,
            },
        ));
    }

    for tpr::DelegatorVote {
        proposal,
        vote,
        start_block_height,
        start_position,
        rate_data,
    } in request.delegator_votes
    {
        let voting_notes = storage
            .get_notes_for_voting(request.source.clone(), start_block_height)
            .await?;

        if voting_notes.is_empty() {
            return Err(WasmError::Anyhow(anyhow::anyhow!(
                "no notes were found for voting on proposal {proposal}"
            )));
        }

        // Collect RateData into a map so it's easier to check without looping
        let rate_data_map: BTreeMap<IdentityKey, RateData> = rate_data
            .into_iter()
            .map(|r| r.try_into())
            .collect::<Result<Vec<RateData>, _>>()?
            .into_iter()
            .map(|data| (data.identity_key, data))
            .collect();

        // For each voting note, see if there are any matches with the domain_rate_data vec
        // If so, add a DelegatorVotePlan to the action_list
        for (record, identity_key) in &voting_notes {
            let Some(validator_start_rate_data) = rate_data_map.get(identity_key) else {
                continue;
            };

            let voting_power_at_vote_start =
                validator_start_rate_data.unbonded_amount(record.note.amount());

            let domain_vote = vote
                .map(TryInto::try_into)
                .transpose()?
                .ok_or_else(|| anyhow::anyhow!("missing vote param"))?;

            let vote_plan = DelegatorVotePlan::new(
                &mut OsRng,
                proposal,
                start_position.into(),
                domain_vote,
                record.note.clone(),
                record.position,
                voting_power_at_vote_start,
            );
            actions_list.push(ActionPlan::DelegatorVote(vote_plan));
        }
    }

    for tpr::Spend { value, address } in request.spends.clone() {
        let value = value.ok_or_else(|| anyhow!("missing value in spend"))?;
        let amount = value.amount.ok_or_else(|| anyhow!("no amount in value"))?;
        let address = address.ok_or_else(|| anyhow!("missing address in spend"))?;
        let asset_id = value
            .asset_id
            .ok_or_else(|| anyhow!("missing asset_id in spend"))?;

        // Constraint: validates the Spend transaction planner request is constructed in isolation.
        if !actions_list.actions().is_empty() {
            let error_message =
                "Invalid transaction: Spend action must be the only action in the planner request."
                    .to_string();
            return Err(WasmError::Anyhow(anyhow!(error_message)));
        }

        // Constraint: validate the transaction planner request is constructed with a single spend request.
        if request.spends.len() > 1 {
            let error_message =
                "Invalid transaction: only one Spend action allowed in planner request."
                    .to_string();
            return Err(WasmError::Anyhow(anyhow!(error_message)));
        }

        // Find all the notes of this asset in the source account.
        let records = storage
            .get_notes(NotesRequest {
                include_spent: false,
                asset_id: Some(asset_id.clone()),
                address_index: Some(source_address_index.into()),
                amount_to_spend: None,
            })
            .await?;

        // Accumlate the total available note balance for the asset id.
        let accumulated_note_amounts = records
            .iter()
            .map(|record| record.note.value().amount)
            .fold(Amount::zero(), |acc, note_value| acc + note_value);

        // Constraint: validate if the requested spend amount is not equal to the accumulated note balance.
        if accumulated_note_amounts.to_proto() != amount {
            let error_message =
                "Invalid transaction: The requested spend amount does not match the available balance.".to_string();
            return Err(WasmError::Anyhow(anyhow!(error_message)));
        }

        for record in records.clone() {
            // Filter out zero-valued notes from spendable note record (SNR) set.
            if record.clone().note.amount() != 0u64.into() {
                let spend: SpendPlan =
                    SpendPlan::new(&mut OsRng, record.clone().note, record.clone().position);
                actions_list.push(spend);
            }
        }

        // Constraint: validate that each spend action's asset ID matches the fee asset ID.
        // It enforces that all the notes being sent to the recipient are of the same denomination
        // and that fees are deducted from those notes.
        for action in actions_list.actions() {
            if let ActionPlan::Spend(spend_plan) = action {
                if spend_plan.note.asset_id() != fee_asset_id {
                    let error_message =
                        "Invalid transaction: The asset ID for the spend action does not match the fee asset ID."
                            .to_string();
                    return Err(WasmError::Anyhow(anyhow!(error_message)));
                }
            }
        }

        // Change address is overwritten to the recipient.
        change_address = address.try_into()?;
    }

    for tpr::ActionLiquidityTournamentVote {
        incentivized,
        rewards_recipient,
        staked_notes,
        epoch_index,
    } in request.action_liquidity_tournament_vote
    {
        if staked_notes.is_empty() {
            let error_message =
                "Invalid transaction: zero delegation notes for voting in the liquidity tournament"
                    .to_string();
            return Err(WasmError::Anyhow(anyhow!(error_message)));
        }

        for staked_note in staked_notes {
            let incentivized: Denom = incentivized
                .clone()
                .ok_or_else(|| anyhow!("missing incentivized asset in liquidity tournament"))?
                .try_into()?;
            let rewards_recipient: Address = rewards_recipient
                .clone()
                .ok_or_else(|| anyhow!("missing rewards recipient in liquidity tournament"))?
                .try_into()?;
            let note: Note = staked_note
                .note
                .ok_or_else(|| anyhow!("missing note in liquidity tournament"))?
                .try_into()?;
            let note_position: Position = staked_note.position.into();

            // Domain type conversion: `Position(Tree { epoch: EPOCH_INDEX, block: 0, commitment: 0 })`
            let start_position: Position = Position::from((epoch_index as u16, 0, 0));

            let vote_plan = ActionLiquidityTournamentVotePlan::new(
                &mut OsRng,
                incentivized,
                rewards_recipient,
                note.clone(),
                note_position,
                start_position,
            );

            // For each staked delegation note, we create a corresponding vote plan and a spend plan.
            //
            // - The vote plan expresses the user's intent to vote in the liquidity tournament with this
            //   specific delegation note in the current epoch, where `rewards_recipient` field determines
            //   the address to mint rewards to.
            // - The spend plan spends the note, enabling us to *roll over* its value into new notes.
            //
            // The latter has two purposes:
            // (1) Enables note *consolidation*: if a user has multiple staked notes of the same asset,
            //     they will all be spent and reissued in a smaller number of outputs, reducing note fragmentation
            //     and minimizing the number of inputs required for future votes.
            // (2) Prevents nullifier linkability: the voting action doesn't require a spend, but it does reveal
            //     information about the note, making repeated use across epochs linkable. To avoid this, you can
            //     optionally spend the notes during voting, consolidating your voting power into a single, unlinkable
            //     note—allowing future votes with fewer actions.
            actions_list.push(vote_plan);
            actions_list.push(SpendPlan::new(&mut OsRng, note, note_position));
        }
    }

    // Phase 2: balance the transaction with information from the view service.
    //
    // It's possible that adding spends could increase the gas, increasing
    // the fee amount, and so on, so we add spends iteratively. However, we
    // need to query all the notes we'll use for planning upfront, so we
    // don't accidentally try to use the same one twice.

    // Compute an initial fee estimate based on the actions we have so far.
    actions_list.refresh_fee_and_change(OsRng, &gas_prices, &fee_tier, &change_address);

    for required in actions_list.balance_with_fee().required() {
        // Find all the notes of this asset in the source account.
        let records = storage
            .get_notes(NotesRequest {
                include_spent: false,
                asset_id: Some(required.asset_id.into()),
                address_index: Some(source_address_index.into()),
                amount_to_spend: None,
            })
            .await?;
        notes_by_asset_id.insert(
            required.asset_id,
            prioritize_and_filter_spendable_notes(records),
        );
    }

    let mut iterations = 0usize;

    // Now iterate over the action list's imbalances to balance the transaction.
    while let Some(required) = actions_list.balance_with_fee().required().next() {
        // Find a single note to spend towards the required balance.
        let maybe_note = notes_by_asset_id
            .get_mut(&required.asset_id)
            .and_then(|notes| notes.pop());
        let note = match maybe_note {
            Some(note) => Ok(note),
            None => Err(insufficient_funds_err(&storage, &required).await),
        }?;

        // Add a spend for that note to the action list.
        actions_list.push(SpendPlan::new(&mut OsRng, note.note, note.position));

        // Refresh the fee estimate and change outputs.
        actions_list.refresh_fee_and_change(OsRng, &gas_prices, &fee_tier, &change_address);

        iterations += 1;
        if iterations > 100 {
            return Err(anyhow!("failed to plan transaction after 100 iterations").into());
        }
    }

    // Add memo to the transaction plan.
    let memo = if let Some(pb_memo_plaintext) = request.memo {
        Some(MemoPlan::new(&mut OsRng, pb_memo_plaintext.try_into()?))
    } else if actions_list.requires_memo() {
        // If a memo was not provided, but is required (because we have outputs),
        // auto-create one with the change address.
        let plaintext = MemoPlaintext::new(change_address, String::new())?;
        Some(MemoPlan::new(&mut OsRng, plaintext))
    } else {
        None
    };

    // Reset the planner in case it were reused.
    let plan =
        mem::take(&mut actions_list).into_plan(OsRng, &fmd_params, transaction_parameters, memo)?;

    Ok(plan)
}

import { ActionView } from '@penumbra-zone/protobuf/penumbra/core/transaction/v1/transaction_pb';
import { AssetId, Metadata } from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import {
  getAsset1Metadata,
  getAsset2Metadata,
  getDelta2IFromSwapView,
} from '@penumbra-zone/getters/swap-view';
import { getOutput1Value, getOutput2Value } from '@penumbra-zone/getters/swap-claim-view';
import { getNote as getSpendNote } from '@penumbra-zone/getters/spend-view';
import { getNote as getOutputNote } from '@penumbra-zone/getters/output-view';
import { getMetadata, getAmount } from '@penumbra-zone/getters/value-view';
import { bech32mIdentityKey } from '@penumbra-zone/bech32m/penumbravalid';

export type RelevantAsset = AssetId | Metadata;

const returnAssets = (assets: (RelevantAsset | undefined)[]): RelevantAsset[] =>
  assets.filter(Boolean) as RelevantAsset[];

/**
 * Takes an action view and returns relevant assets for that action.
 * Some actions store assets as Metadata and some as AssetId, so further processing is needed
 * to convert AssetId to Metadata.
 *
 * Actions with asset information:
 * - spend
 * - output
 * - swap
 * - swapClaim
 * - positionOpen
 * - actionDutchAuctionSchedule
 * - actionDutchAuctionWithdraw
 * - actionLiquidityTournamentVote
 *
 * Some action views can compute asset information from its data:
 * - delegate
 * - undelegate
 * - position close/withdraw (not implemented but can compute lpNft from positionId)
 */
export const findRelevantAssets = (action?: ActionView): RelevantAsset[] => {
  if (!action) {
    return [];
  }

  const view = action.actionView;

  if (view.case === 'spend') {
    const note = getSpendNote.optional(view.value);
    return returnAssets([getMetadata(note?.value)]);
  }

  if (view.case === 'output') {
    const note = getOutputNote.optional(view.value);
    return returnAssets([getMetadata.optional(note?.value)]);
  }

  if (view.case === 'swap') {
    // find correct swap sides
    const metadata1 = getAsset1Metadata.optional(view.value);
    const metadata2 = getAsset2Metadata.optional(view.value);
    const delta2 = getDelta2IFromSwapView(view.value);
    const isDelta2Zero = !(delta2.lo > 0n || delta2.hi > 0n);
    const inputMetadata = isDelta2Zero ? metadata1 : metadata2;
    const outputMetadata = isDelta2Zero ? metadata2 : metadata1;

    return returnAssets([inputMetadata, outputMetadata]);
  }

  if (view.case === 'swapClaim') {
    const value1 = getOutput1Value.optional(view.value);
    const value2 = getOutput2Value.optional(view.value);
    let inputMetadata = getMetadata.optional(value1);
    let outputMetadata = getMetadata.optional(value2);

    // find correct swap claim sides
    const amount1 = getAmount.optional(value1);
    const isAmount1NotZero = amount1 && (amount1.lo > 0n || amount1.hi > 0n);
    if (isAmount1NotZero) {
      inputMetadata = getMetadata.optional(value2);
      outputMetadata = getMetadata.optional(value1);
    }

    return returnAssets([inputMetadata, outputMetadata]);
  }

  if (view.case === 'positionOpen') {
    const pair = view.value.position?.phi?.pair;
    return returnAssets([pair?.asset1, pair?.asset2]);
  }

  if (view.case === 'delegatorVote') {
    const note =
      view.value.delegatorVote.case === 'visible' ? view.value.delegatorVote.value.note : undefined;
    return returnAssets([getMetadata.optional(note?.value)]);
  }

  // TODO: check this for validity
  if (view.case === 'delegate') {
    return returnAssets([
      view.value.validatorIdentity &&
        new Metadata({
          display: `delegation_${bech32mIdentityKey(view.value.validatorIdentity)}`,
        }),
    ]);
  }

  // TODO: check this for validity
  if (view.case === 'undelegate') {
    return returnAssets([
      view.value.validatorIdentity &&
        view.value.fromEpoch &&
        new Metadata({
          display: `unbonding_start_at_${view.value.fromEpoch.startHeight}_${bech32mIdentityKey(view.value.validatorIdentity)}`,
        }),
    ]);
  }

  if (view.case === 'actionDutchAuctionSchedule') {
    return returnAssets([view.value.inputMetadata, view.value.outputMetadata]);
  }

  if (view.case === 'actionDutchAuctionWithdraw') {
    return returnAssets(view.value.reserves.map(valueView => getMetadata.optional(valueView)));
  }

  if (view.case === 'actionLiquidityTournamentVote') {
    return view.value.liquidityTournamentVote.case === 'visible'
      ? returnAssets([getMetadata.optional(view.value.liquidityTournamentVote.value.note?.value)])
      : [];
  }

  return [];
};

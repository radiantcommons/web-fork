import {
  ActionPlan,
  ActionView,
} from '@penumbra-zone/protobuf/penumbra/core/transaction/v1/transaction_pb';
import {
  AssetId,
  Metadata,
  Value,
  ValueView,
} from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import { getAddressView } from './get-address-view.js';
import {
  Note,
  NoteView,
  OutputPlan,
  OutputView,
  SpendPlan,
  SpendView,
} from '@penumbra-zone/protobuf/penumbra/core/component/shielded_pool/v1/shielded_pool_pb';
import {
  SwapClaimPlan,
  SwapClaimView,
  SwapPlan,
  SwapView,
} from '@penumbra-zone/protobuf/penumbra/core/component/dex/v1/dex_pb';
import { FullViewingKey } from '@penumbra-zone/protobuf/penumbra/core/keys/v1/keys_pb';
import { getAuctionId } from '@penumbra-zone/wasm/auction';
import {
  getInputAssetId,
  getOutputAssetId,
} from '@penumbra-zone/getters/dutch-auction-description';
import {
  ActionDutchAuctionWithdrawPlan,
  ActionDutchAuctionWithdrawView,
} from '@penumbra-zone/protobuf/penumbra/core/component/auction/v1/auction_pb';
import type { PartialMessage } from '@bufbuild/protobuf';
import {
  DelegatorVotePlan,
  DelegatorVoteView,
} from '@penumbra-zone/protobuf/penumbra/core/component/governance/v1/governance_pb';
import {
  ActionLiquidityTournamentVotePlan,
  ActionLiquidityTournamentVoteView,
} from '@penumbra-zone/protobuf/penumbra/core/component/funding/v1/funding_pb';

const getValueView = async (
  value: Value | undefined,
  denomMetadataByAssetId: (id: AssetId) => Promise<Metadata>,
): Promise<ValueView> => {
  if (!value) {
    throw new Error('No value to view');
  }
  if (!value.assetId) {
    throw new Error('No asset ID in value');
  }
  if (!value.amount) {
    throw new Error('No amount in value');
  }

  return new ValueView({
    valueView: {
      case: 'knownAssetId',
      value: {
        amount: value.amount,
        metadata: await denomMetadataByAssetId(value.assetId),
      },
    },
  });
};

const getNoteView = async (
  note: Note | undefined,
  denomMetadataByAssetId: (id: AssetId) => Promise<Metadata>,
  fullViewingKey: FullViewingKey,
) => {
  if (!note) {
    throw new Error('No note to view');
  }
  if (!note.address) {
    throw new Error('No address in note');
  }
  if (!note.value) {
    throw new Error('No value in note');
  }

  return new NoteView({
    address: getAddressView(note.address, fullViewingKey),
    value: await getValueView(note.value, denomMetadataByAssetId),
  });
};

const getSpendView = async (
  spendPlan: SpendPlan,
  denomMetadataByAssetId: (id: AssetId) => Promise<Metadata>,
  fullViewingKey: FullViewingKey,
): Promise<SpendView> => {
  if (!spendPlan.note?.address) {
    throw new Error('No address in spend plan');
  }

  return new SpendView({
    spendView: {
      case: 'visible',
      value: {
        note: await getNoteView(spendPlan.note, denomMetadataByAssetId, fullViewingKey),
      },
    },
  });
};

const getOutputView = async (
  outputPlan: OutputPlan,
  denomMetadataByAssetId: (id: AssetId) => Promise<Metadata>,
  fullViewingKey: FullViewingKey,
): Promise<OutputView> => {
  if (!outputPlan.destAddress) {
    throw new Error('No destAddress in output plan');
  }

  return new OutputView({
    outputView: {
      case: 'visible',

      value: {
        note: {
          value: await getValueView(outputPlan.value, denomMetadataByAssetId),
          address: getAddressView(outputPlan.destAddress, fullViewingKey),
        },
      },
    },
  });
};

const getSwapView = async (
  swapPlan: SwapPlan,
  denomMetadataByAssetId: (id: AssetId) => Promise<Metadata>,
): Promise<SwapView> => {
  const [asset1Metadata, asset2Metadata] = await Promise.all([
    swapPlan.swapPlaintext?.tradingPair?.asset1
      ? await denomMetadataByAssetId(swapPlan.swapPlaintext.tradingPair.asset1)
      : undefined,
    swapPlan.swapPlaintext?.tradingPair?.asset2
      ? await denomMetadataByAssetId(swapPlan.swapPlaintext.tradingPair.asset2)
      : undefined,
  ]);

  return new SwapView({
    swapView: {
      case: 'visible',
      value: {
        swap: {
          body: {
            delta1I: swapPlan.swapPlaintext?.delta1I,
            delta2I: swapPlan.swapPlaintext?.delta2I,
            tradingPair: swapPlan.swapPlaintext?.tradingPair,
          },
        },
        swapPlaintext: swapPlan.swapPlaintext,
        asset1Metadata,
        asset2Metadata,
      },
    },
  });
};

const getActionDutchAuctionWithdrawView = async (
  action: ActionDutchAuctionWithdrawPlan,
  denomMetadataByAssetId: (id: AssetId) => Promise<Metadata>,
): Promise<PartialMessage<ActionDutchAuctionWithdrawView>> => {
  const reserves = [];

  if (action.reservesInput) {
    reserves.push(getValueView(action.reservesInput, denomMetadataByAssetId));
  }
  if (action.reservesOutput) {
    reserves.push(getValueView(action.reservesOutput, denomMetadataByAssetId));
  }

  return {
    action,
    reserves: await Promise.all(reserves),
  };
};

const getSwapClaimView = async (
  swapClaimPlan: SwapClaimPlan,
  denomMetadataByAssetId: (id: AssetId) => Promise<Metadata>,
  fullViewingKey: FullViewingKey,
): Promise<SwapClaimView> => {
  return new SwapClaimView({
    swapClaimView: {
      case: 'visible',
      value: {
        output1: {
          address: swapClaimPlan.swapPlaintext?.claimAddress
            ? getAddressView(swapClaimPlan.swapPlaintext.claimAddress, fullViewingKey)
            : undefined,
          value: swapClaimPlan.outputData?.lambda1
            ? await getValueView(
                new Value({
                  amount: swapClaimPlan.outputData.lambda1,
                  assetId: swapClaimPlan.outputData.tradingPair?.asset1,
                }),
                denomMetadataByAssetId,
              )
            : undefined,
        },
        output2: {
          address: swapClaimPlan.swapPlaintext?.claimAddress
            ? getAddressView(swapClaimPlan.swapPlaintext.claimAddress, fullViewingKey)
            : undefined,
          value: swapClaimPlan.outputData?.lambda2
            ? await getValueView(
                new Value({
                  amount: swapClaimPlan.outputData.lambda2,
                  assetId: swapClaimPlan.outputData.tradingPair?.asset2,
                }),
                denomMetadataByAssetId,
              )
            : undefined,
        },
        swapClaim: {
          body: {
            fee: swapClaimPlan.swapPlaintext?.claimFee,
            outputData: swapClaimPlan.outputData,
          },
          epochDuration: swapClaimPlan.epochDuration,
        },
      },
    },
  });
};

const getDelegatorVoteView = async (
  votePlan: DelegatorVotePlan,
  denomMetadataByAssetId: (id: AssetId) => Promise<Metadata>,
  fullViewingKey: FullViewingKey,
): Promise<DelegatorVoteView> => {
  return new DelegatorVoteView({
    delegatorVote: {
      case: 'visible',
      value: {
        note: await getNoteView(votePlan.stakedNote, denomMetadataByAssetId, fullViewingKey),
        delegatorVote: {
          body: {
            proposal: votePlan.proposal,
            startPosition: votePlan.startPosition,
            vote: votePlan.vote,
            value: votePlan.stakedNote?.value,
            unbondedAmount: votePlan.unbondedAmount,
          },
        },
      },
    },
  });
};

const getLQTVoteView = async (
  plan: ActionLiquidityTournamentVotePlan,
  denomMetadataByAssetId: (id: AssetId) => Promise<Metadata>,
  fullViewingKey: FullViewingKey,
): Promise<ActionLiquidityTournamentVoteView> => {
  return new ActionLiquidityTournamentVoteView({
    liquidityTournamentVote: {
      case: 'visible',
      value: {
        note: await getNoteView(plan.stakedNote, denomMetadataByAssetId, fullViewingKey),
        vote: {
          body: {
            incentivized: plan.incentivized,
            value: plan.stakedNote?.value,
            startPosition: plan.startPosition,
            rewardsRecipient: plan.rewardsRecipient,
          },
        },
      },
    },
  });
};

export const viewActionPlan =
  (denomMetadataByAssetId: (id: AssetId) => Promise<Metadata>, fullViewingKey: FullViewingKey) =>
  async (actionPlan: ActionPlan): Promise<ActionView> => {
    switch (actionPlan.action.case) {
      case 'spend':
        return new ActionView({
          actionView: {
            case: 'spend',
            value: await getSpendView(
              actionPlan.action.value,
              denomMetadataByAssetId,
              fullViewingKey,
            ),
          },
        });
      case 'output':
        return new ActionView({
          actionView: {
            case: 'output',
            value: await getOutputView(
              actionPlan.action.value,
              denomMetadataByAssetId,
              fullViewingKey,
            ),
          },
        });
      case 'swap':
        return new ActionView({
          actionView: {
            case: 'swap',
            value: await getSwapView(actionPlan.action.value, denomMetadataByAssetId),
          },
        });
      case 'swapClaim':
        return new ActionView({
          actionView: {
            case: 'swapClaim',
            value: await getSwapClaimView(
              actionPlan.action.value,
              denomMetadataByAssetId,
              fullViewingKey,
            ),
          },
        });
      case 'ics20Withdrawal':
        /**
         * Special case -- the `withdrawal` case in the action plan maps to the
         * `ics20Withdrawal` case in the action view.
         *
         * This should probably be renamed for consistency. See
         * https://github.com/penumbra-zone/penumbra/issues/3614.
         */
        return new ActionView({
          actionView: {
            case: 'ics20Withdrawal',
            value: actionPlan.action.value,
          },
        });
      case 'delegate':
      case 'undelegate':
        return new ActionView({ actionView: actionPlan.action });

      case 'undelegateClaim':
        return new ActionView({
          actionView: {
            case: 'undelegateClaim',
            value: {
              body: actionPlan.action.value,
            },
          },
        });

      case 'actionDutchAuctionSchedule': {
        const inputAssetId = getInputAssetId.optional(actionPlan.action.value.description);
        const outputAssetId = getOutputAssetId.optional(actionPlan.action.value.description);
        const [inputMetadata, outputMetadata] = await Promise.all([
          inputAssetId ? await denomMetadataByAssetId(inputAssetId) : undefined,
          outputAssetId ? await denomMetadataByAssetId(outputAssetId) : undefined,
        ]);

        return new ActionView({
          actionView: {
            case: 'actionDutchAuctionSchedule',
            value: {
              action: actionPlan.action.value,
              auctionId: actionPlan.action.value.description
                ? getAuctionId(actionPlan.action.value.description)
                : undefined,
              inputMetadata,
              outputMetadata,
            },
          },
        });
      }

      case 'actionDutchAuctionWithdraw':
        return new ActionView({
          actionView: {
            case: 'actionDutchAuctionWithdraw',
            value: await getActionDutchAuctionWithdrawView(
              actionPlan.action.value,
              denomMetadataByAssetId,
            ),
          },
        });

      case 'actionDutchAuctionEnd':
        return new ActionView({
          actionView: actionPlan.action,
        });

      case 'delegatorVote':
        return new ActionView({
          actionView: {
            case: 'delegatorVote',
            value: await getDelegatorVoteView(
              actionPlan.action.value,
              denomMetadataByAssetId,
              fullViewingKey,
            ),
          },
        });

      case 'validatorVote':
        return new ActionView({
          actionView: actionPlan.action,
        });

      case 'positionOpen':
        return new ActionView({
          actionView: actionPlan.action,
        });

      case 'positionOpenPlan': {
        return new ActionView({
          actionView: {
            case: 'positionOpen',
            value: actionPlan.action.value,
          },
        });
      }

      case 'positionClose':
        return new ActionView({
          actionView: actionPlan.action,
        });

      case 'positionWithdraw':
        return new ActionView({
          actionView: actionPlan.action,
        });

      case 'validatorDefinition': {
        return new ActionView({
          actionView: actionPlan.action,
        });
      }

      case 'ibcRelayAction': {
        return new ActionView({
          actionView: actionPlan.action,
        });
      }

      case 'proposalSubmit': {
        return new ActionView({
          actionView: actionPlan.action,
        });
      }

      case 'proposalWithdraw': {
        return new ActionView({
          actionView: actionPlan.action,
        });
      }

      case 'proposalDepositClaim': {
        return new ActionView({
          actionView: actionPlan.action,
        });
      }

      case 'communityPoolSpend': {
        return new ActionView({
          actionView: actionPlan.action,
        });
      }

      case 'communityPoolOutput': {
        return new ActionView({
          actionView: actionPlan.action,
        });
      }

      case 'communityPoolDeposit': {
        return new ActionView({
          actionView: actionPlan.action,
        });
      }

      // Deprecated
      case 'positionRewardClaim': {
        return new ActionView({
          actionView: {
            case: 'positionRewardClaim',
            value: {},
          },
        });
      }

      case 'actionLiquidityTournamentVote': {
        return new ActionView({
          actionView: {
            case: 'actionLiquidityTournamentVote',
            value: await getLQTVoteView(
              actionPlan.action.value,
              denomMetadataByAssetId,
              fullViewingKey,
            ),
          },
        });
      }

      case undefined:
        return new ActionView({
          actionView: actionPlan.action,
        });
    }
  };

import { AllSlices, Middleware, SliceCreator, useStore } from '..';

import {
  BalancesResponse,
  TransactionPlannerRequest,
} from '@penumbra-zone/protobuf/penumbra/view/v1/view_pb';
import BigNumber from 'bignumber.js';
import { MemoPlaintext } from '@penumbra-zone/protobuf/penumbra/core/transaction/v1/transaction_pb';
import { amountMoreThanBalance, isIncorrectDecimal, plan, planBuildBroadcast } from '../helpers';

import { Fee, FeeTier_Tier } from '@penumbra-zone/protobuf/penumbra/core/component/fee/v1/fee_pb';
import {
  getAssetIdFromValueView,
  getDisplayDenomExponentFromValueView,
} from '@penumbra-zone/getters/value-view';
import { getAddress, getAddressIndex } from '@penumbra-zone/getters/address-view';
import { toBaseUnit } from '@penumbra-zone/types/lo-hi';
import { isAddress } from '@penumbra-zone/bech32m/penumbra';
import {
  checkSendMaxInvariants,
  SpendOrOutput,
  transferableBalancesResponsesSelector,
} from './helpers';
import { Metadata, Value } from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import { getAssetTokenMetadata } from '../../fetchers/registry';
import { Address } from '@penumbra-zone/protobuf/penumbra/core/keys/v1/keys_pb';
import { getGasPrices, hasStakingToken } from '../../fetchers/gas-prices.ts';

export interface SendSlice {
  selection: BalancesResponse | undefined;
  setSelection: (selection: BalancesResponse) => void;
  amount: string;
  setAmount: (amount: string) => void;
  recipient: string;
  setRecipient: (addr: string) => void;
  memo: string;
  setMemo: (txt: string) => void;
  fee: Fee | undefined;
  refreshFee: () => Promise<void>;
  feeTier: FeeTier_Tier;
  setFeeTier: (feeTier: FeeTier_Tier) => void;
  sendTx: () => Promise<void>;
  txInProgress: boolean;
  assetFeeMetadata: Metadata | undefined;
}

export const createSendSlice = (): SliceCreator<SendSlice> => (set, get) => {
  return {
    selection: undefined,
    amount: '',
    recipient: '',
    memo: '',
    fee: undefined,
    feeTier: FeeTier_Tier.LOW,
    txInProgress: false,
    assetFeeMetadata: undefined,
    setAmount: amount => {
      set(state => {
        state.send.amount = amount;
      });
    },
    setSelection: selection => {
      set(state => {
        state.send.selection = selection;
      });
    },
    setRecipient: addr => {
      set(state => {
        state.send.recipient = addr;
      });
    },
    setMemo: txt => {
      set(state => {
        state.send.memo = txt;
      });
    },
    refreshFee: async () => {
      const { amount, recipient, selection } = get().send;
      if (!amount || !recipient || !selection) {
        set(state => {
          state.send.fee = undefined;
          state.send.assetFeeMetadata = undefined;
        });
        return;
      }

      const req = await assembleRequest(get());
      const txPlan = await plan(req);
      const fee = txPlan.transactionParameters?.fee;

      // Fetch the asset metadata for the fee if assetId is defined; otherwise, set it to undefined.
      // The undefined case occurs when the fee uses the native staking token.
      const feeAssetMetadata = fee?.assetId ? await getAssetTokenMetadata(fee.assetId) : undefined;

      if (!fee?.amount) {
        return;
      }

      set(state => {
        state.send.fee = fee;
        state.send.assetFeeMetadata = feeAssetMetadata;
      });
    },
    setFeeTier: feeTier => {
      set(state => {
        state.send.feeTier = feeTier;
      });
    },
    sendTx: async () => {
      set(state => {
        state.send.txInProgress = true;
      });

      try {
        const req = await assembleRequest(get());
        await planBuildBroadcast('send', req);

        set(state => {
          state.send.amount = '';
        });
        get().shared.balancesResponses.revalidate();
      } finally {
        set(state => {
          state.send.txInProgress = false;
        });
      }
    },
  };
};

const assembleRequest = async (state: AllSlices) => {
  const {
    send: { amount, feeTier, recipient, selection, memo },
  } = state;

  const spendOrOutput: SpendOrOutput = {
    address: new Address({ altBech32m: recipient }),
    value: new Value({
      amount: toBaseUnit(
        BigNumber(amount),
        getDisplayDenomExponentFromValueView.optional(selection?.balanceView),
      ),
      assetId: getAssetIdFromValueView(selection?.balanceView),
    }),
  };

  const isSendingMax = checkSendMaxInvariants({
    selection,
    spendOrOutput,
    gasPrices: await getGasPrices(),
    hasStakingToken: selectedStakingTokenSelector(state),
  });

  return new TransactionPlannerRequest({
    ...(isSendingMax ? { spends: [spendOrOutput] } : { outputs: [spendOrOutput] }),
    source: getAddressIndex(selection?.accountAddress),
    // Note: we currently don't provide a UI for setting the fee manually. Thus,
    // a `feeMode` of `manualFee` is not supported here.
    feeMode:
      typeof feeTier === 'undefined'
        ? { case: undefined }
        : {
            case: 'autoFee',
            value: { feeTier },
          },
    memo: new MemoPlaintext({
      returnAddress: getAddress(selection?.accountAddress),
      text: memo,
    }),
  });
};

export interface SendValidationFields {
  recipientErr: boolean;
  amountErr: boolean;
  exponentErr: boolean;
  memoErr: boolean;
}

export const sendValidationErrors = (
  asset: BalancesResponse | undefined,
  amount: string,
  recipient: string,
  memo?: string,
): SendValidationFields => {
  return {
    recipientErr: Boolean(recipient) && !isAddress(recipient),
    amountErr: !asset ? false : amountMoreThanBalance(asset, amount),
    exponentErr: !asset ? false : isIncorrectDecimal(asset, amount),
    // The memo cannot exceed 512 bytes
    // return address uses 80 bytes
    // so 512-80=432 bytes for memo text
    memoErr: new TextEncoder().encode(memo).length > 432,
  };
};

// Determine if the selected token is the staking token based on the current balances and metadata
export const selectedStakingTokenSelector = (state: AllSlices) => {
  const transferableBalancesResponses = transferableBalancesResponsesSelector(
    state.shared.balancesResponses,
  ).data;
  const stakingTokenMetadata = state.shared.stakingTokenMetadata.data;
  const selection = state.send.selection;

  return hasStakingToken(transferableBalancesResponses, stakingTokenMetadata, selection);
};

export const sendSelector = (state: AllSlices) => state.send;

export const sendSelectionMiddleware: Middleware = f => (set, get, store) => {
  const modifiedSetter: typeof set = (...args) => {
    const before = transferableBalancesResponsesSelector(get().shared.balancesResponses).data;
    set(...args);
    const after = transferableBalancesResponsesSelector(get().shared.balancesResponses).data;

    const balancesResponsesWereJustSet = !before?.length && !!after?.length;
    const selectionNotYetSet = !get().send.selection;

    if (balancesResponsesWereJustSet && selectionNotYetSet) {
      useStore.setState(state => {
        state.send.selection = after[0];
      });
    }
  };

  store.setState = modifiedSetter;

  return f(modifiedSetter, get, store);
};

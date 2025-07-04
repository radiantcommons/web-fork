import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { getDisplayDenomExponent } from '@penumbra-zone/getters/metadata';
import {
  getBalanceView,
  getMetadataFromBalancesResponse,
} from '@penumbra-zone/getters/balances-response';
import { pnum } from '@penumbra-zone/types/pnum';

import { useBalancesStore } from '@/shared/stores/store-context';
import { BalancesByAccount } from '@/shared/stores/balances-store';
import { BalancesResponse } from '@penumbra-zone/protobuf/penumbra/view/v1/view_pb';
import { AssetCard } from './assets/asset-card';
import { TransactionCard } from './transactions/transaction-card';
import { AssetData, AccountData } from './assets/asset-card/types';

export const Portfolio = observer((): React.ReactNode => {
  const balancesStore = useBalancesStore();

  // Transform balances data to format expected by AssetCard
  const accounts = useMemo(() => {
    if (balancesStore.loading || !balancesStore.balancesByAccount.length) {
      return [];
    }

    return balancesStore.balancesByAccount.map((account: BalancesByAccount) => {
      // The addressView should be the AddressView protobuf message itself
      const firstBalance = account.balances[0];
      const addressView = firstBalance?.accountAddress;

      return {
        id: String(account.account),
        name: account.account === 0 ? 'Main Account' : `Sub-Account #${account.account}`,
        addressView,
        assets: account.balances
          .map((balance: BalancesResponse) => {
            const valueView = getBalanceView.optional(balance);
            const metadata = getMetadataFromBalancesResponse.optional(balance);

            if (!valueView || !metadata) {
              return null;
            }

            // Use original metadata without enhancement
            const originalMetadata = metadata;

            // Get the proper display exponent for this asset
            const displayExponent = getDisplayDenomExponent(originalMetadata);

            // Convert amount to display format with proper commas for large numbers
            const amount = valueView.valueView.value?.amount;
            const displayAmount = amount
              ? pnum(amount, displayExponent).toFormattedString({
                  commas: true,
                  decimals: 0, // Don't show decimals for whole numbers
                  trailingZeros: false,
                })
              : '0';

            // Use original metadata for display
            const displayName = originalMetadata.name ?? originalMetadata.symbol;

            const asset: AssetData = {
              id: originalMetadata.penumbraAssetId?.inner.toString() ?? '',
              // Use proper display name for the asset
              name: displayName,
              symbol: originalMetadata.symbol,
              // Don't include the symbol in amount - the component will add it
              amount: displayAmount,
              value: null,
              // Use original metadata images without enhancement
              icon: originalMetadata.images[0]?.png ?? originalMetadata.images[0]?.svg ?? undefined,
              // Include original metadata for AssetIcon to use
              originalMetadata,
            };

            return asset;
          })
          .filter((asset: AssetData | null): asset is AssetData => asset !== null),
      } as AccountData;
    });
  }, [balancesStore.balancesByAccount, balancesStore.loading]);

  return (
    <div className='flex w-full flex-col items-center'>
      <div className='grid w-full flex-1 grid-cols-1 gap-4 md:grid-cols-2'>
        <div>
          <AssetCard accounts={accounts} showInfoButton={true} />
        </div>
        <div>
          <TransactionCard />
        </div>
      </div>
    </div>
  );
});

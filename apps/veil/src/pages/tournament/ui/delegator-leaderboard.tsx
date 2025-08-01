import cn from 'clsx';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { AddressView } from '@penumbra-zone/protobuf/penumbra/core/keys/v1/keys_pb';
import { ValueView } from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import { bech32mAddress } from '@penumbra-zone/bech32m/penumbra';
import { AddressViewComponent } from '@penumbra-zone/ui/AddressView';
import { ValueViewComponent } from '@penumbra-zone/ui/ValueView';
import { Pagination } from '@penumbra-zone/ui/Pagination';
import { TableCell } from '@penumbra-zone/ui/TableCell';
import { splitLoHi } from '@penumbra-zone/types/lo-hi';
import { Density } from '@penumbra-zone/ui/Density';
import { Button } from '@penumbra-zone/ui/Button';
import { Text } from '@penumbra-zone/ui/Text';
import { PagePath } from '@/shared/const/pages';
import { connectionStore } from '@/shared/model/connection';
import type {
  DelegatorLeaderboardSortKey,
  DelegatorLeaderboardData,
} from '../server/delegator-leaderboard';
import { useDelegatorLeaderboard, BASE_PAGE, BASE_LIMIT } from '../api/use-delegator-leaderboard';
import { useSortableTableHeaders } from './sortable-table-header';
import { useIndexByAddress } from '../api/use-index-by-address';
import { useStakingTokenMetadata } from '@/shared/api/registry';
import { getValueViewLength } from '@/shared/utils/get-max-padstart';

interface DelegatorLeaderboardRow extends DelegatorLeaderboardData {
  reward?: ValueView;
  displayAddress: string;
}

const LeaderboardRow = observer(
  ({
    row,
    padStart,
    loading,
  }: {
    row: DelegatorLeaderboardRow;
    padStart?: number;
    loading: boolean;
  }) => {
    const { connected } = connectionStore;
    const { data: subaccountIndex } = useIndexByAddress(row.address, loading);

    const addressLink = useMemo(() => {
      if (loading) {
        return '';
      }
      return PagePath.TournamentDelegator.replace(
        ':address',
        encodeURIComponent(row.displayAddress),
      );
    }, [row.displayAddress, loading]);

    const addressView = useMemo(() => {
      return connected && subaccountIndex
        ? new AddressView({
            addressView: {
              case: 'decoded',
              value: {
                address: row.address,
                index: subaccountIndex,
              },
            },
          })
        : new AddressView({
            addressView: {
              case: 'opaque',
              value: {
                address: row.address,
              },
            },
          });
    }, [row.address, subaccountIndex, connected]);

    return (
      <Link
        href={addressLink}
        className={cn(
          'col-span-5 grid grid-cols-subgrid',
          'cursor-pointer transition-colors hover:bg-action-hover-overlay',
          !!subaccountIndex && 'bg-other-tonal-fill5',
        )}
      >
        <TableCell cell loading={loading}>
          {!loading && (
            <>
              <AddressViewComponent
                truncate
                copyable={false}
                hideIcon={!subaccountIndex}
                addressView={addressView}
              />
              <i className='flex size-4 items-center justify-center text-text-secondary'>
                <ExternalLink className='size-3' />
              </i>
            </>
          )}
        </TableCell>
        <TableCell cell loading={loading}>
          {row.epochs_voted_in}
        </TableCell>
        <TableCell cell loading={loading}>
          {row.streak}
        </TableCell>
        <TableCell cell loading={loading}>
          {row.total_rewards && (
            <ValueViewComponent
              valueView={row.reward}
              priority='tertiary'
              trailingZeros={true}
              padStart={padStart}
            />
          )}
        </TableCell>
        <TableCell cell loading={loading}>
          <Density slim>
            <Button iconOnly icon={ChevronRight}>
              Go to delegator vote information
            </Button>
          </Density>
        </TableCell>
      </Link>
    );
  },
);

export const DelegatorLeaderboard = observer(() => {
  const [page, setPage] = useState(BASE_PAGE);
  const [limit, setLimit] = useState(BASE_LIMIT);
  const { getTableHeader, sortBy } = useSortableTableHeaders<DelegatorLeaderboardSortKey>();

  const { data: stakingToken } = useStakingTokenMetadata();
  const {
    query: { isLoading },
    data,
    total,
  } = useDelegatorLeaderboard(page, limit, sortBy.key || undefined, sortBy.direction);

  const mappedData = useMemo(() => {
    return data?.reduce<{ rows: DelegatorLeaderboardRow[]; padStart: number }>(
      (accum, row) => {
        if (row.total_rewards) {
          const reward = new ValueView({
            valueView: {
              case: 'knownAssetId',
              value: {
                amount: splitLoHi(BigInt(row.total_rewards)),
                metadata: stakingToken,
              },
            },
          });

          accum.padStart = Math.max(accum.padStart, getValueViewLength(reward));
          accum.rows.push({
            ...row,
            reward,
            displayAddress: bech32mAddress(row.address),
          });
        }

        return accum;
      },
      { rows: [], padStart: 0 },
    );
  }, [data, stakingToken]);

  const loadingArr = new Array(5).fill({}) as DelegatorLeaderboardRow[];
  const leaderboard = mappedData?.rows ?? loadingArr;

  const onLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(BASE_PAGE);
  };

  return (
    <section className='flex flex-col gap-4 rounded-lg bg-other-tonal-fill5 p-6 backdrop-blur-lg'>
      <Text xxl color='text.primary'>
        Delegator Leaderboard
      </Text>
      <Density compact>
        <div className='grid max-w-full grid-cols-[200px_1fr_1fr_1fr_48px] overflow-x-auto'>
          <div key='header' className='col-span-5 grid grid-cols-subgrid'>
            <TableCell heading>Delegator Address</TableCell>
            {getTableHeader('epochs_voted_in', 'Rounds Participated')}
            {getTableHeader('streak', 'Voting Streak')}
            {getTableHeader('total_rewards', 'Rewards Earned')}
            <TableCell heading> </TableCell>
          </div>

          {leaderboard.map((row, index) => (
            <LeaderboardRow
              key={isLoading ? `loading-${index}` : row.displayAddress}
              padStart={mappedData?.padStart}
              row={row}
              loading={isLoading || !Object.keys(row).length}
            />
          ))}
        </div>
      </Density>

      {!isLoading && total >= BASE_LIMIT && (
        <Pagination
          totalItems={total}
          visibleItems={leaderboard.length}
          value={page}
          limit={limit}
          onChange={setPage}
          onLimitChange={onLimitChange}
        />
      )}
    </section>
  );
});

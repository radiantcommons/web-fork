import cn from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { ChevronRight } from 'lucide-react';
import { ValueViewComponent } from '@penumbra-zone/ui/ValueView';
import { Pagination } from '@penumbra-zone/ui/Pagination';
import { TableCell } from '@penumbra-zone/ui/TableCell';
import { Tooltip } from '@penumbra-zone/ui/Tooltip';
import { Density } from '@penumbra-zone/ui/Density';
import { Button } from '@penumbra-zone/ui/Button';
import { Text } from '@penumbra-zone/ui/Text';
import { connectionStore } from '@/shared/model/connection';
import { useStakingTokenMetadata } from '@/shared/api/registry';
import { usePreviousEpochs, BASE_PAGE, BASE_LIMIT } from '../api/use-previous-epochs';
import type { PreviousEpochData } from '../server/previous-epochs';
import { useSortableTableHeaders } from './sortable-table-header';
import { usePersonalRewards } from '../api/use-personal-rewards';
import { Vote } from './vote';
import { toValueView } from '@/shared/utils/value-view';
import { EpochBug } from '@/pages/tournament/ui/shared/bug';

const TABLE_CLASSES = {
  table: {
    default: cn('grid-cols-[200px_1fr_48px]'),
    connected: cn('grid-cols-[200px_1fr_200px_48px]'),
  },
  row: {
    default: cn('col-span-3'),
    connected: cn('col-span-4'),
  },
};

interface PreviousEpochsRowProps {
  row: PreviousEpochData;
  isLoading: boolean;
  className: string;
  connected: boolean;
}

const PreviousEpochsRow = observer(
  ({ row, isLoading, className, connected }: PreviousEpochsRowProps) => {
    const { subaccount } = connectionStore;
    const {
      data: rewards,
      query: { isLoading: rewardsLoading },
    } = usePersonalRewards(subaccount, row.epoch, false, 1, 1);
    const { data: stakingToken } = useStakingTokenMetadata();
    const reward = rewards.get(row.epoch);

    return (
      <Link
        href={isLoading ? '' : `/tournament/${row.epoch}`}
        className={cn(
          className,
          'grid grid-cols-subgrid',
          'cursor-pointer transition-colors hover:bg-action-hover-overlay',
        )}
      >
        <TableCell cell loading={isLoading}>
          Epoch #{row.epoch}
          <EpochBug epoch={row.epoch} small />
        </TableCell>
        <TableCell cell loading={isLoading}>
          {!isLoading && !row.gauge.length && '-'}
          {!isLoading &&
            row.gauge.slice(0, 3).map((vote, index) => (
              <div key={index} className='flex min-w-[88px] items-center justify-start px-1'>
                <Vote asset={vote.asset} percent={vote.portion} hideFor />
              </div>
            ))}
          {!isLoading && row.gauge.length > 3 && (
            <Tooltip
              message={
                <div className='flex flex-col gap-2'>
                  {row.gauge.slice(3).map((vote, index) => (
                    <Vote key={index} asset={vote.asset} percent={vote.portion} hideFor />
                  ))}
                </div>
              }
            >
              <div className='flex items-center justify-start px-3 text-text-primary'>
                <Text smallTechnical>+{row.gauge.length - 3}</Text>
              </div>
            </Tooltip>
          )}
        </TableCell>

        {connected && (
          <TableCell cell loading={isLoading || rewardsLoading}>
            {reward !== undefined ? (
              <ValueViewComponent
                trailingZeros
                valueView={toValueView({ amount: reward.reward, metadata: stakingToken })}
                priority='tertiary'
              />
            ) : (
              '-'
            )}
          </TableCell>
        )}
        <TableCell cell loading={isLoading}>
          <Density slim>
            <Button iconOnly icon={ChevronRight}>
              Go to voting reward information
            </Button>
          </Density>
        </TableCell>
      </Link>
    );
  },
);

export const PreviousEpochs = observer(() => {
  const [page, setPage] = useState(BASE_PAGE);
  const [limit, setLimit] = useState(BASE_LIMIT);
  const { getTableHeader, sortBy } = useSortableTableHeaders<'epoch'>();

  const { connected } = connectionStore;
  const tableKey = connected ? 'connected' : 'default';

  const {
    query: { isLoading },
    data,
    total,
  } = usePreviousEpochs(connected, page, limit, sortBy.key, sortBy.direction);

  const loadingArr = new Array(10).fill({ votes: [] }) as PreviousEpochData[];
  const epochs = data ?? loadingArr;

  const onLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(BASE_PAGE);
  };

  return (
    <div className='flex w-full flex-col gap-6 rounded-lg bg-other-tonal-fill5 p-6 backdrop-blur-lg'>
      <Text xxl color='text.primary'>
        Previous Epochs
      </Text>
      <Density compact>
        <div className={cn('grid max-w-full overflow-x-auto', TABLE_CLASSES.table[tableKey])}>
          <div className={cn('grid grid-cols-subgrid', TABLE_CLASSES.row[tableKey])}>
            {getTableHeader('epoch', 'Epoch')}
            <TableCell heading>Votes Summary</TableCell>
            {connected && <TableCell heading>My Voting Rewards</TableCell>}
            <TableCell heading> </TableCell>
          </div>

          {epochs.map((epoch, index) => (
            <PreviousEpochsRow
              key={isLoading ? index : epoch.epoch}
              isLoading={isLoading}
              row={epoch}
              connected={connected}
              className={TABLE_CLASSES.row[tableKey]}
            />
          ))}
        </div>
      </Density>

      {!isLoading && total >= BASE_LIMIT && (
        <Pagination
          totalItems={total}
          visibleItems={epochs.length}
          value={page}
          limit={limit}
          onChange={setPage}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
});

import Link from 'next/link';
import { Text } from '@penumbra-zone/ui/Text';
import { Card } from '@penumbra-zone/ui/Card';
import { ValueViewComponent } from '@penumbra-zone/ui/ValueView';
import { TimeDisplay } from '@/pages/inspect/ui/time.tsx';
import { useLpIdInUrl } from '@/pages/inspect/ui/result.tsx';
import { useLpPosition } from '@/pages/inspect/lp/api/position.ts';
import { Skeleton } from '@/shared/ui/skeleton.tsx';
import { PositionStateVV, PositionWithdrawalVV } from '@/pages/inspect/lp/api/types.ts';

export const PositionClosed = ({
  closingTx,
  closingTime,
  closingHeight,
}: {
  closingTime: string;
  closingHeight: number;
  closingTx?: string;
}) => {
  return (
    <div className='mb-4 grid grid-cols-6 items-center'>
      <div className='col-span-4'>
        <Card title='Position Closed'>
          <div className='flex items-center justify-between'>
            <div className='flex min-w-0 shrink flex-col gap-2'>
              {closingTx && (
                <Text color='text.secondary' truncate>
                  Tx:{' '}
                  <Link href={`/inspect/tx/${closingTx}`} className='hover:underline'>
                    {closingTx}
                  </Link>
                </Text>
              )}
            </div>

            <div className='ml-4 shrink-0'></div>
          </div>
        </Card>
      </div>
      <div className='col-span-2'>
        <TimeDisplay dateStr={closingTime} height={closingHeight} />
      </div>
    </div>
  );
};

export const PositionWithdraw = ({ withdrawal }: { withdrawal: PositionWithdrawalVV }) => {
  return (
    <div className='mb-4 grid grid-cols-6 items-center'>
      <div className='col-span-4'>
        <Card title='Position Withdraw'>
          <div className='flex items-center justify-between'>
            <div className='flex min-w-0 shrink flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <ValueViewComponent valueView={withdrawal.reserves1} abbreviate={false} />
                <ValueViewComponent valueView={withdrawal.reserves2} abbreviate={false} />
              </div>

              <Text color='text.secondary' truncate>
                Tx:{' '}
                <Link href={`/inspect/tx/${withdrawal.txHash}`} className='hover:underline'>
                  {withdrawal.txHash}
                </Link>
              </Text>
            </div>
          </div>
        </Card>
      </div>
      <div className='col-span-2'>
        <TimeDisplay dateStr={withdrawal.time} height={withdrawal.height} />
      </div>
    </div>
  );
};

export const PositionOpen = ({ state }: { state: PositionStateVV }) => {
  return (
    <div className='mb-4 grid grid-cols-6 items-center'>
      <div className='col-span-4'>
        <Card title='Position Open'>
          <div className='flex items-center justify-between'>
            <div className='flex min-w-0 shrink flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <ValueViewComponent valueView={state.openingReserves1} abbreviate={false} />
                <ValueViewComponent valueView={state.openingReserves2} abbreviate={false} />
              </div>

              <Text color='text.secondary' truncate>
                Tx:{' '}
                <Link href={`/inspect/tx/${state.openingTx}`} className='hover:underline'>
                  {state.openingTx}
                </Link>
              </Text>
            </div>
          </div>
        </Card>
      </div>
      <div className='col-span-2'>
        <TimeDisplay dateStr={state.openingTime} height={state.openingHeight} />
      </div>
    </div>
  );
};

const DataBody = ({
  state,
  withdrawals,
}: {
  state: PositionStateVV;
  withdrawals: PositionWithdrawalVV[];
}) => {
  return (
    <div className='flex flex-col justify-center gap-4'>
      {withdrawals.map((w, i) => (
        <PositionWithdraw key={i} withdrawal={w} />
      ))}
      {state.closingTime && state.closingHeight && (
        <PositionClosed
          closingHeight={state.closingHeight}
          closingTime={state.closingTime}
          closingTx={state.closingTx}
        />
      )}
      <PositionOpen state={state} />
    </div>
  );
};

const LoadingState = ({ count = 2 }: { count?: number }) => {
  const withdrawalSkeletons = Array.from({ length: count });

  return (
    <div className='flex flex-col gap-4'>
      {withdrawalSkeletons.map((_, index) => (
        <Card key={index}>
          <div className='flex items-center justify-between'>
            <div className='flex min-w-0 shrink flex-col gap-2'>
              <div className='flex items-center gap-2'>
                {/* Skeletons for ValueViewComponents */}
                <div className='h-6 w-24'>
                  <Skeleton />
                </div>
                <div className='h-6 w-24'>
                  <Skeleton />
                </div>
              </div>
              <div className='h-4 w-32'>
                <Skeleton />
              </div>
            </div>
            <div className='ml-4 shrink-0'>
              <div className='h-4 w-20'>
                <Skeleton />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export const Actions = () => {
  const id = useLpIdInUrl();
  const { data, isLoading } = useLpPosition(id);

  return (
    <div className='flex flex-col gap-2'>
      <Text xxl color='base.white'>
        Actions
      </Text>
      {isLoading && <LoadingState />}
      {data && <DataBody state={data.state} withdrawals={data.withdrawals} />}
    </div>
  );
};

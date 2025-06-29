import Link from 'next/link';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { FileSearch } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { TransactionId } from '@penumbra-zone/protobuf/penumbra/core/txhash/v1/txhash_pb';
import { TransactionInfo } from '@penumbra-zone/protobuf/penumbra/view/v1/view_pb';
import { TransactionSummary } from '@penumbra-zone/ui/TransactionSummary';
import { Button } from '@penumbra-zone/ui/Button';
import { Skeleton } from '@penumbra-zone/ui/Skeleton';
import { uint8ArrayToHex } from '@penumbra-zone/types/hex';
import { connectionStore } from '@/shared/model/connection';
import { useGetMetadata } from '@/shared/api/assets';
import { BlockchainError } from '@/shared/ui/blockchain-error';
import { useObserver } from '@/shared/utils/use-observer';
import { useTransactions } from '../api/use-transactions';
import { NoData } from './no-data';

const getTransactionLink = (id?: TransactionId) => {
  const hash = id?.inner ? uint8ArrayToHex(id.inner) : '';

  const TxLink = ({ children, ...rest }: { children?: ReactNode }) => (
    <Link href={`/inspect/tx/${hash}`} {...rest}>
      {children}
    </Link>
  );
  TxLink.displayName = 'TxLink';

  return TxLink;
};

export const PortfolioTransactions = observer(() => {
  const router = useRouter();

  const { subaccount } = connectionStore;
  const getMetadata = useGetMetadata();
  const {
    data: transactions,
    isLoading,
    error,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useTransactions(subaccount);

  const { observerEl } = useObserver(
    isLoading || isRefetching || isFetchingNextPage || !hasNextPage,
    () => {
      void fetchNextPage();
    },
  );

  const getTxId = (tx: TransactionInfo): string => {
    return tx.id?.inner ? uint8ArrayToHex(tx.id.inner) : '';
  };

  return (
    <div className='flex flex-col gap-1' style={{ overflowAnchor: 'none' }}>
      {isLoading &&
        Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className='h-[72px]'>
            <Skeleton />
          </div>
        ))}

      {!isLoading && !!error && (
        <div className='flex min-h-[250px] items-center'>
          <BlockchainError direction='column' message={String(error)} hideDetails />
        </div>
      )}

      {!isLoading && !error && !transactions?.pages[0]?.length && (
        <NoData label='You have no transactions' />
      )}

      {transactions?.pages.map(page =>
        page.map((tx, index) => (
          <TransactionSummary
            info={tx}
            key={getTxId(tx) || index}
            as={getTransactionLink(tx.id)}
            getMetadata={getMetadata}
            onClick={() =>
              tx.id?.inner && router.push(`/inspect/tx/${uint8ArrayToHex(tx.id.inner)}`)
            }
            endAdornment={
              <Button actionType='accent' density='compact' iconOnly icon={FileSearch}>
                Go to transaction details
              </Button>
            }
          />
        )),
      )}

      {/* An element that triggers the infinite scroll when visible */}
      <div className='h-1 w-full' ref={observerEl} />
    </div>
  );
});

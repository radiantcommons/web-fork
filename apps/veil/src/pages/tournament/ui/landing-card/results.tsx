import { Text } from '@penumbra-zone/ui/Text';
import { Skeleton } from '@penumbra-zone/ui/Skeleton';
import type { MappedGauge } from '../../server/previous-epochs';
import { VoteAssetIcon, VoteAssetContent } from '../vote-dialog/vote-dialog-asset';
import { ProvideLiquidityButton } from '../shared/provide-liquidity-button';

export interface TournamentResultsProps {
  results: MappedGauge[];
  loading: boolean;
}

const TournamentResultsAsset = ({ asset }: { asset: MappedGauge }) => {
  return (
    <div key={asset.asset.symbol} className='flex items-center gap-3'>
      <VoteAssetIcon asset={asset} />
      <VoteAssetContent asset={asset} />
      <ProvideLiquidityButton symbol={asset.asset.symbol} />
    </div>
  );
};

export const TournamentResults = ({ loading, results }: TournamentResultsProps) => {
  if (!loading && !results.length) {
    return <div className='grow' />;
  }

  return (
    <div className='flex grow flex-col gap-4'>
      {loading ? (
        <div className='h-6 w-24 rounded'>
          <Skeleton />
        </div>
      ) : (
        <Text strong color='text.primary'>
          Current Results
        </Text>
      )}

      {loading
        ? new Array(5).fill({}).map((_, index) => (
            <div key={index} className='h-8 w-full rounded'>
              <Skeleton />
            </div>
          ))
        : results.map(asset => <TournamentResultsAsset asset={asset} key={asset.asset.base} />)}
    </div>
  );
};

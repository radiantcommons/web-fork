import { useSyncProgress } from '@penumbra-zone/ui-deprecated/components/ui/block-sync-status';
import { Text } from '@penumbra-zone/ui-deprecated/Text';

export const RemainingTime = ({
  fullSyncHeight,
  latestKnownBlockHeight,
}: {
  fullSyncHeight: bigint;
  latestKnownBlockHeight: bigint;
}) => {
  const { formattedTimeRemaining } = useSyncProgress(fullSyncHeight, latestKnownBlockHeight);
  return (
    <Text technical as='div'>
      {`(Estimated time remaining: ${formattedTimeRemaining})`}
    </Text>
  );
};

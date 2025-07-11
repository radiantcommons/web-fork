import { Text } from '@penumbra-zone/ui/Text';
import { JsonViewer } from '@textea/json-viewer';
import { useLpIdInUrl } from '@/pages/inspect/ui/result.tsx';
import { useLpPosition } from '@/pages/inspect/lp/api/position.ts';
import { Skeleton } from '@/shared/ui/skeleton.tsx';

const LoadingState = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='space-y-2 p-4'>
        <div className='h-4 w-full' aria-hidden='true'>
          <Skeleton />
        </div>
        <div className='h-4 w-full' aria-hidden='true'>
          <Skeleton />
        </div>
        <div className='h-4 w-full' aria-hidden='true'>
          <Skeleton />
        </div>
        <div className='h-4 w-full' aria-hidden='true'>
          <Skeleton />
        </div>
      </div>
    </div>
  );
};

export const DebugView = () => {
  const id = useLpIdInUrl();
  const { data, isLoading } = useLpPosition(id);

  return (
    <div className='flex flex-col gap-2'>
      <Text xxl color='base.white'>
        Debug view
      </Text>
      {isLoading && <LoadingState />}
      {data && (
        <JsonViewer
          value={data}
          enableClipboard
          defaultInspectDepth={1}
          displayDataTypes={false}
          theme='dark'
          rootName={false}
          quotesOnKeys={false}
        />
      )}
    </div>
  );
};

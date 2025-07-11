import { List } from 'lucide-react';
import { Text } from '@penumbra-zone/ui/Text';

export interface NoDataProps {
  label: string;
}

export const NoData = ({ label }: NoDataProps) => {
  return (
    <div className='flex min-h-[250px] flex-col items-center justify-center pt-5'>
      <List className='size-8 text-neutral-light' />
      <Text small color='text.secondary'>
        {label}
      </Text>
    </div>
  );
};

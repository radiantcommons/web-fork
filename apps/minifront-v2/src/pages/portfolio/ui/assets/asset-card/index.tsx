import { ReactNode } from 'react';
import { Card } from '@penumbra-zone/ui/Card';
import { Text } from '@penumbra-zone/ui/Text';
import { Button } from '@penumbra-zone/ui/Button';
import { Wallet2 } from 'lucide-react';
import { AssetList } from './AssetList';
import { InfoDialog } from '../info-dialog';
import { useIsConnected, useConnectWallet } from '@/shared/hooks/use-connection';
import { AccountData } from './types';

export interface AssetCardProps {
  /**
   * Title of the card
   */
  title?: string;
  /**
   * List of accounts with assets
   */
  accounts?: AccountData[];
  /**
   * Optional header action component
   */
  headerAction?: ReactNode;
  /**
   * Optional content to display at the end of the title row
   * This is useful for displaying icons, buttons, or other elements
   * alongside the title
   */
  /**
   * Whether to show the InfoButton
   * When true, the InfoButton will be displayed next to the title
   */
  showInfoButton?: boolean;
}

/**
 * AssetCard component displays a list of assets grouped by accounts.
 * It follows the Penumbra design system and uses the Card component as a container.
 *
 * By default, it shows an InfoButton that provides information about the shielded portfolio.
 */
export const AssetCard = ({
  title = 'Your Assets',
  accounts = [],
  headerAction,
  showInfoButton = true,
}: AssetCardProps) => {
  const isConnected = useIsConnected();
  const { connectWallet } = useConnectWallet();

  // Use InfoButton as endContent if showInfoButton is true and no custom endContent is provided
  const finalEndContent = showInfoButton ? <InfoDialog /> : undefined;

  // If wallet is not connected, show connect wallet message
  if (!isConnected) {
    return (
      <Card title={title} headerAction={headerAction} endContent={finalEndContent}>
        <div className='flex min-h-[250px] flex-col items-center justify-center gap-4'>
          <div className='size-8 text-text-secondary'>
            <Wallet2 className='size-full' />
          </div>
          <Text color='text.secondary' small>
            Connect wallet to see your assets
          </Text>
          <div className='w-fit'>
            <Button actionType='default' density='compact' onClick={() => void connectWallet()}>
              Connect wallet
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title={title} headerAction={headerAction} endContent={finalEndContent}>
      <AssetList accounts={accounts} />
    </Card>
  );
};

// Re-export sub-components and types
export { AssetList } from './AssetList';
export type { AssetListProps } from './AssetList';
export { AssetListItem } from './AssetListItem';
export type { AssetListItemProps } from './AssetListItem';
export { AccountSection } from './AccountSection';
export type { AccountSectionProps } from './AccountSection';
export type { AccountData, AssetData } from './types';

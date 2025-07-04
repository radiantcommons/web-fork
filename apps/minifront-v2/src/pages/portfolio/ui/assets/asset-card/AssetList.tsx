import { AccountSection } from './AccountSection';
import { AccountData } from './types';

export interface AssetListProps {
  /**
   * Accounts with their assets to display
   */
  accounts: AccountData[];
}

/**
 * AssetList component renders a list of accounts with their assets
 */
export const AssetList = ({ accounts }: AssetListProps) => {
  if (accounts.length === 0) {
    return (
      <div className='text-muted-foreground flex min-h-[120px] flex-col items-center justify-center p-6 text-center'>
        <p className='text-sm'>You have no assets yet.</p>
        <p className='mt-1 text-xs'>
          Deposit or receive any assets first to your wallet. They will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      {accounts.map(account => (
        <AccountSection key={account.id} account={account} />
      ))}
    </div>
  );
};

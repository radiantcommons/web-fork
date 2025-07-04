import { observer } from 'mobx-react-lite';
import { Button } from '@penumbra-zone/ui/Button';
import { Text } from '@penumbra-zone/ui/Text';
import { connectionStore } from '@/shared/model/connection';
import { ConnectButton } from '@/features/connect/connect-button';
import { OrderInput } from './order-input';
import { SegmentedControl } from './segmented-control';
import { InfoRowTradingFee } from './info-row-trading-fee';
import { InfoRowGasFee } from './info-row-gas-fee';
import { InfoRow } from './info-row';
import { SelectGroup } from './select-group';
import { OrderFormStore } from './store/OrderFormStore';
import { BuyLimitOrderOptions, SellLimitOrderOptions } from './store/LimitOrderFormStore';

export const LimitOrderForm = observer(({ parentStore }: { parentStore: OrderFormStore }) => {
  const { connected } = connectionStore;
  const { defaultDecimals, limitForm: store } = parentStore;

  const isBuy = store.direction === 'buy';

  return (
    <div className='p-4'>
      <SegmentedControl direction={store.direction} setDirection={store.setDirection} />
      <div className='mb-4'>
        <div className='mb-2'>
          <OrderInput
            round
            label={`When ${store.baseAsset?.symbol} is`}
            value={store.priceInput}
            decimals={store.quoteAsset?.exponent ?? defaultDecimals}
            onChange={price => store.setPriceInput(price)}
            denominator={store.quoteAsset?.symbol}
          />
        </div>
        <SelectGroup
          options={Object.values(isBuy ? BuyLimitOrderOptions : SellLimitOrderOptions)}
          value={store.priceInputOption}
          onChange={option =>
            store.setPriceInputOption(option as BuyLimitOrderOptions | SellLimitOrderOptions)
          }
        />
      </div>
      <div className='mb-4'>
        <OrderInput
          round
          label={isBuy ? 'Buy' : 'Sell'}
          value={store.baseInput}
          decimals={store.baseAsset?.exponent ?? defaultDecimals}
          onChange={store.setBaseInput}
          denominator={store.baseAsset?.symbol}
        />
      </div>
      <div className='mb-4'>
        <OrderInput
          round
          label={isBuy ? 'Pay with' : 'Receive'}
          value={store.quoteInput}
          decimals={store.quoteAsset?.exponent ?? defaultDecimals}
          onChange={store.setQuoteInput}
          denominator={store.quoteAsset?.symbol}
        />
      </div>
      <div className='mb-4'>
        <InfoRow label='Available balance' value={store.balance} />
        <InfoRowTradingFee />
        <InfoRowGasFee
          gasFee={parentStore.gasFee.display}
          symbol={parentStore.gasFee.symbol}
          isLoading={parentStore.gasFeeLoading}
        />
        <InfoRow
          label='Receive'
          value={
            isBuy
              ? `${store.baseInput} ${store.baseAsset?.symbol ?? '--'}`
              : `${store.quoteInput} ${store.quoteAsset?.symbol ?? '--'}`
          }
        />
      </div>
      <div className='mb-4'>
        {connected ? (
          <Button
            actionType='accent'
            disabled={!parentStore.canSubmit}
            onClick={() => void parentStore.submit()}
          >
            {isBuy ? 'Buy' : 'Sell'} {store.baseAsset?.symbol}
          </Button>
        ) : (
          <ConnectButton actionType='default' />
        )}
      </div>
      {parentStore.marketPrice && (
        <div className='flex justify-center p-1'>
          <Text small color='text.secondary'>
            1 {store.baseAsset?.symbol} ={' '}
            <Text small color='text.primary'>
              {store.quoteAsset?.formatDisplayAmount(parentStore.marketPrice)}
            </Text>
          </Text>
        </div>
      )}
    </div>
  );
});

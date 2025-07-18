import Image from 'next/image';
import { observer } from 'mobx-react-lite';
import { WalletMinimal, InfoIcon } from 'lucide-react';
import { Button } from '@penumbra-zone/ui/Button';
import { Text } from '@penumbra-zone/ui/Text';
import { TextInput } from '@penumbra-zone/ui/TextInput';
import { connectionStore } from '@/shared/model/connection';
import { ConnectButton } from '@/features/connect/connect-button';
import { Tooltip } from '@penumbra-zone/ui/Tooltip';
import { InfoRow } from './info-row';
import { InfoRowGasFee } from './info-row-gas-fee';
import { OrderFormStore } from './store/OrderFormStore';
import { DEFAULT_PRICE_RANGE, DEFAULT_PRICE_SPREAD } from './store/SimpleLPFormStore';
import { PriceSlider, roundToDecimals } from './price-slider';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@penumbra-zone/ui/Icon';
import { Density } from '@penumbra-zone/ui/Density';
import { useIsLqtEligible } from '@/shared/utils/is-lqt-eligible';
import { LiquidityDistributionShape } from '@/shared/math/position';
import { LiquidityShape } from './liquidity-shape';

export const SimpleLiquidityOrderForm = observer(
  ({ parentStore }: { parentStore: OrderFormStore }) => {
    const { connected } = connectionStore;
    const { simpleLPForm: store, defaultDecimals } = parentStore;
    const isLQTEligible = useIsLqtEligible(store.baseAsset?.metadata, store.quoteAsset?.metadata);

    const priceSpread = DEFAULT_PRICE_SPREAD;
    const priceRange = DEFAULT_PRICE_RANGE;

    // simple absolute zoom adjustment in steps of 0.05
    const [zoomAdjustment /* setZoomAdjustment */] = useState(0);
    const adjustedPriceRange = priceRange + zoomAdjustment;

    const [priceRanges, setPriceRanges] = useState<[number | undefined, number | undefined]>([
      undefined,
      undefined,
    ]);

    const setRanges = useCallback(() => {
      if (!store.marketPrice) {
        setPriceRanges([undefined, undefined]);
        return;
      }

      const exponent = store.quoteAsset?.exponent ?? defaultDecimals;
      setPriceRanges([
        roundToDecimals(store.marketPrice * (1 - priceSpread), exponent),
        roundToDecimals(store.marketPrice * (1 + priceSpread), exponent),
      ]);
    }, [defaultDecimals, priceSpread, store.marketPrice, store.quoteAsset?.exponent]);

    useEffect(() => {
      // set price ranges once the market price is available
      if (store.marketPrice && !priceRanges[0] && !priceRanges[1]) {
        setRanges();
      }

      // unset price ranges once the market price is unavailable
      // due to switching of asset pairs
      if (!store.marketPrice && priceRanges[0] && priceRanges[1]) {
        setRanges();
      }
    }, [store.marketPrice, priceSpread, priceRanges, setRanges]);

    // values flow from local state to form store to keep ui smooth
    useEffect(() => {
      if (priceRanges[0] && priceRanges[1]) {
        store.setLowerPriceInput(priceRanges[0]);
        store.setUpperPriceInput(priceRanges[1]);
      }
    }, [store, priceRanges]);

    return (
      <div className='p-4'>
        <div className='mb-4'>
          <div className='mb-2 flex items-center gap-1 leading-6'>
            <Text small color='text.secondary'>
              Enter Amounts
            </Text>
            <Tooltip message='Specify the token amounts for your liquidity contribution. They adjust based on the selected price range.'>
              <Icon IconComponent={InfoIcon} size='sm' color='text.secondary' />
            </Tooltip>
          </div>
          <div className='mb-2'>
            <Density compact>
              <TextInput
                type='number'
                typography='large'
                blurOnWheel
                value={store.baseInput}
                maxDecimals={store.quoteAsset?.exponent ?? defaultDecimals}
                onChange={store.setBaseInput}
                endAdornment={
                  store.baseAsset?.symbol && (
                    <div className='flex shrink-0 items-center gap-1 font-default text-text-sm leading-text-xs font-normal text-text-secondary'>
                      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- its necessary */}
                      {store.baseAsset?.metadata?.images?.[0]?.svg && (
                        <Image
                          className='h-4 w-4 rounded-full'
                          src={store.baseAsset.metadata.images[0].svg}
                          alt={store.baseAsset.symbol}
                          width={16}
                          height={16}
                        />
                      )}
                      <div>{store.baseAsset.symbol}</div>
                    </div>
                  )
                }
              />
            </Density>
            {store.baseAsset?.formatBalance() && (
              <button
                type='button'
                className='my-1 flex items-center gap-1 font-mono text-text-xs leading-text-xs font-normal text-text-secondary'
                onClick={() => {
                  const target = store.baseAsset?.balance?.toString();
                  if (target) {
                    store.setBaseInput(target);
                  }
                }}
              >
                <div className='flex h-[20px] w-[28px] items-center justify-center rounded-full bg-other-tonal-fill5'>
                  <Icon IconComponent={WalletMinimal} size='xs' color='text.secondary' />
                </div>
                {store.baseAsset.formatBalance()}
              </button>
            )}
          </div>
          <div className='mb-2'>
            <Density compact>
              <TextInput
                type='number'
                typography='large'
                blurOnWheel
                value={store.quoteInput}
                maxDecimals={store.quoteAsset?.exponent ?? defaultDecimals}
                onChange={store.setQuoteInput}
                endAdornment={
                  store.quoteAsset?.symbol && (
                    <div className='flex shrink-0 items-center gap-1 font-default text-text-sm leading-text-xs font-normal text-text-secondary'>
                      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- its necessary */}
                      {store.quoteAsset?.metadata?.images?.[0]?.svg && (
                        <Image
                          className='h-4 w-4 rounded-full'
                          src={store.quoteAsset.metadata.images[0].svg}
                          alt={store.quoteAsset.symbol}
                          width={16}
                          height={16}
                        />
                      )}
                      <div>{store.quoteAsset.symbol}</div>
                    </div>
                  )
                }
              />
            </Density>
            {store.quoteAsset?.formatBalance() && (
              <button
                type='button'
                className='my-1 flex items-center gap-1 font-mono text-text-xs leading-text-xs font-normal text-text-secondary'
                onClick={() => {
                  const target = store.quoteAsset?.balance?.toString();
                  if (target) {
                    store.setQuoteInput(target);
                  }
                }}
              >
                <div className='flex h-[20px] w-[28px] items-center justify-center rounded-full bg-other-tonal-fill5'>
                  <Icon IconComponent={WalletMinimal} size='xs' color='text.secondary' />
                </div>
                {store.quoteAsset.formatBalance()}
              </button>
            )}
          </div>
        </div>
        <div className='mb-4'>
          <div className='mb-2 flex items-center gap-1'>
            <Text small color='text.secondary'>
              Liquidity Shape
            </Text>
            <Tooltip message='Select how your liquidity is distributed across the price range.'>
              <Icon IconComponent={InfoIcon} size='sm' color='text.secondary' />
            </Tooltip>
          </div>
          <div className='flex w-full gap-2'>
            {Object.values(LiquidityDistributionShape).map(shape => (
              <LiquidityShape
                key={shape}
                shape={shape}
                selected={store.liquidityShape === shape}
                onClick={() => store.setLiquidityShape(shape)}
              />
            ))}
          </div>
        </div>
        <div className='mb-4'>
          <div className='mb-4 flex justify-between leading-6'>
            <div className='flex items-center gap-1'>
              <Text small color='text.secondary'>
                Price Range
              </Text>
              <Tooltip message='Defines the range of prices where your liquidity will be active. You earn fees only when trades happen within this range.'>
                <Icon IconComponent={InfoIcon} size='sm' color='text.secondary' />
              </Tooltip>
            </div>
            <div className='flex items-center gap-1'>
              {/* Jason note: this is pending designs, but needed the
               /* ability to zoom to test the depth chart */}
              {/* <Button
                actionType='default'
                priority='secondary'
                density='compact'
                onClick={() => {
                  setZoomAdjustment(prev => Math.max(-0.25, prev - 0.05));
                }}
              >
                +
              </Button>
              <Button
                actionType='default'
                priority='secondary'
                density='compact'
                onClick={() => {
                  setZoomAdjustment(prev => Math.min(0.25, prev + 0.05));
                }}
              >
                -
              </Button> */}
              <Button
                actionType='default'
                priority='secondary'
                density='compact'
                onClick={setRanges}
              >
                Reset
              </Button>
            </div>
          </div>
          <PriceSlider
            min={store.marketPrice ? store.marketPrice * (1 - adjustedPriceRange) : 0}
            max={store.marketPrice ? store.marketPrice * (1 + adjustedPriceRange) : Infinity}
            values={priceRanges}
            onInput={setPriceRanges}
            quoteExponent={store.quoteAsset?.exponent ?? defaultDecimals}
            marketPrice={store.marketPrice}
            quoteAsset={store.quoteAsset}
            baseAsset={store.baseAsset}
          />
        </div>
        <div className='mb-4'>
          <InfoRow
            label='LQT Rewards'
            value={isLQTEligible ? 'Eligible' : 'Not Eligible'}
            valueColor={isLQTEligible ? 'success' : undefined}
            toolTip={
              isLQTEligible ? (
                <>
                  This pair qualifies for LQT rewards. By providing liquidity, you earn additional
                  protocol incentives.{' '}
                  <a href='https://penumbra-zone.webflow.io/tournament' className='underline'>
                    Learn More.
                  </a>
                </>
              ) : (
                <>
                  This pair is not currently eligible for LQT rewards. Explore other pairs or{' '}
                  <a href='https://penumbra-zone.webflow.io/tournament' className='underline'>
                    Learn More.
                  </a>
                </>
              )
            }
          />
          <InfoRowGasFee
            gasFee={parentStore.gasFee.display}
            symbol={parentStore.gasFee.symbol}
            isLoading={parentStore.gasFeeLoading}
          />
        </div>
        <div className='mb-4'>
          {connected ? (
            <Button
              actionType='accent'
              disabled={!parentStore.canSubmit}
              onClick={() => void parentStore.submit()}
            >
              Add Liquidity
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
  },
);

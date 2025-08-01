import { AssetId } from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import {
  Position,
  PositionState,
  PositionState_PositionStateEnum,
  TradingPair,
} from '@penumbra-zone/protobuf/penumbra/core/component/dex/v1/dex_pb';
import { Amount } from '@penumbra-zone/protobuf/penumbra/core/num/v1/num_pb';
import { pnum } from '@penumbra-zone/types/pnum';
import BigNumber from 'bignumber.js';

export interface PositionedLiquidity {
  position: Position;
  shape: LiquidityDistributionShape;
}

export const compareAssetId = (a: AssetId, b: AssetId): number => {
  // The asset ids are serialized using LE, so this is checking the MSB.
  for (let i = 31; i >= 0; --i) {
    const a_i = a.inner[i] ?? -Infinity;
    const b_i = b.inner[i] ?? -Infinity;
    if (a_i < b_i) {
      return -1;
    }
    if (b_i < a_i) {
      return 1;
    }
  }
  return 0;
};

/**
 * A slimmed-down representation for assets, restricted to what we need for math.
 *
 * We have an identifier for the kind of asset, which is needed to construct a position,
 * and an exponent E, such that 10**E units of the base denom constitute a unit of the display denom.
 *
 * For example, 10**6 uUSD make up one USD.
 */
export interface Asset {
  id: AssetId;
  exponent: number;
}

/**
 * A basic plan to create a position.
 *
 * This can then be passed to `planToPosition` to fill out the position.
 */
export interface PositionPlan {
  baseAsset: Asset;
  quoteAsset: Asset;
  /** How much of the quote asset do you get for each unit of the base asset?
   *
   * This will be in terms of the *display* denoms, e.g. USD / UM.
   */
  price: number;
  /** The fee, in [0, 10_000]*/
  feeBps: number;
  /** How much of the base asset we want to provide, in display units. */
  baseReserves: number;
  /** How much of the quote asset we want to provide, in display units. */
  quoteReserves: number;
}

const priceToPQ = (
  price: number,
  pExponent: number,
  qExponent: number,
): { p: Amount; q: Amount } => {
  // e.g. price     = X USD / UM
  //      basePrice = Y uUM / uUSD = X USD / UM * uUSD / USD * UM / uUM
  //                = X * 10 ** qExponent * 10 ** -pExponent
  const basePrice = new BigNumber(price).times(new BigNumber(10).pow(qExponent - pExponent));

  // USD / UM -> [USD, UM], with a given precision.
  // Then, we want the invariant that p * UM + q * USD = constant, so
  let [p, q] = basePrice.toFraction();
  // These can be higher, but this gives us some leg room.
  const max_p_or_q = new BigNumber(10).pow(20);
  while (p.isGreaterThanOrEqualTo(max_p_or_q) || q.isGreaterThanOrEqualTo(max_p_or_q)) {
    p = p.shiftedBy(-1);
    q = q.shiftedBy(-1);
  }
  p = p.plus(Number(p.isEqualTo(0)));
  q = q.plus(Number(p.isEqualTo(0)));
  return { p: pnum(BigInt(p.toFixed(0))).toAmount(), q: pnum(BigInt(q.toFixed(0))).toAmount() };
};

/**
 * Convert a plan into a position.
 *
 * Try using `rangeLiquidityPositions` or `limitOrderPosition` instead, with this method existing
 * as an escape hatch in case any of those use cases aren't sufficient.
 */
export const planToPosition = (
  plan: PositionPlan,
  shape: LiquidityDistributionShape,
): PositionedLiquidity => {
  const { p: rawP, q: rawQ } = priceToPQ(
    plan.price,
    plan.baseAsset.exponent,
    plan.quoteAsset.exponent,
  );
  const rawA1 = plan.baseAsset;
  const rawA2 = plan.quoteAsset;
  const rawR1 = pnum(plan.baseReserves, plan.baseAsset.exponent).toAmount();
  const rawR2 = pnum(plan.quoteReserves, plan.quoteAsset.exponent).toAmount();

  const correctOrder = compareAssetId(plan.baseAsset.id, plan.quoteAsset.id) <= 0;
  const [[p, q], [r1, r2], [a1, a2]] = correctOrder
    ? [
        [rawP, rawQ],
        [rawR1, rawR2],
        [rawA1, rawA2],
      ]
    : [
        [rawQ, rawP],
        [rawR2, rawR1],
        [rawA2, rawA1],
      ];

  const position = new Position({
    phi: {
      component: {
        fee: plan.feeBps,
        p: pnum(p).toAmount(),
        q: pnum(q).toAmount(),
      },
      pair: new TradingPair({
        asset1: a1.id,
        asset2: a2.id,
      }),
    },
    nonce: crypto.getRandomValues(new Uint8Array(32)),
    state: new PositionState({ state: PositionState_PositionStateEnum.OPENED }),
    reserves: { r1, r2 },
    closeOnFill: false,
  });

  return { position, shape };
};

/**
 * A range liquidity plan provides for creating multiple positions across a range of prices.
 *
 * This plan attempts to distribute reserves across equally spaced price points.
 *
 * It needs to know the market price, to know when to switch from positions that sell the quote
 * asset, to positions that buy the quote asset.
 *
 * All prices are in terms of quoteAsset / baseAsset, in display units.
 *
 * TODO: validate this is superfluous in light of `SimpleLiquidityPlan`?
 */
interface RangeLiquidityPlan {
  baseAsset: Asset;
  quoteAsset: Asset;
  targetLiquidity: number;
  upperPrice: number;
  lowerPrice: number;
  marketPrice: number;
  feeBps: number;
  positions: number;
  distributionShape: LiquidityDistributionShape;
}

/**
 * Defines how liquidity should be distributed across the price range
 */
export enum LiquidityDistributionShape {
  /** Distribution shape alloted to limit orders (single position) */
  LIMIT = 'LIMIT',
  /** Equal distribution across all positions */
  FLAT = 'FLAT',
  /** Higher liquidity near market price, decreasing towards range edges */
  PYRAMID = 'PYRAMID',
  /** Lower liquidity near market price, increasing towards range edges */
  INVERTED_PYRAMID = 'INVERTED_PYRAMID',
}

/**
 * Defines associative numeric encoding of `LiquidityDistributionShape` representing the strategy tag
 */
export enum LiquidityDistributionStrategy {
  SKIP = 1,
  ARBITRARY = 2,
  FLAT = 3,
  PYRAMID = 4,
  INVERTED_PYRAMID = 5,
}

interface SimpleLiquidityPlan {
  baseAsset: Asset;
  quoteAsset: Asset;
  baseLiquidity: number;
  quoteLiquidity: number;
  upperPrice: number;
  lowerPrice: number;
  marketPrice: number;
  feeBps: number;
  positions: number;
  distributionShape: LiquidityDistributionShape;
}

export function encodeLiquidityShape(
  shape: LiquidityDistributionShape,
): LiquidityDistributionStrategy {
  switch (shape) {
    case LiquidityDistributionShape.FLAT:
      return LiquidityDistributionStrategy.FLAT;
    case LiquidityDistributionShape.PYRAMID:
      return LiquidityDistributionStrategy.PYRAMID;
    case LiquidityDistributionShape.INVERTED_PYRAMID:
      return LiquidityDistributionStrategy.INVERTED_PYRAMID;
    // maps `LIMIT` liquidity shape (identifier for limit orders) to an `ARBITRARY` strategy tag.
    case LiquidityDistributionShape.LIMIT:
      return LiquidityDistributionStrategy.ARBITRARY;
    default:
      return LiquidityDistributionStrategy.SKIP;
  }
}

export const getPositionWeights = (
  positions: number,
  shape: LiquidityDistributionShape,
): number[] => {
  if (positions === 1) {
    return [1];
  }

  return Array.from({ length: positions }, (_, i) => {
    const normalizedIndex = i / (positions - 1);
    switch (shape) {
      case LiquidityDistributionShape.FLAT:
        return 1;
      case LiquidityDistributionShape.PYRAMID:
        // Creates a pyramid shape with peak at middle
        return 0.1 + 0.9 * (1 - Math.abs(normalizedIndex - 0.5) * 2);
      case LiquidityDistributionShape.INVERTED_PYRAMID:
        // Creates an inverted pyramid with peaks at edges
        return Math.abs(normalizedIndex - 0.5) * 2;
      default:
        return 1;
    }
  });
};

/** Given a plan for providing range liquidity, create all the necessary positions to accomplish the plan. */
export const rangeLiquidityPositions = (plan: RangeLiquidityPlan): PositionedLiquidity[] => {
  // The step width is positions-1 because it's between the endpoints
  // |---|---|---|---|
  // 0   1   2   3   4
  //   0   1   2   3
  const stepWidth = (plan.upperPrice - plan.lowerPrice) / plan.positions;
  return Array.from({ length: plan.positions }, (_, i) => {
    const price = plan.lowerPrice + i * stepWidth;

    let baseReserves: number;
    let quoteReserves: number;
    if (price < plan.marketPrice) {
      // If the price is < market price, then people *paying* that price are getting a good deal,
      // and receiving the base asset in exchange, so we don't want to offer them any of that.
      baseReserves = 0;
      quoteReserves = plan.targetLiquidity / plan.positions;
    } else {
      // Conversely, when price > market price, then the people that are selling the base asset,
      // receiving the quote asset in exchange are getting a good deal, so we don't want to offer that.
      baseReserves = plan.targetLiquidity / plan.positions / price;
      quoteReserves = 0;
    }

    return planToPosition(
      {
        baseAsset: plan.baseAsset,
        quoteAsset: plan.quoteAsset,
        feeBps: plan.feeBps,
        price,
        baseReserves,
        quoteReserves,
      },
      plan.distributionShape,
    );
  });
};

/** Given a plan for providing simple liquidity, create all the necessary positions to accomplish the plan. */
export const simpleLiquidityPositions = (plan: SimpleLiquidityPlan): PositionedLiquidity[] => {
  // Calculate how many positions should be in each range based on market price position
  const totalRange = plan.upperPrice - plan.lowerPrice;
  const marketPosition = (plan.marketPrice - plan.lowerPrice) / totalRange;

  // Calculate number of positions for each range
  const lowerPositionsAmount = Math.max(0, Math.floor(plan.positions * marketPosition));
  const upperPositionsAmount = Math.max(0, plan.positions - lowerPositionsAmount);

  // Calculate step widths for each range
  const lowerStepWidth = (plan.marketPrice - plan.lowerPrice) / lowerPositionsAmount;
  const upperStepWidth = (plan.upperPrice - plan.marketPrice) / upperPositionsAmount;

  // Calculate weights for ALL positions together to maintain the distribution shape
  const weights = getPositionWeights(
    lowerPositionsAmount + upperPositionsAmount,
    plan.distributionShape,
  );

  // Calculate the total weight for each range to properly scale the liquidity
  const lowerRangeTotalWeight = weights
    .slice(0, lowerPositionsAmount)
    .reduce((sum, w) => sum + w, 0);
  const upperRangeTotalWeight = weights.slice(lowerPositionsAmount).reduce((sum, w) => sum + w, 0);

  // Generate positions for lower range (quote liquidity)
  const lowerPositions = Array.from({ length: lowerPositionsAmount }, (_, i) => {
    const price = plan.lowerPrice + i * lowerStepWidth;
    // Scale the weight by the range's total weight to maintain proper liquidity distribution
    const weight = (weights[i] ?? 0) / (lowerRangeTotalWeight || 1);
    return planToPosition(
      {
        baseAsset: plan.baseAsset,
        quoteAsset: plan.quoteAsset,
        feeBps: plan.feeBps,
        price,
        baseReserves: 0,
        quoteReserves: plan.quoteLiquidity * weight,
      },
      plan.distributionShape,
    );
  });

  // Generate positions for upper range (base liquidity)
  const upperPositions = Array.from({ length: upperPositionsAmount }, (_, i) => {
    const price = plan.marketPrice + i * upperStepWidth;
    // Scale the weight by the range's total weight to maintain proper liquidity distribution
    const weight = (weights[i + lowerPositionsAmount] ?? 0) / (upperRangeTotalWeight || 1);
    return planToPosition(
      {
        baseAsset: plan.baseAsset,
        quoteAsset: plan.quoteAsset,
        feeBps: plan.feeBps,
        price,
        baseReserves: plan.baseLiquidity * weight,
        quoteReserves: 0,
      },
      plan.distributionShape,
    );
  });

  return [...lowerPositions, ...upperPositions];
};

/** A limit order plan attempts to buy or sell the baseAsset at a given price.
 *
 * This price is always in terms of quoteAsset / baseAsset.
 *
 * The input is the quote asset when buying, and the base asset when selling, and in display units.
 */
interface LimitOrderPlan {
  buy: 'buy' | 'sell';
  price: number;
  input: number;
  baseAsset: Asset;
  quoteAsset: Asset;
  distributionShape: LiquidityDistributionShape;
}

export const limitOrderPosition = (plan: LimitOrderPlan): PositionedLiquidity => {
  let baseReserves: number;
  let quoteReserves: number;
  if (plan.buy === 'buy') {
    baseReserves = 0;
    quoteReserves = plan.input;
  } else {
    baseReserves = plan.input;
    quoteReserves = 0;
  }
  const pos = planToPosition(
    {
      baseAsset: plan.baseAsset,
      quoteAsset: plan.quoteAsset,
      feeBps: 0,
      price: plan.price,
      baseReserves,
      quoteReserves,
    },
    plan.distributionShape,
  );
  pos.position.closeOnFill = true;
  return pos;
};

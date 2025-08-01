import { NextRequest, NextResponse } from 'next/server';
import { serialize, Serialized } from '@/shared/utils/serializer';
import { pindexerDb } from '@/shared/database/client';
import { positionIdFromBech32 } from '@penumbra-zone/bech32m/plpid';
import { PositionId } from '@penumbra-zone/protobuf/penumbra/core/component/dex/v1/dex_pb';
import { AssetId } from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import { JsonObject } from '@bufbuild/protobuf';

export type LpRewardsSortKey = 'epoch' | 'position_id' | 'rewards';
export type LpRewardsSortDirection = 'asc' | 'desc';

export interface LpRewardsRequest extends JsonObject {
  positionIds: string[];
  limit: number;
  page: number;
  sortKey: LpRewardsSortKey;
  sortDirection: LpRewardsSortDirection;
}

export interface LqtLp {
  epoch: number;
  positionId: PositionId;
  assetId: AssetId;
  rewards: number;
  executions: number;
  umVolume: number;
  assetVolume: number;
  assetFees: number;
  points: number;
  pointsShare: number;
}

export interface LpRewardsApiResponse {
  data: LqtLp[];
  total: number;
  totalRewards: number;
}

async function queryLqtLps({ positionIds, sortKey, sortDirection, limit, page }: LpRewardsRequest) {
  const positionIdsBytes = positionIds
    .map(positionId => positionIdFromBech32(positionId).inner)
    .map(posIdInner => Buffer.from(posIdInner));

  const [totalStats, results] = await Promise.all([
    pindexerDb
      .selectFrom('lqt.lps')
      .select(eb => [
        eb.fn.sum('rewards').as('total_rewards'),
        eb.fn.count('position_id').as('total_positions'),
      ])
      .where('position_id', 'in', positionIdsBytes)
      .executeTakeFirst(),
    pindexerDb
      .selectFrom('lqt.lps')
      .selectAll()
      .where('position_id', 'in', positionIdsBytes)
      .orderBy(sortKey, sortDirection)
      .offset(limit * (page - 1))
      .limit(limit)
      .execute(),
  ]);

  return {
    data: results,
    total: Number(totalStats?.total_positions ?? 0),
    totalRewards: Number(totalStats?.total_rewards ?? 0n),
  };
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<Serialized<LpRewardsApiResponse>>> {
  const params = (await req.json()) as LpRewardsRequest;
  const lps = await queryLqtLps(params);

  return NextResponse.json(
    serialize({
      data: lps.data.map(lp => ({
        epoch: lp.epoch,
        positionId: new PositionId({ inner: lp.position_id }),
        assetId: new AssetId({ inner: lp.asset_id }),
        rewards: lp.rewards,
        executions: lp.executions,
        umVolume: lp.um_volume,
        assetVolume: lp.asset_volume,
        assetFees: lp.asset_fees,
        points: lp.points,
        pointsShare: lp.point_share,
      })),
      total: lps.total,
      totalRewards: lps.totalRewards,
    }),
  );
}

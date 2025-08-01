import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { bech32mPositionId } from '@penumbra-zone/bech32m/plpid';
import { apiPostFetch } from '@/shared/utils/api-fetch';
import { penumbra } from '@/shared/const/penumbra';
import { AddressIndex } from '@penumbra-zone/protobuf/penumbra/core/keys/v1/keys_pb';
import { ViewService } from '@penumbra-zone/protobuf/penumbra/view/v1/view_connect';
import { useCurrentEpoch } from '@/pages/tournament/api/use-current-epoch';
import {
  LpLeaderboardRequest,
  LpLeaderboardResponse,
  LpLeaderboardSortKey,
  LpLeaderboardSortDirection,
} from './utils';

export const BASE_LIMIT = 10;
export const BASE_PAGE = 1;

export const useMyLpLeaderboard = ({
  subaccount,
  epoch,
  page,
  limit,
  sortKey,
  sortDirection,
  isActive,
  assetId,
}: {
  subaccount: number;
  epoch: number | undefined;
  page: number;
  limit: number;
  sortKey?: LpLeaderboardSortKey | '';
  sortDirection?: LpLeaderboardSortDirection;
  isActive: boolean;
  assetId: string | undefined;
}): UseQueryResult<LpLeaderboardResponse> => {
  const { epoch: currentEpoch } = useCurrentEpoch();

  const { data: positionIds } = useQuery({
    queryKey: ['owned-positions', subaccount],
    queryFn: async () => {
      const ids: string[] = [];

      const result = penumbra.service(ViewService).ownedPositionIds({
        subaccount: new AddressIndex({ account: subaccount }),
      });
      for await (const item of result) {
        const id = item.positionId;
        if (id) {
          ids.push(bech32mPositionId(id));
        }
      }

      return ids;
    },
  });

  const query = useQuery({
    queryKey: [
      'my-lp-leaderboard',
      ...(positionIds ?? []),
      epoch,
      page,
      limit,
      sortKey,
      sortDirection,
      assetId,
    ],
    staleTime: Infinity,
    queryFn: async () => {
      if (!positionIds?.length) {
        return { data: [], total: 0 };
      }

      return apiPostFetch<LpLeaderboardResponse>('/api/tournament/lp-leaderboard', {
        positionIds,
        epoch,
        page,
        limit,
        sortKey,
        sortDirection,
        assetId,
      } as LpLeaderboardRequest);
    },
    enabled: typeof epoch === 'number' && positionIds !== undefined && isActive,
    refetchInterval: epoch === currentEpoch ? 10000 : false,
  });

  return query;
};

import { useQuery } from '@tanstack/react-query';
import { ValueView } from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import { DUMMY_VALUE_VIEW } from '@/pages/tournament/api/dummy';

export const useTotalRewards = () => {
  return useQuery<ValueView>({
    queryKey: ['my-total-rewards'],
    queryFn: async () => {
      // TODO: use backend API to fetch, filter, and sort rewards
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(DUMMY_VALUE_VIEW);
        }, 1000);
      });
    },
  });
};

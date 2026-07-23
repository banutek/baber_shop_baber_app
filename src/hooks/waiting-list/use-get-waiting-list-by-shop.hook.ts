import { useQuery } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { IWaitingListDtoOut } from '../../dto'
import { WaitingListService } from '../../services'

export const useGetWaitingListByShopHook = (shopId: string) => {
  return useQuery<AxiosResponse<{ waitingList: IWaitingListDtoOut }>, Error>({
    queryKey: ['get-waiting-list-by-shop', shopId],
    queryFn: async () => {
      const response = await WaitingListService.get_waiting_list_by_shop_id(shopId)
      console.log({ response })
      return response
    },
    retry: 1,
    enabled: !!shopId,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
}

import { useQuery } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { IWaitingListDtoOut } from '../../dto'
import { WaitingListService } from '../../services'
import { useShopStore } from '../../stores'

export const useGetWaitingListByShopHook = (shopId: string) => {
  const { currentShop } = useShopStore()

  const currentList = currentShop?.barber_shop_waiting_list?.find(
    (_) => new Date(_.createdAt).getDay() === new Date().getDay(),
  )

  console.log({ currentShop })

  return useQuery<AxiosResponse<{ waitingList: IWaitingListDtoOut }>, Error>({
    queryKey: ['get-waiting-list-by-shop', shopId],
    queryFn: () => {
      return WaitingListService.get_waiting_list_by_shop_id(shopId)
    },
    retry: 1,
    enabled: !!shopId && !!currentList,
    refetchOnWindowFocus: true,
  })
}

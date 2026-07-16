import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { IBarberShopDtoOut, INewBarberShopDtoIn } from '../../dto'
import { ShopService } from '../../services'

export const useUpdateShopHook = () => {
  return useMutation<
    AxiosResponse<{ shop: IBarberShopDtoOut }>,
    Error,
    { shopId: string; datas: Partial<INewBarberShopDtoIn> }
  >({
    mutationKey: ['update-shop'],
    mutationFn: ({ shopId, datas }) => {
      return ShopService.update_shop(shopId, datas)
    },
    retry: 0,
  })
}

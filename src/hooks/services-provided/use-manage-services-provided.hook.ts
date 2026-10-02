import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { IBarberShopDtoOut, IManageShopServicesListDtoIn } from '../../dto'
import { ServicesProvidedService } from '../../services'

export const useManageServicesProvidedHook = () => {
  return useMutation<
    AxiosResponse<{ shop: IBarberShopDtoOut }>,
    Error,
    { shopId: string; datas: Partial<IManageShopServicesListDtoIn> }
  >({
    mutationKey: ['manage-shop-services'],
    mutationFn: ({ shopId, datas }) => {
      return ServicesProvidedService.manage_shop_services_list(shopId, datas)
    },
    retry: 0,
  })
}

import { useQuery } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { IBarberShopDtoOut } from '../../dto'
import { ShopService } from '../../services'

export const useGetShopByManagerHook = () => {
  return useQuery<AxiosResponse<{ shop: IBarberShopDtoOut }>, Error>({
    queryKey: ['get-shop-by-manager'],
    queryFn: () => {
      return ShopService.get_barber_shop_by_manager_id()
    },
    retry: 0,
  })
}

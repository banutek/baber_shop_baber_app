import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { IBarberShopDtoOut } from '../../dto'
import { ShopService } from '../../services'

export const useCreateNewShopHook = () => {
  return useMutation<AxiosResponse<{ shop: IBarberShopDtoOut }>, Error, FormData>({
    mutationKey: ['create-new-shop'],
    mutationFn: (body: FormData) => {
      return ShopService.create_barber_shop(body)
    },
    retry: 0,
  })
}

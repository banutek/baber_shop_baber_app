import { useMutation } from "@tanstack/react-query"
import type { IBarberShopDtoOut, IUpdateShopStatusDtoIn } from "../../dto"
import type { AxiosResponse } from "axios"
import { ShopService } from "../../services"

export const useUpdateShopStatusHook = () => {
    return useMutation<AxiosResponse<{ shop: IBarberShopDtoOut }>, Error, { shopId: string, datas: IUpdateShopStatusDtoIn }>({
        mutationKey: ['update-shop-status'],
        mutationFn: ({ shopId, datas }) => {
            return ShopService.update_shop_status(shopId, datas)
        },
        retry: 0
    })
}
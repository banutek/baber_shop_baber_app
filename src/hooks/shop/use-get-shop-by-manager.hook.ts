import { useQuery } from "@tanstack/react-query"
import type { IBarberShopDtoOut } from "../../dto"
import type { AxiosResponse } from "axios"
import { ShopService } from "../../services"

export const useGetShopByManagerHook = () => {
    return useQuery<AxiosResponse<{ shop: IBarberShopDtoOut }>, Error>({
        queryKey: ['get-shop-by-manager'],
        queryFn: () => {
            return ShopService.get_barber_shop_by_manager_id()
        },
        retry: 0
    })
}
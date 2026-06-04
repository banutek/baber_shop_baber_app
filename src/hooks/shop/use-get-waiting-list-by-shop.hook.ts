import { useQuery } from "@tanstack/react-query"
import type { IWaitingListDtoOut } from "../../dto"
import type { AxiosResponse } from "axios"
import { ShopService } from "../../services"
import { useShopStore } from "../../stores"

export const useGetWaitingListByShopHook = (shopId: string) => {
    const { currentShop } = useShopStore()

    return useQuery<AxiosResponse<{ waitingList: IWaitingListDtoOut }>, Error>({
        queryKey: ['get-waiting-list-by-shop', shopId],
        queryFn: () => {
            return ShopService.get_waiting_list_by_shop_id(shopId)
        },
        retry: 1,
        enabled: !!shopId && !!currentShop?.barber_shop_waiting_list,
    })
}
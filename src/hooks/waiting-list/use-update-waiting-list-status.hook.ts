import { useMutation } from "@tanstack/react-query"
import type { IUpdateWaitingListStatusDtoIn, IWaitingListDtoOut } from "../../dto"
import type { AxiosResponse } from "axios"
import { ShopService } from "../../services"

export const useUpdateWaitingListStatusHook = () => {
    return useMutation<AxiosResponse<{ waitingList: IWaitingListDtoOut }>, Error, { listId: string, datas: IUpdateWaitingListStatusDtoIn }>({
        mutationKey: ['update-waiting-list-status'],
        mutationFn: ({ listId, datas }) => {
            return ShopService.update_waiting_list_status(listId, datas)
        },
        retry: 0
    })
}
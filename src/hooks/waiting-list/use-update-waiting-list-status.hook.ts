import { useMutation } from "@tanstack/react-query"
import type { IUpdateWaitingListStatusDtoIn, IWaitingListDtoOut } from "../../dto"
import type { AxiosResponse } from "axios"
import { WaitingListService } from "../../services"

export const useUpdateWaitingListStatusHook = () => {
    return useMutation<AxiosResponse<{ waitingList: IWaitingListDtoOut }>, Error, { listId: string, datas: IUpdateWaitingListStatusDtoIn }>({
        mutationKey: ['update-waiting-list-status'],
        mutationFn: ({ listId, datas }) => {
            return WaitingListService.update_waiting_list_status(listId, datas)
        },
        retry: 0
    })
}
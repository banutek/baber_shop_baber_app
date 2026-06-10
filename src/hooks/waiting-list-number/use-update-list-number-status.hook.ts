import { useMutation } from "@tanstack/react-query"
import type { IUpdateWaitingListNumberStatusDtoIn, IWaitingListNumbersDtoOut } from "../../dto"
import type { AxiosResponse } from "axios"
import { WaitingListNumberService } from "../../services"

export const useUpdateListNumberStatusHook = () => {
    return useMutation<AxiosResponse<{ waitingListNumber: IWaitingListNumbersDtoOut }>, Error, { numberId: string, datas: IUpdateWaitingListNumberStatusDtoIn }>({
        mutationKey: ['update-waiting-list-number-status'],
        mutationFn: ({ numberId, datas }) => {
            return WaitingListNumberService.update_waiting_list_number_status(numberId, datas)
        },
        retry: 0
    })
}
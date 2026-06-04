import { useMutation } from "@tanstack/react-query"
import type { INewWaitingListDtoIn, IWaitingListDtoOut } from "../../dto"
import type { AxiosResponse } from "axios"
import { ShopService } from "../../services"

export const useCreateNewWaitingListHook = () => {
    return useMutation<AxiosResponse<{ waitingList: IWaitingListDtoOut }>, Error, INewWaitingListDtoIn>({
        mutationKey: ['create-new-waiting-list'],
        mutationFn: (body: INewWaitingListDtoIn) => {
            return ShopService.create_waiting_list(body)
        },
        retry: 0
    })
}
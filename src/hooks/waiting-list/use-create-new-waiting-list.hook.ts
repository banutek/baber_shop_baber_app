import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { INewWaitingListDtoIn, IWaitingListDtoOut } from '../../dto'
import { WaitingListService } from '../../services'

export const useCreateNewWaitingListHook = () => {
  return useMutation<
    AxiosResponse<{ waitingList: IWaitingListDtoOut }>,
    Error,
    INewWaitingListDtoIn
  >({
    mutationKey: ['create-new-waiting-list'],
    mutationFn: (body: INewWaitingListDtoIn) => {
      return WaitingListService.create_waiting_list(body)
    },
    retry: 0,
  })
}

import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { IUpdateWaitingListNumberStatusDtoIn, IWaitingListNumbersDtoOut } from '../../dto'
import { WaitingListNumberService } from '../../services'

export interface IUpdateListNumberStatusHookParams {
  numberId: string
  datas: IUpdateWaitingListNumberStatusDtoIn
}

export const useUpdateListNumberStatusHook = () => {
  return useMutation<
    AxiosResponse<{ waitingListNumber: IWaitingListNumbersDtoOut }>,
    Error,
    IUpdateListNumberStatusHookParams
  >({
    mutationKey: ['update-waiting-list-number-status'],
    mutationFn: ({ numberId, datas }) => {
      return WaitingListNumberService.update_waiting_list_number_status(numberId, datas)
    },
    retry: 0,
  })
}

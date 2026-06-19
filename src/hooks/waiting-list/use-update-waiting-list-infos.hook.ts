import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { IUpdateWaitingListDtoIn, IWaitingListDtoOut } from '../../dto'
import { WaitingListService } from '../../services'

export const useUpdateWaitingListInfosHook = () => {
  return useMutation<
    AxiosResponse<{ waitingList: IWaitingListDtoOut }>,
    Error,
    { listId: string; datas: IUpdateWaitingListDtoIn }
  >({
    mutationKey: ['update-waiting-list-infos'],
    mutationFn: ({ listId, datas }) => {
      return WaitingListService.update_waiting_list_infos(listId, datas)
    },
    retry: 0,
  })
}

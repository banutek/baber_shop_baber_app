import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { INotificationDtoOut, IUpdateNotificationStatusDtoIn } from '../../dto'
import { NotificationService } from '../../services'

export interface IUpdateNotificationStatusHookParams {
  notificationId: string
  datas: IUpdateNotificationStatusDtoIn
}

export const useUpdateNotificationStatusHook = () => {
  return useMutation<
    AxiosResponse<{ notification: INotificationDtoOut }>,
    Error,
    IUpdateNotificationStatusHookParams
  >({
    mutationKey: ['update-notification-status'],
    mutationFn: ({ notificationId, datas }) =>
      NotificationService.update_notification_status(notificationId, datas),
    retry: 0,
  })
}

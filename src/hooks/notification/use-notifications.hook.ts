import { useQuery } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { INotificationDtoOut } from '../../dto'
import { NotificationService } from '../../services'

export const useNotificationsHook = (deviceId: string | undefined) => {
  return useQuery<AxiosResponse<{ notifications: INotificationDtoOut[] }>, Error>({
    queryKey: ['notifications', deviceId],
    queryFn: () => NotificationService.get_notifications_by_device(deviceId!),
    enabled: !!deviceId,
    refetchInterval: 15_000, // poll every 15 seconds
    staleTime: 10_000,
    retry: 1,
  })
}

import { useQuery } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

import type { INotificationDtoOut } from '../../dto'
import { NotificationService } from '../../services'

export const useShopNotificationsHook = (shopId: string | undefined) => {
  return useQuery<AxiosResponse<{ notifications: INotificationDtoOut[] }>, Error>({
    queryKey: ['notifications', 'shop', shopId],
    queryFn: () => NotificationService.get_notifications_by_shop(shopId!),
    enabled: !!shopId,
    refetchInterval: 15_000,
    staleTime: 10_000,
    retry: 1,
  })
}

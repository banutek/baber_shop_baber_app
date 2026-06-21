import type { IUpdateNotificationStatusDtoIn } from '../../dto'
import BaseMethods from '../BaseMethods'
import { notificationUrls } from '../url'

export class NotificationService {
  static get_notifications_by_device = (deviceId: string) =>
    BaseMethods.getRequest(notificationUrls.GET_NOTIFICATIONS_BY_DEVICE(deviceId), false)

  static get_notifications_by_shop = (shopId: string) =>
    BaseMethods.getRequest(notificationUrls.GET_NOTIFICATIONS_BY_SHOP(shopId), false)

  static update_notification_status = (
    notificationId: string,
    datas: IUpdateNotificationStatusDtoIn,
  ) =>
    BaseMethods.patchRequest(
      notificationUrls.UPDATE_NOTIFICATION_STATUS(notificationId),
      datas,
      false,
    )
}

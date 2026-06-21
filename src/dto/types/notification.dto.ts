import type { NotificationStatus, NotificationType } from '../enums/notification.enum'
import type { IDeviceDtoOut } from './device.dto'
import type { IWaitingListNumbersDtoOut } from './waiting-list-numbers.dto'

export interface INotificationDtoOut {
  id: string
  message: string
  type: NotificationType
  status: NotificationStatus
  createdAt: string
  updatedAt: string
  waitingListNumberId?: string
  waitingListNumber?: IWaitingListNumbersDtoOut
  deviceId: string
  device: IDeviceDtoOut
}

export interface IUpdateNotificationStatusDtoIn {
  status: NotificationStatus
}

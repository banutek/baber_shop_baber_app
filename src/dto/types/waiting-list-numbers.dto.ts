import type { WaitingListNumberStatus } from '../enums'
import type { IDeviceDtoOut } from './device.dto'
import type { IWaitingListDtoOut } from './waiting-list.dto'

export interface IWaitingListNumbersDtoOut {
  id: string
  value: string
  barcode: string
  status: WaitingListNumberStatus
  createdAt: Date
  updatedAt: Date
  waitingListId: string
  waitingList: IWaitingListDtoOut
  deviceId: string
  device: IDeviceDtoOut
  waiting_list_number_notification: unknown
  waiting_list_number_scan_event: unknown
}

export interface IUpdateWaitingListNumberStatusDtoIn {
  status: WaitingListNumberStatus
}

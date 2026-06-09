
import type { IWaitingListNumbersDtoOut } from "./waiting-list-numbers.dto";

export interface IDeviceDtoOut {
    id: string
    platform: string
    push_token?: string
    createdAt: string
    updatedAt: string
    clientId: string
    client: string
    device_waiting_list_number?: IWaitingListNumbersDtoOut
    device_notification: string[]
    device_scan_event: string[]
}

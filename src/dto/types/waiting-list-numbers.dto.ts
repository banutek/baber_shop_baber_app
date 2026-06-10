
import type { WaitingListNumberStatus } from "../enums";
import type { IWaitingListDtoOut } from "./waiting-list.dto";


export interface IWaitingListNumbersDtoOut {
    id: string;
    value: string;
    barcode: string;
    status: WaitingListNumberStatus;
    createdAt: Date;
    updatedAt: Date;
    waitingListId: string;
    waitingList: IWaitingListDtoOut;
    deviceId: string;
    device: any;
    waiting_list_number_notification: any;
    waiting_list_number_scan_event: any;
}


export interface IUpdateWaitingListNumberStatusDtoIn {
    status: WaitingListNumberStatus;
}
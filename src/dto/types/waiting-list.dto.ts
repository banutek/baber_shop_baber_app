
import type { WaitingListStatusEnum } from "../enums";
import type { IBarberShopDtoOut } from "./barber-shop.dto";
import type { IWaitingListNumbersDtoOut } from "./waiting-list-numbers.dto";


export interface IWaitingListDtoOut {
    id: string;
    current_number: number;
    session_date: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    barberShopId: string;
    barberShop: IBarberShopDtoOut;
    waiting_list_numbers: IWaitingListNumbersDtoOut[];
}

export interface INewWaitingListDtoIn {
    current_number: number;
    session_date: Date;
    status: string;
    barberShopId: string;
}

export interface IUpdateWaitingListStatusDtoIn {
    status: WaitingListStatusEnum;
}

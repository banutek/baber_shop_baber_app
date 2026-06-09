
import type { ShopOpenStatus } from "../enums";
import type { IUserDtoOut } from "./user.dto";
import type { IWaitingListDtoOut } from "./waiting-list.dto";

export interface INewBarberShopDtoIn {
    name: string;
    profileImage?: File;
    address: string;
    latitude?: number;
    longitude?: number;
    phone: string;
    email?: string;
}

export interface IBarberShopDtoOut {
    id: string;
    name: string;
    profileImage: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    email: string;
    isActive: boolean;
    openStatus: ShopOpenStatus;
    createdAt: Date;
    updatedAt: Date;
    managerId: string;
    manager: IUserDtoOut;
    barber_shop_subscription: string;
    barber_shop_waiting_list: IWaitingListDtoOut[];
    barber_shop_scan_event: string;
}

export interface IUpdateShopStatusDtoIn {
    openStatus: ShopOpenStatus;
}

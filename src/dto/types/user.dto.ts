
import { RoleEnum } from "../enums";

export interface INewUserDtoIn {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: RoleEnum;
}

export interface IUserDtoOut {
    id: string;
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    address: string;
    role: RoleEnum;
    createdAt: Date;
    updatedAt: Date;

    manager_barber_shop?: string;
    client_device?: string;
    user_clients_profile?: string;
}

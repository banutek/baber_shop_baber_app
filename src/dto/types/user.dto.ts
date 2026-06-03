
import { RoleEnum } from "../enums";

export interface INewUserDtoIn {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: RoleEnum;
    access_token?: string
}

export interface ILoginUserDtoIn {
    email: string;
    password: string;
}

export interface ILoginUserResponse {
    access_token: string
    user: IUserDtoOut
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

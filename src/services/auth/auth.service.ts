/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseMethods from "../BaseMethods";
import { authUrls } from "../url";

export class AuthService {
    static register_new_user = (infos: any) => BaseMethods.postRequest(authUrls.REGISTER_USER, infos, false)
}
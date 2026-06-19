/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseMethods from '../BaseMethods'
import { authUrls } from '../url'

export class AuthService {
  static register_new_user = (infos: any) =>
    BaseMethods.postRequest(authUrls.REGISTER_USER, infos, false)
  static login_user = (infos: any) => BaseMethods.postRequest(authUrls.LOGIN_USER, infos, false)
}

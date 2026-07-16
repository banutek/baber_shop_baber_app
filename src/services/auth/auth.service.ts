/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IUpdateUserDtoIn } from '../../dto'
import BaseMethods from '../BaseMethods'
import { authUrls } from '../url'

export class AuthService {
  static register_new_user = (infos: any) =>
    BaseMethods.postRequest(authUrls.REGISTER_USER, infos, false)
  static login_user = (infos: any) => BaseMethods.postRequest(authUrls.LOGIN_USER, infos, false)
  static update_user = (userId: string, datas: IUpdateUserDtoIn) =>
    BaseMethods.patchRequest(authUrls.UPDATE_USER(userId), datas, true)
}

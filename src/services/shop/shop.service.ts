import type { IUpdateShopStatusDtoIn } from '../../dto'
import BaseMethods from '../BaseMethods'
import { barberShopUrls } from '../url'

export class ShopService {
  static create_barber_shop = (infos: FormData) =>
    BaseMethods.postFileRequest(barberShopUrls.CREATE_BARBER_SHOP, infos, true)
  static get_barber_shop_by_manager_id = () =>
    BaseMethods.getRequest(barberShopUrls.GET_BARBER_SHOP_BY_MANAGER_ID, true)
  static update_shop_status = (shopId: string, datas: IUpdateShopStatusDtoIn) =>
    BaseMethods.patchRequest(barberShopUrls.UPDATE_SHOP_STATUS(shopId), datas, true)
}

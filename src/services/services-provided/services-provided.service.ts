import type { IManageShopServicesListDtoIn } from '../../dto'
import BaseMethods from '../BaseMethods'
import { barberShopServiceUrls } from '../url'

export class ServicesProvidedService {
  static manage_shop_services_list = (
    shopId: string,
    datas: Partial<IManageShopServicesListDtoIn>,
  ) =>
    BaseMethods.patchRequest(barberShopServiceUrls.MANAGE_SHOP_SERVICES_LIST(shopId), datas, true)
  static get_all_principal_services = () =>
    BaseMethods.getRequest(barberShopServiceUrls.GET_ALL_PRINCIPAL_SERVICES, true)
  static get_all_services = () =>
    BaseMethods.getRequest(barberShopServiceUrls.GET_ALL_SERVICES, true)
  static get_secondary_services_by_parent = (parentId: string) =>
    BaseMethods.getRequest(barberShopServiceUrls.GET_SECONDARY_SERVICE_BY_PARENT_ID(parentId), true)
}

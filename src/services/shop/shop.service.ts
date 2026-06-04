import type { INewWaitingListDtoIn } from "../../dto";
import BaseMethods from "../BaseMethods";
import { barberShopUrls } from "../url";

export class ShopService {
    static create_barber_shop = (infos: FormData) => BaseMethods.postFileRequest(barberShopUrls.CREATE_BARBER_SHOP, infos, true)
    static get_barber_shop_by_manager_id = () => BaseMethods.getRequest(barberShopUrls.GET_BARBER_SHOP_BY_MANAGER_ID, true)

    static create_waiting_list = (infos: INewWaitingListDtoIn) => BaseMethods.postRequest(barberShopUrls.CREATE_WAITING_LIST, infos, true)
    static get_waiting_list_by_shop_id = (shopId: string) => BaseMethods.getRequest(barberShopUrls.GET_WAITING_LIST_BY_SHOP_ID(shopId), true)
}
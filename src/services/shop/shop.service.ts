/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseMethods from "../BaseMethods";
import { barberShopUrls } from "../url";

export class ShopService {
    static create_barber_shop = (infos: any) => BaseMethods.postFileRequest(barberShopUrls.CREATE_BARBER_SHOP, infos, true)
}
import type { INewWaitingListDtoIn, IUpdateWaitingListDtoIn, IUpdateWaitingListStatusDtoIn } from "../../dto";
import BaseMethods from "../BaseMethods";
import { waitingListUrls } from "../url";

export class WaitingListService {
    static create_waiting_list = (infos: INewWaitingListDtoIn) => BaseMethods.postRequest(waitingListUrls.CREATE_WAITING_LIST, infos, true)
    static get_waiting_list_by_shop_id = (shopId: string) => BaseMethods.getRequest(waitingListUrls.GET_WAITING_LIST_BY_SHOP_ID(shopId), true)
    static update_waiting_list_status = (listId: string, datas: IUpdateWaitingListStatusDtoIn) => BaseMethods.patchRequest(waitingListUrls.UPDATE_WAITING_LIST_STATUS(listId), datas, true)
    static update_waiting_list_infos = (listId: string, datas: IUpdateWaitingListDtoIn) => BaseMethods.patchRequest(waitingListUrls.UPDATE_WAITING_LIST(listId), datas, true)
}
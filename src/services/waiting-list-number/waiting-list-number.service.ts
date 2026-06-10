import type { IUpdateWaitingListNumberStatusDtoIn } from "../../dto";
import BaseMethods from "../BaseMethods";
import { waitingListNumberUrls } from "../url";

export class WaitingListNumberService {
    // static create_new_waiting_list_number = (waitingListId: string, deviceId: string) => BaseMethods.postRequest(waitingListNumberUrls.CREATE_NEW_WAITING_LIST_NUMBER(waitingListId), { deviceId }, false)
    // static get_waiting_list_number_by_shop_id = (shopId: string) => BaseMethods.getRequest(waitingListNumberUrls.GET_WAITING_LIST_NUMBER_BY_SHOP_ID(shopId), false)
    // static get_waiting_list_number_by_list_id = (listId: string) => BaseMethods.getRequest(waitingListNumberUrls.GET_WAITING_LIST_NUMBER_BY_LIST_ID(listId), false)
    static update_waiting_list_number_status = (numberId: string, datas: IUpdateWaitingListNumberStatusDtoIn) => BaseMethods.patchRequest(waitingListNumberUrls.UPDATE_WAITING_LIST_NUMBER_STATUS(numberId), datas, false)
}
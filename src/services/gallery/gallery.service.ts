import BaseMethods from '../BaseMethods'
import { galleryUrls } from '../url'

export class GalleryService {
  static create_gallery_multiple_img = (infos: FormData) =>
    BaseMethods.postFileRequest(galleryUrls.UPLOAD_MULTIPLE_IMAGE, infos, true)
  static create_gallery_img_once = (infos: FormData) =>
    BaseMethods.postFileRequest(galleryUrls.UPLOAD_ONE_IMAGE, infos, true)
  static get_gallery_by_shop_id = (shopId: string) =>
    BaseMethods.getRequest(galleryUrls.GET_GALLERY_BY_SHOP_ID(shopId), true)
  static get_gallery_by_service_id = (serviceId: string) =>
    BaseMethods.getRequest(galleryUrls.GET_GALLERY_BY_SERVICE_ID(serviceId), true)
  static update_gallery = (galleryId: string, datas: FormData) =>
    BaseMethods.patchFileRequest(galleryUrls.UPDATE_GALLERY(galleryId), datas, true)
  static delete_gallery = (galleryId: string) =>
    BaseMethods.deleteRequest(galleryUrls.DELETE_GALLERY(galleryId), true)
}

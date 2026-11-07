import type { IBarberShopDtoOut } from './barber-shop.dto'
import type { IServicesProvidedDtoOut } from './services-provided.dto'

export interface IGalleryDtoOut {
  id: string
  url: string
  alt?: string
  displayOrder?: number
  serviceId?: string
  service?: IServicesProvidedDtoOut
  barberShopId: string
  barberShop: IBarberShopDtoOut
}

export interface IUploadGalleryImgDtoIn {
  alt?: string
  displayOrder?: number
  serviceId?: string
  barberShopId: string
}

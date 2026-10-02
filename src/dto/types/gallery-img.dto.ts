import type { IBarberShopDtoOut } from './barber-shop.dto'
import type { IServicesProvidedDtoOut } from './services-provided.dto'

export interface IGalleryImgDtoOut {
  id: String
  url: String
  alt?: String
  displayOrder?: String
  serviceId?: String
  service?: IServicesProvidedDtoOut
  barberShopId: String
  barberShop: IBarberShopDtoOut
}

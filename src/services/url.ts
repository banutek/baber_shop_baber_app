// Chargé depuis .env.development (local) ou .env.production (en ligne)
const API_URL = import.meta.env.VITE_API_URL

export const baseUrl = API_URL.replace('/api/v1/', '/')
export const prefixer = API_URL

export const authUrls = {
  LOGIN_USER: `${prefixer}auth/login`,
  REGISTER_USER: `${prefixer}auth/register`,
}

export const barberShopUrls = {
  CREATE_BARBER_SHOP: `${prefixer}barber-shop/create`,
  GET_BARBER_SHOP_BY_MANAGER_ID: `${prefixer}barber-shop/by-manager-id`,
  UPDATE_SHOP_STATUS: (shopId: string) => `${prefixer}barber-shop/${shopId}/status`,
}

export const waitingListUrls = {
  CREATE_WAITING_LIST: `${prefixer}waiting-list/create`,
  GET_WAITING_LIST_BY_SHOP_ID: (shopId: string) => `${prefixer}waiting-list/by-shop-id/${shopId}`,
  UPDATE_WAITING_LIST_STATUS: (listId: string) => `${prefixer}waiting-list/status/${listId}`,
  UPDATE_WAITING_LIST: (listId: string) => `${prefixer}waiting-list/${listId}`,
}

export const statsUrls = {
  GET_DAILY_STATS: (shopId: string) => `${prefixer}stats/shop/${shopId}/daily`,
}

export const waitingListNumberUrls = {
  // GET_WAITING_LIST_NUMBER_BY_SHOP_ID: (shopId: string) => `${prefixer}waiting-list-number/by-shop-id/${shopId}`,
  // GET_WAITING_LIST_NUMBER_BY_LIST_ID: (listId: string) => `${prefixer}waiting-list-number/by-list/${listId}`,
  UPDATE_WAITING_LIST_NUMBER_STATUS: (numberId: string) =>
    `${prefixer}waiting-list-number/status/${numberId}`,
}

export const notificationUrls = {
  GET_NOTIFICATIONS_BY_DEVICE: (deviceId: string) => `${prefixer}notification/device/${deviceId}`,
  GET_NOTIFICATIONS_BY_SHOP: (shopId: string) => `${prefixer}notification/shop/${shopId}`,
  UPDATE_NOTIFICATION_STATUS: (notificationId: string) =>
    `${prefixer}notification/${notificationId}/status`,
}

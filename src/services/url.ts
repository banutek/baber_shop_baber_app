export const baseUrl = 'http://127.0.0.1:4200/'
export const prefixer = 'http://127.0.0.1:4200/api/v1/'

export const authUrls = {
    LOGIN_USER: `${prefixer}auth/login`,
    REGISTER_USER: `${prefixer}auth/register`,
}

export const barberShopUrls = {
    CREATE_BARBER_SHOP: `${prefixer}barber-shop/create`,
    GET_BARBER_SHOP_BY_MANAGER_ID: `${prefixer}barber-shop/by-manager-id`,

    CREATE_WAITING_LIST: `${prefixer}waiting-list/create`,
    GET_WAITING_LIST_BY_SHOP_ID: (shopId: string) => `${prefixer}waiting-list/by-shop-id/${shopId}`,
}

import { create } from 'zustand'
import type { IBarberShopDtoOut, IWaitingListDtoOut } from '../../dto'

type ShopStore = {
  currentShop: IBarberShopDtoOut | null
  currentWaitingList: IWaitingListDtoOut | null
  setCurrentShop: (shop: IBarberShopDtoOut | null) => void
  setCurrentWaitingList: (waitingList: IWaitingListDtoOut | null) => void
}

export const useShopStore = create<ShopStore>()((set) => ({
  currentShop: null,
  currentWaitingList: null,

  setCurrentShop: (shop: IBarberShopDtoOut | null) => set(() => ({ currentShop: shop })),
  setCurrentWaitingList: (waitingList: IWaitingListDtoOut | null) => set(() => ({ currentWaitingList: waitingList })),
}))

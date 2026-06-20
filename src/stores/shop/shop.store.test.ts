import { describe, it, expect, beforeEach } from 'vitest'
import { useShopStore } from './shop.store'
import type { IBarberShopDtoOut, IWaitingListDtoOut } from '../../dto'

const mockShop: IBarberShopDtoOut = {
  id: 'shop-1',
  name: 'Salon Baraka',
  profileImage: '',
  address: '123 Rue Hassan II',
  latitude: 33.5731,
  longitude: -7.5898,
  phone: '+212600000000',
  email: 'baraka@example.com',
  isActive: true,
  openStatus: 'CLOSED' as any,
  createdAt: new Date(),
  updatedAt: new Date(),
  managerId: 'user-1',
  manager: {} as any,
  barber_shop_subscription: '',
  barber_shop_waiting_list: [],
  barber_shop_scan_event: '',
}

const mockWaitingList: IWaitingListDtoOut = {
  id: 'wl-1',
  current_number: 5,
  session_date: new Date(),
  status: 'OPEN' as any,
  createdAt: new Date(),
  updatedAt: new Date(),
  barberShopId: 'shop-1',
  barberShop: {} as any,
  waiting_list_numbers: [],
}

describe('useShopStore', () => {
  beforeEach(() => {
    useShopStore.setState({ currentShop: null, currentWaitingList: null })
  })

  it('should initialize with null values', () => {
    const state = useShopStore.getState()
    expect(state.currentShop).toBeNull()
    expect(state.currentWaitingList).toBeNull()
  })

  it('should set the current shop', () => {
    useShopStore.getState().setCurrentShop(mockShop)
    expect(useShopStore.getState().currentShop?.name).toBe('Salon Baraka')
    expect(useShopStore.getState().currentShop?.id).toBe('shop-1')
  })

  it('should set the current waiting list', () => {
    useShopStore.getState().setCurrentWaitingList(mockWaitingList)
    expect(useShopStore.getState().currentWaitingList?.id).toBe('wl-1')
    expect(useShopStore.getState().currentWaitingList?.current_number).toBe(5)
  })

  it('should clear the shop when set to null', () => {
    useShopStore.getState().setCurrentShop(mockShop)
    useShopStore.getState().setCurrentShop(null)
    expect(useShopStore.getState().currentShop).toBeNull()
  })

  it('should clear the waiting list when set to null', () => {
    useShopStore.getState().setCurrentWaitingList(mockWaitingList)
    useShopStore.getState().setCurrentWaitingList(null)
    expect(useShopStore.getState().currentWaitingList).toBeNull()
  })

  it('should handle setting both shop and waiting list independently', () => {
    useShopStore.getState().setCurrentShop(mockShop)
    useShopStore.getState().setCurrentWaitingList(mockWaitingList)

    const state = useShopStore.getState()
    expect(state.currentShop).not.toBeNull()
    expect(state.currentWaitingList).not.toBeNull()

    useShopStore.getState().setCurrentWaitingList(null)
    expect(useShopStore.getState().currentShop).not.toBeNull()
    expect(useShopStore.getState().currentWaitingList).toBeNull()
  })
})

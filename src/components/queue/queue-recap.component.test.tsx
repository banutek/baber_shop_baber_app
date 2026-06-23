import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ShopOpenStatus, WaitingListNumberStatus, WaitingListStatusEnum } from '../../dto'
import { useShopStore } from '../../stores'
import { QueueRecapComponent } from './queue-recap.component'

vi.mock('../../hooks', () => ({
  useCreateNewWaitingListHook: () => ({ mutate: vi.fn() }),
  useGetWaitingListByShopHook: () => ({ data: undefined }),
  useUpdateListNumberStatusHook: () => ({ mutate: vi.fn() }),
  useUpdateShopStatusHook: () => ({ mutate: vi.fn() }),
  useUpdateWaitingListStatusHook: () => ({ mutate: vi.fn() }),
}))

const baseDevice = {
  id: 'dev-1',
  platform: 'iOS',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
  clientId: 'client-1',
  client: 'Client 1',
  device_notification: [],
  device_scan_event: [],
}

const baseShop = {
  id: 's1',
  name: 'Salon Test',
  address: '123 Rue',
  profileImage: '',
  latitude: 0,
  longitude: 0,
  phone: '',
  email: '',
  isActive: true,
  openStatus: ShopOpenStatus.CLOSED,
  createdAt: new Date(),
  updatedAt: new Date(),
  managerId: '',
  manager: {} as any,
  barber_shop_subscription: '',
  barber_shop_waiting_list: [],
  barber_shop_scan_event: '',
}

describe('QueueRecapComponent', () => {
  beforeEach(() => {
    useShopStore.setState({
      currentShop: baseShop,
      currentWaitingList: null,
    })
  })

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <QueueRecapComponent />
      </MemoryRouter>,
    )

  it('should show "Vous êtes fermé" when shop is closed', () => {
    renderComponent()
    expect(screen.getByText('Vous êtes fermé')).toBeInTheDocument()
    expect(screen.getByText(/Ouvrir la file/)).toBeInTheDocument()
  })

  it('should show "Tout voir" link when shop is open', () => {
    useShopStore.setState({
      currentShop: { ...baseShop, openStatus: ShopOpenStatus.OPEN },
    })
    renderComponent()
    expect(screen.getByText('Tout voir')).toBeInTheDocument()
  })

  it('should show empty state when open but no customers', () => {
    useShopStore.setState({
      currentShop: { ...baseShop, openStatus: ShopOpenStatus.OPEN },
      currentWaitingList: {
        id: 'wl-1',
        current_number: 0,
        session_date: new Date(),
        status: WaitingListStatusEnum.OPEN,
        createdAt: new Date(),
        updatedAt: new Date(),
        barberShopId: 's1',
        barberShop: {} as any,
        waiting_list_numbers: [],
      },
    })
    renderComponent()
    expect(screen.getByText('Pas encore en service')).toBeInTheDocument()
  })

  it('should display current number when > 0', () => {
    useShopStore.setState({
      currentShop: { ...baseShop, openStatus: ShopOpenStatus.OPEN },
      currentWaitingList: {
        id: 'wl-1',
        current_number: 7,
        session_date: new Date(),
        status: WaitingListStatusEnum.OPEN,
        createdAt: new Date(),
        updatedAt: new Date(),
        barberShopId: 's1',
        barberShop: {} as any,
        waiting_list_numbers: [
          {
            id: 'n1',
            value: '7',
            barcode: 'BC-007',
            status: WaitingListNumberStatus.IN_PROGRESS,
            createdAt: new Date(),
            updatedAt: new Date(),
            inProgressAt: new Date(),
            completedAt: new Date(),
            waitingListId: 'wl-1',
            waitingList: {} as any,
            deviceId: 'dev-1',
            device: { ...baseDevice, platform: 'iOS' },
            waiting_list_number_notification: null,
            waiting_list_number_scan_event: null,
          },
        ],
      },
    })
    renderComponent()
    expect(screen.getByText('Client actuel')).toBeInTheDocument()
    expect(screen.getByText(/Marquer terminé/)).toBeInTheDocument()
    expect(screen.getByText(/Passer au suivant/)).toBeInTheDocument()
    // 7 appears both as current number and in queue list
    expect(screen.getAllByText('7').length).toBeGreaterThanOrEqual(2)
  })

  it('should render waiting list numbers in the list', () => {
    useShopStore.setState({
      currentShop: { ...baseShop, openStatus: ShopOpenStatus.OPEN },
      currentWaitingList: {
        id: 'wl-1',
        current_number: 5,
        session_date: new Date(),
        status: WaitingListStatusEnum.OPEN,
        createdAt: new Date(),
        updatedAt: new Date(),
        barberShopId: 's1',
        barberShop: {} as any,
        waiting_list_numbers: [
          {
            id: 'n1',
            value: '5',
            barcode: 'BC-005',
            status: WaitingListNumberStatus.IN_PROGRESS,
            createdAt: new Date(),
            updatedAt: new Date(),
            inProgressAt: new Date(),
            completedAt: new Date(),
            waitingListId: 'wl-1',
            waitingList: {} as any,
            deviceId: 'dev-1',
            device: { ...baseDevice, platform: 'Android' },
            waiting_list_number_notification: null,
            waiting_list_number_scan_event: null,
          },
          {
            id: 'n2',
            value: '6',
            barcode: 'BC-006',
            status: WaitingListNumberStatus.CREATED,
            createdAt: new Date(),
            updatedAt: new Date(),
            inProgressAt: new Date(),
            completedAt: new Date(),
            waitingListId: 'wl-1',
            waitingList: {} as any,
            deviceId: 'dev-2',
            device: { ...baseDevice, id: 'dev-2', platform: 'Web' },
            waiting_list_number_notification: null,
            waiting_list_number_scan_event: null,
          },
        ],
      },
    })
    renderComponent()
    // Both numbers appear as current number and in queue list
    expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('En chaise')).toBeInTheDocument()
    expect(screen.getByText('En attente')).toBeInTheDocument()
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProfileCardComponent } from './profile-card.component'
import { useAuthStore } from '../../stores'
import { useShopStore } from '../../stores'

vi.mock('../../hooks', () => ({
  useUpdateShopStatusHook: () => ({
    mutate: vi.fn((_data, _options) => {}),
  }),
}))

describe('ProfileCardComponent', () => {
  beforeEach(() => {
    useAuthStore.setState({
      currentUser: {
        access_token: 'tok',
        user: {
          id: '1',
          firstName: 'Ahmed',
          lastName: 'Nacer',
          email: 'ahmed@test.com',
          phone: '+212600112233',
          address: '123 Rue',
          role: 'BARBER' as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    })
    useShopStore.setState({
      currentShop: {
        id: 's1',
        name: 'Salon Baraka',
        address: '123 Rue Hassan II',
        profileImage: '',
        latitude: 0,
        longitude: 0,
        phone: '',
        email: '',
        isActive: true,
        openStatus: 'CLOSED' as any,
        createdAt: new Date(),
        updatedAt: new Date(),
        managerId: '',
        manager: {} as any,
        barber_shop_subscription: '',
        barber_shop_waiting_list: [],
        barber_shop_scan_event: '',
      },
      currentWaitingList: null,
    })
  })

  const renderProfile = () =>
    render(
      <MemoryRouter>
        <ProfileCardComponent />
      </MemoryRouter>
    )

  it('should display user initials in avatar', () => {
    renderProfile()
    expect(screen.getByText('AN')).toBeInTheDocument()
  })

  it('should display user full name', () => {
    renderProfile()
    expect(screen.getByText('Ahmed Nacer')).toBeInTheDocument()
  })

  it('should display role and shop name', () => {
    renderProfile()
    expect(screen.getByText(/BARBER · Salon Baraka/)).toBeInTheDocument()
  })

  it('should display shop address', () => {
    renderProfile()
    expect(screen.getByText('Salon Baraka — 123 Rue Hassan II')).toBeInTheDocument()
  })

  it('should display phone number', () => {
    renderProfile()
    expect(screen.getByText('+212 6 00 11 22 33')).toBeInTheDocument()
  })

  it('should display member since date', () => {
    renderProfile()
    expect(screen.getByText('Mars 2024')).toBeInTheDocument()
  })
})

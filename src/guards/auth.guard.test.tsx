import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthGuard } from './auth.guard'
import { useAuthStore } from '../stores'

const mockUser = {
  access_token: 'token',
  user: {
    id: '1',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@test.com',
    phone: '',
    address: '',
    role: 'BARBER',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}

describe('AuthGuard', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ currentUser: null })
  })

  const renderGuard = (initialRoute = '/') =>
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/create-new-shop" element={<div>CreateShop Page</div>} />
          <Route
            path="*"
            element={
              <AuthGuard>
                <div>Protected Content</div>
              </AuthGuard>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

  it('should redirect to /login when no user in localStorage', () => {
    renderGuard()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('should redirect to /create-new-shop when user has no shop', () => {
    localStorage.setItem('user', JSON.stringify(mockUser))
    renderGuard('/waiting-list')
    expect(screen.getByText('CreateShop Page')).toBeInTheDocument()
  })

  it('should render children when user has a shop', () => {
    const userWithShop = {
      ...mockUser,
      user: { ...mockUser.user, manager_barber_shop: { id: 'shop-1' } },
    }
    localStorage.setItem('user', JSON.stringify(userWithShop))
    renderGuard()
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should sync localStorage user to store', () => {
    const userWithShop = {
      ...mockUser,
      user: { ...mockUser.user, manager_barber_shop: { id: 'shop-1' } },
    }
    localStorage.setItem('user', JSON.stringify(userWithShop))
    renderGuard()
    expect(useAuthStore.getState().currentUser).not.toBeNull()
  })
})

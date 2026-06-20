import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { GuestGuard } from './guest.guard'

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

describe('GuestGuard', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const renderGuard = (initialRoute = '/login') =>
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route
            path="/login"
            element={
              <GuestGuard>
                <div>Guest Content</div>
              </GuestGuard>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

  it('should render children when user is not logged in', () => {
    renderGuard()
    expect(screen.getByText('Guest Content')).toBeInTheDocument()
  })

  it('should redirect to / when user is logged in', () => {
    localStorage.setItem('user', JSON.stringify(mockUser))
    renderGuard()
    expect(screen.queryByText('Guest Content')).not.toBeInTheDocument()
  })
})

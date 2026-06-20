import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './auth.store'
import type { ILoginUserResponse } from '../../dto'

const mockUser: ILoginUserResponse = {
  access_token: 'fake-token-123',
  user: {
    id: 'user-1',
    firstName: 'Ahmed',
    lastName: 'Nacer',
    email: 'ahmed@example.com',
    phone: '+212600112233',
    address: '123 Rue Casablanca',
    role: 'BARBER' as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ currentUser: null })
  })

  it('should initialize with currentUser as null', () => {
    const state = useAuthStore.getState()
    expect(state.currentUser).toBeNull()
  })

  it('should set the current user', () => {
    useAuthStore.getState().setCurrentUser(mockUser)
    const state = useAuthStore.getState()
    expect(state.currentUser).toEqual(mockUser)
    expect(state.currentUser?.access_token).toBe('fake-token-123')
    expect(state.currentUser?.user.firstName).toBe('Ahmed')
  })

  it('should clear the current user when set to null', () => {
    useAuthStore.getState().setCurrentUser(mockUser)
    expect(useAuthStore.getState().currentUser).not.toBeNull()

    useAuthStore.getState().setCurrentUser(null)
    expect(useAuthStore.getState().currentUser).toBeNull()
  })

  it('should replace the current user on subsequent calls', () => {
    useAuthStore.getState().setCurrentUser(mockUser)

    const anotherUser: ILoginUserResponse = {
      access_token: 'another-token',
      user: { ...mockUser.user, id: 'user-2', firstName: 'Karim' },
    }
    useAuthStore.getState().setCurrentUser(anotherUser)

    expect(useAuthStore.getState().currentUser?.user.firstName).toBe('Karim')
    expect(useAuthStore.getState().currentUser?.access_token).toBe('another-token')
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import axios from 'axios'
import { useRegisterNewUserHook } from './use-register-new-user.hook'
import { createWrapper } from '../../test/test-utils'

vi.mock('axios')

const mockedAxios = vi.mocked(axios)

describe('useRegisterNewUserHook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should call AuthService.register_new_user on mutate', async () => {
    mockedAxios.mockResolvedValue({ data: { user: { id: 'u1' } } })

    const { result } = renderHook(() => useRegisterNewUserHook(), { wrapper: createWrapper() })

    result.current.mutate({
      firstName: 'New',
      lastName: 'User',
      email: 'new@test.com',
      password: 'secret',
      phone: '+212600000000',
      address: '123 Street',
      role: 'BARBER' as any,
    })

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalledTimes(1)
      const config = mockedAxios.mock.calls[0][0]
      expect(config.method).toBe('POST')
      expect(config.url).toContain('/auth/register')
    })
  })

  it('should return user data on success', async () => {
    mockedAxios.mockResolvedValue({ data: { user: { id: 'u99', firstName: 'Karim' } } })

    const { result } = renderHook(() => useRegisterNewUserHook(), { wrapper: createWrapper() })

    result.current.mutate({} as any)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data?.data.user.id).toBe('u99')
    })
  })
})

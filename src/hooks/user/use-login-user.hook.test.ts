import { renderHook, waitFor } from '@testing-library/react'
import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createWrapper } from '../../test/test-utils'
import { useLoginUserHook } from './use-login-user.hook'

vi.mock('axios')

const mockedAxios = vi.mocked(axios)

describe('useLoginUserHook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should have correct mutation key', () => {
    const { result } = renderHook(() => useLoginUserHook(), { wrapper: createWrapper() })
    expect(result.current.variables).toBeUndefined()
  })

  it('should call AuthService.login_user on mutate', async () => {
    mockedAxios.mockResolvedValue({
      data: { access_token: 'tok', user: { id: '1', firstName: 'Test' } },
    })

    const { result } = renderHook(() => useLoginUserHook(), { wrapper: createWrapper() })

    result.current.mutate({ email: 'a@b.com', password: 'secret' })

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalledTimes(1)
      const config = mockedAxios.mock.calls[0][0]
      expect(config.method).toBe('POST')
      expect(config.url).toContain('/auth/login')
      expect(config.data).toEqual({ email: 'a@b.com', password: 'secret' })
    })
  })

  it('should return success data after mutation', async () => {
    const mockResponse = {
      data: { access_token: 'tok-123', user: { id: 'u1', firstName: 'Ahmed' } },
    }
    mockedAxios.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useLoginUserHook(), { wrapper: createWrapper() })

    result.current.mutate({ email: 'x@y.com', password: 'pw' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data?.data.access_token).toBe('tok-123')
      expect(result.current.data?.data.user.firstName).toBe('Ahmed')
    })
  })
})

import { renderHook, waitFor } from '@testing-library/react'
import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createWrapper } from '../../test/test-utils'
import { useGetShopByManagerHook } from './use-get-shop-by-manager.hook'

vi.mock('axios')

const mockedAxios = vi.mocked(axios)

describe('useGetShopByManagerHook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should call GET with correct URL when enabled', async () => {
    localStorage.setItem('user', JSON.stringify({ access_token: 'tok' }))
    mockedAxios.mockResolvedValue({ data: { shop: { id: 's1', name: 'Salon' } } })

    const { result } = renderHook(() => useGetShopByManagerHook(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedAxios).toHaveBeenCalledTimes(1)
    const config = mockedAxios.mock.calls[0][0]
    expect(config.method).toBe('GET')
    expect(config.url).toContain('/barber-shop/by-manager-id')
    expect(config.headers?.Authorization).toBe('Bearer tok')
  })

  it('should return shop data', async () => {
    mockedAxios.mockResolvedValue({
      data: { shop: { id: 'shop-42', name: 'Salon Baraka', address: '123 Rue' } },
    })

    const { result } = renderHook(() => useGetShopByManagerHook(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.data?.data.shop.name).toBe('Salon Baraka')
      expect(result.current.data?.data.shop.id).toBe('shop-42')
    })
  })
})

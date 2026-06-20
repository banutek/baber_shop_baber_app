import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import axios, { type AxiosRequestConfig } from 'axios'
import { useCreateNewShopHook } from './use-create-new-shop.hook'
import { createWrapper } from '../../test/test-utils'

vi.mock('axios')

const mockedAxios = vi.mocked(axios)

describe('useCreateNewShopHook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should call ShopService.create_barber_shop with FormData', async () => {
    mockedAxios.mockResolvedValue({ data: { shop: { id: 's1', name: 'Salon' } } })

    const { result } = renderHook(() => useCreateNewShopHook(), { wrapper: createWrapper() })

    const formData = new FormData()
    formData.append('name', 'Test Shop')
    result.current.mutate(formData)

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalledTimes(1)
      const config = mockedAxios.mock.calls[0][0] as unknown as AxiosRequestConfig
      expect(config.method).toBe('POST')
      expect(config.url).toContain('/barber-shop/create')
      expect(config.headers?.['Content-Type']).toBe('multipart/form-data')
    })
  })

  it('should return shop data on success', async () => {
    mockedAxios.mockResolvedValue({ data: { shop: { id: 'shop-new', name: 'Baraka' } } })

    const { result } = renderHook(() => useCreateNewShopHook(), { wrapper: createWrapper() })
    result.current.mutate(new FormData())

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data?.data.shop.name).toBe('Baraka')
    })
  })
})

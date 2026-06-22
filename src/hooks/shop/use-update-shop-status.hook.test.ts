import { renderHook, waitFor } from '@testing-library/react'
import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createWrapper } from '../../test/test-utils'
import { useUpdateShopStatusHook } from './use-update-shop-status.hook'

vi.mock('axios')

const mockedAxios = vi.mocked(axios)

describe('useUpdateShopStatusHook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should call PATCH with correct shopId and status', async () => {
    localStorage.setItem('user', JSON.stringify({ access_token: 'tok' }))
    mockedAxios.mockResolvedValue({ data: { shop: { id: 's1', openStatus: 'OPEN' } } })

    const { result } = renderHook(() => useUpdateShopStatusHook(), { wrapper: createWrapper() })

    result.current.mutate({ shopId: 'shop-5', datas: { openStatus: 'BUSY' } as any })

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalledTimes(1)
      const config = mockedAxios.mock.calls[0][0]
      expect(config.method).toBe('PATCH')
      expect(config.url).toContain('/barber-shop/shop-5/status')
      expect(config.data).toEqual({ openStatus: 'BUSY' })
    })
  })

  it('should return updated shop on success', async () => {
    mockedAxios.mockResolvedValue({ data: { shop: { id: 's1', openStatus: 'CLOSED' } } })

    const { result } = renderHook(() => useUpdateShopStatusHook(), { wrapper: createWrapper() })
    result.current.mutate({ shopId: 's1', datas: { openStatus: 'CLOSED' } as any })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data?.data.shop.openStatus).toBe('CLOSED')
    })
  })
})

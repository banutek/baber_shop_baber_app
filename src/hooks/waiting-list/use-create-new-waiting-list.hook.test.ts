import { renderHook, waitFor } from '@testing-library/react'
import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createWrapper } from '../../test/test-utils'
import { useCreateNewWaitingListHook } from './use-create-new-waiting-list.hook'

vi.mock('axios')

const mockedAxios = vi.mocked(axios)

describe('useCreateNewWaitingListHook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('user', JSON.stringify({ access_token: 'tok' }))
  })

  it('should call POST with correct body', async () => {
    mockedAxios.mockResolvedValue({ data: { waitingList: { id: 'wl-1' } } })

    const { result } = renderHook(() => useCreateNewWaitingListHook(), { wrapper: createWrapper() })

    result.current.mutate({
      current_number: 0,
      session_date: new Date('2026-06-19'),
      status: 'OPEN',
      barberShopId: 'shop-1',
    })

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalledTimes(1)
      const config = mockedAxios.mock.calls[0][0]
      expect(config.method).toBe('POST')
      expect(config.url).toContain('/waiting-list/create')
      expect(config.data.barberShopId).toBe('shop-1')
    })
  })

  it('should return waiting list on success', async () => {
    mockedAxios.mockResolvedValue({ data: { waitingList: { id: 'wl-99', current_number: 3 } } })

    const { result } = renderHook(() => useCreateNewWaitingListHook(), { wrapper: createWrapper() })
    result.current.mutate({} as any)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data?.data.waitingList.id).toBe('wl-99')
    })
  })
})

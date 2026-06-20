import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import axios from 'axios'
import { useUpdateWaitingListStatusHook } from './use-update-waiting-list-status.hook'
import { createWrapper } from '../../test/test-utils'

vi.mock('axios')

const mockedAxios = vi.mocked(axios)

describe('useUpdateWaitingListStatusHook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('user', JSON.stringify({ access_token: 'tok' }))
  })

  it('should call PATCH with correct listId and status', async () => {
    mockedAxios.mockResolvedValue({ data: { waitingList: { status: 'CLOSED' } } })

    const { result } = renderHook(() => useUpdateWaitingListStatusHook(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ listId: 'wl-7', datas: { status: 'CLOSED' } as any })

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalledTimes(1)
      const config = mockedAxios.mock.calls[0][0]
      expect(config.method).toBe('PATCH')
      expect(config.url).toContain('/waiting-list/status/wl-7')
    })
  })
})

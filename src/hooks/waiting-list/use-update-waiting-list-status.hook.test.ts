import { renderHook, waitFor } from '@testing-library/react'
import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createWrapper } from '../../test/test-utils'
import { useUpdateWaitingListStatusHook } from './use-update-waiting-list-status.hook'

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
      const config = mockedAxios.mock.calls[0][0] as unknown as {
        method: string
        url: string
      }
      expect(config.method).toBe('PATCH')
      expect(config.url).toContain('/waiting-list/status/wl-7')
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import axios from 'axios'
import { useUpdateListNumberStatusHook } from './use-update-list-number-status.hook'
import { createWrapper } from '../../test/test-utils'

vi.mock('axios')

const mockedAxios = vi.mocked(axios)

describe('useUpdateListNumberStatusHook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should call PATCH with correct numberId and status (no auth)', async () => {
    mockedAxios.mockResolvedValue({ data: { waitingListNumber: { status: 'COMPLETED' } } })

    const { result } = renderHook(() => useUpdateListNumberStatusHook(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ numberId: 'num-3', datas: { status: 'COMPLETED' } as any })

    await waitFor(() => {
      expect(mockedAxios).toHaveBeenCalledTimes(1)
      const config = mockedAxios.mock.calls[0][0]
      expect(config.method).toBe('PATCH')
      expect(config.url).toContain('/waiting-list-number/status/num-3')
      expect(config.data).toEqual({ status: 'COMPLETED' })
      // No auth header expected
      expect(config.headers?.Authorization).toBeUndefined()
    })
  })

  it('should return updated number on success', async () => {
    mockedAxios.mockResolvedValue({
      data: { waitingListNumber: { id: 'n1', status: 'IN_PROGRESS' } },
    })

    const { result } = renderHook(() => useUpdateListNumberStatusHook(), {
      wrapper: createWrapper(),
    })
    result.current.mutate({ numberId: 'n1', datas: { status: 'IN_PROGRESS' } as any })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data?.data.waitingListNumber.status).toBe('IN_PROGRESS')
    })
  })
})

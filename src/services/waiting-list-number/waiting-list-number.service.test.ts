import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios, { type AxiosRequestConfig } from 'axios'
import { WaitingListNumberService } from './waiting-list-number.service'

vi.mock('axios')

const mockedAxios = vi.mocked(axios)

describe('WaitingListNumberService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('update_waiting_list_number_status', () => {
    it('should call PATCH with correct URL, body, and NO auth', async () => {
      mockedAxios.mockResolvedValue({
        data: { waitingListNumber: { id: 'n1', status: 'COMPLETED' } },
      })

      await WaitingListNumberService.update_waiting_list_number_status('num-5', {
        status: 'COMPLETED' as any,
      })

      const config = mockedAxios.mock.calls[0][0] as unknown as AxiosRequestConfig
      expect(config.method).toBe('PATCH')
      expect(config.url).toContain('/waiting-list-number/status/num-5')
      expect(config.data).toEqual({ status: 'COMPLETED' })
      // No auth for this endpoint (required_auth = false)
      expect(config.headers?.Authorization).toBeUndefined()
    })

    it('should handle different status values', async () => {
      mockedAxios.mockResolvedValue({ data: {} })

      await WaitingListNumberService.update_waiting_list_number_status('num-8', {
        status: 'IN_PROGRESS' as any,
      })

      const config = mockedAxios.mock.calls[0][0] as unknown as AxiosRequestConfig
      expect(config.data).toEqual({ status: 'IN_PROGRESS' })
    })
  })
})

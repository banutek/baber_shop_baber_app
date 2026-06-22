import axios, { type AxiosRequestConfig } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { WaitingListService } from './waiting-list.service'

vi.mock('axios')

const mockedAxios = vi.mocked(axios)

describe('WaitingListService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('user', JSON.stringify({ access_token: 'tok' }))
  })

  describe('create_waiting_list', () => {
    it('should call POST with correct URL and body', async () => {
      const body = {
        current_number: 0,
        session_date: new Date(),
        status: 'OPEN',
        barberShopId: 'shop-1',
      }
      mockedAxios.mockResolvedValue({ data: { waitingList: { id: 'wl-1' } } })

      await WaitingListService.create_waiting_list(body)

      const config = mockedAxios.mock.calls[0][0] as unknown as AxiosRequestConfig
      expect(config.method).toBe('POST')
      expect(config.url).toContain('/waiting-list/create')
      expect(config.data).toEqual(body)
      expect(config.headers?.Authorization).toBe('Bearer tok')
    })
  })

  describe('get_waiting_list_by_shop_id', () => {
    it('should call GET with shopId in URL', async () => {
      mockedAxios.mockResolvedValue({ data: { waitingList: { id: 'wl-1' } } })

      await WaitingListService.get_waiting_list_by_shop_id('shop-42')

      const config = mockedAxios.mock.calls[0][0] as unknown as AxiosRequestConfig
      expect(config.method).toBe('GET')
      expect(config.url).toContain('/waiting-list/by-shop-id/shop-42')
      expect(config.headers?.Authorization).toBe('Bearer tok')
    })
  })

  describe('update_waiting_list_status', () => {
    it('should call PATCH with status body', async () => {
      mockedAxios.mockResolvedValue({ data: {} })

      await WaitingListService.update_waiting_list_status('wl-1', { status: 'CLOSED' } as any)

      const config = mockedAxios.mock.calls[0][0] as unknown as AxiosRequestConfig
      expect(config.method).toBe('PATCH')
      expect(config.url).toContain('/waiting-list/status/wl-1')
      expect(config.data).toEqual({ status: 'CLOSED' })
    })
  })

  describe('update_waiting_list_infos', () => {
    it('should call PATCH with infos body', async () => {
      mockedAxios.mockResolvedValue({ data: {} })

      await WaitingListService.update_waiting_list_infos('wl-1', { current_number: 7 })

      const config = mockedAxios.mock.calls[0][0] as unknown as AxiosRequestConfig
      expect(config.method).toBe('PATCH')
      expect(config.url).toContain('/waiting-list/wl-1')
      expect(config.data).toEqual({ current_number: 7 })
    })
  })
})

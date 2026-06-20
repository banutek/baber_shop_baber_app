import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios, { type AxiosRequestConfig } from 'axios'
import { ShopService } from './shop.service'

vi.mock('axios')

const mockedAxios = vi.mocked(axios)

describe('ShopService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('get_barber_shop_by_manager_id', () => {
    it('should call GET with correct URL and auth token', async () => {
      localStorage.setItem('user', JSON.stringify({ access_token: 'token-123' }))
      mockedAxios.mockResolvedValue({ data: { shop: { id: 's1', name: 'Salon' } } })

      await ShopService.get_barber_shop_by_manager_id()

      const config = mockedAxios.mock.calls[0][0] as unknown as AxiosRequestConfig
      expect(config.method).toBe('GET')
      expect(config.url).toContain('/barber-shop/by-manager-id')
      expect(config.headers?.Authorization).toBe('Bearer token-123')
    })

    it('should send empty Bearer token when no user in localStorage', async () => {
      mockedAxios.mockResolvedValue({ data: {} })

      await ShopService.get_barber_shop_by_manager_id()

      const config = mockedAxios.mock.calls[0][0] as unknown as AxiosRequestConfig
      expect(config.headers?.Authorization).toBe('Bearer ')
    })
  })

  describe('create_barber_shop', () => {
    it('should call POST (multipart) with FormData and auth', async () => {
      localStorage.setItem('user', JSON.stringify({ access_token: 'token-xyz' }))
      const formData = new FormData()
      formData.append('name', 'Nouveau Salon')
      mockedAxios.mockResolvedValue({ data: { shop: { id: 'new' } } })

      await ShopService.create_barber_shop(formData)

      const config = mockedAxios.mock.calls[0][0] as unknown as AxiosRequestConfig
      expect(config.method).toBe('POST')
      expect(config.url).toContain('/barber-shop/create')
      expect(config.headers?.['Content-Type']).toBe('multipart/form-data')
      expect(config.headers?.Authorization).toBe('Bearer token-xyz')
      expect(config.data).toBe(formData)
    })
  })

  describe('update_shop_status', () => {
    it('should call PATCH with correct URL, body, and auth', async () => {
      localStorage.setItem('user', JSON.stringify({ access_token: 'tok' }))
      mockedAxios.mockResolvedValue({ data: { shop: { openStatus: 'OPEN' } } })

      await ShopService.update_shop_status('shop-42', { openStatus: 'OPEN' } as any)

      const config = mockedAxios.mock.calls[0][0] as unknown as AxiosRequestConfig
      expect(config.method).toBe('PATCH')
      expect(config.url).toContain('/barber-shop/shop-42/status')
      expect(config.data).toEqual({ openStatus: 'OPEN' })
      expect(config.headers?.Authorization).toBe('Bearer tok')
    })
  })
})

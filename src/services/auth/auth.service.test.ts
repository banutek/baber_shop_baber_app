import axios, { type AxiosRequestConfig } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthService } from './auth.service'

vi.mock('axios')

const mockedAxios = vi.mocked(axios)

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('login_user', () => {
    it('should call POST with correct URL and body', async () => {
      const body = { email: 'test@test.com', password: 'secret' }
      mockedAxios.mockResolvedValue({ data: { access_token: 'token' } })

      await AuthService.login_user(body)

      expect(mockedAxios).toHaveBeenCalledTimes(1)
      const config = mockedAxios.mock.calls[0][0] as unknown as AxiosRequestConfig
      expect(config.method).toBe('POST')
      expect(config.url).toContain('/auth/login')
      expect(config.data).toEqual(body)
    })
  })

  describe('register_new_user', () => {
    it('should call POST with correct URL and body', async () => {
      const body = {
        firstName: 'New',
        lastName: 'User',
        email: 'new@test.com',
        password: 'secret',
        phone: '+212600000000',
        address: '123 Street',
        role: 'BARBER',
      }
      mockedAxios.mockResolvedValue({ data: { user: { id: '1' } } })

      await AuthService.register_new_user(body)

      const config = mockedAxios.mock.calls[0][0] as unknown as AxiosRequestConfig
      expect(config.method).toBe('POST')
      expect(config.url).toContain('/auth/register')
    })

    it('should send request without auth token', async () => {
      mockedAxios.mockResolvedValue({ data: {} })
      await AuthService.register_new_user({} as any)

      const config = mockedAxios.mock.calls[0][0] as unknown as AxiosRequestConfig
      // register_new_user uses required_auth = false, no Authorization header
      expect(config.headers?.Authorization).toBeUndefined()
    })
  })

  describe('authenticated requests', () => {
    it('should include Bearer token when user is in localStorage', async () => {
      localStorage.setItem('user', JSON.stringify({ access_token: 'my-token' }))
      mockedAxios.mockResolvedValue({ data: {} })

      // ShopService uses required_auth = true
      const { ShopService } = await import('../shop/shop.service')
      await ShopService.get_barber_shop_by_manager_id()

      const config = mockedAxios.mock.calls[0][0] as unknown as AxiosRequestConfig
      expect(config.headers?.Authorization).toBe('Bearer my-token')
    })
  })
})

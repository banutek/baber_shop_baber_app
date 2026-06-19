/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

class BaseMethods {
  ////////////////// Internal usage //////////////////////
  static getHeaders = (isFile?: boolean) => {
    const headers = {
      'Content-Type': isFile ? 'multipart/form-data' : 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      Credentials: 'same-origin',
    }
    return headers
  }

  static getHeadersAuth = (isFile?: boolean) => {
    const headers = BaseMethods.getHeaders(isFile)
    const token = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string).access_token
      : ''
    const copyHeaders = {
      Authorization: `Bearer ${token}`,
      ...headers,
    }
    return copyHeaders
  }

  ///////////////////// External usage ////////////////////
  static async postRequest(
    url: string,
    body: unknown,
    required_auth: boolean,
  ): Promise<AxiosResponse> {
    const headers = required_auth ? BaseMethods.getHeadersAuth() : BaseMethods.getHeaders()

    const config: AxiosRequestConfig = {
      method: 'POST',
      url,
      headers,
      data: body,
    }

    return axios(config)
  }

  static async postFileRequest(
    url: string,
    body: unknown,
    required_auth: boolean,
  ): Promise<AxiosResponse> {
    const headers = required_auth ? BaseMethods.getHeadersAuth(true) : BaseMethods.getHeaders(true)

    const config: AxiosRequestConfig = {
      method: 'POST',
      url,
      headers,
      data: body,
    }
    console.log({ config })

    return axios(config)
  }

  static async getRequest(
    url: string,
    required_auth: boolean,
    params?: Record<string, any>,
  ): Promise<AxiosResponse> {
    const headers = required_auth ? BaseMethods.getHeadersAuth() : BaseMethods.getHeaders()

    const config: AxiosRequestConfig = {
      method: 'GET',
      url,
      headers,
      params: params || {},
    }

    return axios(config)
  }

  static async putFileRequest(
    url: string,
    body: unknown,
    required_auth: boolean,
  ): Promise<AxiosResponse> {
    const headers = required_auth ? BaseMethods.getHeadersAuth(true) : BaseMethods.getHeaders(true)

    const config: AxiosRequestConfig = {
      method: 'PUT',
      url,
      headers,
      data: body,
    }

    return axios(config)
  }

  static async putRequest(
    url: string,
    body: unknown,
    required_auth: boolean,
  ): Promise<AxiosResponse> {
    const headers = required_auth ? BaseMethods.getHeadersAuth() : BaseMethods.getHeaders()

    const config: AxiosRequestConfig = {
      method: 'PUT',
      url,
      headers,
      data: body,
    }

    return axios(config)
  }

  static async patchRequest(
    url: string,
    body: unknown,
    required_auth: boolean,
  ): Promise<AxiosResponse> {
    const headers = required_auth ? BaseMethods.getHeadersAuth() : BaseMethods.getHeaders()

    const config: AxiosRequestConfig = {
      method: 'PATCH',
      url,
      headers,
      data: body,
    }

    return axios(config)
  }

  static async deleteRequest(url: string, required_auth: boolean): Promise<AxiosResponse> {
    const headers = required_auth ? BaseMethods.getHeadersAuth() : BaseMethods.getHeaders()

    const config: AxiosRequestConfig = {
      method: 'DELETE',
      url,
      headers,
    }

    return axios(config)
  }
}

export default BaseMethods

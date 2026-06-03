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
      ? JSON.parse(localStorage.getItem('user')).access_token
      : ''
    const copyHeaders = {
      Authorization: `Bearer ${token}`,
      // Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ5bFJqZzlzT19POFdMUmJfXzhBQ0szYVN5b1AwaXh3aTNvVEFfeWswelk0In0.eyJleHAiOjE3NDE5NTAyNjgsImlhdCI6MTc0MTk0NjY2OCwianRpIjoiODk1NmMwNmItZTFkOC00NWNhLTljZTYtZTAyYzgyNzQzOWMzIiwiaXNzIjoiaHR0cHM6Ly8xMzcuMTM1LjIwMS4xOTY6ODQ0My9yZWFsbXMvZnNlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjRhNmIxNTIxLTMxZTgtNDU5NS04NDIzLWE2ZTA1NmI0OWMxNiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImZzZS1leHRlcm5hbCIsInNpZCI6ImM2NTg4ZmQwLTVlNjQtNGFhNy1iYTdjLThmNDliNGE1YTM3ZCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiLyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtZnNlIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInVuaXR5IjoidW5pdHkxMjM0NTYiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJBaG1lZCBOYWNlciIsIklOUEUiOiIwMDAwMDAwMDEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhLmtham91aTEyMzQiLCJnaXZlbl9uYW1lIjoiQWhtZWQiLCJjYXRlZ29yeSI6ImNhdGVnb3J5MTIzIiwiZmFtaWx5X25hbWUiOiJOYWNlciIsImVtYWlsIjoibmFjZXIua0BnbWFpbC5jb20ifQ.4Les8z73cIHAJ2RPp9YtoMgCL3p5qXCmSR-hyIgC-UWPGxurhkY05g7Gq-N7n-CDvOQjfbcpPhcjui4AzEXZMUxNn_JqFDxYk_PtpDDMqDjsoXwHhAOTpXqIQ57ak5itxSv9wJvQYsItSrTpFHKEgM3fVLzvi4oRLIxby77LbMxJzYKB6WvjNmpxhmUEDvjRGCSepBPjukla4tiyo7XryhaSIzbh6vyyJQEmxtWHBgPuyNEN-dHGDdz1rVkHgSEOyGCObySw6-jIGw5WB9l6wIEhYGtJaMK3kExJ6_WyYE95s5-CScTKOtCHEVtT7w3Pv3nsDb0-spusb_zMFqrXMw`,
      ...headers,
    }
    // headers.append('Authorization', `Bearer ${JSON.parse(token)}`);
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

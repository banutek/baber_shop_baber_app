/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'

// ─── Interceptor global ──────────────────────────────────────────────────────

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    // Essaie d'extraire un message lisible
    const backendMessage =
      (error.response?.data as { message?: string })?.message ??
      (error.response?.data as { error?: string })?.error

    // Import dynamique pour éviter la dépendance circulaire
    import('../stores/toast').then(({ useToastStore }) => {
      if (error.response?.status === 401) {
        // 401 = non authentifié. On ne montre pas de toast ici :
        // - Sur /login, c'est le formulaire qui affiche l'erreur champ.
        // - Ailleurs, on redirige vers /login silencieusement.
        localStorage.removeItem('user')
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      } else if (error.response?.status === 403) {
        useToastStore.getState().addToast('Accès non autorisé', 'error')
      } else if (error.response?.status === 409) {
        useToastStore
          .getState()
          .addToast(backendMessage ?? 'Conflit : cette ressource existe déjà', 'warning')
      } else if (error.response?.status && error.response.status >= 500) {
        useToastStore
          .getState()
          .addToast(backendMessage ?? 'Erreur serveur, veuillez réessayer', 'error')
      } else if (error.response?.status === 400 || error.response?.status === 422) {
        // 400/422 = erreur de validation — laissé au formulaire
      } else if (error.code === 'ERR_NETWORK' || !error.response) {
        useToastStore.getState().addToast('Problème de connexion réseau', 'error')
      }
      // Pas de catch-all : chaque onError de formulaire gère ses propres messages.
    })

    return Promise.reject(error)
  },
)

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

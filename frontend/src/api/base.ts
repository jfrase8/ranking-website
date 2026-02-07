import type { TokenResponse, ZustandAuthLocalType } from '@/types/AuthResponse'
import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

const refreshAccessToken = async (): Promise<string | null> => {
  const authData = localStorage.getItem('auth-storage')
  if (!authData) {
    return null
  }

  const response = JSON.parse(authData) as ZustandAuthLocalType
  const refreshToken = response.state.refreshToken

  if (!refreshToken) {
    return null
  }

  try {
    const { data } = await axios.post<TokenResponse>(`${API_BASE_URL}/api/auth/refresh`, {
      refreshToken,
    })

    // Update localStorage with new tokens
    const updatedAuthData = {
      ...response,
      state: {
        ...response.state,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
      },
    }
    localStorage.setItem('auth-storage', JSON.stringify(updatedAuthData))

    return data.accessToken
  } catch (error) {
    // Refresh failed, clear auth
    localStorage.removeItem('auth-storage')
    window.location.href = '/login'
    return null
  }
}

const isTokenExpired = (): boolean => {
  const authData = localStorage.getItem('auth-storage')
  if (!authData) return true

  const response = JSON.parse(authData) as ZustandAuthLocalType
  const expiresAt = response.state.expiresAt

  if (!expiresAt) return true

  // Check if token expires in less than 1 minute
  return new Date(expiresAt).getTime() - Date.now() < 60000
}

// Add request interceptor to attach JWT token and handle refresh
apiClient.interceptors.request.use(
  async (config) => {
    // Check if token is expired
    if (isTokenExpired()) {
      if (!isRefreshing) {
        isRefreshing = true
        const newToken = await refreshAccessToken()
        isRefreshing = false

        if (newToken) {
          onRefreshed(newToken)
          config.headers.Authorization = `Bearer ${newToken}`
        }
      } else {
        // Wait for the ongoing refresh
        const token = await new Promise<string>((resolve) => {
          addRefreshSubscriber((newToken) => {
            resolve(newToken)
          })
        })
        config.headers.Authorization = `Bearer ${token}`
      }
    } else {
      // Token is still valid, use it
      const authData = localStorage.getItem('auth-storage')
      if (authData) {
        const response = JSON.parse(authData) as ZustandAuthLocalType
        const token = response.state.accessToken
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const newToken = await refreshAccessToken()
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      }
    }

    if (error.response?.status === 401) {
      const message = error.response?.data?.message || 'Authentication required. Please log in.'
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
      return Promise.reject(new Error(message))
    }

    return Promise.reject(error)
  },
)

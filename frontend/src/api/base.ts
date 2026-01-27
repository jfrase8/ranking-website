import type { ZustandAuthLocalType } from '@/types/AuthResponse'
import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('auth-storage')
    console.log('adding token:', authData)
    if (authData) {
      const response = JSON.parse(authData) as ZustandAuthLocalType

      const token = response.state.token
      if (token) {
        console.log('successfully added token')
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Optional: Add response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || 'Authentication required. Please log in.'

      // Token expired or invalid - clear it and redirect to login
      localStorage.removeItem('token')
      // TODO: Redirect to login
      // window.location.href = '/login' // or use your router

      return Promise.reject(new Error(message))
    }
    return Promise.reject(error)
  },
)

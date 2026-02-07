import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  userName: string
  email: string | null
  avatarUrl: string | null
  createdAt: string
}

interface AuthStore {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  expiresAt: string | null
  isAuthenticated: boolean

  login: (accessToken: string, refreshToken: string, expiresAt: string, user: User) => void
  logout: () => void
  updateTokens: (accessToken: string, refreshToken: string, expiresAt: string) => void
  isTokenExpired: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,

      login: (accessToken: string, refreshToken: string, expiresAt: string, user: User) => {
        set({
          user,
          accessToken,
          refreshToken,
          expiresAt,
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
        })
      },

      updateTokens: (accessToken: string, refreshToken: string, expiresAt: string) => {
        set({ accessToken, refreshToken, expiresAt })
      },

      isTokenExpired: () => {
        const { expiresAt } = get()
        if (!expiresAt) return true
        // Check if token expires in less than 1 minute
        return new Date(expiresAt).getTime() - Date.now() < 60000
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
)

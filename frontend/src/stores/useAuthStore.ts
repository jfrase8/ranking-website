import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  userName: string
  email: string | undefined
  avatarUrl: string | undefined
  createdAt: string
}

interface AuthStore {
  user: User | undefined
  accessToken: string | undefined
  refreshToken: string | undefined
  expiresAt: string | undefined
  isAuthenticated: boolean

  login: (accessToken: string, refreshToken: string, expiresAt: string, user: User) => void
  logout: () => void
  updateTokens: (accessToken: string, refreshToken: string, expiresAt: string) => void
  isTokenExpired: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: undefined,
      accessToken: undefined,
      refreshToken: undefined,
      expiresAt: undefined,
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
          user: undefined,
          accessToken: undefined,
          refreshToken: undefined,
          expiresAt: undefined,
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

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
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      // Automatically syncs to localStorage
    },
  ),
)

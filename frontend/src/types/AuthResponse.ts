export type AuthResponse = {
  token: string
  refreshToken: string
  expiresAt: string
  user: {
    id: string
    userName: string
    email: string | null
    avatarUrl: string | null
    createdAt: string
  }
}

export type TokenResponse = {
  accessToken: string
  refreshToken: string
  expiresAt: string
}

export type ZustandAuthLocalType = {
  state: {
    accessToken: string | null
    refreshToken: string | null
    expiresAt: string | null
    isAuthenticated: boolean
    user: {
      id: string
      userName: string
      email: string | null
      avatarUrl: string | null
      createdAt: string
    } | null
  }
  version: number
}

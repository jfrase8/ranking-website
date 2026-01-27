export type AuthResponse = {
  token: string
  user: {
    id: string
    userName: string
    email: string | null
    avatarUrl: string | null
    createdAt: string
  }
}

export type ZustandAuthLocalType = {
  state: {
    token: string
    isAuthorized: boolean
    user: {
      id: string
      userName: string
      email: string | null
      avatarUrl: string | null
      createdAt: string
    }
  }
  version: number
}

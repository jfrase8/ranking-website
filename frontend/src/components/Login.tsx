import { useAuthStore } from '@/stores/useAuthStore'
import { type CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { useMutation } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_API_URL as string

interface AuthResponse {
  token: string
  user: {
    id: string
    userName: string
    email: string | null
    avatarUrl: string | null
    createdAt: string
  }
}

interface LoginRequest {
  idToken: string
}

export function Login() {
  const { login } = useAuthStore()

  const loginMutation = useMutation<AuthResponse, Error, string>({
    mutationFn: async (googleToken: string) => {
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: googleToken } as LoginRequest),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      return response.json() as Promise<AuthResponse>
    },
    onSuccess: (data: AuthResponse) => {
      login(data.token, data.user)
    },
    onError: (error: Error) => {
      console.error('Login error:', error)
    },
  })

  return (
    <GoogleLogin
      onSuccess={(credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
          loginMutation.mutate(credentialResponse.credential)
        }
      }}
      onError={() => {
        console.log('Login Failed')
      }}
    />
  )
}

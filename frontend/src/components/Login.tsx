import { apiClient } from '@/api/base'
import { useAuthStore } from '@/stores/useAuthStore'
import type { AuthResponse } from '@/types/AuthResponse'
import { type CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { useMutation } from '@tanstack/react-query'

export function Login({ onSuccess }: { onSuccess?: () => void }) {
  const { login } = useAuthStore()

  const loginMutation = useMutation<AuthResponse, Error, string>({
    mutationFn: async (googleToken: string) => {
      // Since /sigma is in your .env, we just need the remaining path
      const { data } = await apiClient.post<AuthResponse>('/api/auth/google', {
        idToken: googleToken,
      })
      return data
    },
    onSuccess: (data) => {
      // Make sure your store and localStorage keys ('authToken') match
      login(data.token, data.user)
      onSuccess?.()
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.errors?.['$']?.[0] || error.message
      console.error('Authentication failed:', errorMsg)
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

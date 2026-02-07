import { apiClient } from '@/api/base'
import { useAuthStore } from '@/stores/useAuthStore'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

export function SessionManager({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { refreshToken, logout } = useAuthStore()
  const lastPingRef = useRef(Date.now())

  const pingMutation = useMutation({
    mutationFn: async (token: string) => {
      const { data } = await apiClient.post('/api/auth/ping', {
        refreshToken: token,
      })
      return data
    },
    onError: (error) => {
      console.error('Ping error:', error)
      logout()
      navigate({ to: '/' })
    },
  })

  useEffect(() => {
    if (!refreshToken) return

    const pingServer = () => {
      pingMutation.mutate(refreshToken)
    }

    // Throttled activity handler - only ping every 30 seconds
    const handleActivity = () => {
      const now = Date.now()
      if (now - lastPingRef.current > 30000) {
        lastPingRef.current = now
        pingServer()
      }
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        pingServer()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    const interval = setInterval(() => {
      if (!document.hidden) {
        pingServer()
      }
    }, 60000)

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(interval)
    }
  }, [refreshToken, pingMutation])

  return <>{children}</>
}

import Profile from '@/pages/profile/Profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ranking/profile/')({
  component: Profile,
})

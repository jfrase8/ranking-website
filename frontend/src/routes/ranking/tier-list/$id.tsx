import TierList from '@/pages/TierList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ranking/tier-list/$id')({
  component: TierList,
})

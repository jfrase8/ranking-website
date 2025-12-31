import { createFileRoute } from '@tanstack/react-router'
import NumberedList from '@/pages/numbered-list/NumberedList'

export const Route = createFileRoute('/ranking/numbered-list/')({
  component: NumberedList,
})

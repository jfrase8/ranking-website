import { createFileRoute } from '@tanstack/react-router'
import NumberedList from '../../pages/NumberedList'

export const Route = createFileRoute('/ranking/numbered-list')({
  component: NumberedList,
})

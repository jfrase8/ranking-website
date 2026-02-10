import { Spinner } from '@/components/ui/spinner'
import EditList from '@/pages/numbered-list/EditList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ranking/numbered-list/$listId')({
  component: EditList,
  pendingComponent: () => (
    <div className="flex h-full justify-center items-center">
      <Spinner />
    </div>
  ),
})

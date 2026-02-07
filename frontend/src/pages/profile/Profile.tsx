import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Text } from '@/components/ui/text'
import { useLists } from '@/hooks/useList'
import type { List } from '@/types/ListType'
import { useNavigate } from '@tanstack/react-router'

export default function Profile() {
  const navigate = useNavigate()
  const { data: lists } = useLists()
  if (!lists) return <Spinner />
  return (
    <div className="flex flex-col gap-20 h-full p-8 overflow-hidden">
      <div className="flex flex-col gap-2">
        <Text variant="headerPrimary">Recent Lists</Text>
        <div className="w-full overflow-auto flex gap-2">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 min-h-0">
        <Text variant="headerPrimary">All Lists</Text>
        <div className="w-fit flex flex-col items-center gap-2 p-2 overflow-y-auto">
          {lists.map((list) => (
            <Button
              className="justify-start w-fit"
              key={list.id}
              onClick={() => navigate({ to: `/ranking/numbered-list/${list.id}` })}
            >
              <Text className="text-secondary">Numbered</Text> {list.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ListCard({ list }: { list: List }) {
  const navigate = useNavigate()
  return (
    <button
      key={list.id}
      className={`flex flex-col gap-2 w-60 h-40 cursor-pointer bg-primary-foreground rounded-2xl 
                p-4 hover:bg-primary transition-colors duration-300 border border-primary group shrink-0`}
      onClick={() => navigate({ to: `/ranking/numbered-list/${list.id}` })}
    >
      <Text className="group-hover:text-secondary text-left">Numbered</Text>
      <Text variant="headerPrimary" className="group-hover:text-primary-foreground">
        {list.name}
      </Text>
      <Text variant="subText" className="group-hover:text-secondary">
        {list.description}
      </Text>
    </button>
  )
}

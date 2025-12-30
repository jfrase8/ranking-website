import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useLists } from '@/hooks/useList'

export default function NumberedList() {
  const userId = '123'
  const { data: listData, error: listDataError, isLoading: isListDataLoading } = useLists(userId)

  return (
    <div className="flex h-full">
      <div className="w-[50%] h-full">
        <Button onClick={() => {}}>Create New Numbered List</Button>
      </div>
      <div className="w-[50%] h-full">
        <div className="flex flex-col gap-4"></div>
        <Text variant="header">Recent Lists</Text>
        <div className="flex flex-col gap-1">
          {listData && listData.map((list) => <Button key={list.id}>{list.name}</Button>)}
        </div>
      </div>
    </div>
  )
}

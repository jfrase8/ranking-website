import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useLists } from '@/hooks/useList'
import CreateNumberedListModal from '@/components/numbered-list/CreateNumberedListModal'
import { useNavigate } from '@tanstack/react-router'

export default function NumberedList() {
  const userId = '123'
  const { data: listData, error: listDataError, isLoading: isListDataLoading } = useLists(userId)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex h-full">
      <div className="flex justify-center items-center w-[50%] h-full">
        <Button onClick={() => setIsOpen(true)}>Create New Numbered List</Button>
      </div>
      <div className="flex justify-center w-[50%] h-full">
        <div className="flex flex-col gap-4"></div>
        <Text variant="header">Recent Lists</Text>
        <div className="flex flex-col gap-1">
          {listData &&
            listData.map((list) => (
              <Button
                key={list.id}
                onClick={() => navigate({ to: `/ranking/numbered-list/${list.id}` })}
              >
                {list.name}
              </Button>
            ))}
        </div>
      </div>
      <CreateNumberedListModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  )
}

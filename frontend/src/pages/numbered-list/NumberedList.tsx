import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useLists } from '@/hooks/useList'
import CreateNumberedListModal from '@/components/numbered-list/CreateNumberedListModal'
import { useNavigate } from '@tanstack/react-router'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatTimestamp } from '@/utils/timestamp'

export default function NumberedList() {
  const userId = '123'
  const { data: listData, error: listDataError, isLoading: isListDataLoading } = useLists(userId)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex h-full p-8 gap-8">
      <div className="flex justify-center items-center w-[50%] h-full p-4 bg-indigo-400 rounded-2xl shadow-xl">
        <Button onClick={() => setIsOpen(true)}>Create New Numbered List</Button>
      </div>
      <div className="flex justify-left w-[50%] h-full pb-4 bg-indigo-400 rounded-2xl shadow-xl overflow-x-hidden">
        <div className="flex flex-col size-full">
          <div className="p-4 h-fit bg-linear-to-r from-indigo-500 bg-indigo-400 w-full shadow-lg">
            <Text variant="headerSecondary">Recent Lists</Text>
          </div>
          <div className="p-4 overflow-y-scroll h-full">
            <div className="flex flex-col gap-4">
              {listData &&
                listData.map((list) => (
                  <Card key={list.id}>
                    <CardHeader>
                      <CardTitle>{list.name}</CardTitle>
                      <CardDescription>{list.description}</CardDescription>
                      <CardAction>
                        <Button
                          onClick={() => navigate({ to: `/ranking/numbered-list/${list.id}` })}
                        >
                          View List
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <CardFooter>{formatTimestamp(list.createdAt)}</CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
      <CreateNumberedListModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  )
}

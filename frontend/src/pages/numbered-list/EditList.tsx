import { useState } from 'react'
import SearchList from '@/components/SearchList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useAddItem, useListItems, useRemoveItem } from '@/hooks/useListItems'
import { useLists } from '@/hooks/useList'
import { useParams } from '@tanstack/react-router'

export default function EditList() {
  const { listId } = useParams({ from: '/ranking/numbered-list/$listId' })

  const [search, setSearch] = useState('')

  const { data: lists, error: listsError, isLoading: isListsLoading } = useLists('123')

  const {
    data: listItems,
    error: listItemsError,
    isLoading: isListItemsLoading,
  } = useListItems(listId)

  if (listsError || listItemsError) return console.error(listsError || listItemsError)
  if (!lists || lists.length === 0) return console.error('No lists found')

  const listData = lists.find((list) => list.id === listId)

  const addItemMutation = useAddItem()
  const removeItemMutation = useRemoveItem()

  const addItem = async (itemName: string) => {
    if (!itemName.trim()) return

    try {
      await addItemMutation.mutateAsync({
        listId,
        name: itemName.trim(),
      })
    } catch (err) {
      console.error('Failed to add item:', err)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await removeItemMutation.mutateAsync({ listId, itemId })
    } catch (err) {
      console.error('Failed to remove item:', err)
    }
  }

  return (
    <div className="flex h-full">
      <div className="flex flex-col border border-black w-1/4 p-4 gap-4">
        <Text variant="header">Search for items to add to list</Text>
        <Input onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search..." />
        <SearchList
          search={search}
          list={['Cow', 'Mammoth', 'Centipede', 'Lobster', 'Horse', 'Otter']}
          onClick={(item) => addItem(item)}
        />
      </div>
      <div className="flex flex-col border border-black w-1/2 p-4">
        {isListItemsLoading ? (
          <div>Loading...</div>
        ) : (
          listItems &&
          listItems.map((item) => (
            <Button key={item.id} onClick={() => removeItem(item.id)}>
              {item.rank}. {item.name}
            </Button>
          ))
        )}
      </div>
      <div className="flex flex-col border border-black w-1/4 p-4">
        {isListsLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-col gap-4">
            <Text variant="header">Section 3 - List Details</Text>
            {listData ? (
              <div className="flex flex-col gap-2">
                <Text>{listData.name}</Text>
                <Text>{listData.description}</Text>
                <Text>{listData.privacy}</Text>
                <Text>{listData.createdAt}</Text>
              </div>
            ) : (
              <Text>Error finding list data</Text>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

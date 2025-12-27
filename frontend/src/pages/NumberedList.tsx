import { useState } from 'react'
import SearchList from '@/components/SearchList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useAddItem, useListItems, useRemoveItem } from '@/hooks/useList'

type Props = {}

export type ListItem = { itemName: string; rank: number; itemId: string }

export default function NumberedList({}: Props) {
  const [search, setSearch] = useState('')

  const listId = 'numbered-list'
  const { data: currentList, error, isLoading } = useListItems(listId)

  const addItemMutation = useAddItem()
  const removeItemMutation = useRemoveItem()

  console.log('!!', currentList)

  const addItem = async (itemName: string) => {
    if (!itemName.trim()) return

    try {
      await addItemMutation.mutateAsync({
        listId,
        itemName: itemName.trim(),
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
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          currentList &&
          currentList.map((item) => (
            <Button key={item.itemId} onClick={() => removeItem(item.itemId)}>
              {item.rank}. {item.itemName}
            </Button>
          ))
        )}
      </div>
      <div className="flex flex-col border border-black w-1/4 p-4">Section 3 - List Details</div>
    </div>
  )
}

import { useState } from 'react'
import SearchList from '@/components/SearchList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useAddItem, useListData, useListItems, useRemoveItem } from '@/hooks/useList'

type EditListProps = {
  listId: string
}

export default function EditList({ listId }: EditListProps) {
  const [search, setSearch] = useState('')

  const { data: listData, error: listDataError, isLoading: isListDataLoading } = useListData(listId)
  const {
    data: listItems,
    error: listItemsError,
    isLoading: isListItemsLoading,
  } = useListItems(listId)

  const addItemMutation = useAddItem()
  const removeItemMutation = useRemoveItem()

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

  if (listDataError || listItemsError) console.error(listDataError || listItemsError)

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
      <div className="flex flex-col border border-black w-1/4 p-4">Section 3 - List Details</div>
    </div>
  )
}

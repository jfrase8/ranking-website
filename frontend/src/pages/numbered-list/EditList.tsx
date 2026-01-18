import { useState } from 'react'
import SearchList from '@/components/SearchList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useAddItem, useListItems, useRemoveItem } from '@/hooks/useListItems'
import { useLists } from '@/hooks/useList'
import { useParams } from '@tanstack/react-router'
import { Section } from '@/components/Section'

export default function EditList() {
  const { listId } = useParams({ from: '/ranking/numbered-list/$listId' })

  const [search, setSearch] = useState('')

  const { data: lists, error: listsError, isLoading: isListsLoading } = useLists('123')

  const {
    data: listItems,
    error: listItemsError,
    isLoading: isListItemsLoading,
  } = useListItems(listId)

  const addItemMutation = useAddItem()
  const removeItemMutation = useRemoveItem()

  if (listsError || listItemsError) return console.error(listsError || listItemsError)
  if (!lists || lists.length === 0) return <div>Loading...</div>

  const listData = lists.find((list) => list.id === listId)

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
      <Section className="w-1/4" header={<Text variant="headerSecondary">Add Items</Text>}>
        <Input onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search..." />
        <SearchList
          search={search}
          list={['Cow', 'Mammoth', 'Centipede', 'Lobster', 'Horse', 'Otter']}
          onClick={(item) => addItem(item)}
          buttonVariant="secondary"
        />
      </Section>
      <Section
        className="w-1/2"
        header={<Text variant="headerSecondary">List Items</Text>}
        variant="secondary"
      >
        {isListItemsLoading ? (
          <div>Loading...</div>
        ) : (
          listItems &&
          listItems.map((item) => (
            <Button key={item.id} onClick={() => removeItem(item.id)} variant="secondary">
              {item.rank}. {item.name}
            </Button>
          ))
        )}
      </Section>
      <Section className="w-1/4" header={<Text variant="headerSecondary">List Details</Text>}>
        {isListsLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {listData ? (
              <div className="flex flex-col gap-2">
                <Text variant="secondary">{listData.name}</Text>
                <Text variant="secondary">{listData.description}</Text>
                <Text variant="secondary">{listData.privacy}</Text>
                <Text variant="secondary">{listData.createdAt}</Text>
              </div>
            ) : (
              <Text>Error finding list data</Text>
            )}
          </div>
        )}
      </Section>
    </div>
  )
}

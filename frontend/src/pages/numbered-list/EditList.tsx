import { useRef, useState, type ChangeEvent } from 'react'
import SearchList from '@/components/SearchList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useAddItem, useListItems, useRemoveItem } from '@/hooks/useListItems'
import { useLists, useUpdateList } from '@/hooks/useList'
import { useParams } from '@tanstack/react-router'
import { Section } from '@/components/Section'
import { Check } from 'lucide-react'
import type { UpdateListBody } from '@/api/list/types/body'
import { Spinner } from '@/components/ui/spinner'

export default function EditList() {
  const { listId } = useParams({ from: '/ranking/numbered-list/$listId' })

  const [search, setSearch] = useState('')
  const [saved, setSaved] = useState(true)

  const { data: lists, error: listsError } = useLists()

  const {
    data: listItems,
    error: listItemsError,
    isLoading: isListItemsLoading,
  } = useListItems(listId)

  // Mutations
  const updateListMutation = useUpdateList(listId)
  const addItemMutation = useAddItem()
  const removeItemMutation = useRemoveItem()

  const listData = lists?.find((list) => list.id === listId)

  const [titleInput, setTitleInput] = useState(listData?.name || '')
  const [descriptionInput, setDescriptionInput] = useState(listData?.description || '')
  const debounceTimer = useRef<NodeJS.Timeout>(null)

  if (listsError || listItemsError) return console.error(listsError || listItemsError)
  if (!lists || lists.length === 0) return <div>Loading...</div>

  // After debounced time, update the list
  const updateListDebounce = (update: Partial<UpdateListBody>) => {
    debounceTimer.current = setTimeout(async () => {
      try {
        await updateListMutation.mutateAsync(update).then(() => setSaved(true))
      } catch (err) {
        console.error('Failed to update list:', err)
      }
    }, 2000)
  }

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    setTitleInput(e.target.value)
    setSaved(false)

    updateListDebounce({
      name: e.target.value,
    })
  }

  const onDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    setDescriptionInput(e.target.value)
    setSaved(false)

    updateListDebounce({
      description: e.target.value,
    })
  }

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
    <div className="flex flex-col h-full">
      <div className="w-full flex justify-end pt-4 pr-4">
        <span className="flex justify-center gap-1 items-center py-2 px-4 border border-primary rounded-full bg-primary-foreground">
          <Text>{saved ? 'Saved' : 'Saving'}</Text>
          {saved ? (
            <Check className="text-primary size-4" />
          ) : (
            <Spinner className="text-primary size-4" />
          )}
        </span>
      </div>
      <div className="flex h-full">
        <Section className="w-1/4" header={<Text variant="headerSecondary">Add Items</Text>}>
          <Input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search..."
          />
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
          <div className="flex flex-col gap-4">
            {listData ? (
              <div className="flex flex-col gap-2">
                <Input value={titleInput} onChange={onTitleChange} />
                <Text variant="secondary">{listData.description}</Text>
                <Text variant="secondary">{listData.privacy}</Text>
                <Text variant="secondary">{listData.createdAt}</Text>
              </div>
            ) : (
              <Text>Error finding list data</Text>
            )}
          </div>
        </Section>
      </div>
    </div>
  )
}

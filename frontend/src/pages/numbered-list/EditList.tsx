import type { UpdateListBody } from '@/api/list/types/body'
import ImageCard from '@/components/ImageCard'
import SearchList from '@/components/SearchList'
import { Section } from '@/components/Section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Text } from '@/components/ui/text'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useLists, useUpdateList } from '@/hooks/useList'
import { useAddItem, useListItems, useRemoveItem } from '@/hooks/useListItems'
import { useParams } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'

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
  const [privacyToggle, setPrivacyToggle] = useState<'private' | 'public'>(
    listData?.privacy || 'private',
  )
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

  const onDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    setDescriptionInput(e.target.value)
    setSaved(false)

    updateListDebounce({
      description: e.target.value,
    })
  }

  const togglePrivacy = () => {
    setPrivacyToggle((prev) => (prev === 'private' ? 'public' : 'private'))
  }

  const onPrivacyChange = async (privacy: 'private' | 'public' | '') => {
    if (privacy === '') return
    try {
      togglePrivacy()
      await updateListMutation.mutateAsync({ privacy })
    } catch (err) {
      // Toggle privacy back if update failed
      togglePrivacy()
      console.error('Failed to update list:', err)
    }
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

  const testListItems = {
    Cow: '/src/assets/animals/cow.jpg',
    Mammoth: '/src/assets/animals/mammoth.jpg',
    Elephant: '/src/assets/animals/elephant.jpg',
    Lobster: '/src/assets/animals/lobster.jpg',
    Horse: '/src/assets/animals/horse.jpg',
    Otter: '/src/assets/animals/otter.jpg',
  }
  return (
    <div className="flex flex-col h-full min-h-0 flex-1">
      <div className="w-full flex justify-between pt-4 px-4">
        <Input
          value={titleInput}
          onChange={onTitleChange}
          className="bg-none rounded-full focus-visible:bg-white hover:bg-white/60 border-2 focus-visible:ring-0 transition-colors duration-300 shadow-none text-2xl! h-full font-semibold text-indigo-900"
          placeholder="Add a Title..."
          autoSize
          maxWidth="50%"
        />
        <span className="flex justify-center gap-1 items-center py-2 px-4 border border-primary rounded-full bg-primary-foreground my-2">
          <Text>{saved ? 'Saved' : 'Saving'}</Text>
          {saved ? (
            <Check className="text-primary size-4" />
          ) : (
            <Spinner className="text-primary size-4" />
          )}
        </span>
      </div>
      <div className="flex h-full min-h-0 flex-1">
        <Section
          className="w-1/4 min-h-0"
          header={<Text variant="headerSecondary">Add Items</Text>}
        >
          <Input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search..."
          />
          <SearchList search={search} filterBy={Object.keys(testListItems)}>
            {(filteredList) =>
              filteredList.map((item) => (
                <ImageCard
                  key={item}
                  image={testListItems[item as keyof typeof testListItems]}
                  title={item}
                  onClick={() => addItem(item)}
                />
              ))
            }
          </SearchList>
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
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 shadow-lg">
                  <Text variant="secondary">Description</Text>
                  <Textarea value={descriptionInput} onChange={onDescriptionChange} />
                </div>
                <div className="flex justify-between items-center">
                  <Text variant="secondary">Privacy</Text>
                  <ToggleGroup
                    type="single"
                    value={privacyToggle}
                    onValueChange={(value: 'public' | 'private' | '') => onPrivacyChange(value)}
                  >
                    <ToggleGroupItem value="public">Public</ToggleGroupItem>
                    <ToggleGroupItem value="private">Private</ToggleGroupItem>
                  </ToggleGroup>
                </div>
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

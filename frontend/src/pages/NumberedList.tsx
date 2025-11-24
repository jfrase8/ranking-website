import SearchList from '@/components/SearchList'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useState } from 'react'

type Props = {}

export type ListItem = { name: string; rank: number }

export default function NumberedList({}: Props) {
  const [search, setSearch] = useState('')

  const [currentList, setCurrentList] = useState<ListItem[]>([])

  return (
    <div className="flex h-full">
      <div className="flex flex-col border border-black w-1/4 p-4 gap-4">
        <Text variant="header">Search for items to add to list</Text>
        <Input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search..."
        />
        <SearchList
          search={search}
          list={['Cow', 'Mammoth', 'Centipede', 'Lobster', 'Horse', 'Otter']}
          setList={setCurrentList}
        />
      </div>
      <div className="flex flex-col border border-black w-1/2 p-4">
        {currentList.map((item) => (
          <div>
            {item.rank}. {item.name}
          </div>
        ))}
      </div>
      <div className="flex flex-col border border-black w-1/4 p-4">
        Section 3 - List Details
      </div>
    </div>
  )
}

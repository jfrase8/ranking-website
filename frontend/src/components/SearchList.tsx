import type { ListItem } from '@/pages/NumberedList'
import { Button } from './ui/button'

type SearchListProps = {
  search: string
  list: string[]
  setList: React.Dispatch<React.SetStateAction<ListItem[]>>
}
export default function SearchList({ search, list, setList }: SearchListProps) {
  const filteredList = list.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase()),
  )

  const addToList = (item: string) => {
    setList((prev) => [...prev, { name: item, rank: prev.length + 1 }])
  }

  return (
    <div className="flex flex-col gap-1">
      {filteredList.map((item) => (
        <Button onClick={() => addToList(item)}>{item}</Button>
      ))}
    </div>
  )
}

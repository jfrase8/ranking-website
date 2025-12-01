import { Button } from './ui/button'

type SearchListProps = {
  search: string
  list: string[]
  onClick: (item: string) => void
}
export default function SearchList({ search, list, onClick }: SearchListProps) {
  const filteredList = list.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-1">
      {filteredList.map((item) => (
        <Button onClick={() => onClick(item)}>{item}</Button>
      ))}
    </div>
  )
}

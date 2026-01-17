import type { VariantProps } from 'class-variance-authority'
import { Button, buttonVariants } from './ui/button'

type SearchListProps = {
  search: string
  list: string[]
  buttonVariant: VariantProps<typeof buttonVariants>['variant']
  onClick: (item: string) => void
}
export default function SearchList({ search, list, buttonVariant, onClick }: SearchListProps) {
  const filteredList = list.filter((item) => item.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex flex-col gap-1">
      {filteredList.map((item) => (
        <Button key={item} onClick={() => onClick(item)} variant={buttonVariant}>
          {item}
        </Button>
      ))}
    </div>
  )
}

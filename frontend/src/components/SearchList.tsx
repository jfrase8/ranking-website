import clsx from 'clsx'

type SearchListProps = {
  search: string
  filterBy: string[]
  children: (filteredList: string[]) => React.ReactNode
  className?: string
}

export default function SearchList({ search, filterBy, className, children }: SearchListProps) {
  const filteredList = filterBy.filter((name) => name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div
      className={clsx('flex flex-col gap-2 overflow-y-auto px-3 py-1 min-h-0 flex-1', className)}
    >
      {children(filteredList)}
    </div>
  )
}

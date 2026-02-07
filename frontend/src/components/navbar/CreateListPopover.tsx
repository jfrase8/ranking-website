import { ListTypeEnum } from '@/types/enums/ListTypeEnum'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { type Dispatch, type SetStateAction } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { capitalize } from '@/utils/capitalize'
import { NavButton } from './NavButton'

type CreateListPopoverProps = {
  setActiveModal: Dispatch<SetStateAction<ListTypeEnum | 'login' | null>>
  setIsOpen: Dispatch<SetStateAction<boolean>>
  setModalToOpen: Dispatch<SetStateAction<ListTypeEnum | null>>
  setLoginModalText: Dispatch<SetStateAction<string>>
}
export default function CreateListPopover({
  setActiveModal,
  setIsOpen,
  setModalToOpen,
  setLoginModalText,
}: CreateListPopoverProps) {
  const { user } = useAuthStore()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <NavButton>Create List</NavButton>
      </PopoverTrigger>
      <PopoverContent className="size-fit flex flex-col p-0">
        {Object.values(ListTypeEnum).map((type, i) => (
          <Button
            key={type}
            size="sm"
            className={
              i === 0
                ? 'rounded-b-none'
                : i === Object.values(ListTypeEnum).length - 1
                  ? 'rounded-t-none'
                  : undefined
            }
            onClick={() => {
              // Check if user is logged in
              if (!user) {
                // Open modal telling user to log in
                setActiveModal('login')
                setModalToOpen(type) // This state is set so the right modal will open after logging in
                setLoginModalText('You must sign in to create a list.')
                setIsOpen(true)
                return
              }
              setActiveModal(type)
              setIsOpen(true)
            }}
          >
            {`${capitalize(type)} List`}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

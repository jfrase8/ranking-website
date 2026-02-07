import { useAuthStore } from '@/stores/useAuthStore'
import { NavButton } from './NavButton'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Text } from '../ui/text'
import { Button } from '../ui/button'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export default function ProfilePopover() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [open, setOpen] = useState(false)

  if (!user) return

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <NavButton className="p-3">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              referrerPolicy="no-referrer"
              alt="Profile"
              className="size-10 rounded-full"
            />
          ) : (
            user.userName
          )}
        </NavButton>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col justify-center items-center size-fit gap-2 bg-indigo-500">
        <Text variant="headerSecondary">{user.userName}</Text>
        <Button
          variant="ghostPrimary"
          className="hover:bg-indigo-400"
          onClick={() => {
            setOpen(false)
            navigate({ to: '/ranking/profile' })
          }}
        >
          My Lists
        </Button>
      </PopoverContent>
    </Popover>
  )
}

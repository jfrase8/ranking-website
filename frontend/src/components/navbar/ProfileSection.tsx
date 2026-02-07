import { useAuthStore } from '@/stores/useAuthStore'
import NavButton from './NavButton'
import { LogOut } from 'lucide-react'

export default function ProfileSection() {
  const { user } = useAuthStore()
  if (!user) return
  return (
    <>
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
      {/* Logout */}
      <NavButton className="p-3">
        <LogOut />
      </NavButton>
    </>
  )
}

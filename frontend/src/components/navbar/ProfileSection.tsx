import { NavButton } from './NavButton'
import { LogOut } from 'lucide-react'
import ProfilePopover from './ProfilePopover'

export default function ProfileSection() {
  return (
    <>
      <ProfilePopover />
      {/* Logout */}
      <NavButton className="p-3">
        <LogOut />
      </NavButton>
    </>
  )
}

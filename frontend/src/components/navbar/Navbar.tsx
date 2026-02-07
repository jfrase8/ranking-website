import { CreateListModals } from '@/constants/navbar/CreateListModals'
import { ListTypeEnum } from '@/types/enums/ListTypeEnum'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Login } from '../Login'
import { useAuthStore } from '@/stores/useAuthStore'
import LoginModal from '../modals/LoginModal'
import FireIcon from '@/assets/svg/fire.svg?react'
import NavButton from './NavButton'
import CreateListPopover from './CreateListPopover'
import ProfileSection from './ProfileSection'

export default function Navbar() {
  const [activeModal, setActiveModal] = useState<ListTypeEnum | 'login' | null>(null)
  const [loginModalText, setLoginModalText] = useState<string>('')
  const [modalToOpen, setModalToOpen] = useState<ListTypeEnum | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const Modal =
    activeModal && (activeModal === 'login' ? LoginModal : CreateListModals[activeModal])

  const navigate = useNavigate()

  const { user } = useAuthStore()

  // This function will be called when the user finishes signing in from the login modal
  const handleRedirection = () => {
    if (modalToOpen) {
      setActiveModal(modalToOpen)
      setIsOpen(true)
    } else {
      // Redirect to page
    }
  }

  return (
    <nav className="flex h-16 items-center justify-between bg-linear-to-r from-indigo-950 to-indigo-800 shadow-lg">
      {/* Left Side */}
      <div className="flex items-center size-full">
        {/* Home */}
        <NavButton onClick={() => navigate({ to: '/' })} className="group">
          <FireIcon className="size-6 group-hover:size-7 transition-all duration-300 text-primary-foreground" />
        </NavButton>
        {/* Create */}
        <CreateListPopover
          setActiveModal={setActiveModal}
          setIsOpen={setIsOpen}
          setModalToOpen={setModalToOpen}
          setLoginModalText={setLoginModalText}
        />
        <NavButton>View Lists</NavButton>
        <NavButton>Global Rankings</NavButton>
        {/* Login */}
        {!user && (
          <div className="ml-2">
            <Login />
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center size-full justify-end">
        {/* Profile */}
        <ProfileSection />
      </div>

      {Modal && (
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          text={loginModalText}
          onLogin={handleRedirection}
        />
      )}
    </nav>
  )
}

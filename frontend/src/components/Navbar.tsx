import clsx from 'clsx'
import { Button } from './ui/button'
import { useNavigate } from '@tanstack/react-router'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { ListTypeEnum } from '@/types/enums/ListTypeEnum'
import React, { useState } from 'react'
import CreateNumberedListModal from './numbered-list/CreateNumberedListModal'

type PopoverItem = {
  label: string
  Modal: React.ComponentType<{ isOpen: boolean; setIsOpen: (open: boolean) => void }>
}
type NavItem = {
  label: string
  popover?: Record<ListTypeEnum, PopoverItem>
  onClick?: () => void
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [ActiveModal, setActiveModal] = useState<React.ComponentType<{
    isOpen: boolean
    setIsOpen: (open: boolean) => void
  }> | null>(null)

  const navItems = {
    left: {
      create: {
        label: 'Create List',
        popover: {
          [ListTypeEnum.NUMBERED]: {
            label: 'Numbered List',
            Modal: CreateNumberedListModal,
          },
          [ListTypeEnum.TIERED]: {
            label: 'Tier List',
            Modal: CreateNumberedListModal,
          },
        },
      },
      view: {
        label: 'View Lists',
      },
      global: {
        label: 'Global Rankings',
      },
    } as Record<string, NavItem>,
    right: {
      login: {
        label: 'Create Account/Login',
      },
      profile: {
        label: 'Profile',
      },
      settings: {
        label: 'Settings',
      },
      logout: {
        label: 'Logout',
      },
    } as Record<string, NavItem>,
  }

  const navigate = useNavigate()

  return (
    <nav className="flex h-16 items-center justify-between bg-linear-to-r from-indigo-950 to-indigo-800 shadow-lg">
      {Object.entries(navItems).map(([position, tabs], i) => (
        <div
          className={clsx('flex items-center size-full', position === 'right' && 'justify-end')}
          key={position}
        >
          {/* Home Button */}
          {i === 0 && position === 'left' && (
            <Button
              key="home"
              variant="ghost"
              fitParent
              onClick={() => navigate({ to: '/' })}
              className="w-fit px-4 group"
            >
              {/* TODO: Change to SVGR */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 group-hover:size-7 transition-all duration-300 text-primary-foreground"
              >
                <path
                  fillRule="evenodd"
                  d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          )}
          {Object.values(tabs).map(({ label, popover, onClick }) => {
            const button = (
              <Button fitParent variant="ghost" className="w-fit px-4" onClick={onClick}>
                {label}
              </Button>
            )
            if (popover) {
              return (
                <Popover key={label}>
                  <PopoverTrigger asChild>{button}</PopoverTrigger>
                  <PopoverContent className="size-fit flex flex-col p-0">
                    {Object.values(popover).map(({ label, Modal }, i) => (
                      <Button
                        key={label}
                        size="sm"
                        className={
                          i === 0
                            ? 'rounded-b-none'
                            : i === Object.values(popover).length - 1
                              ? 'rounded-t-none'
                              : undefined
                        }
                        onClick={() => {
                          setActiveModal(() => Modal)
                          setIsOpen(true)
                        }}
                      >
                        {label}
                      </Button>
                    ))}
                  </PopoverContent>
                </Popover>
              )
            }
            return button
          })}
        </div>
      ))}
      {ActiveModal && (
        <ActiveModal isOpen={true} setIsOpen={(open) => !open && setActiveModal(null)} />
      )}
    </nav>
  )
}

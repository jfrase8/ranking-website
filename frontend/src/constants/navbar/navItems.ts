import { useAuthStore } from '@/stores/useAuthStore'
import { ListTypeEnum } from '@/types/enums/ListTypeEnum'

type PopoverItem = {
  label: string
}
type NavItem = {
  label: string
  popover?: Record<ListTypeEnum, PopoverItem>
  onClick?: () => void
}

export const NavItems = {
  left: {
    create: {
      label: 'Create List',
      popover: {
        [ListTypeEnum.NUMBERED]: {
          label: 'Numbered List',
        },
        [ListTypeEnum.TIERED]: {
          label: 'Tier List',
        },
      },
    },
    view: {
      label: 'View Lists',
    },
    global: {
      label: 'Global Rankings',
    },
    login: {
      label: 'Login',
    },
  } as Record<string, NavItem>,
  right: {
    profile: {
      label: 'Profile',
    },
    logout: {
      label: 'Logout',
      onClick: () => {
        useAuthStore.getState().logout()
        window.location.reload()
      },
    },
  } as Record<string, NavItem>,
}

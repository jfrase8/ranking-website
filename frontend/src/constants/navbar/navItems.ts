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

import clsx from 'clsx'
import { Button } from '../ui/button'
import { forwardRef, type ReactNode } from 'react'

type NavButtonProps = {
  className?: string
  onClick?: () => void
  children?: ReactNode
}
export const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ className, onClick, children }, ref) => {
    return (
      <Button
        fitParent
        variant="ghostPrimary"
        className={clsx('w-fit px-4', className)}
        onClick={onClick}
        ref={ref}
      >
        {children}
      </Button>
    )
  },
)

import clsx from 'clsx'
import { Button } from '../ui/button'

type NavButtonProps = {
  className?: string
  onClick?: () => void
  children?: React.ReactNode
}
export default function NavButton({ className, onClick, children }: NavButtonProps) {
  return (
    <Button fitParent variant="ghost" className={clsx('w-fit px-4', className)} onClick={onClick}>
      {children}
    </Button>
  )
}

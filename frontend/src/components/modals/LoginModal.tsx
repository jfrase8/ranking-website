import { DialogTitle } from '@radix-ui/react-dialog'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'
import { Login } from '../Login'
import { Text } from '../ui/text'

type LoginModalProps = {
  text: string
  onLogin?: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export default function LoginModal({ text, onLogin, isOpen, setIsOpen }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="mb-8">
          <div className="flex justify-center">
            <DialogTitle>
              <Text variant="headerPrimary">{text}</Text>
            </DialogTitle>
          </div>
        </DialogHeader>
        <Login
          onSuccess={() => {
            setIsOpen(false)
            onLogin?.()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

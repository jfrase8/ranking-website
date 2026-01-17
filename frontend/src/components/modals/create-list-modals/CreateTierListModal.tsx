import { Controller, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Text } from '@/components/ui/text'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCreateList } from '@/hooks/useList'
import { PrivacyEnum } from '@/types/enums/PrivacyEnum'

type Inputs = {
  listName: string
  description: string
  privacy: PrivacyEnum
}

interface CreateTierListModalProps {
  isOpen: boolean
  setIsOpen: (oepn: boolean) => void
}
export default function CreateTierListModal({ isOpen, setIsOpen }: CreateTierListModalProps) {
  const { handleSubmit, register, control } = useForm<Inputs>({
    defaultValues: {
      privacy: PrivacyEnum.PRIVATE,
    },
  })

  const { mutateAsync } = useCreateList()

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      await mutateAsync({
        name: data.listName,
        description: data.description,
        privacy: data.privacy,
        userId: '123',
      })
    } catch (err) {
      console.error('Failed to create list:', err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} aria-describedby={undefined}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <div className="flex justify-center">
              <DialogTitle>
                <Text variant="headerPrimary">Create a Tier List</Text>
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="flex flex-col gap-8">
            <div className="flex gap-1">
              <Label htmlFor="listName" className="w-[25%]">
                List Name:
              </Label>
              <Input
                type="text"
                id="listName"
                placeholder="Enter list name..."
                className="w-[75%] h-fit"
                {...register('listName')}
              />
            </div>
            <div className="flex gap-1">
              <Label htmlFor="description" className="w-[25%] h-fit">
                Description:
              </Label>
              <Textarea
                id="description"
                placeholder="Enter description..."
                {...register('description')}
                className="w-[75%]"
              />
            </div>
            <div className="flex gap-1">
              <Label htmlFor="privacy" className="w-[25%] h-fit">
                Set List Privacy:
              </Label>
              <Controller
                control={control}
                name="privacy"
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="w-[75%]"
                  >
                    <div className="flex gap-1">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">public</Label>
                    </div>
                    <div className="flex gap-1">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private">private</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex justify-between w-full">
              <Button onClick={() => setIsOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button type="submit" onClick={() => setIsOpen(false)}>
                Create
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

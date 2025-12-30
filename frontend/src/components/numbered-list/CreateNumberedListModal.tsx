import { Controller, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Text } from '@/components/ui/text'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type Inputs = {
  listName: string
  description: string
  privacy: string
}

interface CreateNumberedListModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}
export default function CreateNumberedListModal({
  isOpen,
  setIsOpen,
}: CreateNumberedListModalProps) {
  const { handleSubmit, register, control } = useForm<Inputs>({
    defaultValues: {
      privacy: 'public',
    },
  })

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    console.log(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <div className="flex justify-center">
              <Text variant="header">Create a Numbered List</Text>
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
                className="w-[75%]"
                {...register('description')}
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

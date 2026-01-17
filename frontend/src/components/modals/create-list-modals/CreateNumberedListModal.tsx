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
import { useNavigate } from '@tanstack/react-router'

type Inputs = {
  listName: string
  description: string
  privacy: PrivacyEnum
}

interface CreateNumberedListModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export default function CreateNumberedListModal({
  isOpen,
  setIsOpen,
}: CreateNumberedListModalProps) {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      privacy: PrivacyEnum.PRIVATE,
    },
  })

  const { mutateAsync, isPending } = useCreateList()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      const { id } = await mutateAsync({
        name: data.listName,
        description: data.description,
        privacy: data.privacy,
        userId: '123',
      })
      setIsOpen(false)
      navigate({ to: `/ranking/numbered-list/${id}` })
    } catch (err) {
      console.error('Failed to create list:', err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} aria-describedby={undefined}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="mb-8">
            <div className="flex justify-center">
              <DialogTitle>
                <Text variant="headerPrimary">Create a Numbered List</Text>
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="flex flex-col gap-8">
            <div className="flex gap-1 items-start">
              <Label htmlFor="listName" className="w-[20%] pt-2">
                List Name:
              </Label>
              <div className="w-[80%] flex flex-col gap-1">
                <Input
                  type="text"
                  id="listName"
                  placeholder="Enter list name..."
                  className="h-fit"
                  aria-invalid={!!errors.listName}
                  {...register('listName', {
                    required: '*List name is required',
                    minLength: {
                      value: 1,
                      message: 'List name cannot be empty',
                    },
                  })}
                />
                <div className="h-fit">
                  {errors.listName && (
                    <Text variant="error" className="text-sm">
                      {errors.listName.message}
                    </Text>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Label htmlFor="description" className="w-[20%] h-fit">
                Description:
              </Label>
              <Textarea
                id="description"
                placeholder="Enter description..."
                {...register('description')}
                className="w-[80%]"
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
                    <div className="flex gap-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">Public</Label>
                    </div>
                    <div className="flex gap-2">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private">Private</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <div className="flex justify-between w-full">
              <Button onClick={() => setIsOpen(false)} variant="outline" color="gray" type="button">
                Cancel
              </Button>
              <Button type="submit" isLoading={isPending}>
                Create
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

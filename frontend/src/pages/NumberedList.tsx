import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Text } from '@/components/ui/text'
import { useLists } from '@/hooks/useList'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function NumberedList() {
  const userId = '123'
  const { data: listData, error: listDataError, isLoading: isListDataLoading } = useLists(userId)

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex h-full">
      <div className="flex justify-center items-center w-[50%] h-full">
        <Button onClick={() => setIsOpen(true)}>Create New Numbered List</Button>
      </div>
      <div className="flex justify-center w-[50%] h-full">
        <div className="flex flex-col gap-4"></div>
        <Text variant="header">Recent Lists</Text>
        <div className="flex flex-col gap-1">
          {listData && listData.map((list) => <Button key={list.id}>{list.name}</Button>)}
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent showCloseButton={false}>
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
              />
            </div>
            <div className="flex gap-1">
              <Label htmlFor="description" className="w-[25%] h-fit">
                Description:
              </Label>
              <Textarea id="description" placeholder="Enter description..." className="w-[75%]" />
            </div>
            <div className="flex gap-1">
              <Label htmlFor="privacy" className="w-[25%] h-fit">
                Set List Privacy:
              </Label>
              <RadioGroup defaultValue="public">
                <div className="flex gap-1">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public">public</Label>
                </div>
                <div className="flex gap-1">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private">private</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <div className="flex justify-between w-full">
              <Button onClick={() => setIsOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Create</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

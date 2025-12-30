import { createFileRoute, Link } from '@tanstack/react-router'
import Plus from '@/assets/Plus.svg?react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/ranking/tier-list/')({
  component: TierListHome,
})

function TierListHome() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <AddTierListModal open={open} setOpen={setOpen} />
      <div className="grid grid-cols-4 gap-8">
        {images.map((image, index) => (
          <TierListCard key={image} id={index} image={image} />
        ))}
        <button
          onClick={() => setOpen(true)}
          className="border border-green-500 rounded-lg p-4 max-h-80 aspect-[0.833] object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
        >
          <Plus className="size-full text-green-500" />
        </button>
      </div>
    </>
  )
}

function TierListCard({ id, image }: { id: number; image: string }) {
  return (
    <Link
      to="/ranking/tier-list/$id"
      params={{ id: id.toString() }}
      className="bg-green-500 rounded-lg p-4 max-h-80 aspect-[0.833] object-cover transition-transform duration-300 hover:scale-105"
    >
      <img src={`/src/assets/${image}`} alt={image} className="w-full h-full object-cover" />
    </Link>
  )
}

const images = [
  'GolemCard.png',
  'MegaKnight.png',
  'BabyDragonCard.png',
  'BarbariansCard.png',
  'BomberCard.png',
  'DarkPrinceCard.png',
  'ElixirGolemCard.png',
  'MinerCard.png',
  'PEKKACard.png',
  'RagingPrinceCard.png',
  'SkeletonsCard.png',
]

type Inputs = {
  name: string
}

function AddTierListModal({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const { handleSubmit, register } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create new tier list</DialogTitle>
            <DialogDescription>This will create a new tier list.</DialogDescription>
          </DialogHeader>
          <Label htmlFor="name">Title</Label>
          <Input id="name" type="text" placeholder="Tier list name" {...register('name')} />
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

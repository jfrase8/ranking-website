import { createFileRoute, Link } from '@tanstack/react-router'
import Plus from '@/assets/Plus.svg?react'

export const Route = createFileRoute('/ranking/tier-list/')({
  component: TierListHome,
})

function TierListHome() {
  return (
    <div className="grid grid-cols-4 gap-8">
      {images.map((image, index) => (
        <TierListCard key={image} id={index} image={image} />
      ))}
      <button className="border border-green-500 rounded-lg p-4 max-h-80 aspect-[0.833] object-cover transition-transform duration-300 hover:scale-105 cursor-pointer">
        <Plus className="size-full text-green-500" />
      </button>
    </div>
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

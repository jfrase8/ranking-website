import clsx from 'clsx'
import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from '@dnd-kit/core'

type Props = {}

export default function TierList({}: Props) {
  const handleDragEnd = (event: DragEndEvent) => {
    console.log(event)
  }
  return (
    <div className="flex flex-col gap-12">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="p-12">
          {tiers.map((tier) => (
            <TierRow key={tier} tier={tier} />
          ))}
        </div>
        <div className="px-12 grid grid-cols-12">
          {Array.from({ length: 3 }).map((_, index) => (
            <DraggableTile id={index.toString()} key={index} />
          ))}
        </div>
      </DndContext>
    </div>
  )
}

function TierRow({ tier }: { tier: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable-' + tier,
  })
  const style = {
    color: isOver ? 'green' : undefined,
  }
  return (
    <div
      className="flex min-h-20 border-b border-foreground"
      ref={setNodeRef}
      style={style}
    >
      <div
        className={clsx(
          'w-24 flex items-center justify-center text-2xl font-bold',
          tierColors[tier],
        )}
      >
        {tier}
      </div>
      <div className="flex-1 bg-secondary border-l border-foreground">
        SOMETHING SOMETHING
      </div>
      <div className="w-24 bg-secondary border-l border-foreground p-4">
        UP/DOWN
      </div>
    </div>
  )
}

const tiers = ['S', 'A', 'B', 'C', 'D', 'E', 'F']

const tierColors: Record<string, string> = {
  S: 'bg-red-500',
  A: 'bg-orange-500',
  B: 'bg-yellow-500',
  C: 'bg-green-500',
  D: 'bg-blue-500',
  E: 'bg-indigo-500',
  F: 'bg-purple-500',
}

const icons = ['🔥', '🔥', '🔥', '🔥', '🔥', '🔥', '🔥', '🔥', '🔥', '']

function DraggableTile({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable-' + id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-red-500 rounded-lg"
    >
      <img
        src="/src/assets/GolemCard.png"
        alt="Golem"
        className="size-full object-cover"
      />
    </button>
  )
}

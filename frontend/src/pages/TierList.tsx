import clsx from 'clsx'
import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Draggable = {
  id: string
  src: string
  dz: string | null
}

type DropZone = {
  id: string
  title: string
  items: string[]
}

export default function TierList() {
  const defaultDraggables = useMemo(
    () => [
      { id: crypto.randomUUID(), src: 'GolemCard.png', dz: null },
      { id: crypto.randomUUID(), src: 'MegaKnight.png', dz: null },
      { id: crypto.randomUUID(), src: 'BabyDragonCard.png', dz: null },
    ],
    [],
  )

  const defaultDropZones = useMemo(
    () => [
      { id: crypto.randomUUID(), title: 'S', items: [] },
      { id: crypto.randomUUID(), title: 'A', items: [] },
      { id: crypto.randomUUID(), title: 'B', items: [] },
      { id: crypto.randomUUID(), title: 'C', items: [] },
      { id: crypto.randomUUID(), title: 'D', items: [] },
      { id: crypto.randomUUID(), title: 'E', items: [] },
      { id: crypto.randomUUID(), title: 'F', items: [] },
    ],
    [],
  )

  // State for ALL draggables
  const [draggables, setDraggables] = useState<Draggable[]>(defaultDraggables)

  // State for ALL drop zones
  const [dropZones, setDropZones] = useState<DropZone[]>(defaultDropZones)

  const handleDragEnd = (event: DragEndEvent) => {
    // Find which tier we're hovering over
    if (!event.over?.id) return
    const dropZoneOver = String(event.over.id)

    // ID of the draggable we're dragging
    const draggableId = String(event.active.id)

    // Update dropZones
    setDropZones((prev) =>
      prev.map((dz) =>
        dz.id === dropZoneOver
          ? {
              ...dz,
              items: [
                ...dz.items.filter((item) => item !== draggableId),
                draggableId,
              ],
            } // If this is the draggable we're over, add this draggable to it
          : dz.items.find((item) => item === draggableId) // if draggable was already in a drop zone, remove it from the old one
            ? { ...dz, items: dz.items.filter((item) => item !== draggableId) }
            : dz,
      ),
    )

    // Update draggables
    setDraggables((prev) =>
      prev.map((d) => (d.id === draggableId ? { ...d, dz: dropZoneOver } : d)),
    )
  }

  return (
    <div className="flex flex-col gap-12">
      <Button
        onClick={() => {
          setDraggables(defaultDraggables)
          setDropZones(defaultDropZones)
        }}
      >
        Reset
      </Button>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="p-12">
          {dropZones.map((tier) => (
            <TierRow key={tier.id} tier={tier} draggables={draggables} />
          ))}
        </div>
        <div className="px-12 grid grid-cols-12">
          {draggables
            .filter((draggable) => draggable.dz === null)
            .map(({ id, src }) => (
              <DraggableTile id={id} key={id} src={src} />
            ))}
        </div>
      </DndContext>
    </div>
  )
}

function TierRow({
  tier,
  draggables,
}: {
  tier: DropZone
  draggables: Draggable[]
}) {
  const { id, title, items } = tier
  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  return (
    <div className="flex min-h-20 border-b border-foreground" ref={setNodeRef}>
      <div
        className={clsx(
          'w-24 flex items-center justify-center text-2xl font-bold',
          tierColors[title],
        )}
      >
        {title}
      </div>
      <div
        className={cn(
          'flex flex-1 bg-secondary border-l border-foreground',
          isOver ? 'bg-accent/50' : undefined,
        )}
      >
        {items.map((item) => {
          const draggable = draggables.find((d) => d.id === item)
          if (!draggable) return null
          return (
            <DraggableTile
              id={draggable.id}
              key={draggable.id}
              src={draggable.src}
            />
          )
        })}
      </div>
      <div className="w-24 bg-secondary border-l border-foreground p-4">
        UP/DOWN
      </div>
    </div>
  )
}

const tierColors: Record<string, string> = {
  S: 'bg-red-500',
  A: 'bg-orange-500',
  B: 'bg-yellow-500',
  C: 'bg-green-500',
  D: 'bg-blue-500',
  E: 'bg-indigo-500',
  F: 'bg-purple-500',
}

function DraggableTile({ id, src }: { id: string; src: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
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
      className="rounded-lg max-h-30 aspect-[0.833] cursor-pointer"
    >
      <img
        src={`/src/assets/${src}`}
        alt="Golem"
        className="size-full object-cover"
      />
    </button>
  )
}

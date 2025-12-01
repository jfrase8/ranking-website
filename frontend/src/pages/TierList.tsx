import clsx from 'clsx'
import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragOverEvent,
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
      { id: crypto.randomUUID(), src: 'BarbariansCard.png', dz: null },
      { id: crypto.randomUUID(), src: 'BomberCard.png', dz: null },
      { id: crypto.randomUUID(), src: 'DarkPrinceCard.png', dz: null },
      { id: crypto.randomUUID(), src: 'ElixirGolemCard.png', dz: null },
      { id: crypto.randomUUID(), src: 'MinerCard.png', dz: null },
      { id: crypto.randomUUID(), src: 'PEKKACard.png', dz: null },
      { id: crypto.randomUUID(), src: 'RagingPrinceCard.png', dz: null },
      { id: crypto.randomUUID(), src: 'SkeletonsCard.png', dz: null },
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

  // Track the current drag over position for reordering
  const [dragOverPosition, setDragOverPosition] = useState<{
    tierId: string
    index: number
  } | null>(null)

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over?.id) {
      setDragOverPosition(null)
      return
    }

    const overId = String(event.over.id)

    // Check if we're over a position-based drop zone (format: tier-${tierId}-pos-${index})
    const positionMatch = overId.match(/^tier-(.+)-pos-(\d+)$/)
    if (positionMatch) {
      const [, tierId, indexStr] = positionMatch
      setDragOverPosition({ tierId, index: parseInt(indexStr, 10) })
      return
    }

    // Check if we're over a tier row itself
    const tierMatch = dropZones.find((dz) => dz.id === overId)
    if (tierMatch) {
      // If tier is empty or we're at the end, set position to the end
      setDragOverPosition({
        tierId: tierMatch.id,
        index: tierMatch.items.length,
      })
      return
    }

    setDragOverPosition(null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    // Find which tier we're hovering over
    if (!event.over?.id) {
      setDragOverPosition(null)
      return
    }

    const overId = String(event.over.id)
    const draggableId = String(event.active.id)

    let targetTierId: string | null = null
    let insertIndex: number | null = null

    // Check if we're over a position-based drop zone
    const positionMatch = overId.match(/^tier-(.+)-pos-(\d+)$/)
    if (positionMatch) {
      const [, tierId, indexStr] = positionMatch
      targetTierId = tierId
      insertIndex = parseInt(indexStr, 10)
    } else {
      // Check if we're over a tier row itself
      const tier = dropZones.find((dz) => dz.id === overId)
      if (tier) {
        targetTierId = tier.id
        insertIndex = tier.items.length
      } else {
        setDragOverPosition(null)
        return
      }
    }

    if (!targetTierId || insertIndex === null) {
      setDragOverPosition(null)
      return
    }

    // Find the source tier (where the draggable currently is)
    const sourceTier = dropZones.find((dz) => dz.items.includes(draggableId))
    const sourceIndex = sourceTier?.items.indexOf(draggableId) ?? -1

    // Update dropZones
    setDropZones((prev) =>
      prev.map((dz) => {
        if (dz.id === targetTierId) {
          // Target tier: insert at the specified position
          const itemsWithoutDraggable = dz.items.filter(
            (item) => item !== draggableId,
          )

          // Adjust insert index if we're moving within the same tier
          let adjustedIndex = insertIndex
          if (
            sourceTier?.id === targetTierId &&
            sourceIndex !== -1 &&
            sourceIndex < insertIndex
          ) {
            adjustedIndex = insertIndex - 1
          }

          const newItems = [
            ...itemsWithoutDraggable.slice(0, adjustedIndex),
            draggableId,
            ...itemsWithoutDraggable.slice(adjustedIndex),
          ]

          return {
            ...dz,
            items: newItems,
          }
        } else if (dz.id === sourceTier?.id && dz.id !== targetTierId) {
          // Source tier (different from target): remove the draggable
          return {
            ...dz,
            items: dz.items.filter((item) => item !== draggableId),
          }
        }
        return dz
      }),
    )

    // Update draggables
    setDraggables((prev) =>
      prev.map((d) => (d.id === draggableId ? { ...d, dz: targetTierId } : d)),
    )

    setDragOverPosition(null)
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
      <DndContext onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="p-12">
          {dropZones.map((tier) => (
            <TierRow
              key={tier.id}
              tier={tier}
              draggables={draggables}
              dragOverPosition={dragOverPosition}
            />
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
  dragOverPosition,
}: {
  tier: DropZone
  draggables: Draggable[]
  dragOverPosition: { tierId: string; index: number } | null
}) {
  const { id, title, items } = tier
  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  const isThisTierActive =
    dragOverPosition?.tierId === id && dragOverPosition !== null

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
          isOver && !isThisTierActive ? 'bg-accent/50' : undefined,
        )}
      >
        {/* Drop zone at the start of the list */}
        <PositionDropZone
          positionId={`tier-${id}-pos-0`}
          isActive={isThisTierActive && dragOverPosition.index === 0}
        />
        {/* Render items with drop zones between them */}
        {items.map((item, index) => {
          const draggable = draggables.find((d) => d.id === item)
          if (!draggable) return null

          return (
            <div key={draggable.id} className="flex items-center">
              <DraggableTile id={draggable.id} src={draggable.src} />
              {/* Drop zone after this item */}
              <PositionDropZone
                positionId={`tier-${id}-pos-${index + 1}`}
                isActive={
                  isThisTierActive && dragOverPosition.index === index + 1
                }
              />
            </div>
          )
        })}
      </div>
      <div className="w-24 bg-secondary border-l border-foreground p-4">
        UP/DOWN
      </div>
    </div>
  )
}

function PositionDropZone({
  positionId,
  isActive,
}: {
  positionId: string
  isActive: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: positionId,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'w-3 min-w-3 h-full transition-all shrink-0 flex items-center justify-center',
        isActive || isOver ? 'bg-primary/50' : 'bg-transparent',
      )}
    >
      {(isActive || isOver) && (
        <div className="w-full h-1 bg-primary rounded-full" />
      )}
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

import clsx from 'clsx'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'

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

//#region Tier List
export default function TierList() {
  const defaultDraggables = useMemo(
    () => [
      { id: 8, src: 'GolemCard.png', dz: 2 },
      { id: 9, src: 'MegaKnight.png', dz: 4 },
      { id: 10, src: 'BabyDragonCard.png', dz: 5 },
      { id: 11, src: 'BarbariansCard.png', dz: 4 },
      { id: 12, src: 'BomberCard.png', dz: 4 },
      { id: 13, src: 'DarkPrinceCard.png', dz: 2 },
      { id: 14, src: 'ElixirGolemCard.png', dz: 7 },
      { id: 15, src: 'MinerCard.png', dz: 6 },
      { id: 16, src: 'PEKKACard.png', dz: 1 },
      { id: 17, src: 'RagingPrinceCard.png', dz: 3 },
      { id: 18, src: 'SkeletonsCard.png', dz: 6 },
    ],
    [],
  )

  const defaultDropZones = useMemo(
    () => [
      { id: 1, title: 'S', items: [16] },
      { id: 2, title: 'A', items: [8, 13] },
      { id: 3, title: 'B', items: [17] },
      { id: 4, title: 'C', items: [9, 11, 12] },
      { id: 5, title: 'D', items: [10] },
      { id: 6, title: 'E', items: [15, 18] },
      { id: 7, title: 'F', items: [14] },
    ],
    [],
  )

  const [activeDraggable, setActiveDraggable] = useState<Draggable | null>(null)

  // State for ALL draggables
  const [draggables, setDraggables] = useState<Draggable[]>(defaultDraggables)

  // State for ALL drop zones
  const [dropZones, setDropZones] = useState<DropZone[]>(defaultDropZones)

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeDraggable = draggables?.find((d) => d.id === active.id) ?? null
    setActiveDraggable(activeDraggable)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeId = active.id
    const overId = over.id

    const activeDraggable = draggables.find((d) => d.id === activeId)
    const overDraggable = draggables.find((d) => d.id === overId)

    const activeDropZoneId = activeDraggable?.dz

    // Are we over a drop zone?
    const isOverDropZone = dropZones.find((dz) => dz.id === overId)

    const overDropZoneId = isOverDropZone ? isOverDropZone.id : overDraggable?.dz

    console.log({ overDropZoneId, activeDropZoneId })
    // Only handle cross-zone movement here
    if (!overDropZoneId || activeDropZoneId === overDropZoneId) return

    // Move item between drop zones in real-time
    setDraggables((prev) =>
      prev.map((d) => (d.id === activeId ? { ...d, dz: overDropZoneId! } : d)),
    )

    setDropZones((prev) =>
      prev.map((dz) => {
        const newIndex = dz.items.findIndex((item) => item === overId)

        // Remove from old drop zone
        if (dz.id === activeDropZoneId) {
          console.log('brothsdsder')
          return { ...dz, items: dz.items.filter((item) => item !== activeId) }
        }

        // Add to new drop zone
        if (dz.id === overDropZoneId && newIndex !== -1) {
          const newItems = [...dz.items]
          newItems.splice(newIndex, 0, activeId)
          console.log('brothe2222r')
          return { ...dz, items: newItems }
        }

        console.log('brother')
        return dz
      }),
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || !event?.over?.id || active.id === over.id) return setActiveDraggable(null)

    const activeId = event.active.id as string
    const overId = event.over.id as string

    const activeDraggable = draggables.find((d) => d.id === activeId)
    const draggableOver = draggables.find((dz) => dz.id === overId)

    // The draggable's old drop zone ID before it was moved
    const oldDropZoneId = activeDraggable?.dz

    // Are we over a drop zone?
    const isOverDropZone = dropZones.some((dz) => dz.id === overId)

    // Find the drop zone we're over
    // If we're hovering a drop zone, use that ID, otherwise use the OVER draggable's drop zone ID
    const dropZoneOver = dropZones.find(
      (dz) => dz.id === (isOverDropZone ? overId : draggableOver?.dz),
    )

    // Rearranging items within the same drop zone
    if (oldDropZoneId === dropZoneOver?.id) {
      setDropZones((prev) =>
        prev.map((dz) => {
          const oldIndex = dz.items.findIndex((item) => item === activeId)
          const newIndex = dz.items.findIndex((item) => item === overId)
          if (oldIndex === newIndex) return dz
          const newItems = arrayMove(dz.items, oldIndex, newIndex)
          return { ...dz, items: newItems }
        }),
      )
    }

    // Draggable moved from one sortable context to another
    if (draggableOver?.dz && draggableOver?.dz !== activeDraggable?.dz) {
      setDraggables((prev) =>
        prev.map((d) => (d.id === activeId ? { ...d, dz: dropZoneOver!.id } : d)),
      )
      setDropZones((prev) =>
        prev.map((dz) => {
          const newIndex = dz.items.findIndex((item) => item === overId)

          // Remove draggable from its old drop zone
          if (dz.id === oldDropZoneId) {
            const newItems = dz.items.filter((item) => item !== activeId)
            return { ...dz, items: newItems }
          }

          // Add draggable to its new drop zone
          if (newIndex === -1) return dz
          const newItems = dz.items.toSpliced(newIndex, 0, activeId)
          return { ...dz, items: newItems }
        }),
      )
    }

    // Moving a draggable into a new drop zone (outside of the sortable context, at the end of the list)
    if (isOverDropZone) {
      setDraggables((prev) =>
        prev.map((d) => (d.id === activeId ? { ...d, dz: dropZoneOver!.id } : d)),
      )
      setDropZones((prev) =>
        prev.map((dz) => {
          // Remove draggable from its old drop zone
          if (dz.id === oldDropZoneId && dropZoneOver?.id !== oldDropZoneId) {
            const newItems = dz.items.filter((item) => item !== activeId)
            return { ...dz, items: newItems }
          }

          // If we dropped it at the end of the dropzone it was already in
          if (dz.id === dropZoneOver?.id && dropZoneOver?.id === oldDropZoneId) {
            const newItems = dz.items.filter((item) => item !== activeId)
            newItems.push(activeId)
            return { ...dz, items: newItems }
          }

          return dz.id === dropZoneOver?.id ? { ...dz, items: [...dz.items, activeId] } : dz
        }),
      )
    }

    setActiveDraggable(null)
  }

  console.log(dropZones)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const freeDraggables = draggables.filter((draggable) => draggable.dz === null)

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
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className="p-12">
          {dropZones.map((tier) => (
            <TierRow
              key={tier.id}
              tier={tier}
              draggables={draggables}
              activeId={activeDraggable?.id}
            />
          ))}
        </div>
        <div className="px-12 grid grid-cols-12">
          <SortableContext items={freeDraggables} strategy={horizontalListSortingStrategy}>
            {freeDraggables
              .filter((draggable) => draggable.dz === null)
              .map(({ id, src }) => (
                <DraggableTile id={id} key={id} src={src} activeId={activeDraggable?.id} />
              ))}
          </SortableContext>
        </div>
        <DragOverlay>
          {activeDraggable && <DraggableContent src={activeDraggable.src} isDragging />}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

// #region Tier Row
function TierRow({
  tier,
  draggables,
  activeId,
}: {
  tier: DropZone
  draggables: Draggable[]
  activeId?: string
}) {
  const { id, title, items } = tier

  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  return (
    <div className="flex min-h-30 border-b border-foreground" ref={setNodeRef}>
      <div
        className={clsx(
          'w-24 flex items-center justify-center text-2xl font-bold',
          tierColors[title],
        )}
      >
        {title}
      </div>
      <div
        className={cn('flex flex-1 border-l border-foreground bg-[#333]', isOver && 'bg-accent')}
      >
        <SortableContext items={items} strategy={horizontalListSortingStrategy}>
          {items.map((item, index) => {
            const draggable = draggables.find((d) => d.id === item)
            if (!draggable) return null
            const { id, src } = draggable
            return <DraggableTile key={id} id={id} src={src} activeId={activeId} />
          })}
        </SortableContext>
      </div>
      <div className="w-24 bg-[#333] border-l border-foreground p-4">UP/DOWN</div>
    </div>
  )
}

//#region Draggable
function DraggableTile({
  id,
  src,
  activeId,
}: {
  id: string
  src: string
  isDragging?: boolean
  activeId?: string
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
      }
    : undefined

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-pointer"
    >
      <DraggableContent src={src} draggableId={id} activeId={activeId} />
    </button>
  )
}

function DraggableContent({
  src,
  activeId,
  isDragging,
  draggableId,
}: {
  src: string
  activeId?: string
  isDragging?: boolean
  draggableId?: string
}) {
  return (
    <img
      src={`/src/assets/${src}`}
      alt="Golem"
      className="rounded-lg max-h-30 aspect-[0.833] object-cover"
      style={{
        visibility: activeId === draggableId && !isDragging ? 'hidden' : 'visible',
      }}
    />
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

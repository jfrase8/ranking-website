import clsx from 'clsx'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
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

  const handleDragEnd = (event: DragEndEvent) => {
    // Find which tier we're hovering over
    if (!event.over?.id) return

    const dropZoneOver = String(event.over.id)
    const draggableId = String(event.active.id)

    let targetTierId: string | null = null

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
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        <div className="p-12">
          {/* {dropZones.map((tier) => (
            <TierRow key={tier.id} tier={tier} draggables={draggables} />
          ))} */}
          <SigmaRow draggables={draggables} />
        </div>
          <div className="px-12 grid grid-cols-12">
            {freeDraggables
              .filter((draggable) => draggable.dz === null)
              .map(({ id, src }) => (
                <DraggableTile id={id} key={id} src={src} />
              ))}
          </div>
      </DndContext>
    </div>
  )
}

function SigmaRow() {

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

  const [items, setItems] = useState(defaultDraggables)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setItems((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  }

  return (
    <div className="flex min-h-20 border-b border-foreground">
      <div
        className={clsx(
          'w-24 flex items-center justify-center text-2xl font-bold',
        )}
      >
        Sigma
      </div>
      <div
        className={cn(
          'flex flex-1 bg-secondary border-l border-foreground bg-[#333]'
        )}
      >
            <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
        <SortableContext items={items} strategy={horizontalListSortingStrategy}>
          {items.map((item) => {
            const {id, src} = item
            return (
              <DraggableTile
                key={id}
                id={id}
                src={src}
              />
            )
          })}
        </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}

// #region Tier Row
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
          'flex flex-1 bg-secondary border-l border-foreground bg-[#333]',
          isOver ? 'bg-accent/50' : undefined,
        )}
      >
        <SortableContext items={items} strategy={horizontalListSortingStrategy}>
          {/* Drop zone at the start of the list */}
          {/* {isThisTierActive && dragOverPosition.index === 0 && (
            <HoverZone positionId={`tier-${id}-pos-0`} />
          )} */}
          {/* Render items with drop zones between them */}
          {items.map((item, index) => {
            const draggable = draggables.find((d) => d.id === item)
            if (!draggable) return null
            const {id, src} = draggable
            return (
              <DraggableTile
                key={id}
                id={id}
                src={src}
              />
            )
          })}
        </SortableContext>
      </div>
      <div className="w-24 bg-secondary border-l border-foreground p-4">
        UP/DOWN
      </div>
    </div>
  )
}

//#region Hover Zone
function HoverZone({ positionId }: { positionId: string }) {
  const { setNodeRef } = useDroppable({
    id: positionId,
  })

  return (
    <div
      ref={setNodeRef}
      className="w-25 h-full transition-all shrink-0 flex items-center justify-center bg-primary/50"
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

//#region Draggable
function DraggableTile({ id, src }: { id: string; src: string }) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
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

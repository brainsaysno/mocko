import { Mocko } from '@/model/mocko';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSwappingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';
import MockoCard from './MockoCard';

export default function DragNDropMockoCards({
  mockos,
  isGenerating,
  setIsGenerating,
}: {
  mockos: Mocko[];
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}) {
  const [sortedMockoIds, setSortedMockoIds] = useState(mockos.map((m) => m.id));
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    setSortedMockoIds(mockos.map((m) => m.id));
  }, [mockos]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setSortedMockoIds((oldMockoIds) => {
        const oldIndex = oldMockoIds.indexOf(active.id as number);
        const newIndex = oldMockoIds.indexOf(over.id as number);

        return arrayMove(oldMockoIds, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortedMockoIds} strategy={rectSwappingStrategy}>
        {sortedMockoIds.map((mid) => {
          const mocko = mockos.find((m) => mid == m.id);
          if (!mocko) return null;

          return (
            <SortableMockoCard
              key={mid}
              mocko={mocko}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          );
        })}
      </SortableContext>
    </DndContext>
  );
}

function SortableMockoCard({
  mocko,
  isGenerating,
  setIsGenerating,
}: {
  mocko: Mocko;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: mocko.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <MockoCard
        key={mocko.id}
        mocko={mocko}
        disabled={isGenerating}
        afterGenerate={() => setIsGenerating(false)}
        onGenerate={() => setIsGenerating(true)}
      />
    </div>
  );
}

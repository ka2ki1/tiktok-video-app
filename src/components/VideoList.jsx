import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "../SortableItem";

function VideoList({
  videos,
  onDelete,
  onToggleFavorite,
  onOpen,
  onDragEnd,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={videos.map((video) => video.id)}
        strategy={rectSortingStrategy}
      >
        <div className="video-grid">
          {videos.map((video) => (
            <SortableItem
              key={video.id}
              video={video}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onOpen={onOpen}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default VideoList;

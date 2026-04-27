import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ video, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-item">
      <div className="video-card">
        <div className="thumbnail-wrap" {...attributes} {...listeners}>
          {video.thumbnail ? (
            <img src={video.thumbnail} alt={video.title} />
          ) : (
            <div className="no-thumbnail">No Image</div>
          )}
        </div>

        <div className="card-body">
          <h3>{video.title}</h3>

          {video.memo && <p>{video.memo}</p>}

          <div className="card-actions">
            <a href={video.url} target="_blank" rel="noreferrer">
              TikTokを開く
            </a>

            <button type="button" onClick={() => onDelete(video.id)}>
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SortableItem;

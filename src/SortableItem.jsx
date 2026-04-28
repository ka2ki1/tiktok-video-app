import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ video, onDelete, onToggleFavorite }) {
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

  const starStyle = {
    display: "block",
    margin: "0 0 12px",
    padding: 0,
    border: "none",
    background: "transparent",
    color: video.isFavorite ? "#f5a400" : "#bbb",
    fontSize: "28px",
    lineHeight: 1,
    cursor: "pointer",
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

          <button
            type="button"
            style={starStyle}
            onClick={() => onToggleFavorite(video.id)}
          >
            {video.isFavorite ? "★" : "☆"}
          </button>

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

function VideoModal({ video, onClose }) {
  if (!video) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-button" onClick={onClose}>
          ×
        </button>

        <h2>{video.title}</h2>

        <iframe
          src={video.url}
          title={video.title}
          className="modal-iframe"
          allow="autoplay; encrypted-media"
        />

        {video.memo && <p className="modal-memo">{video.memo}</p>}
      </div>
    </div>
  );
}

export default VideoModal;

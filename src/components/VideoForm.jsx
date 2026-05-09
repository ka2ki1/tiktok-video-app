function VideoForm({
  title,
  url,
  memo,
  thumbnail,
  onChangeTitle,
  onChangeUrl,
  onChangeMemo,
  onChangeThumbnail,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="form">
      <input
        type="text"
        placeholder="タイトル"
        value={title}
        onChange={(e) => onChangeTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="TikTok URL"
        value={url}
        onChange={(e) => onChangeUrl(e.target.value)}
      />

      <input
        type="text"
        placeholder="サムネイルURL（任意）"
        value={thumbnail}
        onChange={(e) => onChangeThumbnail(e.target.value)}
      />

      <textarea
        placeholder="メモ"
        value={memo}
        onChange={(e) => onChangeMemo(e.target.value)}
      />

      <button type="submit">追加</button>
    </form>
  );
}

export default VideoForm;

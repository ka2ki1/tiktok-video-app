import { useState, useEffect } from "react";

function App() {
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem("tiktokVideos");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    localStorage.setItem("tiktokVideos", JSON.stringify(videos));
  }, [videos]);

  function handleSubmit(e) {
    e.preventDefault();

    const newVideo = {
      id: Date.now(),
      title,
      url,
      memo,
    };

    setVideos([newVideo, ...videos]);

    setTitle("");
    setUrl("");
    setMemo("");
  }

  function handleDelete(id) {
    setVideos(videos.filter((video) => video.id !== id));
  }

  return (
    <div>
      <h1>TikTok動画まとめアプリ</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>TikTok URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div>
          <label>メモ</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>

        <button type="submit">登録</button>
      </form>

      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            <h2>{video.title}</h2>

            <a href={video.url} target="_blank" rel="noreferrer">
              TikTokを開く
            </a>

            <p>{video.memo}</p>

            <button onClick={() => handleDelete(video.id)}>
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

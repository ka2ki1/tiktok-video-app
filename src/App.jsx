import { useState } from "react";

function App() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [memo, setMemo] = useState("");

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
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)} />
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

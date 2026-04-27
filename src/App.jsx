import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import "./index.css";

function App() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [memo, setMemo] = useState("");

  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem("tiktokVideos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tiktokVideos", JSON.stringify(videos));
  }, [videos]);

  async function fetchThumbnail(tiktokUrl) {
    try {
      const res = await fetch(
        `http://localhost:3001/api/tiktok?url=${encodeURIComponent(tiktokUrl)}`
      );

      const data = await res.json();

      console.log("server data:", data);

      return data.thumbnail_url || "";
    } catch (error) {
      console.error("サムネイル取得失敗:", error);
      return "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      alert("タイトルとURLは必須です");
      return;
    }

    const thumbnail = await fetchThumbnail(url);

    console.log("取得したサムネイル:", thumbnail);

    const newVideo = {
      id: String(Date.now()),
      title,
      url,
      thumbnail,
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

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setVideos((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  }

  return (
    <div className="container">
      <h1>TikTok動画まとめアプリ</h1>

      <form className="video-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="TikTok URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <textarea
          placeholder="メモ"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />

        <button type="submit">登録</button>
      </form>

      <h2>登録した動画一覧</h2>

      {videos.length === 0 ? (
        <p className="empty-message">まだ動画が登録されていません。</p>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={videos.map((video) => video.id)}
            strategy={rectSortingStrategy}
          >
            <div className="video-grid">
              {videos.map((video) => (
                <SortableItem
                  key={video.id}
                  video={video}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

export default App;

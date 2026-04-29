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
  const [searchText, setSearchText] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [editingId, setEditingId] = useState(null);

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
      return data.thumbnail_url || "";
    } catch {
      return "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      alert("タイトルとURLは必須です");
      return;
    }

    if (editingId) {
      setVideos((prev) =>
        prev.map((video) =>
          video.id === editingId
            ? {
              ...video,
              title,
              url,
              memo,
            }
            : video
        )
      );

      setEditingId(null);
      setTitle("");
      setUrl("");
      setMemo("");
      return;
    }

    const thumbnail = await fetchThumbnail(url);

    const newVideo = {
      id: String(Date.now()),
      title,
      url,
      thumbnail,
      memo,
      isFavorite: false,
    };

    setVideos([newVideo, ...videos]);

    setTitle("");
    setUrl("");
    setMemo("");
  }

  function handleEdit(video) {
    setEditingId(video.id);
    setTitle(video.title);
    setUrl(video.url);
    setMemo(video.memo || "");
  }

  function handleCancelEdit() {
    setEditingId(null);
    setTitle("");
    setUrl("");
    setMemo("");
  }

  function handleDelete(id) {
    setVideos(videos.filter((video) => video.id !== id));
  }

  function handleToggleFavorite(id) {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, isFavorite: !v.isFavorite } : v
      )
    );
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setVideos((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  }

  const filteredVideos = videos.filter((video) => {
    const keyword = searchText.toLowerCase();

    const matchesSearch =
      video.title.toLowerCase().includes(keyword) ||
      video.memo.toLowerCase().includes(keyword);

    const matchesFavorite = showFavoritesOnly ? video.isFavorite : true;

    return matchesSearch && matchesFavorite;
  });

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

        <button type="submit">{editingId ? "更新" : "登録"}</button>

        {editingId && (
          <button type="button" onClick={handleCancelEdit}>
            キャンセル
          </button>
        )}
      </form>

      <div className="search-row">
        <input
          className="search-input"
          type="text"
          placeholder="タイトル・メモで検索"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <button
          type="button"
          className={
            showFavoritesOnly
              ? "favorite-filter-button active"
              : "favorite-filter-button"
          }
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          {showFavoritesOnly ? "★ お気に入り中" : "☆ お気に入りのみ"}
        </button>
      </div>

      <h2>動画一覧</h2>

      {filteredVideos.length === 0 ? (
        <p className="empty-message">該当する動画がありません</p>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={filteredVideos.map((v) => v.id)}
            strategy={rectSortingStrategy}
          >
            <div className="video-grid">
              {filteredVideos.map((video) => (
                <SortableItem
                  key={video.id}
                  video={video}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={handleEdit}
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

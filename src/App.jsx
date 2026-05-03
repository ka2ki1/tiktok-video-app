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
  const [thumbnailFile, setThumbnailFile] = useState("");
  const [category, setCategory] = useState("勉強");

  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("すべて");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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

  function handleThumbnailFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setThumbnailFile(reader.result);
    };

    reader.readAsDataURL(file);
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
              category,
              thumbnail: thumbnailFile || video.thumbnail,
            }
            : video
        )
      );

      resetForm();
      return;
    }

    const fetchedThumbnail = await fetchThumbnail(url);

    const newVideo = {
      id: String(Date.now()),
      title,
      url,
      memo,
      category,
      thumbnail: thumbnailFile || fetchedThumbnail,
      isFavorite: false,
    };

    setVideos([newVideo, ...videos]);
    resetForm();
    setCurrentPage(1);
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setUrl("");
    setMemo("");
    setThumbnailFile("");
    setCategory("勉強");
  }

  function handleEdit(video) {
    setEditingId(video.id);
    setTitle(video.title);
    setUrl(video.url);
    setMemo(video.memo || "");
    setThumbnailFile("");
    setCategory(video.category || "勉強");
  }

  function handleDelete(id) {
    setVideos(videos.filter((video) => video.id !== id));
  }

  function handleToggleFavorite(id) {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === id
          ? { ...video, isFavorite: !video.isFavorite }
          : video
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
      (video.memo || "").toLowerCase().includes(keyword);

    const matchesCategory =
      filterCategory === "すべて" ||
      (video.category || "未分類") === filterCategory;

    const matchesFavorite = showFavoritesOnly ? video.isFavorite : true;

    return matchesSearch && matchesCategory && matchesFavorite;
  });

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVideos = filteredVideos.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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

        <input
          className="thumbnail-file-input"
          type="file"
          accept="image/*"
          onChange={handleThumbnailFileChange}
        />

        <textarea
          placeholder="メモ"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="勉強">勉強</option>
          <option value="料理">料理</option>
          <option value="音楽">音楽</option>
          <option value="美容">美容</option>
          <option value="その他">その他</option>
        </select>

        <button type="submit">{editingId ? "更新" : "登録"}</button>

        {editingId && (
          <button type="button" onClick={resetForm}>
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
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          className="category-filter"
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="すべて">すべて</option>
          <option value="勉強">勉強</option>
          <option value="料理">料理</option>
          <option value="音楽">音楽</option>
          <option value="美容">美容</option>
          <option value="その他">その他</option>
        </select>

        <button
          type="button"
          className={
            showFavoritesOnly
              ? "favorite-filter-button active"
              : "favorite-filter-button"
          }
          onClick={() => {
            setShowFavoritesOnly(!showFavoritesOnly);
            setCurrentPage(1);
          }}
        >
          {showFavoritesOnly ? "★ お気に入り中" : "☆ お気に入りのみ"}
        </button>
      </div>

      <h2>動画一覧</h2>

      {paginatedVideos.length === 0 ? (
        <p className="empty-message">該当する動画がありません</p>
      ) : (
        <>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={paginatedVideos.map((v) => v.id)}
              strategy={rectSortingStrategy}
            >
              <div className="video-grid">
                {paginatedVideos.map((video) => (
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

          <div className="pagination">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              前へ
            </button>

            <span>
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
            >
              次へ
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

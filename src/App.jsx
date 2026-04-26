import { useState } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [memo, setMemo] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    console.log({
      title,
      url,
      memo,
    });
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
    </div>
  );
}

export default App;

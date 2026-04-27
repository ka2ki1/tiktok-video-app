import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());

app.get("/api/tiktok", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "url is required" });
  }

  try {
    const apiUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(
      url
    )}`;

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json,text/html,*/*",
      },
    });

    const text = await response.text();

    console.log("status:", response.status);
    console.log("raw response:", text);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "TikTok oEmbed failed",
        status: response.status,
        raw: text,
      });
    }

    const data = JSON.parse(text);

    return res.json({
      title: data.title || "",
      thumbnail_url: data.thumbnail_url || "",
      author_name: data.author_name || "",
      raw: data,
    });
  } catch (error) {
    console.error("server error:", error);

    return res.status(500).json({
      error: "Failed to fetch TikTok data",
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

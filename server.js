const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/get_m3u8", async (req, res) => {
  const { url, quality = 720 } = req.query;

  if (!url || !url.includes("/s/")) {
    return res.status(400).json({ error: "Invalid Terabox link" });
  }

  try {
    const apiURL = `https://api.ronnieverse.site/get_m3u8?url=${encodeURIComponent(url)}&quality=${quality}`;
    const response = await axios.get(apiURL);
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch m3u8" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

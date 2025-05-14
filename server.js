const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/get_m3u8', async (req, res) => {
  const { url } = req.query;

  if (!url || !url.includes('/s/')) {
    return res.status(400).json({ error: 'Invalid Terabox link' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for video element
    await page.waitForSelector('video');

    // Extract m3u8 link
    const m3u8Url = await page.evaluate(() => {
      const video = document.querySelector('video');
      return video ? video.src : null;
    });

    await browser.close();

    if (!m3u8Url || !m3u8Url.includes('.m3u8')) {
      return res.status(404).json({ error: 'M3U8 not found' });
    }

    return res.json({ m3u8_url: m3u8Url });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to extract m3u8' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

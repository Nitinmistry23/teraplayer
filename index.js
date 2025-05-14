export default {
  async fetch(req) {
    const url = new URL(req.url);
    const rawUrl = url.searchParams.get("url");
    if (!rawUrl) return new Response("❌ Missing ?url param", { status: 400 });

    const target = decodeURIComponent(rawUrl);

    if (target.endsWith(".ts") || target.includes(".ts?")) {
      return fetch(target, {
        headers: {
          'Referer': 'https://www.terabox.com/',
          'Origin': 'https://www.terabox.com',
          'User-Agent': req.headers.get("user-agent") || "Mozilla/5.0"
        }
      });
    }

    const m3u8Resp = await fetch(target);
    const m3u8Text = await m3u8Resp.text();
    const base = target.substring(0, target.lastIndexOf("/") + 1);

    const rewritten = m3u8Text.replace(/^(?!#)(.*\.ts.*)$/gm, line => {
      const fullUrl = new URL(line, base).toString();
      return `https://${url.hostname}/?url=${encodeURIComponent(fullUrl)}`;
    });

    return new Response(rewritten, {
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

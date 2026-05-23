import { withSecurity } from "../../middleware/security.js";

const PRIVATE_HOST_RE = /(^localhost$)|(^127\.)|(^10\.)|(^192\.168\.)|(^169\.254\.)|(^172\.(1[6-9]|2\d|3[0-1])\.)|(^::1$)/i;

function isSafeImageUrl(rawUrl) {
  if (typeof rawUrl !== "string" || rawUrl.trim().length === 0) {
    return false;
  }

  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return false;
  }

  if (PRIVATE_HOST_RE.test(parsed.hostname)) {
    return false;
  }

  return true;
}

async function handler(request, response) {
  const sourceUrl = String(request.query?.url || "");

  if (!isSafeImageUrl(sourceUrl)) {
    return response.status(400).json({ error: "Invalid image URL" });
  }

  try {
    const upstream = await fetch(sourceUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        Accept: "image/*",
      },
    });

    if (!upstream.ok) {
      return response.status(upstream.status).json({ error: "Upstream image request failed" });
    }

    const contentType = String(upstream.headers.get("content-type") || "").toLowerCase();
    if (!contentType.startsWith("image/")) {
      return response.status(415).json({ error: "Upstream response is not an image" });
    }

    const cacheControl = String(upstream.headers.get("cache-control") || "public, max-age=3600, s-maxage=3600");
    const etag = upstream.headers.get("etag");

    const bytes = Buffer.from(await upstream.arrayBuffer());

    response.setHeader("Content-Type", contentType);
    response.setHeader("Cache-Control", cacheControl);
    if (etag) {
      response.setHeader("ETag", etag);
    }

    return response.status(200).send(bytes);
  } catch (error) {
    console.error("[api/media/image] proxy error:", error);
    return response.status(502).json({ error: "Failed to fetch image" });
  }
}

export default withSecurity(handler, {
  methods: ["GET"],
  requireJson: false,
  requireCsrf: false,
  requireOrigin: false,
  blockBots: false,
  maxBodyBytes: 1024,
  rateLimit: { key: "media-image", windowMs: 60 * 1000, max: 180 },
});

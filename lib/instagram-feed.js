import { validateEnvOnce } from "../config/env.validation.js";

const INSTAGRAM_FEED_TTL = 3 * 60 * 60 * 1000;
const INSTAGRAM_API_TIMEOUT = 10000;
const INSTAGRAM_DEFAULT_LIMIT = 18;
const INSTAGRAM_MAX_LIMIT = 30;
const INSTAGRAM_CACHE_KEY = "instagram-feed";

const feedCache = new Map();

function getConfiguredAccountId() {
  return String(process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || "").trim();
}

function isInstagramConfigured() {
  return Boolean(process.env.INSTAGRAM_ACCESS_TOKEN && getConfiguredAccountId());
}

function buildImageProxyPath(rawUrl) {
  if (typeof rawUrl !== "string" || rawUrl.trim().length === 0) {
    return null;
  }

  return `/api/media/image?url=${encodeURIComponent(rawUrl)}`;
}

function extractShortcode(permalink) {
  if (typeof permalink !== "string") {
    return null;
  }

  const match = permalink.match(/\/(reel|p|tv)\/([^/?#]+)/i);
  return match?.[2] ?? null;
}

function getCarouselPreview(children) {
  const mediaChildren = children?.data;
  if (!Array.isArray(mediaChildren)) {
    return null;
  }

  const preferredChild = mediaChildren.find((child) => child?.thumbnail_url || child?.media_url);
  if (!preferredChild) {
    return null;
  }

  return preferredChild.thumbnail_url || preferredChild.media_url || null;
}

function getThumbnailSource(item) {
  if (typeof item?.thumbnail_url === "string" && item.thumbnail_url.length > 0) {
    return item.thumbnail_url;
  }

  if (item?.media_type === "CAROUSEL_ALBUM") {
    return getCarouselPreview(item.children);
  }

  if (typeof item?.media_url === "string" && item.media_url.length > 0) {
    return item.media_url;
  }

  return null;
}

function createExcerpt(caption) {
  const normalized = String(caption || "").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "Student success story from URM ENROLL.";
  }

  if (normalized.length <= 120) {
    return normalized;
  }

  return `${normalized.slice(0, 117).trimEnd()}...`;
}

function normalizeFeedItem(item) {
  const permalink = String(item?.permalink || "").trim();
  const shortcode = extractShortcode(permalink);
  if (!permalink || !shortcode) {
    return null;
  }

  const caption = String(item?.caption || "").trim();
  const thumbnailSource = getThumbnailSource(item);

  return {
    id: String(item.id || shortcode),
    shortcode,
    permalink,
    caption,
    excerpt: createExcerpt(caption),
    mediaType: String(item?.media_type || "UNKNOWN"),
    mediaProductType: item?.media_product_type ? String(item.media_product_type) : null,
    publishedAt: item?.timestamp ? String(item.timestamp) : null,
    thumbnailUrl: buildImageProxyPath(thumbnailSource),
    altText: caption || "Instagram success story from URM ENROLL",
  };
}

async function fetchInstagramGraphMedia(limit = INSTAGRAM_DEFAULT_LIMIT) {
  validateEnvOnce(
    "instagram-feed",
    ["INSTAGRAM_ACCESS_TOKEN", "INSTAGRAM_BUSINESS_ACCOUNT_ID"],
    "Instagram feed ingestion",
  );

  const accountId = getConfiguredAccountId();
  if (!accountId) {
    throw new Error("Instagram business account ID not configured");
  }

  const url = new URL(`https://graph.instagram.com/v18.0/${accountId}/media`);
  url.searchParams.set(
    "fields",
    [
      "id",
      "caption",
      "media_type",
      "media_product_type",
      "media_url",
      "thumbnail_url",
      "timestamp",
      "permalink",
      "children{media_type,media_url,thumbnail_url,permalink}",
    ].join(","),
  );
  url.searchParams.set("limit", String(Math.min(Math.max(limit, 1), INSTAGRAM_MAX_LIMIT)));
  url.searchParams.set("access_token", String(process.env.INSTAGRAM_ACCESS_TOKEN));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), INSTAGRAM_API_TIMEOUT);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { "User-Agent": "URM-Enroll/1.0" },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Instagram API error ${response.status}: ${error.error?.message || "Unknown error"}`,
      );
    }

    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Instagram API request timeout");
    }
    throw error;
  }
}

function getCacheEntry() {
  return feedCache.get(INSTAGRAM_CACHE_KEY) || null;
}

function setCacheEntry(items) {
  const now = Date.now();
  const entry = {
    items,
    fetchedAt: new Date(now).toISOString(),
    expiresAt: now + INSTAGRAM_FEED_TTL,
    lastError: null,
  };

  feedCache.set(INSTAGRAM_CACHE_KEY, entry);
  return entry;
}

function updateCacheError(message) {
  const existing = getCacheEntry();
  if (!existing) {
    return null;
  }

  const next = {
    ...existing,
    lastError: message,
  };

  feedCache.set(INSTAGRAM_CACHE_KEY, next);
  return next;
}

function buildFeedResponse(items, cacheEntry, options = {}) {
  const { limit = INSTAGRAM_DEFAULT_LIMIT, stale = false, source = "live", fallbackUsed = false } = options;
  const sliced = items.slice(0, Math.min(Math.max(limit, 1), INSTAGRAM_MAX_LIMIT));

  return {
    data: sliced,
    meta: {
      count: sliced.length,
      stale,
      source,
      fallbackUsed,
      fetchedAt: cacheEntry?.fetchedAt ?? null,
      expiresAt: cacheEntry?.expiresAt ? new Date(cacheEntry.expiresAt).toISOString() : null,
      lastError: cacheEntry?.lastError ?? null,
      ttlMs: INSTAGRAM_FEED_TTL,
    },
  };
}

async function getInstagramFeed(options = {}) {
  const {
    limit = INSTAGRAM_DEFAULT_LIMIT,
    forceRefresh = false,
  } = options;

  const cacheEntry = getCacheEntry();
  const hasFreshCache = Boolean(
    cacheEntry && Array.isArray(cacheEntry.items) && cacheEntry.items.length > 0 && cacheEntry.expiresAt > Date.now(),
  );

  if (!forceRefresh && hasFreshCache) {
    return buildFeedResponse(cacheEntry.items, cacheEntry, {
      limit,
      stale: false,
      source: "memory-cache",
    });
  }

  try {
    if (!isInstagramConfigured()) {
      throw new Error("Instagram integration not configured");
    }

    const rawItems = await fetchInstagramGraphMedia(Math.max(limit, INSTAGRAM_DEFAULT_LIMIT));
    const normalizedItems = rawItems
      .map(normalizeFeedItem)
      .filter(Boolean);

    const nextCacheEntry = setCacheEntry(normalizedItems);
    return buildFeedResponse(normalizedItems, nextCacheEntry, {
      limit,
      stale: false,
      source: "live",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const staleCache = updateCacheError(message);

    if (staleCache && Array.isArray(staleCache.items) && staleCache.items.length > 0) {
      return buildFeedResponse(staleCache.items, staleCache, {
        limit,
        stale: true,
        source: "stale-cache",
        fallbackUsed: true,
      });
    }

    throw error;
  }
}

async function refreshInstagramFeed(options = {}) {
  return getInstagramFeed({ ...options, forceRefresh: true });
}

function getInstagramFeedStatus() {
  const cacheEntry = getCacheEntry();
  if (!cacheEntry) {
    return {
      cached: false,
      count: 0,
      expiresAt: null,
      fetchedAt: null,
      lastError: null,
    };
  }

  return {
    cached: true,
    count: Array.isArray(cacheEntry.items) ? cacheEntry.items.length : 0,
    expiresAt: new Date(cacheEntry.expiresAt).toISOString(),
    fetchedAt: cacheEntry.fetchedAt,
    isStale: cacheEntry.expiresAt <= Date.now(),
    lastError: cacheEntry.lastError ?? null,
  };
}

export {
  INSTAGRAM_FEED_TTL,
  getInstagramFeed,
  refreshInstagramFeed,
  getInstagramFeedStatus,
  isInstagramConfigured,
};
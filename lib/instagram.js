/**
 * Instagram Graph API Integration
 * Fetches latest posts/reels from Instagram account with caching
 * Reference: https://developers.facebook.com/docs/instagram/oembed/
 */

import { validateEnvOnce } from "../config/env.validation.js";

// Cache storage with TTL (in-memory for now; can be upgraded to Redis)
const cache = new Map();

const INSTAGRAM_CACHE_KEY = "instagram_posts";
const INSTAGRAM_CACHE_TTL = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const INSTAGRAM_API_TIMEOUT = 10000; // 10 seconds

/**
 * Fetches Instagram business account ID using username
 * Note: For production, store the business account ID in env instead
 */
async function getBusinessAccountId() {
  const { INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID } = process.env;

  if (INSTAGRAM_BUSINESS_ACCOUNT_ID) {
    return INSTAGRAM_BUSINESS_ACCOUNT_ID;
  }

  // Fallback: derive from access token lookup (less efficient)
  // In production, store ID directly in env
  if (!INSTAGRAM_ACCESS_TOKEN) {
    throw new Error(
      "Missing INSTAGRAM_ACCESS_TOKEN. Set INSTAGRAM_BUSINESS_ACCOUNT_ID directly for better performance."
    );
  }

  return null;
}

/**
 * Fetches latest Instagram media (posts/reels) from business account
 * Uses Graph API v18.0 or later
 */
async function fetchInstagramMedia(limit = 12) {
  validateEnvOnce("instagram", ["INSTAGRAM_ACCESS_TOKEN"], "Instagram integration");

  const accountId = await getBusinessAccountId();
  if (!accountId) {
    throw new Error("Instagram business account ID not configured");
  }

  const url = new URL(
    `https://graph.instagram.com/v18.0/${accountId}/media`
  );
  url.searchParams.set("fields", "id,caption,media_type,media_url,timestamp,permalink");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("access_token", process.env.INSTAGRAM_ACCESS_TOKEN);

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
        `Instagram API error ${response.status}: ${error.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Instagram API request timeout");
    }
    throw error;
  }
}

/**
 * Normalizes Instagram media item to frontend format
 */
function normalizeMediaItem(item) {
  return {
    id: item.id,
    instagramUrl: item.permalink,
    caption: item.caption || "",
    mediaType: item.media_type, // IMAGE, VIDEO, CAROUSEL_ALBUM
    mediaUrl: item.media_url,
    timestamp: item.timestamp,
    // Fallback for manual mapping
    quote: {
      en: item.caption || "Check out our latest update on Instagram!",
      de: item.caption || "Schau dir unser neuestes Update auf Instagram an!",
      ar: item.caption || "تحقق من آخر تحديث لنا على Instagram!",
    },
  };
}

/**
 * Gets cached Instagram media or fetches fresh data
 */
async function getInstagramMedia(limit = 12) {
  // Check cache first
  const cached = cache.get(INSTAGRAM_CACHE_KEY);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  try {
    const media = await fetchInstagramMedia(limit);
    const normalized = media.map(normalizeMediaItem);

    // Store in cache with TTL
    cache.set(INSTAGRAM_CACHE_KEY, {
      data: normalized,
      expiresAt: Date.now() + INSTAGRAM_CACHE_TTL,
    });

    return normalized;
  } catch (error) {
    // If fetch fails, attempt to return stale cache
    if (cached) {
      console.warn("[Instagram] Using stale cache due to API error:", error.message);
      return cached.data;
    }

    throw error;
  }
}

/**
 * Clears Instagram media cache (manual invalidation)
 */
function clearInstagramCache() {
  cache.delete(INSTAGRAM_CACHE_KEY);
}

/**
 * Gets cache metadata for debugging
 */
function getCacheStatus() {
  const cached = cache.get(INSTAGRAM_CACHE_KEY);
  if (!cached) {
    return { cached: false, expiresAt: null };
  }

  return {
    cached: true,
    expiresAt: new Date(cached.expiresAt).toISOString(),
    itemCount: cached.data.length,
    staleness: Date.now() - (cached.expiresAt - INSTAGRAM_CACHE_TTL),
  };
}

export {
  getInstagramMedia,
  clearInstagramCache,
  getCacheStatus,
  INSTAGRAM_CACHE_TTL,
};

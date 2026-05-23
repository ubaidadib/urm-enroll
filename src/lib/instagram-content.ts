/**
 * Instagram Content Service
 * Handles fetching, caching, and error handling for Instagram media.
 */

const INSTAGRAM_API_ENDPOINT = '/api/instagram';
const FRONTEND_CACHE_KEY = 'urm_instagram_content';
const FRONTEND_CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const FETCH_TIMEOUT = 15000; // 15 seconds

export interface InstagramContentItem {
  id: string | number;
  instagramUrl: string;
  caption?: string;
  mediaType?: string;
  mediaUrl?: string;
  timestamp?: string;
  quote?: {
    en: string;
    de: string;
    ar: string;
  };
}

let inFlightFetch: Promise<InstagramContentItem[]> | null = null;

interface CachedInstagramData {
  data: InstagramContentItem[];
  expiresAt: number;
  timestamp: string;
}

interface FetchOptions {
  limit?: number;
  forceRefresh?: boolean;
  timeout?: number;
}

interface InstagramApiSuccessResponse {
  success: true;
  data: InstagramContentItem[];
}

const MODULE_SNIPPET_RE = /^\s*import\s+\{/;

function isInstagramContentItem(value: unknown): value is InstagramContentItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    (typeof record.id === 'string' || typeof record.id === 'number') &&
    typeof record.instagramUrl === 'string'
  );
}

function isInstagramApiSuccessResponse(value: unknown): value is InstagramApiSuccessResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    record.success === true &&
    Array.isArray(record.data) &&
    record.data.every(isInstagramContentItem)
  );
}

/**
 * Fetches Instagram content from backend API.
 */
export async function fetchInstagramContent(
  options: FetchOptions = {}
): Promise<InstagramContentItem[]> {
  const {
    limit = 12,
    forceRefresh = false,
    timeout = FETCH_TIMEOUT,
  } = options;

  if (!forceRefresh) {
    const cached = getInstagramCacheFromStorage();
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }
  }

  if (inFlightFetch) {
    try {
      return await inFlightFetch;
    } catch {
      inFlightFetch = null;
    }
  }

  const url = new URL(INSTAGRAM_API_ENDPOINT, window.location.origin);
  url.searchParams.set('limit', String(limit));
  if (forceRefresh) {
    url.searchParams.set('nocache', 'true');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    inFlightFetch = (async () => {
      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      clearTimeout(timeoutId);

      const contentType = String(response.headers.get('content-type') || '').toLowerCase();
      const payloadText = await response.text();

      if (!response.ok) {
        let errorPayload: { error?: string } = {};
        if (contentType.includes('application/json')) {
          errorPayload = (JSON.parse(payloadText) as { error?: string }) || {};
        }
        throw new Error(
          `Instagram API error ${response.status}: ${errorPayload.error ?? 'Unknown error'}`
        );
      }

      if (!contentType.includes('application/json')) {
        const snippet = payloadText.slice(0, 120).replace(/\s+/g, ' ');
        const detail = MODULE_SNIPPET_RE.test(payloadText)
          ? 'received JavaScript module output'
          : `received content-type ${contentType || 'unknown'}`;
        throw new Error(`Instagram endpoint expected JSON, but ${detail}. Response starts with: ${snippet}`);
      }

      const result = JSON.parse(payloadText) as unknown;
      if (!isInstagramApiSuccessResponse(result)) {
        throw new Error('Invalid Instagram API response format');
      }

      saveInstagramCacheToStorage(result.data);
      return result.data;
    })();

    const resultData = await inFlightFetch;
    inFlightFetch = null;
    return resultData;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      inFlightFetch = null;
      throw new Error('Instagram content fetch timed out');
    }

    inFlightFetch = null;

    const staleCache = getInstagramCacheFromStorage(true);
    if (staleCache) {
      return staleCache.data;
    }

    throw error;
  }
}

/**
 * Returns cached Instagram content from localStorage.
 */
function getInstagramCacheFromStorage(
  allowStale = false
): CachedInstagramData | null {
  try {
    const cached = localStorage.getItem(FRONTEND_CACHE_KEY);
    if (!cached) {
      return null;
    }

    const parsed = JSON.parse(cached) as CachedInstagramData;
    if (parsed.expiresAt > Date.now() || allowStale) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Saves Instagram content to localStorage with TTL.
 */
function saveInstagramCacheToStorage(data: InstagramContentItem[]): void {
  try {
    const cacheData: CachedInstagramData = {
      data,
      expiresAt: Date.now() + FRONTEND_CACHE_TTL,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(FRONTEND_CACHE_KEY, JSON.stringify(cacheData));
  } catch {
    // Ignore cache write errors.
  }
}

/**
 * Clears Instagram content cache.
 */
export function clearInstagramCache(): void {
  try {
    localStorage.removeItem(FRONTEND_CACHE_KEY);
  } catch {
    // Ignore cache clear errors.
  }
}

/**
 * Returns cache status.
 */
export function getInstagramCacheStatus() {
  const cached = getInstagramCacheFromStorage(true);
  if (!cached) {
    return { cached: false, isStale: null, expiresAt: null };
  }

  const isStale = cached.expiresAt <= Date.now();
  return {
    cached: true,
    isStale,
    expiresAt: new Date(cached.expiresAt).toISOString(),
    itemCount: cached.data.length,
  };
}

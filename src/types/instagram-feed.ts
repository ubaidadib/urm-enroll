export interface InstagramFeedItem {
  id: string;
  shortcode: string;
  permalink: string;
  caption: string;
  excerpt: string;
  mediaType: string;
  mediaProductType: string | null;
  publishedAt: string | null;
  thumbnailUrl: string | null;
  altText: string;
}

export interface InstagramFeedMeta {
  count: number;
  stale: boolean;
  source: string;
  fallbackUsed: boolean;
  fetchedAt: string | null;
  expiresAt: string | null;
  lastError: string | null;
  ttlMs: number;
}

export interface InstagramFeedResponse {
  success: true;
  data: InstagramFeedItem[];
  meta: InstagramFeedMeta;
}
/**
 * Instagram Content API Endpoint
 * Provides frontend access to cached Instagram media
 * GET /api/instagram?limit=12
 */

import { z } from "zod";
import { withSecurity } from "../middleware/security.js";
import { getInstagramMedia, getCacheStatus } from "../lib/instagram.js";

const querySchema = z.object({
  limit: z.coerce.number().int().min(3).max(30).optional().default(12),
  nocache: z.enum(["true", "false"]).optional().default("false"),
});

async function handler(request, response) {
  try {
    // Check if Instagram is configured
    if (!process.env.INSTAGRAM_ACCESS_TOKEN || !process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID) {
      console.warn("[API] Instagram not configured - env vars missing");
      return response.status(503).json({
        error: "Instagram integration not configured",
        message: "INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_BUSINESS_ACCOUNT_ID not set",
        cache: { cached: false },
        retryAfter: 300, // seconds (5 minutes)
      });
    }

    // Parse and validate query parameters
    const parsed = querySchema.safeParse(request.query || {});
    if (!parsed.success) {
      return response.status(400).json({
        error: "Invalid query parameters",
      });
    }

    const { limit, nocache } = parsed.data;
    const forceRefresh = nocache === "true";

    // Attempt to fetch Instagram media
    let media;
    try {
      media = await getInstagramMedia(limit, { forceRefresh });
    } catch (error) {
      // Log error for debugging but provide graceful fallback
      console.error("[API] Instagram fetch error:", error.message);

      // Return cached metadata in error response
      const cacheStatus = getCacheStatus();

      return response.status(503).json({
        error: "Instagram integration temporarily unavailable",
        cache: cacheStatus,
        retryAfter: 60,
      });
    }

    // Success response
    return response.status(200).json({
      success: true,
      data: media,
      count: media.length,
      cache: getCacheStatus(),
      refreshedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API] Unexpected error in Instagram endpoint:", error);

    return response.status(500).json({
      error: "Internal server error",
      message: process.env.NODE_ENV === "development" ? error.message : "Unknown error",
    });
  }
}

export default withSecurity(handler, {
  methods: ["GET"],
  requireJson: false,
  requireCsrf: false,
  requireOrigin: false,
  blockBots: false,
  maxBodyBytes: 1024,
  rateLimit: { key: "instagram", windowMs: 60 * 1000, max: 30 }, // 30 requests/minute
});

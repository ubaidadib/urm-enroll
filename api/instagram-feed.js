import { z } from "zod";

import { withSecurity } from "../middleware/security.js";
import {
  getInstagramFeed,
  getInstagramFeedStatus,
} from "../lib/instagram-feed.js";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(30).optional().default(12),
});

async function handler(request, response) {
  try {
    const parsed = querySchema.safeParse(request.query || {});
    if (!parsed.success) {
      response.status(400).json({ error: "Invalid query parameters" });
      return;
    }

    const { limit } = parsed.data;
    const result = await getInstagramFeed({ limit });

    response.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=3600");
    response.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = /not configured/i.test(message) ? 503 : 502;

    response.status(status).json({
      error: status === 503 ? "Instagram feed not configured" : "Instagram feed unavailable",
      message,
      meta: getInstagramFeedStatus(),
      retryAfter: 300,
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
  rateLimit: { key: "instagram-feed", windowMs: 60 * 1000, max: 60 },
});
import { withSecurity } from "../../middleware/security.js";
import {
  fetchCatalogFromSupabase,
  fetchCoursesFromSupabase,
} from "../../lib/supabase-catalog.js";

// Resource-oriented catalog endpoint. One Serverless Function serves every
// read-only catalog resource via the dynamic [resource] segment:
//   GET /api/catalog/universities
//   GET /api/catalog/courses
// (Replaces the former one-file-per-resource handlers.)
const RESOURCES = {
  universities: fetchCatalogFromSupabase,
  courses: fetchCoursesFromSupabase,
};

async function handler(request, response) {
  const resource = String(request.query?.resource || "");
  const fetcher = RESOURCES[resource];

  if (!fetcher) {
    response.status(404).json({ error: "Unknown catalog resource" });
    return;
  }

  const result = await fetcher();
  response.status(200).json(result);
}

export default withSecurity(handler, {
  methods: ["GET"],
  requireJson: false,
  requireCsrf: false,
  requireOrigin: false,
  blockBots: false,
  maxBodyBytes: 1024,
  rateLimit: { key: "catalog", windowMs: 60 * 1000, max: 120 },
});

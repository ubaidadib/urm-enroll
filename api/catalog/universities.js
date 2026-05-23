import { withSecurity } from "../../middleware/security.js";
import { fetchCatalogFromSupabase } from "../../lib/supabase-catalog.js";

async function handler(_request, response) {
  const result = await fetchCatalogFromSupabase();
  response.status(200).json(result);
}

export default withSecurity(handler, {
  methods: ["GET"],
  requireJson: false,
  requireCsrf: false,
  requireOrigin: false,
  blockBots: false,
  maxBodyBytes: 1024,
  rateLimit: { key: "catalog-universities", windowMs: 60 * 1000, max: 120 },
});

import { withSecurity } from "../middleware/security.js";

function handler(_request, response) {
  response.status(200).json({ status: "ok" });
}

export default withSecurity(handler, {
  methods: ["GET"],
  requireJson: false,
  requireCsrf: false,
  requireOrigin: false,
  blockBots: false,
  maxBodyBytes: 1024,
  rateLimit: { key: "health", windowMs: 60 * 1000, max: 60 },
});

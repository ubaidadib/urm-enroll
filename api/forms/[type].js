import { withSecurity } from "../../middleware/security.js";
import { handleLead } from "../../lib/forms/lead.js";
import { handleContact } from "../../lib/forms/contact.js";
import { handlePartner } from "../../lib/forms/partner.js";
import { handleApplication } from "../../lib/forms/application.js";

// Single Serverless Function serving every public form submission via the
// dynamic [type] segment. Backed by handlers in lib/forms/* (Phase 5 — routes
// stay thin; business logic lives in lib/). Reached at /api/forms/<type>, and
// the legacy /api/{lead,contact,partner,application} paths are rewritten here
// in vercel.json for backward compatibility.
const HANDLERS = {
  lead: handleLead,
  contact: handleContact,
  partner: handlePartner,
  application: handleApplication,
};

async function handler(request, response) {
  const type = String(request.query?.type || "");
  const run = HANDLERS[type];

  if (!run) {
    response.status(404).json({ error: "Unknown form type" });
    return;
  }

  return run(request, response);
}

export default withSecurity(handler, {
  methods: ["POST"],
  requireJson: true,
  requireCsrf: true,
  requireOrigin: true,
  blockBots: true,
  // Superset of the former per-form caps (application used 20 KB).
  maxBodyBytes: 20 * 1024,
  // Shared per-IP bucket across the form family; per-email limits inside each
  // handler remain the primary anti-abuse control.
  rateLimit: { key: "forms", windowMs: 15 * 60 * 1000, max: 40 },
});

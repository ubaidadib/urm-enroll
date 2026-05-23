# Security Audit & Hardening Report

Date: 2026-02-20

Scope: Full repository security audit and hardening before production deployment.

## Findings and Resolutions

| # | Phase | Finding | Severity | Fix Applied | Status |
|---|---|---|---|---|---|
| 1 | Secrets & Env | No `.gitignore` present; secret files and env files risk accidental commit | High | Added `.gitignore` with `.env`, key/cert patterns, and secret directories excluded | Resolved |
| 2 | Secrets & Env | Missing startup env validation for required server vars | High | Added `config/env.validation.js` and enforced checks in contact API startup path | Resolved |
| 3 | Secrets & Env | `.env.example` incomplete for operational security configuration | Medium | Expanded `.env.example` with all required variables and secure placeholders | Resolved |
| 4 | AuthN/AuthZ | No authenticated routes present in current codebase (public intake APIs only) | Low | Confirmed no token/session auth surface in repo; documented N/A scope | Resolved (N/A) |
| 5 | Input Validation | `api/contact.js` used manual validation and unsanitized template interpolation risk | High | Added strict `zod` schema and `sanitize-html` sanitization | Resolved |
| 6 | Input Validation | Endpoint validation inconsistent across APIs | Medium | Standardized schema enforcement on `api/contact.js`, `api/lead.js`, `api/partner.js` | Resolved |
| 7 | HTTP Headers | Missing required COOP/COEP and CORP mode not strict enough | High | Enforced strict headers in `vercel.json` and `middleware/security.js` | Resolved |
| 8 | Rate Limiting | No shared, enforceable rate-limit baseline across all APIs | High | Added centralized rate limiter in `middleware/security.js` and route-specific limits | Resolved |
| 9 | CORS | Fragmented per-route origin checks | Medium | Centralized strict allowlist CORS with preflight handling | Resolved |
| 10 | CSRF | CSRF checks implemented inconsistently | High | Added centralized CSRF validation with token format + equality enforcement | Resolved |
| 11 | Error Handling | Potential internal error leakage via direct logging patterns | Medium | Added `middleware/errorHandler.js` with redaction and safe client error responses | Resolved |
| 12 | Dependency Security | `npm audit` reported high/moderate issues in `react-router-dom` and `vite` | High | Updated dependencies to patched versions and prepared lockfile refresh | Resolved |
| 13 | CI Security | No CI gate for secret scanning and vulnerability audit | High | Added `.github/workflows/security.yml` with `npm audit` + gitleaks | Resolved |
| 14 | Validation Automation | No standard repeatable security verification command | Medium | Added `scripts/security-audit.sh` and `npm run security:audit` | Resolved |
| 15 | Database Security | No database component found in repository | Low | Marked N/A; no DB credentials, clients, or query layers in code | Resolved (N/A) |
| 16 | File Upload Security | No file upload endpoints found in repository | Low | Marked N/A; no multipart handlers or storage flows present | Resolved (N/A) |
| 17 | Anti-automation | Endpoints accepted submissions without CAPTCHA attestation | High | Added Cloudflare Turnstile server-side verification to `api/contact.js`, `api/lead.js`, and `api/partner.js` | Resolved |
| 18 | Anti-automation | Client forms lacked CAPTCHA challenge on submit paths | High | Added Turnstile widgets to contact, get-started, and institutional forms | Resolved |
| 19 | Abuse Controls | No per-email submission throttle in place | High | Added 3-per-24h email limiter with Vercel KV support and in-memory TTL fallback | Resolved |
| 20 | Supply-chain integrity | External CDN resources lacked SRI/crossorigin integrity controls | Medium | Added SHA-384 `integrity` and `crossorigin` for external stylesheet and Turnstile script | Resolved |
| 21 | Logging security | Console-based logs without centralized redaction policy | Medium | Migrated to `pino` with automatic redaction fields and structured output | Resolved |
| 22 | Dependency hygiene | Missing automated npm update checks | Medium | Added weekly npm checks with grouped patch updates and an assignee workflow | Resolved |

## Phase-by-Phase Summary

### Phase 1 — Secrets & Environment Variables
- Performed pattern scans for hardcoded credentials and key markers.
- Added missing `.gitignore` secrets exclusions.
- Added env contract enforcement and completed `.env.example`.

### Phase 2 — Authentication & Authorization
- Current application exposes public form-ingestion APIs and no auth/session subsystem.
- No protected/private route surface exists in repository scope.

### Phase 3 — Input Validation & Injection
- Added strict schema validation and server-side sanitization for contact payload.
- Enforced consistent validation paths for lead and partner APIs.

### Phase 4 — HTTP Security Headers
- Enforced strict CSP and all required modern isolation headers.

### Phase 5 — Rate Limiting & Abuse Controls
- Added endpoint-level limits and block responses for overuse.

### Phase 6 — CORS
- Added centralized allowlist CORS policy with explicit methods/headers and preflight handling.

### Phase 7 — CSRF
- Added centralized CSRF verification for state-changing routes.

### Phase 8 — Database Security
- Not applicable in current repository (no DB present).

### Phase 9 — File Upload Security
- Not applicable in current repository (no file upload endpoints present).

### Phase 10 — Dependency Security
- Upgraded vulnerable direct dependencies to patched versions.

### Phase 11 — Error Handling & Disclosure
- Added centralized error middleware with sensitive field redaction.

### Phase 12 — Deployment Hardening
- Added codified controls (headers, CI, scripts) and documented remaining infra-level checks.

### Phase 13 — Frontend Build Headers
- Implemented in `vercel.json` for global routes.

### Phase 14 — Final Validation
- Added script automation for dependency audit, secret scan, ZAP/Lighthouse/TLS checks.

## Additional Hardening (Follow-up)

- Turnstile:
	- Added server-side verification against Cloudflare siteverify endpoint.
	- Added client-side Turnstile widget integration on all primary submission forms.
	- Added env keys: `TURNSTILE_SECRET_KEY`, `VITE_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
- Per-email throttling:
	- Added max 3 successful submissions per email per 24-hour window.
	- Uses Vercel KV REST API when configured, in-memory TTL fallback otherwise.
- SRI:
	- Added `integrity` + `crossorigin` attributes for CDN resources in `index.html`.
- Structured logs:
	- Replaced console logging paths with `pino` for server and client logging APIs.
	- Enabled redaction for `email`, `password`, `token`, `authorization`, `cookie`, `ip`, and `x-forwarded-for` fields.
- Dependency automation:
	- Added weekly npm update checks with grouped patch updates and an assignee workflow.

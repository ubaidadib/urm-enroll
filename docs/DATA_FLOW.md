# Data Flow

## Lead Intake Lifecycle
1. User completes Smart Quiz.
2. Client sends payload via [src/app/lib/secure-submit.ts](src/app/lib/secure-submit.ts).
3. Payload validated and rate limited in [api/lead.js](api/lead.js) or [netlify/functions/lead.js](netlify/functions/lead.js).
4. Response returns 204 on success.

## Institutional Partnership Lifecycle
1. Partner completes the institutional inquiry form.
2. Client sends payload via [src/app/lib/partner-submit.ts](src/app/lib/partner-submit.ts).
3. Payload validated and rate limited in [api/partner.js](api/partner.js) or [netlify/functions/partner.js](netlify/functions/partner.js).
4. Response returns 204 on success.

## Security Controls
- CSRF token required in header and payload.
- Origin validation using allowed origins.
- Bot protection via user-agent checks.

## Storage
- No persistent storage in this mock endpoint.
- Replace with secure backend integration when ready.

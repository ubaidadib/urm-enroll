# Architecture

## System Overview
- Single-page Vite + React + TypeScript application.
- Section-based layout with lazy-loaded modules and shared design system.
- Multilingual support with RTL capability.

## Core Flow
Hero -> Nexus Infrastructure -> Nexus Launch -> Services -> Founder Vision -> Destination Hub -> Germany Workforce Module -> Institutional Partnership -> Social Proof -> Case Studies -> Institutional Timeline -> Smart Quiz -> Footer

## Data and State
- Language state managed in [src/app/i18n/language-context.tsx](src/app/i18n/language-context.tsx).
- Lead submission handled through [src/app/lib/secure-submit.ts](src/app/lib/secure-submit.ts).
- Institutional inquiry submission handled through [src/app/lib/partner-submit.ts](src/app/lib/partner-submit.ts).

## Security Layers
- CSP and security headers at edge.
- CSRF, rate limiting, and validation on /api/lead and /api/partner.

## Deployment
- Vercel/Netlify static hosting with serverless endpoints.
- Optional NGINX reverse proxy for VPS deployments.

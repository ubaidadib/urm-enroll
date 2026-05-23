# URM Enroll

> A production-grade multilingual education and skilled-migration platform with a **Germany-first** positioning, run as a Vite + React SPA in front of Vercel serverless API routes.

URM Enroll helps international students and skilled professionals — primarily from Lebanon and the wider MENA region — discover study programs in Europe, evaluate their eligibility for the German **Chancenkarte** (Opportunity Card), and convert into qualified leads through a hardened, security-first lead pipeline.

The application is **not** a CMS, not a job board, and not a generic agency website. It is a conversion-engineered, SEO-optimised, locale-aware decision system for two distinct audiences:

1. **Students** looking at European universities (with a Germany emphasis).
2. **Skilled professionals** evaluating the Germany Chancenkarte and skilled-migration pathway.

Every page, component, route, API, and middleware in this repo serves one of those two journeys.

---

## Table of Contents

1. [What This Repository Contains](#what-this-repository-contains)
2. [Tech Stack](#tech-stack)
3. [Top-Level Directory Layout](#top-level-directory-layout)
4. [Architectural Overview](#architectural-overview)
5. [Routing System](#routing-system)
6. [Internationalisation (i18n)](#internationalisation-i18n)
7. [Theme and Design System](#theme-and-design-system)
8. [Pages](#pages)
9. [Sections and Components](#sections-and-components)
10. [Lead and Conversion Pipeline](#lead-and-conversion-pipeline)
11. [Germany Careers / Chancenkarte Division](#germany-careers--chancenkarte-division)
12. [Chancenkarte Eligibility Quiz](#chancenkarte-eligibility-quiz)
13. [Nursing Assessment](#nursing-assessment)
14. [Smart Match Quiz](#smart-match-quiz)
15. [API Endpoints (Serverless)](#api-endpoints-serverless)
16. [Security Architecture](#security-architecture)
17. [SEO System](#seo-system)
18. [Sitemap, Prerender, and Static Generation](#sitemap-prerender-and-static-generation)
19. [Analytics, Tracking, and Personalisation](#analytics-tracking-and-personalisation)
20. [Instagram Integration](#instagram-integration)
21. [Calendly Booking Integration](#calendly-booking-integration)
22. [Theme, Accessibility, and RTL Support](#theme-accessibility-and-rtl-support)
23. [Build, Run, and Quality Gates](#build-run-and-quality-gates)
24. [Environment Variables (Full Reference)](#environment-variables-full-reference)
25. [Deployment](#deployment)
26. [Documentation Index](#documentation-index)
27. [Conventions and Contribution Notes](#conventions-and-contribution-notes)
28. [Glossary](#glossary)

---

## What This Repository Contains

| Layer | Description |
| --- | --- |
| **Frontend SPA** | React 18 + TypeScript + Vite 6 single-page app, route-based, lazy-loaded per page, multilingual (EN / DE / AR), RTL-aware. |
| **Serverless API** | Vercel-style functions under `api/` (lead, contact, partner, instagram, health). |
| **Security layer** | Shared `middleware/` (Turnstile, CSRF, origin checks, rate limiting, body-size caps, bot filtering, email-quota limiting). |
| **i18n** | Custom locale loader (`src/i18n/`) with type-safe key parity across English, German, and Arabic. |
| **Design system** | Tailwind v4 with a CSS-variable theme (`src/styles/theme.css`, `glass.css`) and light/dark/system mode. |
| **Content data** | Structured data files under `src/data/` for destinations, universities, programs, success stories, nursing questions, and the Germany / Chancenkarte modules. |
| **SEO system** | Per-locale metadata (`src/app/seo/seo-content.ts`), JSON-LD schemas, breadcrumbs, hreflang alternates, canonical handling, and multilingual sitemaps. |
| **Build pipeline** | Sitemap generation → Vite build → headless prerender of every locale-prefixed route into static HTML for SEO and first-paint speed. |
| **Docs** | `docs/` contains architecture, security, accessibility, SEO, data-flow, Instagram and UI/UX guides. |

---

## Tech Stack

| Concern | Choice | Version |
| --- | --- | --- |
| Framework | React | 19 |
| Language | TypeScript | 5.7.3 |
| Bundler | Vite | 6 |
| Routing | React Router | v7 (`react-router-dom`) |
| Styling | Tailwind CSS | v4 (via `@tailwindcss/vite`) |
| Motion | `motion` (Framer Motion v12 lineage) | ^12.38 |
| Icons | `lucide-react` | 0.487 |
| Validation | `zod` | 3.23.8 |
| Email | `nodemailer` | 8.0.7 |
| Logging | `pino` | ^10.3 |
| Sanitisation | `sanitize-html` | ^2.17 |
| i18n helpers | `i18next` + `react-i18next` (light usage; the project ships a custom typed provider) |
| Hosting | Vercel (static + serverless) |
| Bot defence | Cloudflare Turnstile |

---

## Brand Assets

Logo files are stored under `public/img/` and served as static assets:

| File | Usage |
| --- | --- |
| `public/img/logo-favicon.png` | Browser favicon and Apple touch icon (188×188 px) |
| `public/img/logo-light.png` | Light-theme wordmark (used on dark backgrounds) |
| `public/img/logo-dark.png` | Dark-theme wordmark (used on light backgrounds) |
| `public/img/logo-icon.png` | Square icon variant without wordmark |
| `public/img/ubaidadib-founder.JPEG` | Founder portrait (used on About page) |
| `public/img/ubaidadib-founder-original.JPEG` | Founder portrait (full-resolution original) |

The OG image should be placed at `public/img/og-image.png` (1200×630 px recommended). It is referenced in the `<meta property="og:image">` and `<meta name="twitter:image">` tags in `index.html`.

---

## Social Media

| Platform | Handle / URL |
| --- | --- |
| Instagram | [@urmenroll](https://www.instagram.com/urmenroll) |
| Facebook | [URMENROLL](https://www.facebook.com/URMENROLL) |
| LinkedIn | [urm-enroll](https://www.linkedin.com/company/urm-enroll) |
| TikTok | [@urm.enroll.ltd](https://www.tiktok.com/@urm.enroll.ltd) |

---

## Top-Level Directory Layout

```text
.
├── api/                            # Vercel serverless endpoints
│   ├── contact.js                  # Contact form (SMTP via nodemailer)
│   ├── health.js                   # Liveness / readiness probe
│   ├── instagram.js                # Cached Instagram media feed proxy
│   ├── lead.js                     # Lead capture pipeline (quiz + funnel)
│   └── partner.js                  # Institutional / agent partnership intake
├── config/
│   └── env.validation.js           # Server-side env validation (zod)
├── docs/                           # Architecture / security / SEO / a11y docs
├── lib/                            # Server utilities (pino, instagram helpers)
├── middleware/                     # Reusable serverless middleware
│   ├── email-rate-limit.js         # Per-email submission throttling (KV-backed)
│   ├── errorHandler.js             # Structured error responses
│   ├── security.js                 # withSecurity() composer (CSRF, origin, bots,
│   │                               # rate limit, body cap, methods, JSON enforce)
│   └── turnstile.js                # Cloudflare Turnstile verification
├── public/                         # Static assets, robots.txt, sitemaps
├── scripts/
│   ├── check-translations.js       # i18n parity validator
│   ├── generate-sitemap.mjs        # Builds /public/sitemap*.xml
│   ├── prerender-static.mjs        # Headless prerender for every route × locale
│   ├── security-audit.sh           # CI-friendly security checks
│   ├── ui-smoke-audit.mjs          # Lightweight UI smoke checks
│   └── write-*.py                  # Long-form article generators
├── src/
│   ├── app/
│   │   ├── App.tsx                 # Router shell, providers, route table
│   │   ├── components/             # Reusable components (forms, UI, layout, germany/)
│   │   ├── context/                # React contexts (favorites, comparison)
│   │   ├── hooks/                  # App-scoped hooks
│   │   ├── pages/                  # Top-level routed pages
│   │   ├── sections/               # Composable page sections
│   │   ├── seo/                    # SeoManager + SeoHead + structured data
│   │   └── utils/                  # App-scoped helpers
│   ├── data/                       # Static + structured data
│   │   ├── destinations.ts
│   │   ├── germany/                # NEW — Chancenkarte / careers data layer
│   │   ├── nursing-assessment-questions.ts
│   │   ├── partners.ts
│   │   ├── programs/               # Per-country JSON program datasets
│   │   ├── quiz-config.ts
│   │   ├── success-stories.ts
│   │   └── universities.ts
│   ├── hooks/                      # Cross-page React hooks
│   ├── i18n/                       # Custom typed i18n system
│   │   ├── config.ts
│   │   ├── detectLanguage.ts       # Storage / browser-based language detection
│   │   ├── language-context.tsx    # LanguageProvider + useLanguage()
│   │   ├── loader.ts               # Lazy locale loading
│   │   ├── locales/                # en/, de/, ar/ — one TS file per namespace
│   │   ├── TRANSLATION_GUIDE.md
│   │   └── types.ts                # Type-derived parity contracts
│   ├── lib/                        # Frontend libraries
│   │   ├── analytics.ts
│   │   ├── csrf.ts                 # Per-session CSRF token issuance
│   │   ├── env.ts                  # Public env access (zod-checked)
│   │   ├── secure-submit.ts        # Centralised /api/lead submitter
│   │   ├── theme.ts
│   │   └── ...
│   ├── services/                   # Domain services
│   │   ├── lead-service.ts         # End-to-end lead orchestration
│   │   ├── lead-scoring.ts         # Lead quality score
│   │   ├── lead-types.ts
│   │   ├── lead-webhooks.ts        # CRM / WhatsApp / Email adapter dispatch
│   │   └── chancenkarte-lead.ts    # Chancenkarte-specific submitter
│   ├── styles/                     # Global, glass, theme CSS
│   ├── types/                      # Ambient type declarations
│   └── utils/                      # Personalisation, experiments, tracking
├── index.html
├── package.json
├── postcss.config.mjs
├── PRE_DEPLOYMENT_CHECKLIST.md
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
```

---

## Architectural Overview

URM Enroll is structured as four concentric layers:

```
┌──────────────────────────────────────────────────────────────┐
│ 1. Static assets + prerendered HTML  (dist/, public/)        │
│    – Per-locale sitemap.xml, robots.txt, og-image.svg        │
│    – One prerendered index.html per route × locale           │
├──────────────────────────────────────────────────────────────┤
│ 2. React SPA  (src/)                                         │
│    – Lazy-loaded pages (App.tsx route table)                 │
│    – LanguageProvider, ThemeProvider, BookingModalProvider   │
│    – Favorites, Comparison contexts                          │
│    – AppShell (header, footer, sticky CTA, cookie banner)    │
├──────────────────────────────────────────────────────────────┤
│ 3. Serverless API  (api/)                                    │
│    – Stateless functions composed with withSecurity()        │
│    – Validate → Turnstile → CSRF → origin → rate-limit       │
│    – nodemailer for transactional email                      │
│    – KV (optional) for per-email rate windows                │
├──────────────────────────────────────────────────────────────┤
│ 4. Integrations                                              │
│    – Cloudflare Turnstile (bot defence)                      │
│    – Instagram Graph API (cached media feed)                 │
│    – Calendly (embedded consultation booking)                │
│    – Optional Vercel KV (durable per-email throttling)       │
└──────────────────────────────────────────────────────────────┘
```

**Important invariants:**

- All client → server traffic for forms goes through `secureSubmitLead()` → `/api/lead`, which always carries a CSRF token, a Turnstile token, an `x-urm-client` header, `credentials: "omit"`, and `referrerPolicy: "no-referrer"`.
- EN is the source of truth for translation shape; `TranslationKeys = Widen<typeof en>` forces DE and AR to match — this is enforced at compile time.
- The full route table exists twice in `App.tsx`: once mounted on `/` (default-language detection) and once under `/:lang/*` (explicit locale prefix).

---

## Routing System

Routes live in [`src/app/App.tsx`](src/app/App.tsx). Two parallel route trees are mounted:

1. **Default tree** — `/`, `/services`, `/programs`, …
2. **Localised tree** — `/:lang/*` where `lang ∈ {en, de, ar}`

A `LocaleRoute` wrapper synchronises the URL prefix into the `LanguageProvider`. A separate `FocusShell` outlet renders distraction-free pages (the AI Smart Match `/quiz`).

### Full route inventory

| Path | Component | Layout | Purpose |
| --- | --- | --- | --- |
| `/` | `HomePage` | AppShell | Brand homepage, hero, social proof, quiz teaser, CTA banners. |
| `/services` | `ServicesPage` | AppShell | Service catalogue. |
| `/programs` | `ProgramsPage` | AppShell | Programs discovery (filters, sort, search). |
| `/programs/:id` | `ProgramDetailPage` | AppShell | Per-program detail, requirements, apply. |
| `/universities` | `UniversitiesPage` | AppShell | Universities discovery. |
| `/universities/:id` | `UniversityDetailPage` | AppShell | University profile with related programs. |
| `/destinations` | `DestinationsPage` | AppShell | Country / market overviews. |
| `/destinations/:countrySlug` | `CountryDetailPage` | AppShell | Per-country detail (Germany, France, etc.). |
| `/compare` | `ComparePage` | AppShell | Side-by-side comparison of saved programs. |
| `/saved` | `SavedPage` | AppShell | Favourites (programs + universities). |
| `/nursing` | `NursingPage` | AppShell | Nursing in Germany hub. |
| `/nursing-assessment` | `NursingAssessmentPage` | AppShell | 20-question nursing readiness assessment. |
| `/germany-careers` | `GermanyCareersPage` | AppShell | Premium Germany Careers landing page. |
| `/germany-jobs` | `GermanyJobsPage` | AppShell | Germany shortage occupations + placement intro. |
| `/germany-relocation` | `GermanyRelocationPage` | AppShell | End-to-end relocation services in Germany. |
| `/chancenkarte` | `ChancenkartePage` | AppShell | Chancenkarte hub (explainer + pillars). |
| `/chancenkarte/eligibility` | `ChancenkarteEligibilityPage` | AppShell | **18-question eligibility quiz with lead gate and result.** |
| `/chancenkarte/process` | `ChancenkarteProcessPage` | AppShell | Step-by-step process timeline. |
| `/chancenkarte/requirements` | `ChancenkarteRequirementsPage` | AppShell | Document checklist (mandatory + optional). |
| `/chancenkarte/success-stories` | `ChancenkarteSuccessStoriesPage` | AppShell | Verified client testimonials. |
| `/chancenkarte/faq` | `ChancenkarteFaqPage` | AppShell | 12-question FAQ with FAQPage JSON-LD. |
| `/partnerships` | `PartnershipsPage` | AppShell | Institutional + agent partnership intake. |
| `/about` | `AboutPage` | AppShell | Company, mission, team. |
| `/contact` | `ContactPage` | AppShell | Contact form (SMTP). |
| `/resources` | `ResourcesPage` | AppShell | Long-form article index. |
| `/resources/how-to-apply-german-university` | article | AppShell | SEO article. |
| `/resources/student-visa-germany-guide` | article | AppShell | SEO article. |
| `/resources/free-universities-germany` | article | AppShell | SEO article. |
| `/quiz` | `QuizPage` | FocusShell | AI Smart Match (focus-mode). |
| `/privacy`, `/terms`, `/cookies`, `/impressum` | `LegalPage` | AppShell | Legal documents. |
| `*` | `LegalNotFound` | AppShell | 404. |

All of the above also exist under `/en/*`, `/de/*`, and `/ar/*`.

---

## Internationalisation (i18n)

The project ships a **custom typed i18n system** (not a runtime-only library), implemented under [`src/i18n/`](src/i18n/).

### How it works

- `src/i18n/locales/en/index.ts` exports `en` as `const`. This is the single source of truth.
- `src/i18n/types.ts` derives `TranslationKeys = Widen<typeof en>` — German and Arabic must satisfy this shape. Missing or misshaped keys break the type check.
- `LanguageProvider` (in `language-context.tsx`) exposes `t<T>(key)`, `language`, `dir`, `setLanguage`, `setLanguageForRoute`, `resetLanguageToAuto`.
- `t()` falls back to English if a key is missing in the active locale at runtime, and warns in development.
- `loader.ts` lazy-loads AR/DE on demand. EN is bundled synchronously so the default language is zero-flash.
- `detectLanguage.ts` reads `localStorage` first, then `navigator.language`, then defaults to EN.
- HTML `lang` and `dir` are updated automatically on language change.

### Locale files (per namespace)

```
src/i18n/locales/{en|de|ar}/
├── about.ts
├── chancenkarte.ts          # Chancenkarte hub / process / FAQ / stories
├── common.ts                # globalCta, leadForm, agencyComparison, trust, booking
├── contact.ts
├── eligibilityQuiz.ts       # Quiz intro / steps / questions / gate / result
├── enrollment.ts            # quiz, institutional, agentPortal
├── errors.ts                # notFound, errorBoundary
├── footer.ts
├── germany.ts               # Germany hero / professions / trust / jobs / relocation
├── hero.ts
├── index.ts                 # Composes the locale
├── legal.ts
├── nav.ts                   # header.nav.*
├── programs.ts              # nexus, services, destinations, workforce, nursing,
│                            # studentJourney, workforceCalculator, findProgram
└── seo.ts
```

Parity is verified by `npm run check:translations` — at the time of writing, all three locales hold **1,542 leaf keys**.

### Calling translations

```tsx
import { useLanguage } from "@/i18n/language-context";

function MyComponent() {
  const { t, dir, language } = useLanguage();
  return (
    <p dir={dir} lang={language}>
      {t<string>("germany.hero.title")}
    </p>
  );
}
```

`t<readonly string[]>("…")` is used for list translations; `t<{ title: string; body: string }[]>` for array-of-object lists.

---

## Theme and Design System

### Tailwind v4

`tailwind.config.ts` declares the design system in **CSS variables**, defined in [`src/styles/theme.css`](src/styles/theme.css) (and complementary `glass.css`). The Tailwind colour tokens map straight onto these CSS variables, so dark mode and any future theme swap is a CSS-only operation.

### Token namespaces

```
background-{primary|surface|elevated|secondary|tertiary|hover|navy-subtle|steel-subtle}
text-{primary|secondary|muted|disabled}
border-{DEFAULT|strong|interactive}
accent-{primary|primary-strong|primary-hover|success|success-strong|tech|tech-strong|steel}
brand-{navy|steel|gold|teal}-{50…900/950}
success | warning | error | info
```

`brand-gold` and the explicit `#d4af37` accent are used across the Germany / Chancenkarte division to signal premium positioning while remaining inside the existing theme system.

### Theme provider

[`src/app/components/ui/theme-provider.tsx`](src/app/components/ui/theme-provider.tsx) supplies `themeSource ∈ {system, manual}` and the active mode. The header `ThemeToggle` lets users override their system preference; `resetLanguageToAuto()` + `setTheme("system")` returns control to the OS.

### Fonts

`Manrope` (latin) and `Noto Sans Arabic` (Arabic) are pre-loaded; Tailwind defines `font-sans` and `font-arabic`. The `AppShell` adds `font-arabic` when `dir === "rtl"`.

---

## Pages

Each page is **lazy-loaded** in `App.tsx` and follows the same skeleton:

1. `SeoManager` with a `pageKey` and optional `breadcrumbs` / `structuredData`.
2. A breadcrumb row (when nested).
3. A hero section.
4. One or more composable sections from `src/app/sections/` or domain-specific components from `src/app/components/`.
5. A final CTA section + the floating `WhatsAppCTA` for Germany pages.
6. A `usePersonalization()` page-view signal (where applicable).

The full list of pages and their location:

```
src/app/pages/
├── about-page.tsx
├── articles/
│   ├── free-universities-germany.tsx
│   ├── how-to-apply-german-university.tsx
│   └── student-visa-germany-guide.tsx
├── compare-page.tsx
├── contact-page.tsx
├── country-detail-page.tsx
├── destinations-page.tsx
├── germany/                              # Germany Careers / Chancenkarte
│   ├── chancenkarte-eligibility-page.tsx # ★ Interactive quiz
│   ├── chancenkarte-faq-page.tsx
│   ├── chancenkarte-page.tsx             # Hub
│   ├── chancenkarte-process-page.tsx
│   ├── chancenkarte-requirements-page.tsx
│   ├── chancenkarte-success-stories-page.tsx
│   ├── germany-careers-page.tsx          # Premium landing
│   ├── germany-jobs-page.tsx
│   └── germany-relocation-page.tsx
├── home-page.tsx
├── legal-page.tsx
├── not-found-page.tsx
├── nursing-assessment-page.tsx
├── nursing-page.tsx
├── partnerships-page.tsx
├── program-detail-page.tsx
├── programs-page.tsx
├── quiz-page.tsx
├── resources-page.tsx
├── saved-page.tsx
├── services-page.tsx
├── universities-page.tsx
└── university-detail-page.tsx
```

---

## Sections and Components

### Sections — `src/app/sections/`

Composable, page-agnostic sections used by multiple pages.

```
about-overview.tsx                 case-studies.tsx
agency-comparison.tsx              company-timeline.tsx
agent-portal-showcase.tsx          destination-comparison.tsx
destinations-compact.tsx           featured-universities-carousel.tsx
find-your-program.tsx              founder-vision.tsx
germany-workforce-module.tsx       global-partners-marquee.tsx
hero-section.tsx                   home-final-cta-banner.tsx
home-how-it-works.tsx              home-instagram-section.tsx
home-testimonials.tsx              institutional-partnership.tsx
nexus-launch.tsx                   nursing-compact.tsx
program-categories-section.tsx    services-grid.tsx
smart-quiz.tsx                     social-proof.tsx
student-journey-steps.tsx          success-stories-section.tsx
success-story-card.tsx             trust-section.tsx
workforce-calculator.tsx
germany/
└── chancenkarte-final-cta.tsx     # Dark navy + gold CTA used across Germany pages
```

### Components — `src/app/components/`

| Folder | What lives here |
| --- | --- |
| `compare/` | `comparison-floating-bar.tsx` — sticky bar that appears when items are added to compare. |
| `cta/` | `global-cta-system.tsx`, `scroll-triggered-cta.tsx`, `sticky-cta-bar.tsx`. |
| `forms/` | `smart-lead-form.tsx` — the canonical 5-step lead form (Turnstile + CSRF + experiments). |
| `germany/` | The Germany / Chancenkarte component library (see [Germany Careers / Chancenkarte Division](#germany-careers--chancenkarte-division)). |
| `layout/` | `app-shell.tsx`, `focus-shell.tsx`, `header.tsx`, `footer.tsx`, `breadcrumbs.tsx`, `scroll-to-top.tsx`, `preloader.tsx`, `section-skeleton.tsx`. |
| `ui/` | Buttons, modals, tabs, theme toggle, search, filter drawer/panel, cookie banner, turnstile widget, calendly badge, image-with-fallback, page-hero, modern-cards, nav-dropdown, and dozens more. |

---

## Lead and Conversion Pipeline

The lead pipeline is the most security-critical and conversion-critical part of the codebase.

### Flow

```
SmartLeadForm  ─┐
                ├─►  submitLead(formData, turnstileToken)
GermanyLeadForm ┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│ src/services/lead-service.ts                                │
│   1. Normalise raw form data → QualifiedLead (UUID, ISO ts) │
│   2. computeLeadScore() + deriveUrgency() + deriveTags()    │
│   3. trackLeadQualified()                                   │
│   4. secureSubmitLead() → /api/lead  (Turnstile + CSRF)     │
│   5. dispatchWebhooks() → CRM / WhatsApp / Email adapters   │
│   6. trackLeadRouted()                                      │
└─────────────────────────────────────────────────────────────┘
                │
                ▼
        /api/lead (Vercel function)
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│ withSecurity()                                              │
│   • methods: ["POST"]                                       │
│   • requireJson                                             │
│   • requireCsrf                                             │
│   • requireOrigin                                           │
│   • blockBots                                               │
│   • maxBodyBytes: 10 KB                                     │
│   • rateLimit: lead key, 20 / 15 min                        │
│                                                             │
│ zod schema validation                                       │
│ verifyTurnstileToken()                                      │
│ checkEmailSubmissionLimit() — 3 / 24h per email             │
│ recordSuccessfulEmailSubmission()                           │
│ 204 No Content                                              │
└─────────────────────────────────────────────────────────────┘
```

### Files involved

| File | Role |
| --- | --- |
| [`src/app/components/forms/smart-lead-form.tsx`](src/app/components/forms/smart-lead-form.tsx) | 5-step animated form (basic info → user type → details → qualification → conversion). Variant-tested via `useExperiment("lead_form_steps")`. |
| [`src/app/components/germany/germany-lead-form.tsx`](src/app/components/germany/germany-lead-form.tsx) | Lead-capture gate for the Chancenkarte quiz (full name, email, WhatsApp, profession, country). |
| [`src/services/lead-service.ts`](src/services/lead-service.ts) | End-to-end orchestration: normalisation, scoring, submit, webhooks, tracking. |
| [`src/services/lead-scoring.ts`](src/services/lead-scoring.ts) | Lead quality scoring algorithm. |
| [`src/services/lead-types.ts`](src/services/lead-types.ts) | `QualifiedLead`, `LeadSubmitResult`, `URGENCY_MAP`. |
| [`src/services/lead-webhooks.ts`](src/services/lead-webhooks.ts) | Adapter dispatch (CRM, WhatsApp, Email) post-submit. |
| [`src/services/chancenkarte-lead.ts`](src/services/chancenkarte-lead.ts) | Chancenkarte-specific encoder that maps quiz answers + verdict into the existing `/api/lead` payload shape. |
| [`src/lib/secure-submit.ts`](src/lib/secure-submit.ts) | Hardened `fetch` wrapper (CSRF token, `credentials: omit`, `referrerPolicy: no-referrer`, 5s timeout, multi-endpoint fallback). |
| [`src/lib/csrf.ts`](src/lib/csrf.ts) | Session-scoped CSRF token issuance. |
| [`api/lead.js`](api/lead.js) | The serverless endpoint — `withSecurity` composer + zod + Turnstile + per-email throttle. |
| [`middleware/security.js`](middleware/security.js) | `withSecurity()` factory used by every protected route. |
| [`middleware/turnstile.js`](middleware/turnstile.js) | Server-side Turnstile verification. |
| [`middleware/email-rate-limit.js`](middleware/email-rate-limit.js) | Per-email submission counter (in-memory by default; Vercel KV when configured). |

### Lead payload (`/api/lead`)

```ts
{
  fullName?: string;                 // ≤120 chars
  email?: string;                    // email, ≤254 chars
  destination: string;               // required, ≤120 chars
  studyLevel?: string;
  field?: string;
  budget?: string;
  timeline: string;                  // required, ≤120 chars
  matchScore?: number;               // 0–100
  language?: string;                 // ≤16 chars
  turnstileToken: string;            // required
  csrfToken: string;                 // 16–128 chars
}
```

The endpoint returns **204 No Content** on success; the client trusts a `2xx` status, not the body.

---

## Germany Careers / Chancenkarte Division

A premium sub-brand inside the existing platform that targets skilled professionals (primarily from Lebanon and MENA) considering the **German Chancenkarte** (Opportunity Card) and the wider Germany skilled-migration pathway.

### Goals

- Educate users on the Chancenkarte points system.
- Build trust through transparent process, document checklists, and verified success stories.
- Qualify and capture leads with a conversion-optimised, gated eligibility quiz.

### What's included

| Asset | Path |
| --- | --- |
| Hub page | [`src/app/pages/germany/chancenkarte-page.tsx`](src/app/pages/germany/chancenkarte-page.tsx) |
| Eligibility quiz page (★) | [`src/app/pages/germany/chancenkarte-eligibility-page.tsx`](src/app/pages/germany/chancenkarte-eligibility-page.tsx) |
| Process page | [`src/app/pages/germany/chancenkarte-process-page.tsx`](src/app/pages/germany/chancenkarte-process-page.tsx) |
| Requirements page | [`src/app/pages/germany/chancenkarte-requirements-page.tsx`](src/app/pages/germany/chancenkarte-requirements-page.tsx) |
| Success stories page | [`src/app/pages/germany/chancenkarte-success-stories-page.tsx`](src/app/pages/germany/chancenkarte-success-stories-page.tsx) |
| FAQ page (FAQPage JSON-LD) | [`src/app/pages/germany/chancenkarte-faq-page.tsx`](src/app/pages/germany/chancenkarte-faq-page.tsx) |
| Premium landing | [`src/app/pages/germany/germany-careers-page.tsx`](src/app/pages/germany/germany-careers-page.tsx) |
| Jobs page | [`src/app/pages/germany/germany-jobs-page.tsx`](src/app/pages/germany/germany-jobs-page.tsx) |
| Relocation page | [`src/app/pages/germany/germany-relocation-page.tsx`](src/app/pages/germany/germany-relocation-page.tsx) |
| Final CTA section | [`src/app/sections/germany/chancenkarte-final-cta.tsx`](src/app/sections/germany/chancenkarte-final-cta.tsx) |

### Component library — `src/app/components/germany/`

| File | What it does |
| --- | --- |
| `germany-careers-hero.tsx` | Premium navy + gold hero used by `/germany-careers`. |
| `trust-indicators.tsx` | BAMF / Anabin / GDPR / bilingual / Beirut-consulate trust strip (light or dark variant). |
| `chancenkarte-timeline.tsx` | Animated alternating timeline of the 7 process steps. |
| `germany-profession-cards.tsx` | Grid of in-demand professions with salary band and shortage-index badge. |
| `document-checklist.tsx` | Grouped checklist (identity / qualifications / experience / language / finance / additional). |
| `germany-faq.tsx` | Accordion of 12 Chancenkarte FAQ entries. |
| `success-story-card.tsx` | Verified-client testimonial card with city, year, star rating, profession. |
| `quiz-stepper.tsx` | Progress bar + per-step indicator. |
| `quiz-question-card.tsx` | Single-question card (radio cards or text). |
| `score-meter.tsx` | Animated SVG radial score meter. |
| `eligibility-score-card.tsx` | Verdict, category breakdown, gaps, recommended actions. |
| `germany-lead-form.tsx` | The lead-capture gate before reveal (full name, email, WhatsApp, profession, country, Turnstile). |
| `whatsapp-cta.tsx` | Floating + dismissible WhatsApp CTA; reads `VITE_PUBLIC_WHATSAPP_NUMBER`. |
| `useLocalizedPath.ts` | Hook that returns a path-builder which respects the current `/en|/de|/ar` prefix. |

### Data — `src/data/germany/`

| File | Purpose |
| --- | --- |
| [`eligibilityQuiz.ts`](src/data/germany/eligibilityQuiz.ts) | Question bank + Chancenkarte points model + `computeQuizResult()`. |
| [`germanyProfessions.ts`](src/data/germany/germanyProfessions.ts) | Engpassberufe with salary bands and shortage indices. |
| [`germanyProcess.ts`](src/data/germany/germanyProcess.ts) | 7-step process metadata + duration ranges. |
| [`germanyRequirements.ts`](src/data/germany/germanyRequirements.ts) | Grouped document checklist (mandatory vs optional). |
| [`germanyTestimonials.ts`](src/data/germany/germanyTestimonials.ts) | Verified success stories. |
| [`chancenkarteFaq.ts`](src/data/germany/chancenkarteFaq.ts) | Stable FAQ IDs (copy lives in i18n). |

### Translations

Three new namespaces — `germany`, `chancenkarte`, `eligibilityQuiz` — are localised in **English, German, and Arabic**, with full RTL coverage. Parity is type-checked and runtime-checked.

### Design language

Navy `#0b1530` + gold `#d4af37` accents, glassmorphism cards (`backdrop-blur-md`), subtle motion (`motion/react`), and Engpassberuf shortage badges. All built on top of the project's existing CSS-variable theme — no parallel design system.

---

## Chancenkarte Eligibility Quiz

The flagship lead-conversion experience.

### UX flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Intro   │ →  │  Quiz    │ →  │  Gate    │ →  ┌────────┐
│ (CTA)    │    │ (6 steps)│    │ (form)   │    │ Result │
└──────────┘    └──────────┘    └──────────┘    └────────┘
```

| Step | Topic | Questions |
| --- | --- | --- |
| 1 | Personal information | nationality, residence, age, marital status |
| 2 | Education | degree type, Anabin recognition, vocational training, graduation year |
| 3 | Work experience | profession, years of experience, employment status |
| 4 | Languages | German level, English level, certification |
| 5 | Financial readiness | blocked account, sponsor availability |
| 6 | Germany connection | previous stay, relatives, previous application |

**Total**: 18 questions across 6 steps, ~6 minutes.

### Scoring

The model mirrors the official German Chancenkarte points framework:

- Maximum possible points: derived from the question bank at module load time.
- **Minimum eligibility threshold**: 6 points (the legal minimum).
- Verdicts:
  - **Highly Eligible** — `totalPoints ≥ 12` *and* `≥ 6` threshold met.
  - **Potentially Eligible** — `totalPoints ≥ 6`.
  - **Needs Improvement** — below threshold.

`computeQuizResult()` returns:

```ts
{
  totalPoints: number;
  maxPoints: number;
  scorePercent: number;                  // 0–100
  verdict: "highly_eligible"
         | "potentially_eligible"
         | "needs_improvement";
  meetsChancenkarteMinimum: boolean;
  categories: { step, points, maxPoints }[];
  missingRequirements: QuizQuestionId[];  // gaps to address
  recommendedActions: RecommendedActionId[];
}
```

### Lead capture gate

Before the result is revealed, the user **must** provide:

- Full name
- Email
- WhatsApp number
- Profession
- Country of residence

The form submits via `submitChancenkarteLead()` (which delegates to `secureSubmitLead()` → `/api/lead`). The verdict, raw points, score percent, and a compact answer summary are encoded into the existing payload shape, so no API contract change is required.

### Result

The result panel features:

- An animated radial **ScoreMeter** with percent + raw points.
- A verdict headline + colour-coded threshold pill.
- Per-category breakdown with mini-progress bars.
- A "Gaps we noticed" panel.
- A prioritised "Recommended next steps" list.
- CTAs: **Book a strategy call**, **WhatsApp**, **Retake**.

---

## Nursing Assessment

[`src/app/pages/nursing-assessment-page.tsx`](src/app/pages/nursing-assessment-page.tsx) — a 20-question multiple-choice assessment of nursing-program readiness for Germany. Question bank lives in [`src/data/nursing-assessment-questions.ts`](src/data/nursing-assessment-questions.ts) and is **trilingually authored at the question level**: each question carries an `opts`, `q`, `fb` payload for `en`, `de`, and `ar`.

The verdict thresholds (`80% / 60% / below`) drive the final screen, which routes either back to retake or out to the contact form.

---

## Smart Match Quiz

The AI Smart Match (`/quiz`, `QuizPage`) is the legacy programme-matching quiz, separate from the Chancenkarte quiz. It uses the `FocusShell` layout (no header / footer) and feeds into the same `submitLead()` pipeline.

Config: [`src/data/quiz-config.ts`](src/data/quiz-config.ts).

---

## API Endpoints (Serverless)

All endpoints live in `api/` and are composed with `withSecurity()` from `middleware/security.js`. None of them require auth — they exist to receive validated, rate-limited, anonymous form submissions.

| Endpoint | Method | Purpose | Notes |
| --- | --- | --- | --- |
| [`/api/lead`](api/lead.js) | POST | Lead capture (smart-lead-form + Chancenkarte quiz). | zod-validated, Turnstile, CSRF, origin, `maxBodyBytes 10KB`, 20/15min rate limit, per-email throttle 3/24h. Returns 204. |
| [`/api/contact`](api/contact.js) | POST | Contact form. | Sends transactional email via SMTP/nodemailer. |
| [`/api/partner`](api/partner.js) | POST | Partnership intake (institutions, agents). | Same hardening stack as `/api/lead`. |
| [`/api/instagram`](api/instagram.js) | GET | Cached Instagram media feed via Instagram Graph API. | Lives behind `lib/instagram.js` cache layer. |
| [`/api/health`](api/health.js) | GET | Liveness probe (build info + timestamp). | Used by uptime monitoring. |

### `withSecurity()` options reference

```ts
withSecurity(handler, {
  methods: string[],            // allowed HTTP verbs
  requireJson: boolean,         // enforce Content-Type: application/json
  requireCsrf: boolean,         // expect x-urm-csrf header + csrfToken body
  requireOrigin: boolean,       // verify Origin / Referer against URM_ALLOWED_ORIGINS
  blockBots: boolean,           // UA-based bot screening
  maxBodyBytes: number,         // pre-parse hard cap
  rateLimit: { key, windowMs, max }, // per-IP token bucket
});
```

---

## Security Architecture

The security model is **defence-in-depth** with five layers, each independently sufficient to reject a request:

1. **Cloudflare Turnstile** — every lead-bearing form requires a successful Turnstile token. The server re-verifies the token against Cloudflare on receipt.
2. **CSRF** — a per-session token is issued client-side (`src/lib/csrf.ts`) and submitted both as `x-urm-csrf` header *and* in the JSON body. The server requires both.
3. **Origin / Referer enforcement** — the server rejects requests whose `Origin` is not in `URM_ALLOWED_ORIGINS`.
4. **Method, content-type, and body-size guards** — non-POST or oversized payloads are rejected before parsing.
5. **Rate limiting + per-email throttling** — IP-level token bucket (`20 per 15 min`) and email-level counter (`3 per 24h`, optionally KV-backed for multi-region durability).

Additional protections:

- **CSP, HSTS, X-Frame-Options, COOP / CORP, Permissions-Policy** — declared in `vercel.json` and applied to every response.
- **Input validation** — every API route validates inputs with `zod`. Numeric and string lengths are bounded.
- **No PII in logs** — `lib/pino.js` is configured for structured logs without sensitive bodies.
- **Client-side hardening** — `secureSubmitLead()` uses `credentials: "omit"`, `referrerPolicy: "no-referrer"`, and an `AbortController` timeout of 5 seconds.
- **Sanitisation** — `sanitize-html` is available for any free-text rendering on the server side.

See [`docs/SECURITY.md`](docs/SECURITY.md) and [`docs/SECURITY_AUDIT_REPORT.md`](docs/SECURITY_AUDIT_REPORT.md) for the full audit.

---

## SEO System

SEO is treated as a first-class system, not an afterthought.

### Per-page SEO

[`src/app/seo/seo-content.ts`](src/app/seo/seo-content.ts) holds `PAGE_SEO: Record<SupportedLanguage, Record<SeoPageKey, PageMeta>>`. Every page passes a `pageKey` to `SeoManager` and inherits the correct `title`, `description`, and `keywords` per locale.

### Schemas emitted

`SeoManager` (`src/app/seo/seo-manager.tsx`) automatically emits:

- `Organization`
- `WebSite` with a SearchAction
- `EducationalOrganization` (home + services)
- `FAQPage` (home + contact + Chancenkarte FAQ)
- `Person` (contact)
- `BreadcrumbList` (when breadcrumbs are supplied)
- Custom `structuredData` per-page (e.g. the Chancenkarte FAQ page builds its own `FAQPage` from the i18n entries).

### Canonical, hreflang, OpenGraph, Twitter

`SeoHead` emits canonical URL, OpenGraph tags, Twitter cards, and `<link rel="alternate" hreflang="…">` entries for EN / DE / AR plus an `x-default`.

### Long-form content

Article pages live under [`src/app/pages/articles/`](src/app/pages/articles/) and are also included in the sitemap. Content generators sit under `scripts/write-*.py`.

---

## Sitemap, Prerender, and Static Generation

The production build pipeline runs as follows (`npm run build`):

```
1. scripts/generate-sitemap.mjs
     → public/sitemap.xml             (index)
     → public/sitemap-en.xml
     → public/sitemap-de.xml
     → public/sitemap-ar.xml
2. vite build
     → dist/
3. scripts/prerender-static.mjs
     → headless Chromium visits every (route × locale) and writes dist/<lang>/<path>/index.html
```

Every new public route must be added to **both** `scripts/generate-sitemap.mjs` and `scripts/prerender-static.mjs` so it appears in the sitemap *and* gets prerendered HTML with the correct localised `<title>` / `<meta>` / structured data.

The full Germany / Chancenkarte route set is already wired into both files.

---

## Analytics, Tracking, and Personalisation

| File | Role |
| --- | --- |
| [`src/lib/analytics.ts`](src/lib/analytics.ts) | GA4 + Meta Pixel bootstrap (`VITE_GA4_MEASUREMENT_ID`, `VITE_META_PIXEL_ID`). |
| [`src/utils/tracking.ts`](src/utils/tracking.ts) | Typed event helpers: `trackFormStart`, `trackStepCompletion`, `trackFormSubmit`, `trackFormDropOff`, `trackCTA`, `trackExperimentView`, `trackExperimentConversion`, `trackLeadQualified`, `trackLeadRouted`. |
| [`src/utils/experiments.ts`](src/utils/experiments.ts) | Variant assignment + persistence; results joined to leads via `experimentVariants`. |
| [`src/utils/personalization.ts`](src/utils/personalization.ts) | Signal collection → derived user profile. |
| [`src/utils/recommendations.ts`](src/utils/recommendations.ts) | Recommendation engine for next-best content. |
| [`src/utils/user-profile.ts`](src/utils/user-profile.ts) | Persisted user-profile model. |
| [`src/hooks/useExperiment.ts`](src/hooks/useExperiment.ts) | A/B variant access for components. |
| [`src/hooks/usePersonalization.ts`](src/hooks/usePersonalization.ts) | Records signals + reads the current profile. |
| [`src/hooks/useBehavioralTriggers.ts`](src/hooks/useBehavioralTriggers.ts) | Exit-intent and scroll-depth triggers. |

---

## Instagram Integration

`api/instagram.js` proxies the Instagram Graph API and serves a normalised feed to the homepage Instagram section.

- Implementation: [`lib/instagram.js`](lib/instagram.js) (cache, fetch wrapper).
- Client: [`src/hooks/useInstagramContent.ts`](src/hooks/useInstagramContent.ts), [`src/lib/instagram-content.ts`](src/lib/instagram-content.ts), [`src/app/sections/home-instagram-section.tsx`](src/app/sections/home-instagram-section.tsx).
- Requires `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_BUSINESS_ACCOUNT_ID`.
- Cache-aware: serves stale on upstream errors so the home page never blocks on Instagram.

See `docs/INSTAGRAM_*` for the deployment checklist, quickstart, and reference.

---

## Calendly Booking Integration

The Calendly widget is wired through:

- [`src/app/components/ui/calendly-badge.tsx`](src/app/components/ui/calendly-badge.tsx)
- [`src/app/components/ui/inline-calendly.tsx`](src/app/components/ui/inline-calendly.tsx)
- [`src/app/components/ui/booking-modal.tsx`](src/app/components/ui/booking-modal.tsx) — modal layer (provider in `App.tsx`).
- [`src/app/components/ui/book-consultation-button.tsx`](src/app/components/ui/book-consultation-button.tsx) — drop-in CTA used across CTA banners.

URL is configured via `VITE_CALENDLY_URL`.

---

## Theme, Accessibility, and RTL Support

- **Dark / light / system** mode via `ThemeProvider` + `ThemeToggle`.
- **RTL** — `LanguageProvider` updates `document.documentElement.dir`. AppShell flips font (`font-arabic`). All Germany components use `dir`, `flex-row-reverse` (where appropriate), and `rtl:` Tailwind variants for icon translation.
- **Keyboard navigation** — skip link in `AppShell` (`#main-content`), focus-visible outlines, ESC closes modals and the mobile menu.
- **Screen readers** — semantic landmarks, `aria-label` / `aria-expanded` / `aria-current` on navigation, error messages marked with `role="alert"`.
- **Contrast** — tokens chosen to meet WCAG AA on both light and dark surfaces.
- **Reduced motion** — heavy animations use `viewport={{ once: true }}` and avoid auto-playing media.

Full guidance: [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md).

---

## Build, Run, and Quality Gates

### Prerequisites

- Node.js **18+**
- npm

### Install

```bash
npm install
```

### Develop

```bash
npm run dev
# Vite dev server on http://localhost:5173
```

### Build (full pipeline)

```bash
npm run build
# 1. generate-sitemap.mjs   2. vite build   3. prerender-static.mjs
```

### Preview production output

```bash
npm run preview
```

### Quality gates (run before any release)

```bash
npm run typecheck                # TypeScript strict (tsc --noEmit)
npm run check:translations       # i18n parity across en / de / ar
npm run security:audit           # bash scripts/security-audit.sh
npm run check:ui-tokens          # UI utility/token integrity guard
node scripts/ui-smoke-audit.mjs  # light UI smoke checks (optional)
```

### UI smoke audit for SEO-safe regressions

Run the audit against a local preview server so route rendering and metadata checks use production output:

```bash
# terminal 1
npm run build
npm run preview

# terminal 2
AUDIT_BASE_URL=http://127.0.0.1:4173 node scripts/ui-smoke-audit.mjs
```

What this audit covers:

- Responsive overflow checks across mobile, tablet, and desktop viewports.
- Theme toggle smoke check (light/dark switching).
- Basic accessibility checks (alt text, button labels, form labels).
- Key journey route snapshots with metadata checks for title, description, canonical, Open Graph tags, and H1 structure.

The current baseline:

- **TypeScript**: clean.
- **Translation parity**: 1,567 leaf keys × 3 locales (EN / DE / AR).
- **Build**: produces locale-prefixed HTML for every route including the 9 Germany / Chancenkarte routes × 3 locales = 27 additional prerendered pages.
- **UI smoke audit**: PASS on responsive, dark-mode toggle, accessibility labels, and key-route metadata snapshots.

---

## Environment Variables (Full Reference)

`.env.example` is the source of truth. Vite exposes only variables prefixed `VITE_` (or `NEXT_PUBLIC_`) to the client bundle. Everything else is server-only.

### Public (client-bundled)

| Key | Required | Purpose |
| --- | --- | --- |
| `VITE_PUBLIC_SITE_URL` | yes | Canonical site origin; used by SEO, sitemap, OpenGraph. |
| `VITE_ALLOWED_ORIGINS` | yes | Comma-separated origins allowed to embed forms. |
| `VITE_TURNSTILE_SITE_KEY` | yes | Cloudflare Turnstile **site key** (public). Falls back to Cloudflare's always-pass test key in dev. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | optional | Mirror of the above, retained for Vercel/Next deployments. |
| `VITE_GA4_MEASUREMENT_ID` | optional | Google Analytics 4 ID. |
| `VITE_META_PIXEL_ID` | optional | Meta Pixel ID. |
| `VITE_ANALYTICS_DEBUG` | optional | `"true"` to log analytics events to the console. |
| `VITE_CALENDLY_URL` | optional | Calendly link for the consultation widget. |
| `VITE_PUBLIC_WHATSAPP_NUMBER` | optional | Overrides the WhatsApp number used by `WhatsAppCTA` and the Chancenkarte result CTA. Defaults to the URM number in code. |
| `VITE_ENABLE_MIRROR_CATALOG` | optional | `"true"` / `"false"` — enables the mirror program catalog (`src/lib/mirror-catalog.ts`). Defaults to `true`. |
| `VITE_ENABLE_MIRROR_FALLBACK` | optional | `"true"` / `"false"` — enables fallback to the mirror catalog when the primary source is unavailable. Defaults to `true` in dev, `false` in production. |

### Server-only

| Key | Required | Purpose |
| --- | --- | --- |
| `URM_ALLOWED_ORIGINS` | yes | Comma-separated origins accepted by API routes (`requireOrigin`). |
| `SECURITY_ALLOWED_REDIRECTS` | yes | Allow-list of redirect destinations. |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | yes (for contact) | nodemailer transport. |
| `CONTACT_EMAIL` | yes | Recipient for contact-form submissions and security disclosures. |
| `TURNSTILE_SECRET_KEY` | yes | Server-side Turnstile verification secret. |
| `INSTAGRAM_ACCESS_TOKEN` | optional | Instagram Graph API access token. |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | optional | IG Business Account ID. |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | optional | Vercel KV — enables durable per-email throttling across regions. |
| `NODE_ENV` | yes | `production` in deployed environments. |

---

## Deployment

The application is designed for **Vercel** (static + serverless), but any platform that supports Vercel-style function exports and static hosting will work.

### `vercel.json` responsibilities

- SPA rewrites — every non-API path falls through to `index.html` (the prerendered file at that path wins when present).
- **Security headers** — CSP, HSTS, X-Frame-Options, COOP, CORP, Permissions-Policy, Referrer-Policy, X-Content-Type-Options.
- **Cache headers** — long-lived for hashed static assets, short for HTML / sitemap / robots.

### Release checklist (summary)

1. Run `npm run typecheck && npm run check:translations && npm run check:ui-tokens && npm run build` locally.
2. Spot-check `dist/<lang>/<route>/index.html` titles for the locale you changed.
3. Configure every required environment variable on the host.
4. Re-verify the Turnstile key matches the deployed domain.
5. Verify Cloudflare / DNS / SSL covers all `URM_ALLOWED_ORIGINS`.
6. Smoke-test `/api/health` and one lead submission end-to-end.

Full list: [`PRE_DEPLOYMENT_CHECKLIST.md`](PRE_DEPLOYMENT_CHECKLIST.md).

---

## Documentation Index

| Doc | Topic |
| --- | --- |
| [`docs/CURRENT_APPLICATION_OVERVIEW.md`](docs/CURRENT_APPLICATION_OVERVIEW.md) | High-level snapshot of the application. |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Layered architecture and runtime behaviour. |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Security model, threats, mitigations. |
| [`docs/SECURITY_AUDIT_REPORT.md`](docs/SECURITY_AUDIT_REPORT.md) | Most recent audit results. |
| [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md) | Accessibility patterns and acceptance criteria. |
| [`docs/SEO_SETUP_GUIDE.md`](docs/SEO_SETUP_GUIDE.md) | SEO setup, structured data, hreflang, sitemap. |
| [`docs/DATA_FLOW.md`](docs/DATA_FLOW.md) | End-to-end data flow from form to webhook. |
| [`docs/MODERN_UI_UX_REDESIGN.md`](docs/MODERN_UI_UX_REDESIGN.md) | UI/UX direction. |
| [`docs/INSTAGRAM_INTEGRATION.md`](docs/INSTAGRAM_INTEGRATION.md) | Deep dive on the Instagram pipeline. |
| [`docs/INSTAGRAM_QUICKSTART.md`](docs/INSTAGRAM_QUICKSTART.md) | Fastest path to enable Instagram content. |
| [`docs/INSTAGRAM_QUICK_REFERENCE.md`](docs/INSTAGRAM_QUICK_REFERENCE.md) | Operational reference. |
| [`docs/INSTAGRAM_DEPLOYMENT_CHECKLIST.md`](docs/INSTAGRAM_DEPLOYMENT_CHECKLIST.md) | Pre-flight checklist. |
| [`docs/INSTAGRAM_IMPLEMENTATION_SUMMARY.md`](docs/INSTAGRAM_IMPLEMENTATION_SUMMARY.md) | Implementation summary. |
| [`docs/INSTAGRAM_README.md`](docs/INSTAGRAM_README.md) | Overview. |
| [`src/i18n/TRANSLATION_GUIDE.md`](src/i18n/TRANSLATION_GUIDE.md) | How to add / change translations safely. |
| [`PRE_DEPLOYMENT_CHECKLIST.md`](PRE_DEPLOYMENT_CHECKLIST.md) | Final pre-release checklist. |

---

## Conventions and Contribution Notes

- **Locales are type-checked.** Adding a key to `en/*.ts` *requires* adding it to `de/*.ts` and `ar/*.ts`. `npm run typecheck` will fail otherwise.
- **Every new public route must:**
  1. Be added to `App.tsx` in **both** the default and `/:lang` trees.
  2. Be added to `scripts/generate-sitemap.mjs`.
  3. Be added to `scripts/prerender-static.mjs`.
  4. Get a `SeoPageKey` + `PAGE_SEO` entry for EN / DE / AR.
  5. Get a `inferPageKeyFromPath` mapping.
- **All lead-bearing forms must go through `secureSubmitLead()`** — never call `/api/lead` directly. CSRF + Turnstile + headers are handled centrally.
- **Use `useLocalizedPath()` for internal `<Link>`s** in any component that may render under both `/` and `/:lang/*`. Hard-coded paths like `/chancenkarte` are fine on globally-mounted routes but break on locale routes.
- **Never bypass `withSecurity()`** for new endpoints. The composer is the contract.
- **Keep prerender-safe.** Avoid top-level `window` / `document` access in modules that load at route entry. Wrap browser-only work in `useEffect`.
- **Tailwind v4 — keep classes consistent.** The codebase mixes `bg-white/[0.04]`-style arbitrary opacities with shorthand forms; either is acceptable as long as it is correct.

---

## Glossary

| Term | Meaning |
| --- | --- |
| **Chancenkarte** | The German *Opportunity Card* — a points-based residence permit (launched June 2024) that lets qualified non-EU professionals enter Germany to look for work without a prior job offer. Minimum 6 points to qualify. |
| **Anabin** | The German federal database used to assess foreign academic qualifications. An "H+" listing means the qualification is recognised. |
| **ZAB** | *Zentralstelle für ausländisches Bildungswesen* — issues formal credential-recognition statements. |
| **Sperrkonto** | A German blocked account used to prove living-cost capacity for the visa (~€11,904 for a year as of 2026). |
| **Anmeldung** | Mandatory address registration at a German Bürgeramt within ~2 weeks of arrival. |
| **Engpassberuf** | Officially declared shortage occupation in Germany. |
| **Turnstile** | Cloudflare's privacy-friendly CAPTCHA alternative used here for bot defence on every form. |
| **CSRF token** | Per-session anti-forgery token validated by the server on every state-changing API call. |
| **Webhook adapter** | A lead-routing target (CRM, WhatsApp, Email) invoked after a successful lead submission. |
| **AppShell** | The default page layout (header / footer / sticky CTA / cookie banner). |
| **FocusShell** | The minimal layout used for `/quiz`. |
| **Smart Match** | Legacy AI programme-matching quiz at `/quiz`. |
| **`secureSubmitLead`** | Central, hardened client → `/api/lead` submitter. |
| **`withSecurity`** | Server-side composer that applies the full defence stack to any API route. |

---

URM Enroll is a living platform. If something in this README ever stops matching the code, **trust the code and update this file** — `npm run typecheck` and `npm run check:translations` are always the ground truth.

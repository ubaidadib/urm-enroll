# Current Application Overview

## Product Summary

URM Enroll is a multilingual education discovery and conversion platform focused on international study pathways, with a strong Germany-first positioning and dedicated flows for universities, academic programs, destinations, nursing migration, partnerships, and contact/lead capture.

The application combines:

- A marketing and discovery frontend built with Vite, React, TypeScript, Tailwind, and motion/react.
- A serverless API layer for lead capture, contact messaging, partnership intake, health checks, and Instagram content retrieval.
- A shared design system with light/dark themes, RTL support, animated UI patterns, and structured conversion surfaces.

Core implementation entry point: [src/app/App.tsx](src/app/App.tsx)

## Technical Stack

- Frontend: React 18, TypeScript, Vite, React Router
- Styling: Tailwind CSS v4 with custom theme tokens
- Motion: motion/react
- Icons: lucide-react
- Validation: zod
- Email: Nodemailer
- Sanitization: sanitize-html
- Logging: pino
- QA tooling: Puppeteer-based smoke audit script

Package manifest: [package.json](package.json)

## Application Architecture

The application is a route-based SPA with two shell modes:

- Main shell for most pages: header, footer, sticky CTA, cookie banner, preferences toast, comparison floating bar.
- Focus shell for quiz-specific flows.

Main shell implementation: [src/app/components/layout/app-shell.tsx](src/app/components/layout/app-shell.tsx)

The app also supports locale-prefixed routing for English, German, and Arabic:

- Base routes like `/programs`
- Localized routes like `/en/programs`, `/de/programs`, `/ar/programs`

Routing source: [src/app/App.tsx](src/app/App.tsx)

## Global UX and Design System

### Design Language

The current visual system is modern, high-contrast, and premium, mixing institutional credibility with Gen Z-friendly interaction patterns.

Design characteristics:

- Gradient hero backgrounds and ambient glows
- Rounded cards and elevated surfaces
- Motion-driven entrance, hover, and tab animations
- Clear typography hierarchy with large headlines
- Gold, steel, teal, and navy brand token families
- Light/dark theme parity
- RTL-aware layouts and typography

Theme tokens and semantic color system: [src/styles/theme.css](src/styles/theme.css)

### Navigation Style

The header is now organized as a professional information architecture:

- Dropdown navigation for Universities, Programs, Destinations
- Direct links for Services, Nursing, About, Contact
- Language switcher, theme toggle, saved items, and CTA
- Compact scrolled state with glass/backdrop treatment

Header implementation: [src/app/components/layout/header.tsx](src/app/components/layout/header.tsx)

### Shared Modern Discovery Components

- Filter panels: accordion-like, animated, desktop/mobile adaptable
- Enhanced search: autocomplete-style field with recent/trending suggestions
- Modern listing cards: polished program and university cards with gradients and hover interactions

Relevant components:

- [src/app/components/ui/filter-panel.tsx](src/app/components/ui/filter-panel.tsx)
- [src/app/components/ui/enhanced-search.tsx](src/app/components/ui/enhanced-search.tsx)
- [src/app/components/ui/modern-cards.tsx](src/app/components/ui/modern-cards.tsx)

## Full Route and Page Inventory

### 1. Home Page

Route:

- `/`
- `/:lang`

Source: [src/app/pages/home-page.tsx](src/app/pages/home-page.tsx)

Purpose:

- Primary landing page and top-of-funnel conversion surface.

Major sections:

- HeroSection
- ProgramCategoriesSection
- TrustSection
- GlobalPartnersMarquee
- FindYourProgram
- DestinationsCompact
- SocialProof
- FeaturedUniversitiesCarousel
- HomeHowItWorks
- HomeTestimonials
- SmartLeadForm
- HomeFinalCtaBanner

Design style:

- Premium landing-page composition
- Lazy-loaded section strategy for performance
- Strong storytelling flow from trust to discovery to conversion
- High-contrast CTA layout with modern motion and section staging

### 2. Services Page

Route:

- `/services`
- `/:lang/services`

Source: [src/app/pages/services-page.tsx](src/app/pages/services-page.tsx)

Purpose:

- Explains service offerings, student journey, and value proposition.

Major sections:

- Hero with badge and animated stat cards
- ServicesGrid
- StudentJourneySteps
- GlobalCTA banners

Design style:

- Editorial hero with grid background and soft atmospheric glows
- Floating KPI/stat cards
- Service-grid storytelling with conversion banners

### 3. Programs Listing Page

Route:

- `/programs`
- `/:lang/programs`

Source: [src/app/pages/programs-page.tsx](src/app/pages/programs-page.tsx)

Purpose:

- Search, filter, sort, and browse academic programs across universities.

Core functionality:

- Search by program, university, or field
- Filters for degree, field, language, duration, tuition
- Desktop sticky sidebar filters
- Mobile filter drawer/panel pattern
- Pagination and sorting

Design style:

- Modern marketplace/discovery UI
- Gen Z-inspired visual polish with gradient hero and interactive cards
- High-density content presented through clean card grid and guided filtering

### 4. Program Detail Page

Route:

- `/programs/:id`
- `/:lang/programs/:id`

Source: [src/app/pages/program-detail-page.tsx](src/app/pages/program-detail-page.tsx)

Purpose:

- Deep detail page for a single academic program.

Core functionality:

- Overview, curriculum, requirements, career outcomes, apply tabs
- Save/share/compare actions
- Related program recommendations
- Multi-step application form state

Design style:

- Product-detail style layout
- Strong hero with university association and program metadata
- Tabs, stat cards, and action rail oriented toward decision support

### 5. Universities Listing Page

Route:

- `/universities`
- `/:lang/universities`

Source: [src/app/pages/universities-page.tsx](src/app/pages/universities-page.tsx)

Purpose:

- Browse institutions by country, type, and search query.

Core functionality:

- Search by university, city, or country
- Filter by country and university type
- Ranking, name, and program-count sorting
- Pagination and responsive grid

Design style:

- Companion discovery layout to Programs
- Clean modern catalog with visual cards, image-led presentation, and ranking emphasis

### 6. University Detail Page

Route:

- `/universities/:id`
- `/:lang/universities/:id`

Source: [src/app/pages/university-detail-page.tsx](src/app/pages/university-detail-page.tsx)

Purpose:

- Detailed profile for a university.

Core functionality:

- Overview, programs, campus, requirements, location tabs
- Sticky quick stats row
- Save/share actions
- Related universities suggestions

Design style:

- Visual campus/profile layout with large cover image hero
- Premium brochure-like presentation with sticky data navigation

### 7. Compare Page

Route:

- `/compare`
- `/:lang/compare`

Source: [src/app/pages/compare-page.tsx](src/app/pages/compare-page.tsx)

Purpose:

- Side-by-side comparison for shortlisted programs.

Core functionality:

- Compare tuition, duration, field, language, requirements, rating, deadline
- Highlight best tuition and shortest duration
- Remove compared items and navigate to apply

Design style:

- Utility-first comparison table
- Clean and functional rather than decorative
- Decision-support UI optimized for clarity

### 8. Saved Page

Route:

- `/saved`
- `/:lang/saved`

Source: [src/app/pages/saved-page.tsx](src/app/pages/saved-page.tsx)

Purpose:

- Personal shortlist/favorites management.

Design style:

- Expected to align with broader catalog style and support persistent interest tracking.

### 9. Destinations Page

Route:

- `/destinations`
- `/:lang/destinations`

Source: [src/app/pages/destinations-page.tsx](src/app/pages/destinations-page.tsx)

Purpose:

- Country comparison and destination-fit analysis.

Core functionality:

- Country filtering
- Access model filtering
- Language-level filtering
- Tier filtering
- Destination fit scoring
- DestinationComparison section
- Optional program builder reveal

Design style:

- Strategic decision dashboard
- Strong data-visual tone with score meters, stat bars, badges, and glass-style surfaces
- More analytical than the programs/universities listings

### 10. Nursing Page

Route:

- `/nursing`
- `/:lang/nursing`

Source: [src/app/pages/nursing-page.tsx](src/app/pages/nursing-page.tsx)

Purpose:

- Nursing relocation/workforce pathway entry point.

Core functionality:

- Hero and CTA into nursing assessment
- GermanyWorkforceModule
- WorkforceCalculator

Design style:

- Career-path hero with medical/professional framing
- Utility-heavy content below the fold for ROI and readiness evaluation

### 11. Nursing Assessment Page

Route:

- `/nursing-assessment`
- `/:lang/nursing-assessment`

Source: [src/app/pages/nursing-assessment-page.tsx](src/app/pages/nursing-assessment-page.tsx)

Purpose:

- Interactive nursing readiness/eligibility assessment.

Design style:

- Assessment workflow experience with scoring and guidance orientation.

### 12. Partnerships Page

Route:

- `/partnerships`
- `/:lang/partnerships`

Source: [src/app/pages/partnerships-page.tsx](src/app/pages/partnerships-page.tsx)

Purpose:

- B2B / institutional partnership acquisition page.

Major sections:

- InstitutionalPartnership
- AgencyComparison
- AgentPortalShowcase
- B2B GlobalCTA banners

Design style:

- Enterprise/B2B marketing page
- Built around authority, operational credibility, and partner conversion

### 13. About Page

Route:

- `/about`
- `/:lang/about`

Source: [src/app/pages/about-page.tsx](src/app/pages/about-page.tsx)

Purpose:

- Company story, founder vision, timeline, and credibility proof.

Major sections:

- AboutOverview
- FounderVision
- CompanyTimeline
- CaseStudies
- GlobalPartnersMarquee

Design style:

- Editorial/corporate narrative layout
- Strong mission storytelling with abstract visual treatment and trust metrics

### 14. Contact Page

Route:

- `/contact`
- `/:lang/contact`

Source: [src/app/pages/contact-page.tsx](src/app/pages/contact-page.tsx)

Purpose:

- Main user contact, counselor contact, and formal submission page.

Core functionality:

- Quick contact cards (WhatsApp, email, booked call)
- Counselor cards
- Inline Calendly embed
- Secure multi-field contact form
- FAQ accordion
- Turnstile verification and consent handling

Design style:

- Conversion-focused premium contact layout
- Large hero, trust badges, glass cards, strong support-oriented visual framing

### 15. Resources Listing Page

Route:

- `/resources`
- `/:lang/resources`

Source: [src/app/pages/resources-page.tsx](src/app/pages/resources-page.tsx)

Purpose:

- SEO-oriented article hub for practical study-abroad guides.

Design style:

- Minimal editorial card layout
- Clean, content-first experience with lighter visual density than marketing pages

### 16. Resource Article Pages

Routes:

- `/resources/how-to-apply-german-university`
- `/resources/student-visa-germany-guide`
- `/resources/free-universities-germany`
- Localized equivalents under `/:lang/`

Sources:

- [src/app/pages/articles/how-to-apply-german-university.tsx](src/app/pages/articles/how-to-apply-german-university.tsx)
- [src/app/pages/articles/student-visa-germany-guide.tsx](src/app/pages/articles/student-visa-germany-guide.tsx)
- [src/app/pages/articles/free-universities-germany.tsx](src/app/pages/articles/free-universities-germany.tsx)

Purpose:

- Capture organic SEO traffic with practical long-form content.

Design style:

- Article/content publishing layout optimized for readability and search intent.

### 17. Quiz Page

Route:

- `/quiz`
- `/:lang/quiz`

Source: [src/app/pages/quiz-page.tsx](src/app/pages/quiz-page.tsx)

Purpose:

- Smart eligibility and recommendation flow.

Architecture note:

- Rendered through FocusShell instead of AppShell.

Design style:

- Standalone guided flow optimized for completion and qualification.

### 18. Legal Pages

Routes:

- `/privacy`
- `/terms`
- `/cookies`
- `/impressum`
- Localized equivalents under `/:lang/`

Source: [src/app/pages/legal-page.tsx](src/app/pages/legal-page.tsx)

Purpose:

- Required legal/compliance content.

Design style:

- Structured document page layout prioritizing clarity and compliance readability.

### 19. 404 / Not Found

Route:

- Catch-all under `*`

Source: [src/app/pages/not-found-page.tsx](src/app/pages/not-found-page.tsx)

Purpose:

- Graceful fallback for invalid routes.

## API Inventory

API directory: [api](api)

### 1. Contact API

Endpoint:

- `POST /api/contact`

Source: [api/contact.js](api/contact.js)

Purpose:

- Handles secure contact form submission.

Behavior:

- Validates request with zod
- Sanitizes content with sanitize-html
- Verifies Cloudflare Turnstile token
- Applies email submission throttling
- Sends inbound email to configured contact mailbox
- Sends confirmation email to the submitting user

### 2. Lead API

Endpoint:

- `POST /api/lead`

Source: [api/lead.js](api/lead.js)

Purpose:

- Captures quiz or discovery lead payloads.

Behavior:

- Validates request payload
- Verifies Turnstile
- Rate-limits by email when provided
- Returns `204 No Content` on success

### 3. Partner API

Endpoint:

- `POST /api/partner`

Source: [api/partner.js](api/partner.js)

Purpose:

- Accepts institutional partnership / B2B intake submissions.

Behavior:

- Validates organization/contact payload
- Verifies Turnstile
- Rate-limits repeated submissions
- Returns `204 No Content` on success

### 4. Instagram API

Endpoint:

- `GET /api/instagram?limit=12`

Source: [api/instagram.js](api/instagram.js)

Purpose:

- Supplies cached Instagram content to the frontend.

Behavior:

- Validates query params
- Reads from lib-based Instagram cache/fetch layer
- Returns graceful `503` responses when configuration or upstream fetch is unavailable
- Exposes cache status and refresh metadata

Client hook usage: [src/hooks/useInstagramContent.ts](src/hooks/useInstagramContent.ts)

### 5. Health API

Endpoint:

- `GET /api/health`

Source: [api/health.js](api/health.js)

Purpose:

- Basic uptime/health endpoint returning `{ status: "ok" }`.

## Security Model

All APIs are wrapped with shared security middleware.

Key protections used across handlers:

- Allowed-method enforcement
- JSON body enforcement where needed
- CSRF enforcement where needed
- Origin validation where needed
- Rate limiting
- Bot blocking
- Body-size limits
- Turnstile validation for protected form endpoints

Security wrapper usage can be seen in all API files above.

Additional middleware directories:

- [middleware/security.js](middleware/security.js)
- [middleware/turnstile.js](middleware/turnstile.js)
- [middleware/email-rate-limit.js](middleware/email-rate-limit.js)
- [middleware/errorHandler.js](middleware/errorHandler.js)

## Frontend State and Behavioral Systems

Main app-wide providers:

- LanguageProvider
- ThemeProvider
- FavoritesProvider
- ComparisonProvider
- BookingModalProvider

These are composed in [src/app/App.tsx](src/app/App.tsx)

Important client-side systems:

- Favorites / saved programs and universities
- Program comparison context
- Booking modal interactions
- Personalization signals
- Behavioral triggers
- Theme persistence and system-theme fallback
- Locale routing and RTL switching

## Analytics and Personalization

The app includes behavior-aware instrumentation and personalization hooks.

Examples referenced across pages:

- `trackPageView`
- `recordSignal`
- SEO event tracking for language switches and CTA interactions

Representative usage:

- [src/app/pages/home-page.tsx](src/app/pages/home-page.tsx)
- [src/app/pages/services-page.tsx](src/app/pages/services-page.tsx)
- [src/app/pages/contact-page.tsx](src/app/pages/contact-page.tsx)

## Content and Data Sources

Main content/data sources include:

- University and program dataset
- Destination dataset and tier metadata
- Quiz configuration
- Success stories and partners
- Translation dictionaries for EN/DE/AR

Representative files:

- [src/data/universities.ts](src/data/universities.ts)
- [src/data/destinations.ts](src/data/destinations.ts)
- [src/data/quiz-config.ts](src/data/quiz-config.ts)
- [src/i18n](src/i18n)

## Performance and Delivery Patterns

The application uses several production-oriented delivery strategies:

- Route-level lazy loading in the main router
- Deferred/lazy rendering of noncritical home-page sections
- Preloader-based initial transition
- Static prerendering in build pipeline
- Sitemap generation
- Preview/build/typecheck/security scripts

Build scripts: [package.json](package.json)

## Quality and Governance Documentation

Additional repository docs:

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md)
- [docs/DATA_FLOW.md](docs/DATA_FLOW.md)
- [docs/SECURITY.md](docs/SECURITY.md)
- [docs/SEO_SETUP_GUIDE.md](docs/SEO_SETUP_GUIDE.md)

## Current Overall Assessment

At the current state, the application is not just a brochure site. It is a structured discovery, qualification, and conversion platform with:

- Consumer-facing discovery flows for students
- B2B acquisition flow for institutional partners
- Multi-step lead capture and contact systems
- Localized route architecture
- Themed design system with modern interaction patterns
- Secure API endpoints suitable for Vercel-style deployment

The strongest implemented surfaces today are:

- Home / top-of-funnel storytelling
- Program and university discovery pages
- Contact and partnership conversion flows
- Destination analysis and nursing pathway pages

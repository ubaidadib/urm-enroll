# URM Enroll UI/UX Refactor Master Backlog

Status legend: Not Started | In Progress | Done

## P0 (Critical Path)

### TASK DS-001
- ID: DS-001
- Title: Add UI Token Integrity Guardrail
- Category: Design System Stabilization
- Priority: P0
- Dependencies: None
- Files affected: scripts/ui-token-guard.mjs, package.json, README.md
- Objective: Prevent malformed utility classes and unsupported token usage from re-entering production.
- Implementation steps:
1. Create repo script to scan src for banned utility patterns.
2. Fail with actionable output when malformed classes are found.
3. Add npm script and document usage.
- Acceptance criteria:
1. Script exits 0 on clean tree.
2. Script exits non-zero when forbidden patterns are reintroduced.
3. Script is discoverable in README quality gates.
- Validation checks: npm run check:ui-tokens, npm run typecheck, npm run build
- Status: Completed

### TASK DS-002
- ID: DS-002
- Title: Normalize Surface Token Usage on Core High-Traffic Pages
- Category: Design System Stabilization
- Priority: P0
- Dependencies: DS-001
- Files affected: src/app/pages/home-page.tsx, src/app/pages/programs-page.tsx, src/app/pages/universities-page.tsx, src/app/pages/germany/chancenkarte-page.tsx
- Objective: Remove mixed surface/bg token drift in hero and primary content wrappers.
- Implementation steps:
1. Identify mixed class usage on top traffic pages.
2. Normalize to canonical token naming for wrappers and major blocks.
3. Keep semantics and i18n text untouched.
- Acceptance criteria:
1. Visual parity maintained.
2. No token family conflicts in modified blocks.
- Validation checks: npm run check:ui-tokens, npm run typecheck, npm run build
- Status: Completed

### TASK CTA-001
- ID: CTA-001
2. Replace duplicate inline style strings in CTA components.
3. Keep behavior and analytics events unchanged.
- Acceptance criteria:
2. Duplicate class drift reduced.
3. No CTA tracking event regressions.
Status: Completed

### TASK NAV-001
1. Introduce grouped journey labels in desktop dropdown structure.
2. Preserve existing route map and locale parity.
3. Ensure mobile menu mirrors journey grouping.
1. Header still supports EN/DE/AR.
2. Existing routes and links remain valid.

### TASK LAY-001
- ID: LAY-001
- Title: Standardize Page Section Spacing Contract
- Category: Layout System Standardization
- Priority: P0
- Dependencies: DS-002
- Files affected: src/styles/theme.css, src/styles/glass.css, src/app/components/ui/page-hero.tsx
- Objective: Enforce consistent vertical rhythm for hero, content, and CTA sections.
- Implementation steps:
1. Add section spacing utility contract.
2. Apply contract to page hero wrapper first.
3. Keep responsive behavior mobile-first.
- Acceptance criteria:
1. Section spacing is consistent on top traffic pages.
2. No layout regressions in RTL.
- Validation checks: npm run typecheck, npm run build
- Status: Completed

### TASK HOME-001
- ID: HOME-001
- Title: Homepage Journey Split and Trust Placement Upgrade
- Category: Homepage Refactor
- Priority: P0
- Dependencies: NAV-001, LAY-001
- Files affected: src/app/pages/home-page.tsx, src/app/sections/hero-section.tsx, src/app/sections/trust-section.tsx
- Objective: Make journey split explicit and improve trust visibility above the fold.
- Implementation steps:
1. Add explicit dual-journey entry actions in hero.
2. Move trust indicators to earlier decision point.
3. Maintain lazy-loading strategy.
- Acceptance criteria:
1. User can identify journey path in first viewport.
2. No SEO/route regressions.
- Validation checks: npm run typecheck, npm run build
- Status: Completed

### TASK CH-001
- ID: CH-001
- Title: Chancenkarte Quiz Step UX and Feedback Upgrade
- Category: Chancenkarte System (Flagship)
- Priority: P0
- Dependencies: CTA-001, LAY-001
- Files affected: src/app/pages/germany/chancenkarte-eligibility-page.tsx, src/app/components/germany/quiz-stepper.tsx, src/app/components/germany/quiz-question-card.tsx
- Objective: Improve progression clarity and emotional reinforcement in flagship quiz.
- Implementation steps:
1. Improve progress semantics and micro-feedback.
2. Tighten spacing and CTA consistency for mobile.
3. Keep scoring logic unchanged.
- Acceptance criteria:
1. Quiz feels smoother and clearer on mobile.
2. Existing scoring output remains intact.
- Validation checks: npm run typecheck, npm run build
- Status: Completed

### TASK CH-002
- ID: CH-002
- Title: Chancenkarte Results Confidence and Next-Step Clarity
- Category: Chancenkarte System (Flagship)
- Priority: P0
- Dependencies: CH-001
- Files affected: src/app/components/germany/eligibility-score-card.tsx, src/app/components/germany/whatsapp-cta.tsx
- Objective: Increase confidence framing and conversion clarity on result surfaces.
- Implementation steps:
1. Improve score visualization labels and confidence cues.
2. Standardize action stack for WhatsApp and consultation.
3. Keep conversion endpoints unchanged.
- Acceptance criteria:
1. Results clearly communicate eligibility confidence.
2. CTA order and hierarchy are consistent.
- Validation checks: npm run typecheck, npm run build
- Status: Completed

### TASK PU-001
- ID: PU-001
- Title: Programs and Universities Filter UX Unification
- Category: Programs and Universities UX
- Priority: P0
- Dependencies: LAY-001, CTA-001
- Files affected: src/app/pages/programs-page.tsx, src/app/pages/universities-page.tsx, src/app/components/ui/filter-panel.tsx, src/app/components/ui/filter-drawer.tsx
- Objective: Align filter interactions and sticky mobile behavior between both discovery pages.
- Implementation steps:
1. Normalize filter section ordering and affordances.
2. Standardize apply/clear semantics in mobile drawer.
3. Preserve query parameter behavior.
- Acceptance criteria:
1. Filter behavior matches across pages.
2. URL state syncing remains stable.
- Validation checks: npm run typecheck, npm run build
- Status: Completed

### TASK FORM-001
- ID: FORM-001
- Title: Lead Form Step Friction Reduction
- Category: Forms and Conversion System
- Priority: P0
- Dependencies: CTA-001
- Files affected: src/app/components/forms/smart-lead-form.tsx
- Objective: Reduce completion friction while preserving validation and security.
- Implementation steps:
1. Improve inline helper/error feedback timing.
2. Improve optional vs required field clarity.
3. Keep Turnstile and submit service logic unchanged.
- Acceptance criteria:
1. Step completion clarity improved.
2. Validation remains strict and accessible.
- Validation checks: npm run typecheck, npm run build
- Status: Completed

### TASK A11Y-001
- ID: A11Y-001
- Title: Keyboard and Focus Hardening on Nav, CTA, Filters
- Category: Accessibility and Mobile Hardening
- Priority: P0
- Dependencies: NAV-001, CTA-001, PU-001
- Files affected: src/app/components/layout/header.tsx, src/app/components/ui/filter-drawer.tsx, src/app/components/cta/*.tsx, src/styles/theme.css
- Objective: Ensure WCAG AA keyboard/focus consistency across high-intent journeys.
- Implementation steps:
1. Fix focus trap/return behavior where missing.
2. Ensure visible focus states on all interactive controls.
3. Validate touch target size for mobile critical controls.
- Acceptance criteria:
1. Keyboard-only path is usable for nav and conversion actions.
2. Focus indicator remains visible in dark/light modes.
- Validation checks: npm run typecheck, npm run build
- Status: Completed

## P1 (High Value)

### TASK DS-003
- ID: DS-003
- Title: Input/Card/Button Variant Matrix Cleanup
- Category: Design System Stabilization
- Priority: P1
- Dependencies: CTA-001
- Files affected: src/app/components/ui/modern-cards.tsx, src/app/components/forms/smart-lead-form.tsx, src/styles/glass.css
- Objective: Reduce visual variant sprawl and align with tokenized variants.
- Implementation steps:
1. Define compact/default/prominent variants.
2. Replace ad-hoc class combos in shared components.
3. Keep feature behavior unchanged.
- Acceptance criteria:
1. Reduced class duplication.
2. Visual language is consistent.
- Validation checks: npm run typecheck, npm run build
- Status: Completed

### TASK NAV-002
- ID: NAV-002
- Title: Footer IA Reorganization for Journey Clarity
- Category: Navigation and IA Fixes
- Priority: P1
- Dependencies: NAV-001
- Files affected: src/app/components/layout/footer.tsx, src/i18n/locales/en/footer.ts, src/i18n/locales/de/footer.ts, src/i18n/locales/ar/footer.ts
- Objective: Improve discoverability and reduce footer clutter.
- Implementation steps:
1. Group links by journey and support intent.
2. Keep legal and locale parity intact.
3. Preserve current route destinations.
- Acceptance criteria:
1. Footer hierarchy is clearer.
2. No translation key mismatches.
- Validation checks: npm run check:translations, npm run typecheck, npm run build
- Status: Completed

### TASK MOT-001
- ID: MOT-001
- Title: Motion Timing Contract Enforcement
- Category: Motion System Standardization
- Priority: P1
- Dependencies: LAY-001
- Files affected: src/styles/theme.css, src/app/sections/*.tsx, src/app/components/ui/*.tsx
- Objective: Normalize animation timing and reduce inconsistent transitions.
- Implementation steps:
1. Introduce motion duration utility classes/tokens.
2. Replace outlier timing values in high-traffic sections.
3. Preserve reduced-motion behavior.
- Acceptance criteria:
1. Motion feels consistent platform-wide.
2. Reduced-motion users get minimal movement.
- Validation checks: npm run typecheck, npm run build
- Status: Completed

### TASK FORM-002
- ID: FORM-002
- Title: WhatsApp and Consultation CTA Consistency Pass
- Category: Forms and Conversion System
- Priority: P1
- Dependencies: CTA-001
- Files affected: src/app/components/germany/whatsapp-cta.tsx, src/app/components/ui/book-consultation-button.tsx, src/app/components/cta/*.tsx
- Objective: Standardize conversion action ordering and visual hierarchy.
- Implementation steps:
1. Align labels and emphasis hierarchy.
2. Align focus/hover behavior.
3. Keep tracking payload schema unchanged.
- Acceptance criteria:
1. CTA hierarchy is consistent across pages.
2. Conversion actions remain trackable.
- Validation checks: npm run typecheck, npm run build
- Status: Completed

### TASK A11Y-002
- ID: A11Y-002
- Title: RTL and Mobile Touch Target Verification Sweep
- Category: Accessibility and Mobile Hardening
- Priority: P1
- Dependencies: A11Y-001
- Files affected: src/app/components/layout/header.tsx, src/app/components/ui/discovery-nav.tsx, src/app/components/ui/filter-drawer.tsx
- Objective: Enforce mobile ergonomic targets and RTL parity in key controls.
- Implementation steps:
1. Verify touch targets >= 44px in key components.
2. Normalize rtl flex ordering and text alignment utilities.
3. Keep behavior unchanged.
- Acceptance criteria:
1. Mobile controls are reachable and readable.
2. RTL layout remains coherent.
- Validation checks: npm run typecheck, npm run build
- Status: Completed

## P2 (Optimization and Documentation)

### TASK DOC-001
- ID: DOC-001
- Title: Update Accessibility and Architecture Docs to Current Paths
- Category: Accessibility and Mobile Hardening
- Priority: P2
- Dependencies: A11Y-001
- Files affected: docs/ACCESSIBILITY.md, docs/CURRENT_APPLICATION_OVERVIEW.md
- Objective: Remove documentation drift and ensure references match current component paths.
- Implementation steps:
1. Fix stale file references.
2. Add current checklist items for nav/filter/quiz a11y.
- Acceptance criteria:
1. Docs match code structure.
2. No stale path references in updated docs.
- Validation checks: npm run typecheck, npm run build
- Status: Completed

### TASK SEO-001
- ID: SEO-001
- Title: SEO-Safe UI Regression Checklist Automation Hooks
- Category: Layout System Standardization
- Priority: P2
- Dependencies: HOME-001, CH-002, PU-001
- Files affected: scripts/ui-smoke-audit.mjs, README.md
- Objective: Add simple automated checks to guard route render and metadata basics after UI refactors.
- Implementation steps:
1. Extend smoke audit for key route snapshots.
2. Add script invocation docs.
- Acceptance criteria:
1. Smoke audit runs locally post-refactor.
2. Key journey routes included.
- Validation checks: npm run typecheck, npm run build
- Status: Completed

### TASK PERF-001
- ID: PERF-001
- Title: Frontend Bundle and Hero LCP Trim Pass
- Category: Motion System Standardization
- Priority: P2
- Dependencies: MOT-001, HOME-001
- Files affected: src/app/sections/hero-section.tsx, src/app/pages/home-page.tsx, vite.config.ts
- Objective: Keep polished visuals while maintaining current performance budgets.
- Implementation steps:
1. Defer non-critical hero visual work where possible.
2. Audit heavy above-the-fold components.
3. Keep SEO/prerender compatibility unchanged.
- Acceptance criteria:
1. No significant JS/CSS growth beyond baseline.
2. Hero remains visually premium.
- Validation checks: npm run typecheck, npm run build
- Status: Completed

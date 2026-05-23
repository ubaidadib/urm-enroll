# i18n Translation System Guide

## Architecture Overview

```
src/i18n/
├── index.ts          ← Barrel exports (locales, config, types, loader)
├── config.ts         ← Supported languages, RTL config, metadata
├── types.ts          ← TypeScript types (TranslationKeys, SupportedLanguage)
├── loader.ts         ← Lazy loader with cache (EN bundled, AR/DE on demand)
│
└── locales/
    ├── en/           ← English (source of truth)
    │   ├── index.ts  ← Merges all namespace exports
    │   ├── common.ts ← Shared: labels, preloader, cookie banner, floating CTA
    │   ├── nav.ts    ← Header navigation and language controls
    │   ├── hero.ts   ← Hero section content
    │   ├── contact.ts← Entire contact page
    │   ├── enrollment.ts ← Quiz, institutional intake, get-started form
    │   ├── programs.ts   ← Nexus, services, destinations, workforce, nursing
    │   ├── about.ts      ← About, social proof, timeline, partnerships, founder
    │   ├── legal.ts      ← Privacy policy, terms, cookies
    │   ├── errors.ts     ← 404, error boundary messages
    │   ├── footer.ts     ← Footer content and links
    │   └── seo.ts        ← Meta titles, descriptions, structured data
    ├── ar/           ← Arabic (same file structure)
    └── de/           ← German (same file structure)
```

## How to Add a New Language (e.g. French)

1. Create `src/i18n/locales/fr/` folder
2. Copy all files from `src/i18n/locales/en/` into `fr/`
3. In `fr/index.ts`, rename the export from `en` to `fr`:
   ```ts
   export const fr = { ... } as const;
   ```
4. Translate all **values** in each namespace file — never change keys
5. Add `'fr'` to `SupportedLanguage` union in `src/i18n/types.ts`:
   ```ts
   export type SupportedLanguage = 'en' | 'ar' | 'de' | 'fr';
   ```
6. Add `'fr'` to `SUPPORTED_LANGUAGES` in `src/i18n/config.ts`
7. Add French metadata to `LANGUAGE_META` in `src/i18n/config.ts`:
   ```ts
   fr: { label: 'French', nativeLabel: 'Français', flag: '🇫🇷', dir: 'ltr' },
   ```
8. Add a lazy-load branch in `src/i18n/loader.ts`:
   ```ts
   } else if (lang === 'fr') {
     const mod = await import('./locales/fr/index');
     translations = mod.fr;
   }
   ```
9. Add a language option in `src/app/i18n/language-context.tsx`:
   ```ts
   { code: "fr", label: "FR", nativeLabel: "FR", dir: "ltr" },
   ```
10. Run `npx tsc --noEmit` — TypeScript will catch any missing keys
11. Done — the app handles everything else automatically

## How to Add a New Translation Key

1. Add the key to the correct EN namespace file first
   (e.g. `src/i18n/locales/en/contact.ts`)
2. TypeScript will immediately show errors in AR and DE files
3. Add the translated key to AR and DE files to resolve the errors
4. Use the key in your component via `t('contact.newKey')`

## Namespace Guide

| File             | Original Top-Level Keys                                         | Description                                     |
|------------------|-----------------------------------------------------------------|-------------------------------------------------|
| `common.ts`      | `languageLabel`, `languageNative`, `preloader`, `cookieBanner`, `floatingCta`, `common` | Shared UI: labels, preloader, cookie, CTA       |
| `nav.ts`         | `header`                                                        | Navigation items, menu labels, language switcher |
| `hero.ts`        | `hero`                                                          | Hero section content and metrics                |
| `contact.ts`     | `contact`                                                       | Contact page: form, counselors, FAQ, offices    |
| `enrollment.ts`  | `quiz`, `institutional`, `getStarted`                           | Quiz flow, institutional intake, lead form      |
| `programs.ts`    | `nexus`, `nexusLaunch`, `services`, `destinations`, `workforce`, `nursing` | Programs, services, destinations, workforce     |
| `about.ts`       | `about`, `socialProof`, `timeline`, `partnerships`, `caseStudies`, `founder` | About page, social proof, timeline, founder     |
| `legal.ts`       | `legalPagesLabel`, `legalPages`                                 | Privacy policy, terms of service, cookies       |
| `errors.ts`      | `notFound`, `errorBoundary`                                     | 404 page, error boundary messages               |
| `footer.ts`      | `footer`                                                        | Footer content, links, badges, legal            |
| `seo.ts`         | `seo`                                                           | Meta titles, descriptions, FAQ structured data  |

## Key Naming Convention

- Use dot notation: `section.subsection.element`
- Use camelCase for key names: `fullNamePlaceholder`, not `full_name_placeholder`
- EN is the source of truth — define structure there first
- Never use abbreviations in key names

## How Lazy Loading Works

- **English** is bundled in the main JS bundle (zero-delay on load)
- **Arabic** and **German** are loaded on demand when the user switches language
- Loaded translations are cached in memory — no re-fetching
- Adding a new language has **zero impact** on initial bundle size

## Type System

- `TranslationKeys` — derived from EN structure, widened from literals to base types
- `SupportedLanguage` — union of all valid language codes
- `LocaleMap` — enforces every language matches EN shape exactly
- Missing/extra keys in AR or DE will cause TypeScript compile errors

## Component Usage

```tsx
import { useLanguage } from "../i18n/language-context";

function MyComponent() {
  const { t, language, dir } = useLanguage();

  return (
    <h1>{t<string>('hero.badge')}</h1>
  );
}
```

The `t()` function:
- Accepts dot-notation keys matching the translation structure
- Falls back to EN if a key is missing in the active language
- Throws in DEV mode if a key is missing in all locales
- Supports generic typing: `t<string>()`, `t<string[]>()`, `t<{title:string}[]>()`

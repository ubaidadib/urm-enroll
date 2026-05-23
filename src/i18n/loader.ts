import type { SupportedLanguage, TranslationKeys } from './types';

const cache = new Map<SupportedLanguage, TranslationKeys>();

// Preload EN synchronously — zero flash for the default language
import { en } from './locales/en';
cache.set('en', en);

/**
 * Load a locale on demand. EN is bundled and returns instantly.
 * AR/DE are lazy-loaded only when the user switches language.
 */
export async function loadLocale(
  lang: SupportedLanguage
): Promise<TranslationKeys> {
  const cached = cache.get(lang);
  if (cached) return cached;

  let translations: TranslationKeys;

  if (lang === 'ar') {
    const mod = await import('./locales/ar/index');
    translations = mod.ar;
  } else if (lang === 'de') {
    const mod = await import('./locales/de/index');
    translations = mod.de;
  } else {
    // Fallback to EN (should not reach here)
    return en;
  }

  cache.set(lang, translations);
  return translations;
}

/** Get cached translations (sync). Returns undefined if not yet loaded. */
export function getCachedLocale(
  lang: SupportedLanguage
): TranslationKeys | undefined {
  return cache.get(lang);
}

// Locale data
export { en } from './locales/en';
export { ar } from './locales/ar';
export { de } from './locales/de';

// Config
export {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  RTL_LANGUAGES,
  LANGUAGE_META,
} from './config';

// Types
export type { TranslationKeys, SupportedLanguage, LocaleMap } from './types';

// Loader
export { loadLocale, getCachedLocale } from './loader';

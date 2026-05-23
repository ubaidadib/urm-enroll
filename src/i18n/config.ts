import type { SupportedLanguage } from './types';

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'ar', 'de'];

export const RTL_LANGUAGES: SupportedLanguage[] = ['ar'];

export const LANGUAGE_META: Record<
  SupportedLanguage,
  { label: string; nativeLabel: string; flag: string; dir: 'ltr' | 'rtl' }
> = {
  en: { label: 'English', nativeLabel: 'English', flag: '🇬🇧', dir: 'ltr' },
  ar: { label: 'Arabic', nativeLabel: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  de: { label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
} as const;

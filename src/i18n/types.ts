import type { en } from './locales/en';

/**
 * Widen const-literal types to their base types so that
 * AR/DE translations can satisfy the same shape as EN.
 * Preserves readonly modifiers from `as const`.
 */
type Widen<T> =
  T extends string ? string :
  T extends number ? number :
  T extends boolean ? boolean :
  T extends readonly (infer U)[] ? readonly Widen<U>[] :
  T extends Record<string, unknown> ? { [K in keyof T]: Widen<T[K]> } :
  T;

/** EN is the source of truth — all languages must match this shape */
export type TranslationKeys = Widen<typeof en>;

/** Supported language codes */
export type SupportedLanguage = 'en' | 'ar' | 'de';

/** Enforce every language matches EN structure exactly */
export type LocaleMap = {
  [L in SupportedLanguage]: TranslationKeys;
};

/**
 * Deep dot-notation key paths for autocomplete.
 * Usage: type AllKeys = DotNotationKeys<TranslationKeys>;
 */
export type DotNotationKeys<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? DotNotationKeys<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];

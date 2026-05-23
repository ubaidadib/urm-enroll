import { DEFAULT_LANGUAGE, RTL_LANGUAGES, SUPPORTED_LANGUAGES } from "./config";
import type { SupportedLanguage } from "./types";

export const LANGUAGE_STORAGE_KEY = "urmenroll_language";
export const LEGACY_LANGUAGE_STORAGE_KEY = "urm-language";

function extractBaseCode(locale: string): string {
  const [base = ""] = locale.split("-");
  return base.toLowerCase();
}

function isSupported(code: string): code is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(code as SupportedLanguage);
}

function getBrowserLanguages(): string[] {
  if (typeof navigator === "undefined") return [];
  const languages = navigator.languages && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language || ""];
  return Array.from(languages);
}

function readSavedLanguage(): SupportedLanguage | null {
  if (typeof window === "undefined") return null;

  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && isSupported(saved)) {
      return saved;
    }

    const legacy = window.localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);
    if (legacy && isSupported(legacy)) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, legacy);
      return legacy;
    }
  } catch {
    return null;
  }

  return null;
}

function readLanguageFromPath(): SupportedLanguage | null {
  if (typeof window === "undefined") return null;
  const prefix = (window.location.pathname.split("/")[1] || "").toLowerCase();
  if (isSupported(prefix)) return prefix;
  return null;
}

export function hasSavedLanguageChoice(): boolean {
  return readSavedLanguage() !== null;
}

export function detectInitialLanguage(): SupportedLanguage {
  const routeLanguage = readLanguageFromPath();
  if (routeLanguage) {
    if (typeof window !== "undefined") {
      window.__INITIAL_LANGUAGE__ = routeLanguage;
    }
    return routeLanguage;
  }

  const saved = readSavedLanguage();
  if (saved) {
    if (typeof window !== "undefined") {
      window.__INITIAL_LANGUAGE__ = saved;
    }
    return saved;
  }

  const browserLangs = getBrowserLanguages();
  for (const lang of browserLangs) {
    const base = extractBaseCode(lang);
    if (isSupported(base)) {
      if (typeof window !== "undefined") {
        window.__INITIAL_LANGUAGE__ = base;
      }
      return base;
    }
  }

  if (typeof window !== "undefined") {
    window.__INITIAL_LANGUAGE__ = DEFAULT_LANGUAGE;
  }

  return DEFAULT_LANGUAGE;
}

export function saveLanguageChoice(lang: SupportedLanguage): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    window.localStorage.removeItem(LEGACY_LANGUAGE_STORAGE_KEY);
  } catch {
    // Silent fallback when storage is blocked.
  }
}

export function clearLanguageChoice(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_LANGUAGE_STORAGE_KEY);
  } catch {
    // Silent fallback when storage is blocked.
  }
}

export function getLanguageDirection(lang: SupportedLanguage): "ltr" | "rtl" {
  return RTL_LANGUAGES.includes(lang) ? "rtl" : "ltr";
}

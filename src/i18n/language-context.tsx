import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { en } from "@/i18n/locales/en";
import { loadLocale, getCachedLocale } from "@/i18n/loader";
import type { SupportedLanguage, TranslationKeys } from "@/i18n/types";
import { SUPPORTED_LANGUAGES } from "@/i18n/config";
import {
  clearLanguageChoice,
  detectInitialLanguage,
  getLanguageDirection,
  saveLanguageChoice,
} from "@/i18n/detectLanguage";
import { logger } from "../lib/logger";
import { LanguageContext, languageMap, languageOptions } from "./language-context-value";

// Re-exports so existing consumer imports keep working
export type { LanguageCode } from "./language-context-value";
export { LanguageContext, languageOptions } from "./language-context-value";

function isValidLanguage(code: string): code is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(code);
}

const getTranslationValue = (obj: Record<string, unknown>, key: string) => {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window === "undefined") return "en";

    const bootstrapped = window.__INITIAL_LANGUAGE__;
    if (bootstrapped && isValidLanguage(bootstrapped)) {
      return bootstrapped;
    }

    return detectInitialLanguage();
  });

  // Current translations — EN is always available synchronously
  const [translations, setTranslations] = useState<TranslationKeys>(
    () => getCachedLocale(language) ?? en
  );
  const loadingRef = useRef(false);

  const option =
    languageMap.get(language) ??
    languageOptions[0] ??
    { code: "en" as SupportedLanguage, label: "EN", nativeLabel: "EN", dir: "ltr" as const };

  // Load translations when language changes
  useEffect(() => {
    let cancelled = false;
    const cached = getCachedLocale(language);
    if (cached) {
      setTranslations(cached);
      return;
    }

    loadingRef.current = true;
    loadLocale(language).then((loaded) => {
      if (!cancelled) {
        setTranslations(loaded);
        loadingRef.current = false;
      }
    });

    return () => { cancelled = true; };
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = getLanguageDirection(language);
  }, [language]);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    saveLanguageChoice(lang);
    setLanguageState(lang);
  }, []);

  const setLanguageForRoute = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
  }, []);

  const resetLanguageToAuto = useCallback(() => {
    clearLanguageChoice();
    setLanguageState(detectInitialLanguage());
  }, []);

  const t = useMemo(() => {
    return <T,>(key: string): T => {
      const translated = getTranslationValue(
        translations as unknown as Record<string, unknown>,
        key
      );
      if (translated !== undefined) {
        return translated as T;
      }
      const fallback = getTranslationValue(
        en as unknown as Record<string, unknown>,
        key
      );
      if (fallback !== undefined) {
        if (import.meta.env.DEV) {
          logger.warn({
            message: `[i18n] Missing key in '${language}': ${key}. Using English fallback.`,
          });
        }
        return fallback as T;
      }
      if (import.meta.env.DEV) {
        throw new Error(`[i18n] Missing translation key in all locales: ${key}`);
      }
      return "" as T;
    };
  }, [translations, language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        dir: option.dir,
        setLanguage,
        setLanguageForRoute,
        resetLanguageToAuto,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

import { createContext } from "react";
import type { SupportedLanguage } from "@/i18n/types";

// Re-export LanguageCode as an alias so existing imports keep working
export type LanguageCode = SupportedLanguage;

type LanguageOption = {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  dir: "ltr" | "rtl";
};

export const languageOptions: LanguageOption[] = [
  { code: "en", label: "EN", nativeLabel: "EN", dir: "ltr" },
  { code: "ar", label: "AR", nativeLabel: "AR", dir: "rtl" },
  { code: "de", label: "DE", nativeLabel: "DE", dir: "ltr" },
];

export const languageMap = new Map(languageOptions.map((option) => [option.code, option]));

type LanguageContextValue = {
  language: SupportedLanguage;
  dir: "ltr" | "rtl";
  setLanguage: (language: SupportedLanguage) => void;
  setLanguageForRoute: (language: SupportedLanguage) => void;
  resetLanguageToAuto: () => void;
  t: <T = string>(key: string) => T;
};

export const LanguageContext = createContext<LanguageContextValue | null>(null);

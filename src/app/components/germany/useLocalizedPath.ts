import { useLanguage } from "@/i18n/language-context";
import { useLocation } from "react-router-dom";

/**
 * Build a path that respects the current language prefix.
 *  - If the URL begins with /en|/de|/ar, returns `/<lang><path>`.
 *  - Otherwise returns `<path>` so the default (non-prefixed) routes still work.
 */
export function useLocalizedPath() {
  const { language } = useLanguage();
  const location = useLocation();
  const hasPrefix = /^\/(en|de|ar)(?=\/|$)/.test(location.pathname);
  return (path: string): string => {
    const cleaned = path.startsWith("/") ? path : `/${path}`;
    return hasPrefix ? `/${language}${cleaned}` : cleaned;
  };
}

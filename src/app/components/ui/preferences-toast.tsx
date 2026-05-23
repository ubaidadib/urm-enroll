import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { hasSavedLanguageChoice } from "@/i18n/detectLanguage";
import { hasUserThemePreference } from "@/lib/theme";

const TOAST_SEEN_KEY = "urmenroll_pref_notice_shown";

const MESSAGES = {
  en: "We've matched your system preferences. You can change them anytime.",
  ar: "لقد طبّقنا إعدادات جهازك تلقائياً. يمكنك تغييرها في أي وقت.",
  de: "Wir haben Ihre Systemeinstellungen übernommen. Sie können diese jederzeit ändern.",
} as const;

export function PreferencesToast() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);

  const message = useMemo(() => {
    return MESSAGES[language] ?? MESSAGES.en;
  }, [language]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const alreadyShown = window.localStorage.getItem(TOAST_SEEN_KEY) === "1";
      const hasSavedPrefs = hasSavedLanguageChoice() || hasUserThemePreference();

      if (alreadyShown || hasSavedPrefs) return;

      setVisible(true);
      window.localStorage.setItem(TOAST_SEEN_KEY, "1");
    } catch {
      // If storage is blocked, skip one-time toast persistence.
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    const timeout = window.setTimeout(() => setVisible(false), 4000);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] max-w-md w-[calc(100%-2rem)]">
      <div className="rounded-2xl border border-border/50 bg-bg-secondary/95 backdrop-blur-2xl shadow-2xl px-4 py-3 flex items-start gap-3">
        <p className="text-sm text-foreground leading-relaxed">{message}</p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Close preference notice"
          className="shrink-0 rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-surface-glass/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

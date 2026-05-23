import { useState } from "react";
import { Link } from "react-router-dom";
import { m, AnimatePresence } from "motion/react";
import { Shield } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { setConsentState, type ConsentCategories } from "@/lib/analytics";

const STORAGE_KEY = "urm-cookie-consent";
const CONSENT_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

function shouldShowBanner(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;

    // Legacy string values have no timestamp — treat as expired
    if (raw === "accepted" || raw === "rejected") return true;

    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const obj = parsed as Record<string, unknown>;
      const ts = typeof obj.timestamp === "number" ? obj.timestamp : 0;
      if (Date.now() - ts > CONSENT_MAX_AGE_MS) return true;
      return false;
    }
    return true;
  } catch {
    return true;
  }
}

export function CookieBanner() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(() => shouldShowBanner());
  const [analyticsChecked, setAnalyticsChecked] = useState(true);
  const [marketingChecked, setMarketingChecked] = useState(true);

  const handleAcceptAll = () => {
    const consent: ConsentCategories = { analytics: true, marketing: true };
    setConsentState(consent);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const consent: ConsentCategories = {
      analytics: analyticsChecked,
      marketing: marketingChecked,
    };
    setConsentState(consent);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const consent: ConsentCategories = { analytics: false, marketing: false };
    setConsentState(consent);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-4 bottom-4 sm:bottom-6 z-50"
          role="dialog"
          aria-modal="true"
          aria-label={t<string>("cookieBanner.title")}
          aria-live="polite"
        >
          <div className="max-w-3xl mx-auto p-5 md:p-6 glass-card-medium rounded-[1.6rem] border-border/70">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-accent-tech/24 to-accent-primary/24 border border-accent-tech/30 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-accent-tech" />
              </div>
              <div>
                <h3 className="text-text-primary font-semibold mb-1">
                  {t<string>("cookieBanner.title")}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {t<string>("cookieBanner.description")}{" "}
                  <Link
                    to="/cookies"
                    className="text-accent-tech hover:text-text-primary transition-colors"
                  >
                    {t<string>("cookieBanner.learnMore")}
                  </Link>
                </p>
              </div>
            </div>

            {/* Granular consent toggles */}
            <div className="flex flex-col sm:flex-row gap-4 mb-5 ps-13">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={analyticsChecked}
                  onChange={(e) => setAnalyticsChecked(e.target.checked)}
                  className="accent-accent-tech w-4 h-4 rounded"
                />
                {t<string>("cookieBanner.analytics")}
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={marketingChecked}
                  onChange={(e) => setMarketingChecked(e.target.checked)}
                  className="accent-accent-tech w-4 h-4 rounded"
                />
                {t<string>("cookieBanner.marketing")}
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={handleRejectAll}
                className="px-5 py-2.5 rounded-xl border border-border/45 text-text-muted hover:text-text-primary hover:border-border/70 transition-all text-sm"
              >
                {t<string>("cookieBanner.reject")}
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-5 py-2.5 rounded-xl border border-accent-tech/40 text-accent-tech hover:bg-accent-tech/10 transition-all text-sm"
              >
                {t<string>("cookieBanner.savePreferences")}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-accent-primary to-accent-tech text-ink font-semibold hover:-translate-y-0.5 hover:shadow-[0_14px_24px_rgba(30,115,177,0.3)] transition-all text-sm"
              >
                {t<string>("cookieBanner.accept")}
              </button>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

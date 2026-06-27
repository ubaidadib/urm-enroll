import { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, X, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { trackCTA, trackScrollDepth } from "@/utils/tracking";
import { CTA_COMPACT_ACTION_BASE, CTA_FOCUS_RING, CTA_PRIMARY_STANDARD } from "./cta-primitives";

const SCROLL_THRESHOLD = 0.6;
const SESSION_KEY = "urm_scroll_cta_dismissed";
const STICKY_SESSION_KEY = "urm_sticky_cta_dismissed";
const SHOW_DELAY_MS = 2500;

export function ScrollTriggeredCTA() {
  const { t, dir } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });

  // Don't show if StickyCTABar is still active (not dismissed)
  const stickyStillActive = (() => {
    try {
      return sessionStorage.getItem(STICKY_SESSION_KEY) !== "1";
    } catch {
      return true;
    }
  })();

  // Track scroll depth milestones
  const milestonesRef = useCallback(() => {
    const fired = new Set<number>();
    return fired;
  }, []);
  const [firedMilestones] = useState(milestonesRef);

  const handleScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    const ratio = window.scrollY / scrollHeight;

    // Scroll depth milestones
    for (const milestone of [25, 50, 75, 100]) {
      if (ratio >= milestone / 100 && !firedMilestones.has(milestone)) {
        firedMilestones.add(milestone);
        trackScrollDepth({ page: window.location.pathname, depth: milestone });
      }
    }

    // Show CTA at threshold (mark ready — visible after delay)
    if (ratio >= SCROLL_THRESHOLD && !dismissed && !ready) {
      setReady(true);
    }
  }, [dismissed, firedMilestones, ready]);

  // 2.5s delay before showing after scroll threshold
  useEffect(() => {
    if (!ready || dismissed) return;
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [ready, dismissed]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage unavailable
    }
  };

  const handleCtaClick = () => {
    trackCTA({ type: "primary", context: "student", intentLevel: "high", variant: "banner" });
    dismiss();
  };

  return (
    <AnimatePresence>
      {visible && !stickyStillActive && (
        <m.div
          initial={shouldReduceMotion ? { opacity: 0 } : { y: 60, opacity: 0 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { y: 60, opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0.15 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 inset-x-0 z-40 p-4 pointer-events-none"
          dir={dir}
        >
          <div className="pointer-events-auto max-w-3xl mx-auto rounded-2xl border border-border/30 bg-bg-surface/95 backdrop-blur-md shadow-2xl shadow-black/10 p-5 sm:p-6">
            <div className="flex items-start sm:items-center gap-4">
              {/* Icon */}
              <div className="shrink-0 w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-primary-text" />
              </div>

              {/* Copy */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-primary leading-tight">
                  {t<string>("funnelCta.scrollBanner.title")}
                </p>
                <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">
                  {t<string>("funnelCta.scrollBanner.subtitle")}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/quiz"
                  onClick={handleCtaClick}
                  className={`${CTA_COMPACT_ACTION_BASE} ${CTA_PRIMARY_STANDARD} ${CTA_FOCUS_RING} whitespace-nowrap`}
                >
                  <span>{t<string>("funnelCta.scrollBanner.cta")}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <button
                  type="button"
                  onClick={dismiss}
                  className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                  aria-label={t<string>("funnelCta.scrollBanner.dismiss")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

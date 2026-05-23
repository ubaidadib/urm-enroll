import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { m, AnimatePresence } from "motion/react";
import { ArrowRight, MessageCircle, X } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { BookConsultationButton } from "../ui/book-consultation-button";
import { trackCTA } from "@/utils/tracking";
import { CTA_COMPACT_ACTION_BASE, CTA_PRIMARY_STANDARD } from "./cta-primitives";

const WHATSAPP_NUMBER = "96170585052";
const SCROLL_SHOW = 400;
const SESSION_KEY = "urm_sticky_cta_dismissed";

/**
 * Sticky CTA layer:
 * - Mobile: fixed bottom bar with "Book Consultation" button + WhatsApp
 * - Desktop: floating corner with "Book Consultation" + "Apply Now" + WhatsApp
 *
 * Calendly booking is the primary conversion action on this sticky bar.
 */
export function StickyCTABar() {
  const { t, dir } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > SCROLL_SHOW);
    window.addEventListener("scroll", handler, { passive: true });
    handler(); // initial check
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // unavailable
    }
  };

  const handleApply = () => {
    trackCTA({ type: "primary", context: "student", intentLevel: "high", variant: "sticky-bar" });
  };

  const handleBooking = () => {
    trackCTA({ type: "primary", context: "student", intentLevel: "high", variant: "sticky-booking" });
  };

  const handleWhatsApp = () => {
    trackCTA({ type: "secondary", context: "student", intentLevel: "high", variant: "sticky-whatsapp" });
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* ---- Mobile: Fixed bottom bar (booking button only) ---- */}
          <m.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 inset-x-0 z-40 md:hidden"
            dir={dir}
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-border/30 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
              <div className="flex-1">
                <BookConsultationButton
                  variant="primary"
                  size="sm"
                  onClick={handleBooking}
                  className="w-full"
                />
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsApp}
                className="flex items-center justify-center min-w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] transition-colors active:bg-[#25D366]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <button
                type="button"
                onClick={dismiss}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
                aria-label={t<string>("funnelCta.sticky.dismiss")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </m.div>

          {/* ---- Desktop: Floating corner CTA (both buttons) ---- */}
          <m.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-8 z-40 hidden md:block"
            style={{ [dir === "rtl" ? "left" : "right"]: "2rem" }}
            dir={dir}
          >
            <div className="relative flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-border/30 shadow-2xl shadow-black/10">
              <BookConsultationButton
                variant="primary"
                size="sm"
                onClick={handleBooking}
              />
              <Link
                to="/quiz"
                onClick={handleApply}
                className={`${CTA_COMPACT_ACTION_BASE} ${CTA_PRIMARY_STANDARD}`}
              >
                <span>{t<string>("funnelCta.sticky.apply")}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsApp}
                className="flex items-center justify-center min-w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <button
                type="button"
                onClick={dismiss}
                className="absolute -top-2 -right-2 min-w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-text-secondary hover:text-text-primary flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
                aria-label={t<string>("funnelCta.sticky.dismiss")}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}

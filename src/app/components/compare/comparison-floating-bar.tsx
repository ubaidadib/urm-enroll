import { m, AnimatePresence } from "motion/react";
import { X, GitCompareArrows } from "lucide-react";
import { Link } from "react-router-dom";
import { useComparison } from "@/app/context/comparison-context";
import { useLanguage } from "@/i18n/language-context";

export function ComparisonFloatingBar() {
  const { items, removeFromComparison, clearComparison, toastMessage } = useComparison();
  const { t } = useLanguage();

  return (
    <>
      <AnimatePresence>
        {toastMessage && (
          <m.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            className="fixed bottom-24 right-6 z-[70] rounded-lg bg-bg-surface text-text-primary border border-border text-sm px-4 py-2 shadow-xl"
            role="status"
            aria-live="polite"
          >
            {toastMessage}
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {items.length > 0 && (
          <m.aside
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[65] w-[calc(100%-1.5rem)] max-w-5xl sm:bottom-4"
          >
            <div className="rounded-2xl border border-border bg-bg-surface/95 backdrop-blur-xl shadow-2xl px-4 py-3">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                <div className="flex items-center gap-2 shrink-0">
                  <GitCompareArrows className="w-5 h-5 text-accent-primary" />
                  <span className="font-semibold text-text-primary text-sm">
                    {t<string>("comparison.floatingBar.title").replace("{{count}}", String(items.length))}
                  </span>
                </div>

                <div className="flex-1 overflow-x-auto">
                  <div className="flex items-center gap-2 min-w-max">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 rounded-lg border border-border bg-bg-primary px-3 py-1.5"
                      >
                        <img
                          src={item.universityLogo}
                          alt={item.universityName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-xs font-medium text-text-primary line-clamp-1 max-w-[180px]">
                          {item.name}
                        </span>
                        <button
                          onClick={() => removeFromComparison(item.id)}
                          className="text-text-muted hover:text-error transition-colors"
                          aria-label={t<string>("comparison.floatingBar.removeItem").replace("{{name}}", item.name)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={clearComparison}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {t<string>("comparison.clearAll")}
                  </button>
                  <Link
                    to="/compare"
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      items.length >= 2
                        ? "bg-accent-primary text-ink hover:shadow-lg"
                        : "bg-bg-secondary text-text-muted pointer-events-none"
                    }`}
                    aria-disabled={items.length < 2}
                  >
                    {t<string>("comparison.compareNow")}
                  </Link>
                </div>
              </div>
            </div>
          </m.aside>
        )}
      </AnimatePresence>
    </>
  );
}

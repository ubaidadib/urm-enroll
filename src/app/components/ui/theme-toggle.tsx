import { useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useTheme } from "./theme-provider";
import { useLanguage } from "@/i18n/language-context";

const themeOptions = [
  { value: "system", labelKey: "common.theme.system", icon: Monitor },
  { value: "light", labelKey: "common.theme.light", icon: Sun },
  { value: "dark", labelKey: "common.theme.dark", icon: Moon },
] as const;

type ThemeToggleProps = {
  iconOnly?: boolean;
};

export function ThemeToggle({ iconOnly = false }: ThemeToggleProps) {
  const { t } = useLanguage();
  const { theme, setTheme, resolvedTheme, themeSource } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const activeIndex = Math.max(
    0,
    themeOptions.findIndex((option) => option.value === theme),
  );
  const activeOption = themeOptions[activeIndex] ?? themeOptions[0];
  const ActiveIcon = activeOption.icon;
  const sourceLabel =
    themeSource === "system"
      ? t<string>("common.theme.ariaSystem").replace("{{theme}}", resolvedTheme)
      : resolvedTheme === "dark"
        ? t<string>("common.theme.ariaDark")
        : t<string>("common.theme.ariaLight");

  return (
    <div className="relative">
      <m.button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="theme-menu"
        aria-label={sourceLabel}
        title={sourceLabel}
        className={`group relative flex h-10 items-center overflow-hidden rounded-full border border-border/65 bg-background-surface/88 hover:bg-background-hover hover:border-border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-tech/35 ${
          iconOnly ? "w-10 justify-center" : "gap-2 px-3"
        }`}
      >
        <span className="relative grid h-4 w-4 place-items-center">
          <AnimatePresence initial={false} mode="wait">
            <m.span
              key={activeOption.value}
              initial={reduceMotion ? false : { opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute inset-0 grid place-items-center"
            >
              <ActiveIcon className="w-4 h-4 text-text-secondary group-hover:text-accent-primary transition-colors" />
            </m.span>
          </AnimatePresence>
        </span>
        {!iconOnly && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">
            {t<string>(activeOption.labelKey)}
          </span>
        )}
      </m.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <m.div
              id="theme-menu"
              role="menu"
              aria-label={t<string>("common.theme.system")}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute end-0 top-full mt-3 w-[15.5rem] rounded-3xl border border-border/70 glass-card-medium p-3 z-50"
            >
              <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                {t<string>("common.theme.label") || "Appearance"}
              </p>

              {/* Premium animated segmented switch with a sliding indicator. */}
              <div
                role="radiogroup"
                className="relative grid grid-cols-3 rounded-2xl border border-border/55 bg-background-surface/70 p-1"
              >
                {/* Sliding active indicator — animates the transform (x) rather
                    than `left` so motion can interpolate it under LazyMotion. */}
                <m.span
                  aria-hidden="true"
                  className="absolute top-1 bottom-1 left-1 rounded-xl bg-accent-primary/14 border border-accent-primary/45 shadow-[0_2px_12px_rgba(212,175,55,0.18)]"
                  initial={false}
                  animate={{ x: `${activeIndex * 100}%` }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 34 }
                  }
                  style={{ width: "calc((100% - 0.5rem) / 3)" }}
                />

                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = theme === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => {
                        setTheme(option.value);
                        setIsOpen(false);
                      }}
                      className={`relative z-10 flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-tech/35 ${
                        isActive
                          ? "text-accent-primary"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                      <span className="text-[11px] font-semibold tracking-wide">
                        {t<string>(option.labelKey)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Live resolved-theme hint. */}
              <p className="mt-2.5 px-1 text-[11px] text-text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      resolvedTheme === "dark" ? "bg-brand-navy-700" : "bg-brand-gold-400"
                    }`}
                  />
                  {sourceLabel}
                </span>
              </p>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

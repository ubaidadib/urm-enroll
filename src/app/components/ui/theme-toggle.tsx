import { useState } from "react";
import { Monitor, Moon, Sun, Check } from "lucide-react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useTheme } from "./theme-provider";
import { useLanguage } from "@/i18n/language-context";

const themeOptions = [
  {
    value: "system",
    labelKey: "common.theme.system",
    icon: Monitor,
    preview: ["bg-brand-navy-800", "bg-brand-steel-500", "bg-brand-gold-500"],
  },
  {
    value: "light",
    labelKey: "common.theme.light",
    icon: Sun,
    preview: ["bg-brand-navy-800", "bg-brand-teal-500", "bg-brand-gold-500"],
  },
  {
    value: "dark",
    labelKey: "common.theme.dark",
    icon: Moon,
    preview: ["bg-brand-navy-950", "bg-brand-teal-400", "bg-brand-gold-400"],
  },
] as const;

type ThemeToggleProps = {
  iconOnly?: boolean;
};

export function ThemeToggle({ iconOnly = false }: ThemeToggleProps) {
  const { t } = useLanguage();
  const { theme, setTheme, resolvedTheme, themeSource } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const activeOption = themeOptions.find((option) => option.value === theme) ?? themeOptions[0];
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
        {/* Animated icon swap on theme change. */}
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
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 top-full mt-3 w-48 rounded-3xl border border-border/70 glass-card-medium p-2.5 z-50"
            >
              {themeOptions.map((option, index) => {
                const Icon = option.icon;
                const isActive = theme === option.value;
                return (
                  <m.button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setTheme(option.value);
                      setIsOpen(false);
                    }}
                    role="menuitem"
                    aria-current={isActive}
                    initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.18, delay: reduceMotion ? 0 : 0.04 + index * 0.05 }}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-2xl transition-colors duration-200 ${
                      isActive
                        ? "bg-background-hover text-text-primary border border-accent-primary/45"
                        : "text-text-secondary hover:text-text-primary hover:bg-background-hover border border-transparent"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-xl border transition-colors ${
                        isActive
                          ? "bg-accent-primary/12 border-accent-primary/40 text-accent-primary"
                          : "bg-background-surface border-border/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="flex-1 text-left text-xs font-semibold tracking-wide">
                      {t<string>(option.labelKey)}
                    </span>
                    <span className="flex items-center gap-1" aria-hidden="true">
                      {option.preview.map((swatch) => (
                        <span
                          key={swatch}
                          className={`w-2.5 h-2.5 rounded-full border border-border/60 ${swatch}`}
                        />
                      ))}
                    </span>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <m.span
                          initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                        >
                          <Check className="w-4 h-4 text-accent-primary" />
                        </m.span>
                      )}
                    </AnimatePresence>
                  </m.button>
                );
              })}
            </m.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

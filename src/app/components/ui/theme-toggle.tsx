import { Moon, Sun } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { useTheme } from "./theme-provider";
import { useLanguage } from "@/i18n/language-context";

type ThemeToggleProps = {
  /** Kept for API compatibility; the switch renders the same in every slot. */
  iconOnly?: boolean;
};

// Binary light/dark sliding switch (sun ⇄ moon) with a gold knob. Toggling sets
// an explicit preference; system preference is respected until the first toggle.
export function ThemeToggle(_props: ThemeToggleProps = {}) {
  const { t } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const isDark = resolvedTheme === "dark";

  const label = isDark
    ? t<string>("common.theme.ariaLight") // toggling will switch TO light
    : t<string>("common.theme.ariaDark");

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-[30px] w-[60px] shrink-0 items-center rounded-full border border-border/65 bg-background-surface/90 p-[3px] transition-colors duration-300 hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-tech/35"
    >
      {/* Track icons (dim); the knob covers the active side. */}
      <Sun
        className={`pointer-events-none absolute left-[7px] h-3.5 w-3.5 transition-colors ${
          isDark ? "text-text-disabled" : "text-transparent"
        }`}
        aria-hidden="true"
      />
      <Moon
        className={`pointer-events-none absolute right-[7px] h-3.5 w-3.5 transition-colors ${
          isDark ? "text-transparent" : "text-text-disabled"
        }`}
        aria-hidden="true"
      />

      {/* Sliding gold knob carrying the active icon. */}
      <m.span
        initial={false}
        animate={{ x: isDark ? 30 : 0 }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 34 }}
        className="relative z-10 grid h-6 w-6 place-items-center rounded-full bg-linear-to-br from-brand-gold-300 to-brand-gold-500 shadow-[0_2px_8px_rgba(212,175,55,0.45)]"
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-brand-navy-900" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-brand-navy-900" />
        )}
      </m.span>
    </button>
  );
}

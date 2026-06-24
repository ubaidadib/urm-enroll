import type { ReactNode } from "react";
import { m } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

/**
 * Slate Style Kit
 * ----------------
 * Shared primitives that codify the "premium SaaS" design language used on the
 * nursing page (see germany-workforce-module / workforce-calculator):
 *   - raw slate palette (slate-50 → slate-950) with full light/dark theming
 *   - accent-* tokens for brand pops (tech / success / primary)
 *   - ambient gradient orbs + tech-grid backgrounds
 *   - big, tight-tracking display headings + uppercase eyebrow pills
 *   - glass / backdrop-blur cards
 *
 * Use these across all non-landing pages so the look stays consistent.
 */

/* ── Reusable class tokens (import where raw markup is needed) ──────────────── */

export const slate = {
  heading: "font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1]",
  body: "text-slate-600 dark:text-slate-400 leading-relaxed",
  card: "bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all hover:border-accent-tech/30",
  cardSolid: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm",
  divider: "bg-slate-200 dark:bg-slate-800",
  label: "text-xs font-bold text-slate-500 uppercase tracking-widest",
} as const;

/* ── SectionShell ──────────────────────────────────────────────────────────── */

type SectionTone = "base" | "surface";

interface SectionShellProps {
  id?: string;
  tone?: SectionTone;
  /** Apply the standard vertical rhythm (py-24 md:py-32). */
  padded?: boolean;
  /** Faint tech-grid overlay. */
  grid?: boolean;
  /** Ambient blurred gradient orbs. */
  orbs?: boolean;
  /** Large slow-floating background icon (nursing-style). */
  floatingIcon?: LucideIcon;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}

/**
 * Section wrapper providing the slate background + ambient atmosphere and a
 * centered max-w-7xl content container.
 */
export function SectionShell({
  id,
  tone = "base",
  padded = true,
  grid = true,
  orbs = true,
  floatingIcon: FloatingIcon,
  className = "",
  containerClassName = "",
  children,
}: SectionShellProps) {
  const toneClass =
    tone === "surface"
      ? "bg-white dark:bg-slate-900"
      : "bg-slate-50 dark:bg-slate-950";

  return (
    <section
      id={id}
      className={`relative overflow-hidden px-4 sm:px-6 lg:px-8 3xl:px-10 transition-colors duration-500 ${toneClass} ${
        padded ? "page-section-y" : ""
      } ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none">
        {orbs && (
          <>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-tech/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent-success/5 rounded-full blur-[120px]" />
          </>
        )}
        {grid && (
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
          </div>
        )}
        {FloatingIcon && (
          <m.div
            animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-10 lg:right-40 opacity-10"
          >
            <FloatingIcon className="w-64 h-64 text-slate-900 dark:text-white" strokeWidth={0.5} />
          </m.div>
        )}
      </div>

      <div className={`content-shell mx-auto relative z-10 ${containerClassName}`}>{children}</div>
    </section>
  );
}

/* ── Eyebrow ───────────────────────────────────────────────────────────────── */

interface EyebrowProps {
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

/** Uppercase pill badge used above section / hero headings. */
export function Eyebrow({ icon: Icon, children, className = "" }: EyebrowProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`inline-flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 text-accent-tech" />}
      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">
        {children}
      </span>
    </m.div>
  );
}

/* ── SectionHeader ─────────────────────────────────────────────────────────── */

interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

/** Eyebrow + display title + optional description, animated on scroll. */
export function SectionHeader({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const { dir } = useLanguage();
  const isCenter = align === "center";

  return (
    <div
      className={`${isCenter ? "text-center mx-auto max-w-3xl" : "max-w-2xl"} ${
        !isCenter && dir === "rtl" ? "text-right" : ""
      } ${className}`}
    >
      {eyebrow && (
        <div className={`mb-6 ${isCenter ? "flex justify-center" : ""}`}>
          <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>
        </div>
      )}

      <m.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight leading-[1.1]`}
      >
        {title}
      </m.h2>

      {description && (
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed ${
            isCenter ? "mx-auto max-w-2xl" : "max-w-xl"
          }`}
        >
          {description}
        </m.p>
      )}
    </div>
  );
}

/* ── StatCard ──────────────────────────────────────────────────────────────── */

interface StatCardProps {
  icon?: LucideIcon;
  value: string;
  label: string;
  note?: string;
  index?: number;
  align?: "left" | "center";
}

/** Metric card matching the nursing module's metrics strip. */
export function StatCard({ icon: Icon, value, label, note, index = 0, align = "left" }: StatCardProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-center sm:text-left";

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className={`p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-accent-tech/30 transition-all shadow-sm group ${alignClass}`}
    >
      {Icon && (
        <Icon className="w-5 h-5 mb-3 text-accent-tech mx-auto sm:mx-0" />
      )}
      <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-accent-tech transition-colors">
        {value}
      </div>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</div>
      {note && (
        <div className="text-[10px] text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md w-fit mx-auto sm:mx-0">
          {note}
        </div>
      )}
    </m.div>
  );
}

import type { ReactNode } from "react";
import { m } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/language-context";

interface HeroBadge {
  icon: string;
  text: string;
}

interface HeroCta {
  label: string;
  href: string;
}

interface HeroStat {
  icon: LucideIcon;
  value: string;
  label: string;
}

export interface PageHeroProps {
  badge?: HeroBadge;
  headline: string | ReactNode;
  headlineHighlight?: string;
  subtitle: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  stats?: HeroStat[];
  /** Custom right-column content; overrides the default stats grid. */
  aside?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "full" | "compact";
}

function HeroAction({ cta, className }: { cta: HeroCta; className: string }) {
  if (cta.href.startsWith("#")) {
    return (
      <a href={cta.href} className={className}>
        {cta.label}
      </a>
    );
  }

  return (
    <Link to={cta.href} className={className}>
      {cta.label}
    </Link>
  );
}

export function PageHero({
  badge,
  headline,
  headlineHighlight,
  subtitle,
  primaryCta,
  secondaryCta,
  stats = [],
  aside,
  children,
  footer,
  size = "full",
}: PageHeroProps) {
  const { dir } = useLanguage();
  const isCompact = size === "compact";

  const showCta = Boolean(primaryCta || secondaryCta);
  const hasAside = Boolean(aside);
  const showStats = !isCompact && !hasAside && stats.length > 0;
  const twoColumn = hasAside || showStats;

  return (
    <section
      className={`relative px-6 overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 ${
        isCompact ? "pt-24 pb-14" : "pt-32 pb-20 md:pb-24"
      }`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        {!isCompact ? (
          <>
            <div className="absolute top-0 right-0 w-[38rem] h-[38rem] bg-accent-tech/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[34rem] h-[34rem] bg-accent-success/8 rounded-full blur-[120px]" />
          </>
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-accent-tech/8 rounded-full blur-[120px]" />
        )}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {children}

        <div className={`grid gap-12 ${twoColumn ? "lg:grid-cols-12 lg:gap-20 items-center" : "grid-cols-1"}`}>
          <div className={`${twoColumn ? "lg:col-span-7" : ""} ${dir === "rtl" ? "text-right" : "text-left"}`}>
            {badge && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8"
              >
                <span className="text-sm" aria-hidden="true">
                  {badge.icon}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                  {badge.text}
                </span>
              </m.div>
            )}

            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isCompact ? 0.05 : 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]"
            >
              {typeof headline === "string" ? (
                <>
                  {headline}
                  {headlineHighlight ? <span className="text-accent-tech"> {headlineHighlight}</span> : null}
                </>
              ) : (
                headline
              )}
            </m.h1>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isCompact ? 0.1 : 0.2 }}
              className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl"
            >
              {subtitle}
            </m.p>

            {showCta && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isCompact ? 0.15 : 0.3 }}
                className={`mt-8 flex flex-wrap items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
              >
                {primaryCta && (
                  <HeroAction
                    cta={primaryCta}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl btn-gold-primary font-bold hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  />
                )}
                {secondaryCta && (
                  <HeroAction
                    cta={secondaryCta}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold hover:border-accent-tech/40 transition-all"
                  />
                )}
              </m.div>
            )}
          </div>

          {hasAside && <div className="lg:col-span-5 relative">{aside}</div>}

          {showStats && (
            <div className="lg:col-span-5 relative">
              <div className="grid gap-4">
                {stats.map((stat, i) => (
                  <m.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className={`flex items-center gap-5 p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-accent-tech/30 shadow-sm transition-all ${
                      dir === "rtl" ? "flex-row-reverse text-right" : ""
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-accent-tech/10 border border-accent-tech/20">
                      <stat.icon className="w-7 h-7 text-accent-tech" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {footer ? <div className="mt-10 md:mt-12">{footer}</div> : null}
      </div>
    </section>
  );
}

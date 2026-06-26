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
      className={`relative overflow-hidden border-b border-border/50 bg-bg-primary transition-colors duration-500 page-hero-offset ${
        isCompact ? "page-hero-pb-compact" : "page-hero-pb"
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

      <div className="page-hero-inner px-[var(--content-gutter)]">
        {children}

        <div className={twoColumn ? "page-hero-grid" : "grid grid-cols-1 gap-6"}>
          <div className={`${twoColumn ? "page-hero-main" : ""} ${dir === "rtl" ? "text-right" : "text-left"}`}>
            {badge && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-bg-surface border border-border/50 shadow-sm page-hero-badge-gap"
              >
                <span className="text-sm" aria-hidden="true">
                  {badge.icon}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-text-primary">
                  {badge.text}
                </span>
              </m.div>
            )}

            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isCompact ? 0.05 : 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl 3xl:text-[4rem] 4xl:text-[5rem] font-bold text-text-primary mb-4 sm:mb-5 lg:mb-4 tracking-tight leading-[1.08]"
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
              className="text-sm sm:text-base md:text-lg lg:text-xl 3xl:text-xl 4xl:text-2xl text-text-secondary leading-relaxed max-w-2xl lg:max-w-none"
            >
              {subtitle}
            </m.p>

            {showCta && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isCompact ? 0.15 : 0.3 }}
                className={`mt-6 lg:mt-7 flex flex-wrap items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
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
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border/50 bg-bg-surface text-text-primary font-bold hover:border-accent-tech/40 transition-all"
                  />
                )}
              </m.div>
            )}
          </div>

          {hasAside && <div className="page-hero-aside relative">{aside}</div>}

          {showStats && (
            <div className="page-hero-aside relative">
              <div className="grid gap-3">
                {stats.map((stat, i) => (
                  <m.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl bg-bg-surface/80 backdrop-blur-md border border-border/50 hover:border-accent-tech/30 shadow-sm transition-all ${
                      dir === "rtl" ? "flex-row-reverse text-right" : ""
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-accent-tech/10 border border-accent-tech/20">
                      <stat.icon className="w-7 h-7 text-accent-tech" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-text-primary">{stat.value}</div>
                      <div className="text-sm font-medium text-text-muted uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {footer ? <div className="mt-8 lg:mt-10">{footer}</div> : null}
      </div>
    </section>
  );
}

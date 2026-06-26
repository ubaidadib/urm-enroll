import { m } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Breadcrumbs } from "../layout/breadcrumbs";

type HeaderStat = {
  icon: LucideIcon;
  value: string;
  label: string;
};

type Crumb = {
  label: string;
  href: string;
};

type ContextualPageHeaderProps = {
  badge: string;
  title: string;
  description: string;
  breadcrumbs: Crumb[];
  stats?: HeaderStat[];
  searchSlot?: ReactNode;
  /** Tighter spacing for Explore / listing pages */
  variant?: "default" | "listing";
};

export function ContextualPageHeader({
  badge,
  title,
  description,
  breadcrumbs,
  stats = [],
  searchSlot,
  variant = "default",
}: ContextualPageHeaderProps) {
  const hasStats = stats.length > 0;
  const isListing = variant === "listing";

  return (
    <section
      className="relative px-[var(--content-gutter)] page-hero-offset page-hero-pb-compact border-b border-border/50 overflow-hidden bg-bg-primary transition-colors duration-500"
    >
      {/* Ambient atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-20 w-[28rem] h-[28rem] rounded-full bg-accent-tech/10 blur-[120px]" />
        <div className="absolute -bottom-20 -left-16 w-[24rem] h-[24rem] rounded-full bg-accent-success/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
      </div>

      <div className="page-hero-inner">
        <div className="page-hero-crumb-gap">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className={`page-hero-grid ${hasStats ? "" : ""}`}>
          <div className={hasStats ? "page-hero-main" : isListing ? "w-full" : "w-full max-w-4xl"}>
            <m.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-border/50 bg-bg-surface shadow-sm page-hero-badge-gap`}
            >
              <Sparkles className="w-4 h-4 text-accent-tech" />
              <span className="text-xs font-bold uppercase tracking-widest text-text-primary">
                {badge}
              </span>
            </m.div>

            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className={`font-bold text-text-primary tracking-tight leading-[1.1] ${
                isListing
                  ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl"
                  : "text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl"
              }`}
            >
              {title}
            </m.h1>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className={`${isListing ? "mt-2 sm:mt-3" : "mt-3 sm:mt-4 lg:mt-4"} text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl lg:max-w-none leading-relaxed`}
            >
              {description}
            </m.p>

            {searchSlot ? (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className={isListing ? "mt-4 lg:mt-5 rounded-2xl border border-border/50 bg-bg-surface shadow-sm p-4" : "mt-5 lg:mt-6 rounded-2xl border border-border/50 bg-bg-surface shadow-sm p-4"}
              >
                {searchSlot}
              </m.div>
            ) : null}
          </div>

          {hasStats ? (
            <m.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`page-hero-aside grid gap-3 ${
                stats.length <= 2 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
              }`}
            >
              {stats.slice(0, 4).map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={`${stat.label}-${stat.value}`}
                    className="rounded-2xl p-4 flex items-center gap-3 bg-bg-surface/80 backdrop-blur-md border border-border/50 hover:border-accent-tech/30 transition-all shadow-sm"
                  >
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-accent-tech/10 border border-accent-tech/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent-tech" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-black text-text-primary">{stat.value}</p>
                      <p className="text-sm text-text-muted truncate">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </m.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

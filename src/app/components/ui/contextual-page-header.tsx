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
};

export function ContextualPageHeader({
  badge,
  title,
  description,
  breadcrumbs,
  stats = [],
  searchSlot,
}: ContextualPageHeaderProps) {
  const hasStats = stats.length > 0;

  return (
    <section className="relative px-[var(--content-gutter)] page-hero-offset pb-10 sm:pb-16 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Ambient atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-20 w-[28rem] h-[28rem] rounded-full bg-accent-tech/10 blur-[120px]" />
        <div className="absolute -bottom-20 -left-16 w-[24rem] h-[24rem] rounded-full bg-accent-success/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
      </div>

      <div className="content-shell-wide mx-auto relative z-10 px-4 sm:px-6 lg:px-8 3xl:px-10 4xl:px-12">
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className={`grid gap-8 lg:gap-10 items-start ${hasStats ? "lg:grid-cols-12" : ""}`}>
          <div className={hasStats ? "lg:col-span-7" : "max-w-4xl"}>
            <m.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent-tech" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                {badge}
              </span>
            </m.div>

            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1]"
            >
              {title}
            </m.h1>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed"
            >
              {description}
            </m.p>

            {searchSlot ? (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="mt-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-4"
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
              className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {stats.slice(0, 4).map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={`${stat.label}-${stat.value}`}
                    className="rounded-2xl p-5 flex items-center gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-accent-tech/30 transition-all shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent-tech/10 border border-accent-tech/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-accent-tech" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 dark:text-white">{stat.value}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
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

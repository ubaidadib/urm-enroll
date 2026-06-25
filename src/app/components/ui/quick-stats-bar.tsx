import type { LucideIcon } from "lucide-react";

export interface QuickStatItem {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface QuickStatsBarProps {
  stats: QuickStatItem[];
  sticky?: boolean;
  stickyTopClass?: string;
}

export function QuickStatsBar({
  stats,
  sticky = true,
  stickyTopClass = "top-24",
}: QuickStatsBarProps) {
  return (
    <section
      className={`${sticky ? `sticky ${stickyTopClass} z-40` : ""} border-b border-border/70 bg-bg-surface/88 shadow-[0_12px_34px_rgba(11,21,48,0.07)] backdrop-blur-md`}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={`${stat.label}-${stat.value}`} className="premium-stat-card flex min-h-16 items-center gap-3 rounded-xl px-3.5 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent-primary/20 bg-accent-primary/10 text-accent-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold uppercase tracking-wide text-text-muted">
                    {stat.label}
                  </p>
                  <p className="truncate text-base font-black tabular-nums text-text-primary">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

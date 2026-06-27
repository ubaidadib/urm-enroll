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
      className={`${sticky ? `sticky ${stickyTopClass} z-40` : ""} border-b border-border bg-bg-surface/90 backdrop-blur-sm`}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={`${stat.label}-${stat.value}`} className="flex min-h-14 items-center gap-3 rounded-lg border border-border bg-bg-primary px-3 py-2">
                <Icon className="h-5 w-5 text-accent-primary-text" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    {stat.label}
                  </p>
                  <p className="truncate text-sm font-bold text-text-primary">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

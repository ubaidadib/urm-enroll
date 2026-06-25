import { useMemo, useRef } from "react";
import { m } from "motion/react";
import type { LucideIcon } from "lucide-react";

export interface PageTabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface PageTabsProps {
  tabs: PageTabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  ariaLabel?: string;
  stickyTopClass?: string;
}

export function PageTabs({
  tabs,
  activeTab,
  onChange,
  ariaLabel,
  stickyTopClass = "top-[10.5rem]",
}: PageTabsProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeIndex = useMemo(
    () => tabs.findIndex((tab) => tab.id === activeTab),
    [tabs, activeTab]
  );

  const focusTab = (index: number) => {
    const nextIndex = (index + tabs.length) % tabs.length;
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section className={`sticky ${stickyTopClass} z-30 border-b border-border bg-bg-surface/85 backdrop-blur-sm`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 3xl:px-10">
        <div
          role="tablist"
          aria-label={ariaLabel}
          className="flex min-h-14 items-stretch gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTab;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                id={`tab-${tab.id}`}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => onChange(tab.id)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    focusTab(index + 1);
                  }
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    focusTab(index - 1);
                  }
                  if (event.key === "Home") {
                    event.preventDefault();
                    focusTab(0);
                  }
                  if (event.key === "End") {
                    event.preventDefault();
                    focusTab(tabs.length - 1);
                  }
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onChange(tab.id);
                  }
                }}
                className={`relative inline-flex min-h-14 items-center gap-2 whitespace-nowrap px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/30 ${
                  isActive
                    ? "text-text-primary"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
                <span>{tab.label}</span>
                {isActive ? (
                  <m.span
                    layoutId="page-tabs-active-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

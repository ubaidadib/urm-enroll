import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/language-context";

export type DiscoveryView = "destinations" | "universities" | "programs";

export type DiscoveryNavItem = {
  key: DiscoveryView;
  href: string;
  label: string;
};

export function buildDiscoveryQuery(params: Record<string, string | number | null | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;
    const normalized = String(value).trim();
    if (!normalized) continue;
    searchParams.set(key, normalized);
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function DiscoveryHeader({
  current,
  items,
  search,
}: {
  current: DiscoveryView;
  items: DiscoveryNavItem[];
  search: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="mx-auto max-w-160">{search}</div>
      <DiscoveryNav current={current} items={items} />
    </div>
  );
}

export function DiscoveryNav({
  current,
  items,
}: {
  current: DiscoveryView;
  items: DiscoveryNavItem[];
}) {
  const { dir } = useLanguage();

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
      {items.map((item) => {
        const active = item.key === current;
        return (
          <Link
            key={item.key}
            to={item.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
              active
                ? "border-accent-primary bg-accent-primary text-white shadow-lg shadow-accent-primary/20"
                : "border-border bg-background-surface text-text-secondary hover:border-accent-primary hover:text-text-primary"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export function DiscoveryBridgeSection({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}) {
  const { dir } = useLanguage();

  return (
    <section className="mt-12 rounded-4xl border border-border bg-linear-to-br from-bg-surface via-bg-secondary/60 to-bg-surface p-6 md:mt-16 md:p-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-text-muted">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-black text-text-primary md:text-3xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary md:text-base">{description}</p>
        <div className={`mt-6 flex flex-col gap-3 sm:flex-row ${dir === "rtl" ? "sm:flex-row-reverse" : ""}`}>
          <Link
            to={primaryCta.href}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-accent-primary px-5 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-accent-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          >
            {primaryCta.label}
            <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
          </Link>
          {secondaryCta ? (
            <Link
              to={secondaryCta.href}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-border bg-background-surface px-5 py-3 text-sm font-semibold text-text-primary transition-all hover:bg-bg-secondary hover:border-accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
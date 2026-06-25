import { m } from "motion/react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface EmptyStateCta {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  cta?: EmptyStateCta;
}

export function EmptyState({ icon: Icon, title, description, cta }: EmptyStateProps) {
  const ctaClassName =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-accent-primary to-accent-tech px-6 py-3 font-semibold text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_24px_rgba(30,115,177,0.3)]";

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="premium-empty-state rounded-[1.8rem] px-6 py-16 text-center"
    >
      <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-accent-tech/20 to-accent-primary/20 border border-accent-primary/25 text-accent-primary shadow-[0_18px_34px_rgba(11,21,48,0.10)]">
        <Icon className="h-8 w-8" />
      </div>

      <h2 className="relative mb-3 text-2xl font-bold text-text-primary">{title}</h2>
      <p className="relative mx-auto mb-6 max-w-xl text-text-secondary">{description}</p>

      {cta?.href ? (
        <Link to={cta.href} className={ctaClassName}>
          {cta.label}
        </Link>
      ) : cta ? (
        <button onClick={cta.onClick} className={ctaClassName}>
          {cta.label}
        </button>
      ) : null}
    </m.div>
  );
}

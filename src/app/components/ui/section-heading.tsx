import { type ReactNode } from "react";

type SectionHeadingProps = {
  /** Small uppercase label above the title (the "eyebrow"). */
  eyebrow?: ReactNode;
  /** Optional icon rendered inside the eyebrow pill. */
  eyebrowIcon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "start";
  className?: string;
  /** Override the title element classes if a page needs a larger display size. */
  titleClassName?: string;
};

/**
 * Canonical section header (eyebrow pill + title + subtitle) at one fixed
 * responsive scale, replacing the per-page mix of text-2xl…6xl. Keeps every
 * sub-page's section titles visually consistent.
 */
export function SectionHeading({
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
  align = "center",
  className = "",
  titleClassName = "",
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-start";

  return (
    <div className={`flex flex-col ${alignment} ${className}`.trim()}>
      {eyebrow ? (
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-bg-surface px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-accent-primary-text shadow-sm">
          {eyebrowIcon}
          {eyebrow}
        </span>
      ) : null}

      <h2 className={`text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-text-primary ${titleClassName}`.trim()}>
        {title}
      </h2>

      {subtitle ? (
        <p className="mt-3 max-w-2xl text-base sm:text-lg leading-relaxed text-text-secondary">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

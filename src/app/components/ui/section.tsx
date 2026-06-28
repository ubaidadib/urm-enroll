import { type ReactNode } from "react";

type SectionWidth = "default" | "narrow" | "wide";

const MAX_WIDTH: Record<SectionWidth, string> = {
  default: "max-w-7xl",
  narrow: "max-w-3xl",
  wide: "max-w-[96rem]",
};

type SectionProps = {
  children: ReactNode;
  id?: string;
  width?: SectionWidth;
  /** Classes applied to the <section> element (e.g. background, borders). */
  className?: string;
  /** Classes applied to the centered inner container. */
  innerClassName?: string;
  "aria-label"?: string;
};

/**
 * Canonical page section: enforces the design system's vertical rhythm
 * (`page-section-y` → responsive 4–7rem) and horizontal gutter, with a centered
 * max-width container. Use this instead of ad-hoc `py-16/24/32` on sub-pages so
 * every section shares the same spacing.
 */
export function Section({
  children,
  id,
  width = "default",
  className = "",
  innerClassName = "",
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      className={`page-section-y px-[var(--content-gutter)] ${className}`.trim()}
      {...rest}
    >
      <div className={`mx-auto ${MAX_WIDTH[width]} ${innerClassName}`.trim()}>{children}</div>
    </section>
  );
}

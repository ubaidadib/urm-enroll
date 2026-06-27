/**
 * Guide Content Components
 * Reusable building blocks for interactive guide / article pages.
 * All styling uses design-token classes only.
 */
import { m } from "motion/react";
import { CheckCircle2, AlertCircle, Info, Clock, ChevronRight, type LucideIcon } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// GuideStep — single numbered step in a sequential process
// ─────────────────────────────────────────────────────────────────────────────
export interface GuideStepProps {
  number: number;
  title: string;
  description: string;
  tips?: string[];
  icon?: LucideIcon;
  badge?: string;
}

export function GuideStep({ number, title, description, tips, icon: Icon, badge }: GuideStepProps) {
  return (
    <m.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: number * 0.05 }}
      className="relative flex gap-5"
    >
      {/* Step indicator line */}
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-primary/10 border-2 border-accent-primary text-accent-primary-text font-black text-sm flex-shrink-0">
          {Icon ? <Icon className="w-4 h-4" /> : number}
        </div>
        <div className="w-px flex-1 mt-2 bg-border" />
      </div>

      {/* Content */}
      <div className="pb-8 pt-1 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h3 className="text-base font-black text-text-primary">{title}</h3>
          {badge && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full bg-accent-success/10 text-accent-success border border-accent-success/20">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
        {tips && tips.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                <ChevronRight className="w-3.5 h-3.5 text-accent-primary-text mt-0.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        )}
      </div>
    </m.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GuideStepList — wraps a set of steps with section header
// ─────────────────────────────────────────────────────────────────────────────
export interface GuideStepListProps {
  id: string;
  heading: string;
  steps: GuideStepProps[];
}

export function GuideStepList({ id, heading, steps }: GuideStepListProps) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-xl font-black text-text-primary mb-6">{heading}</h2>
      <div>
        {steps.map((step) => (
          <GuideStep key={step.number} {...step} />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GuideInfoCard — callout card (info | warning | success | tip)
// ─────────────────────────────────────────────────────────────────────────────
const CARD_VARIANTS = {
  info: {
    bg: "bg-accent-primary/5 border-accent-primary/20",
    icon: Info,
    iconClass: "text-accent-primary-text",
    titleClass: "text-accent-primary-text",
  },
  warning: {
    bg: "bg-amber-500/5 border-amber-500/20",
    icon: AlertCircle,
    iconClass: "text-amber-500",
    titleClass: "text-amber-600 dark:text-amber-400",
  },
  success: {
    bg: "bg-accent-success/5 border-accent-success/20",
    icon: CheckCircle2,
    iconClass: "text-accent-success",
    titleClass: "text-accent-success",
  },
  tip: {
    bg: "bg-accent-tech/5 border-accent-tech/20",
    icon: Info,
    iconClass: "text-accent-tech",
    titleClass: "text-accent-tech",
  },
} as const;

export type GuideInfoCardVariant = keyof typeof CARD_VARIANTS;

export interface GuideInfoCardProps {
  variant?: GuideInfoCardVariant;
  title: string;
  body: string;
}

export function GuideInfoCard({ variant = "info", title, body }: GuideInfoCardProps) {
  const v = CARD_VARIANTS[variant];
  const Icon = v.icon;
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 rounded-2xl border p-5 ${v.bg}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${v.iconClass}`} />
      <div>
        <p className={`text-sm font-bold mb-1 ${v.titleClass}`}>{title}</p>
        <p className="text-sm text-text-secondary leading-relaxed">{body}</p>
      </div>
    </m.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GuideChecklist — document/requirement checklist
// ─────────────────────────────────────────────────────────────────────────────
export interface GuideChecklistProps {
  id: string;
  heading: string;
  items: Array<{ label: string; detail?: string }>;
}

export function GuideChecklist({ id, heading, items }: GuideChecklistProps) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-xl font-black text-text-primary mb-5">{heading}</h2>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <m.li
            key={i}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
            className="flex items-start gap-3 p-4 rounded-xl border border-border bg-background-surface"
          >
            <CheckCircle2 className="w-4 h-4 text-accent-success mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-semibold text-text-primary">{item.label}</span>
              {item.detail && <p className="text-xs text-text-muted mt-0.5">{item.detail}</p>}
            </div>
          </m.li>
        ))}
      </ul>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GuideFAQ — expandable Q&A section
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface GuideFAQItem {
  question: string;
  answer: string;
}

export interface GuideFAQProps {
  id: string;
  heading: string;
  items: GuideFAQItem[];
}

export function GuideFAQ({ id, heading, items }: GuideFAQProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-xl font-black text-text-primary mb-5">{heading}</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-border bg-background-surface overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="w-full flex items-center justify-between px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            >
              <span className="text-sm font-semibold text-text-primary">{item.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="px-5 pb-4 text-sm text-text-secondary leading-relaxed"
              >
                {item.answer}
              </m.div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GuideTimeline — visual horizontal or vertical timeline
// ─────────────────────────────────────────────────────────────────────────────
export interface GuideTimelineItem {
  phase: string;
  duration: string;
  label: string;
}

export interface GuideTimelineProps {
  id: string;
  heading: string;
  items: GuideTimelineItem[];
}

export function GuideTimeline({ id, heading, items }: GuideTimelineProps) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-xl font-black text-text-primary mb-6">{heading}</h2>
      <div className="flex flex-col sm:flex-row gap-0">
        {items.map((item, i) => (
          <m.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="flex-1 relative"
          >
            {/* connector line */}
            {i < items.length - 1 && (
              <div className="hidden sm:block absolute top-5 left-[calc(50%+20px)] right-0 h-px bg-border z-0" />
            )}
            <div className="relative z-10 flex flex-col items-center text-center px-3 pb-6">
              <div className="w-10 h-10 rounded-full bg-accent-primary/10 border-2 border-accent-primary text-accent-primary-text font-black text-xs flex items-center justify-center mb-2">
                {i + 1}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent-primary-text mb-0.5">{item.phase}</span>
              <span className="flex items-center gap-1 text-xs text-text-muted mb-1">
                <Clock className="w-3 h-3" />
                {item.duration}
              </span>
              <span className="text-sm font-semibold text-text-primary">{item.label}</span>
            </div>
          </m.div>
        ))}
      </div>
    </section>
  );
}

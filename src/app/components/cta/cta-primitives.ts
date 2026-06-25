export const CTA_FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary";

export const CTA_PRIMARY_ELEVATED =
  "bg-gradient-to-r from-accent-primary to-accent-primary-strong text-white shadow-lg shadow-accent-primary/20 hover:shadow-xl hover:shadow-accent-primary/30 hover:-translate-y-0.5";

export const CTA_PRIMARY_STANDARD =
  "bg-linear-to-r from-accent-primary to-accent-primary-strong text-white shadow-md hover:shadow-lg hover:-translate-y-0.5";

export const CTA_SECONDARY_GLASS =
  "bg-surface-glass/5 backdrop-blur-sm border border-border/50 text-text-primary hover:bg-surface-glass/10 hover:border-accent-tech/50 hover:shadow-lg hover:shadow-accent-tech/10";

export const CTA_DARK =
  "btn-gold-primary shadow-lg hover:shadow-xl hover:-translate-y-0.5";

export const CTA_WHATSAPP =
  "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366]/10 text-[#25D366] text-sm font-bold hover:bg-[#25D366]/20 transition-all duration-300 shrink-0";

export const CTA_BUTTON_BASE =
  `group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 active:scale-[0.97] ${CTA_FOCUS_RING}`;

export const CTA_BANNER_ACTION_BASE =
  `group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 w-full sm:w-auto ${CTA_FOCUS_RING}`;

export const CTA_COMPACT_ACTION_BASE =
  "group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300";

export const CTA_INLINE_BASE =
  `group inline-flex items-center gap-1.5 text-sm font-semibold text-accent-primary hover:text-accent-primary-strong transition-colors duration-200 ${CTA_FOCUS_RING}`;

// ─── Shared Partner Data ─────────────────────────────────────────────────────
// Single source of truth for partner logos/info.
// Consumed by: global-partners-marquee

export const PARTNERS = [
  { name: "Edvoy",    category: "edvoy" },
  { name: "ILAC",     category: "ilac" },
  { name: "Acceptix", category: "acceptix" },
  { name: "Flywire",  category: "flywire" },
  { name: "GUS",      category: "gus" },
  { name: "Sansesco", category: "sansesco" },
] as const;

export type Partner = (typeof PARTNERS)[number];

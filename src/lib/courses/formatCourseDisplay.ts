type NameLike = {
  name?: unknown;
};

type FeesLike = {
  display?: {
    value?: unknown;
    currency?: unknown;
  } | null;
  original?: {
    currency?: unknown;
  } | null;
  raw?: unknown;
  base?: unknown;
  after_sale?: unknown;
} | null;

type DateLike = {
  from?: unknown;
  to?: unknown;
  months?: unknown;
};

type ProgramLike = {
  name?: unknown;
  title?: unknown;
  address?: unknown;
  city?: unknown;
  country?: unknown;
  level?: unknown;
  degreeLevel?: unknown;
  pathway?: unknown;
  university?: unknown;
  fees?: unknown;
  dates?: unknown;
  seasons?: unknown;
  has_sale?: unknown;
  sale?: unknown;
  tuitionPerYear?: unknown;
  tuitionAmount?: unknown;
  tuitionCurrency?: unknown;
  fee?: unknown;
  tuition?: unknown;
  [key: string]: unknown;
};

export type ProgramTabId = "internships" | "scholarships" | "research" | "careers" | "global";

const INVALID_TEXT = new Set(["", "-", "—", "null", "undefined", "true", "false"]);

function cleanText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (INVALID_TEXT.has(trimmed.toLowerCase())) return null;
  return trimmed;
}

function readNamedValue(value: unknown): string | null {
  if (typeof value === "string") return cleanText(value);
  if (value && typeof value === "object") {
    return cleanText((value as NameLike).name);
  }
  return null;
}

function readNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const normalized = trimmed.replace(/[,$\s]/g, "");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function readCurrency(program: ProgramLike, fees?: FeesLike): string | null {
  const displayCurrency = cleanText(fees?.display?.currency);
  if (displayCurrency) return displayCurrency;

  const originalCurrency = cleanText(fees?.original?.currency);
  if (originalCurrency) return originalCurrency;

  return cleanText(program.tuitionCurrency);
}

function readArrayOfStrings(value: unknown): string[] {
  if (typeof value === "string") {
    const cleaned = cleanText(value);
    return cleaned ? [cleaned] : [];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => readNamedValue(entry) ?? cleanText(entry))
    .filter((entry): entry is string => Boolean(entry));
}

export function isMeaningfulText(value: unknown): boolean {
  return cleanText(value) !== null;
}

export function formatShortDate(value: unknown): string | null {
  const raw = cleanText(value);
  if (!raw) return null;

  if (!/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return raw;
  }

  const date = new Date(`${raw.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return raw;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateRange(from: unknown, to: unknown): string | null {
  const fromLabel = formatShortDate(from);
  const toLabel = formatShortDate(to);

  if (fromLabel && toLabel && fromLabel !== toLabel) {
    return `${fromLabel} – ${toLabel}`;
  }

  return fromLabel ?? toLabel;
}

/**
 * Extract a year string (e.g. "2026") from an ISO date string.
 * Returns null if the date is invalid or missing.
 */
function extractYear(value: unknown): string | null {
  const raw = cleanText(value);
  if (!raw) return null;
  const match = raw.match(/^(\d{4})-/);
  return match?.[1] ?? null;
}

export function formatIntakeDates(dates: unknown): string[] {
  if (!Array.isArray(dates)) {
    return [];
  }

  const unique = new Set<string>();

  for (const entry of dates) {
    if (!entry || typeof entry !== "object") continue;

    const dateEntry = entry as DateLike;
    const monthNames = readArrayOfStrings(dateEntry.months);

    // Prefer "Month Year" — e.g. "October 2026"
    // Use the year from either `from` or `to` date
    const year = extractYear(dateEntry.from) ?? extractYear(dateEntry.to) ?? null;

    if (monthNames.length > 0) {
      const label = year ? `${monthNames.join(", ")} ${year}` : monthNames.join(", ");
      if (!unique.has(label)) unique.add(label);
      continue;
    }

    // Fallback: show date range when no months array is present
    const range = formatDateRange(dateEntry.from, dateEntry.to);
    if (range && !unique.has(range)) {
      unique.add(range);
    }
  }

  return [...unique];
}

/**
 * Season objects from Supabase: { id: number, value: string, availability: boolean }
 * Only show seasons where availability is true.
 * Also accepts plain strings for backwards compatibility.
 */
export function formatSeasonsList(seasons: unknown): string[] {
  if (!Array.isArray(seasons)) return [];

  const unique = new Set<string>();

  for (const season of seasons) {
    if (!season) continue;

    // Supabase format: { id, value, availability }
    if (typeof season === "object" && season !== null) {
      const s = season as Record<string, unknown>;
      // Only surface seasons that are actually available
      if (s.availability === false) continue;
      const label = cleanText(s.value);
      if (label && !unique.has(label)) unique.add(label);
      continue;
    }

    // Plain string fallback
    const label = cleanText(season);
    if (label && !unique.has(label)) unique.add(label);
  }

  return [...unique];
}

export function formatLocationLabel(program: ProgramLike): string | null {
  const city = readNamedValue(program.city);
  const country = readNamedValue(program.country);

  if (city && country) {
    return `${city}, ${country}`;
  }

  if (city) return city;
  if (country) return country;

  return cleanText(program.address);
}

export function formatDisplayFees(program: ProgramLike): string | null {
  const fees = (program.fees && typeof program.fees === "object" ? program.fees : null) as FeesLike;
  const currency = readCurrency(program, fees);
  const hasSale = program.has_sale === true || program.sale === true;
  const discountedValue = readNumber(fees?.after_sale);

  if (hasSale && discountedValue !== null && discountedValue > 0) {
    return currency
      ? `${currency} ${discountedValue.toLocaleString()}`
      : discountedValue.toLocaleString();
  }

  // Only display fee values that are actually non-zero (0 means unknown, not free)
  const displayValue = readNumber(fees?.display?.value);
  const displayCurrency = cleanText(fees?.display?.currency);
  if (displayValue !== null && displayValue > 0 && displayCurrency) {
    return `${displayCurrency} ${displayValue.toLocaleString()}`;
  }

  const rawFees = cleanText(fees?.raw);
  if (rawFees) {
    return rawFees;
  }

  const baseValue = readNumber(fees?.base);
  if (baseValue !== null && baseValue > 0) {
    return currency
      ? `${currency} ${baseValue.toLocaleString()}`
      : String(baseValue);
  }

  // feesText is a human-readable string stored by the pipeline (e.g. "200,000 TRY / year")
  const feesText = cleanText(program.feesText);
  if (feesText) {
    return feesText;
  }

  const fallbackAmount = readNumber(program.tuitionPerYear ?? program.tuitionAmount ?? program.fee ?? program.tuition);
  if (fallbackAmount !== null && fallbackAmount > 0) {
    return currency
      ? `${currency} ${fallbackAmount.toLocaleString()}`
      : fallbackAmount.toLocaleString();
  }

  // Return null when fees are unknown or zero — callers decide whether to show "Free" or "Contact"
  return null;
}

export function inferProgramTabId(program: ProgramLike): ProgramTabId {
  const haystack = [
    readNamedValue(program.pathway),
    readNamedValue(program.level),
    cleanText(program.name),
    cleanText(program.title),
    cleanText(program.degreeLevel),
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();

  if (/intern|placement|trainee|co-?op/.test(haystack)) return "internships";
  if (/scholarship|grant|bursary|fund/.test(haystack)) return "scholarships";
  if (/research|laboratory|\blab\b|thesis|phd|doctoral/.test(haystack)) return "research";
  if (/career|employ|full[\s-]?time|graduate role|job/.test(haystack)) return "careers";
  if (/exchange|abroad|global|international|semester|study away/.test(haystack)) return "global";
  return "global";
}

export function formatUniversityName(program: ProgramLike): string | null {
  return readNamedValue(program.university);
}

export function formatUniversityLogo(program: ProgramLike): string | null {
  if (!program.university || typeof program.university !== "object") {
    return null;
  }

  const logo = cleanText((program.university as Record<string, unknown>).logo);
  return logo ?? null;
}

export function formatLevelName(program: ProgramLike): string | null {
  return readNamedValue(program.level) ?? cleanText(program.degreeLevel);
}

export function formatPathwayName(program: ProgramLike): string {
  return readNamedValue(program.pathway) ?? readNamedValue(program.level) ?? cleanText(program.degreeLevel) ?? "Program";
}
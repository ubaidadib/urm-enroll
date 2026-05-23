/**
 * supabase-catalog.js
 *
 * Queries the same Supabase database as URM Nexus using the EXACT columns from
 * the live database schema, then reshapes the flat course list into the
 * university-with-programs structure the frontend expects.
 *
 * Actual live Supabase schema (verified):
 *   universities  – id, name, country_id, city_id, logo
 *   countries     – id, name, image, image_mobile, image_web
 *   cities        – id, name, country_id
 *   levels        – id, name
 *   pathways      – id, name
 *   courses       – id, name, university_id, country_id, city_id, level_id,
 *                   pathway_id, fees, fees_after_sale, application_fees,
 *                   requirements, dates, seasons, address, toefl_score,
 *                   has_sale, sale_percentage, is_seasonal,
 *                   fees_with_currency (JSON object), original_currency,
 *                   original_value, display_currency, display_value
 */

import { createClient } from "@supabase/supabase-js";
import ws from "ws";

let _client = null;

function getClient() {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local.",
    );
  }

  _client = createClient(url, key, {
    auth: { persistSession: false },
    realtime: { transport: ws },
  });

  return _client;
}

/** Map a Supabase course row to the Program shape the frontend consumes. */
function buildProgram(course) {
  const originalValue  = Number(course.original_value  ?? 0);
  const originalCurrency = course.original_currency   ?? null;
  const displayValue   = Number(course.display_value   ?? 0);
  const displayCurrency  = course.display_currency    ?? null;
  const baseValue      = Number(course.fees            ?? 0);
  const afterSaleValue = Number(course.fees_after_sale ?? 0);

  // Prefer the original local-currency fee (EUR/TRY/etc.) over the USD conversion.
  // Fall back chain: original → display → base → after_sale → 0
  const effectiveTuition =
    (originalValue  > 0 ? originalValue  : null) ??
    (displayValue   > 0 ? displayValue   : null) ??
    (baseValue      > 0 ? baseValue      : null) ??
    (afterSaleValue > 0 ? afterSaleValue : null) ??
    0;

  const effectiveCurrency =
    (originalValue  > 0 ? originalCurrency  : null) ??
    (displayValue   > 0 ? displayCurrency   : null) ??
    null;

  // Build a human-readable fee label from original or display columns.
  let feesText = "";
  if (originalValue > 0 && originalCurrency) {
    feesText = `${originalCurrency} ${originalValue.toLocaleString()}`;
  } else if (displayValue > 0 && displayCurrency) {
    feesText = `${displayCurrency} ${displayValue.toLocaleString()}`;
  }

  // Parse seasons: Supabase stores [{id, value, availability}]
  // We keep the full objects so formatSeasonsList can show available seasons.
  const seasons = Array.isArray(course.seasons) ? course.seasons : null;

  return {
    id: String(course.id),
    name: course.name ?? "",

    // courses table has no dedicated field/duration/language columns
    degreeLevel: normalizeDegreeLevel(course.levels?.name),
    field: "general",
    duration: "",
    language: "",

    tuitionPerYear:  effectiveTuition,
    tuitionCurrency: effectiveCurrency ?? "",
    feesText,

    // requirements is the raw text shown in the Requirements tab
    description: typeof course.requirements === "string"
      ? course.requirements.trim()
      : "",
    requirements: [],

    // Use the country's web image as program cover photo (no dedicated image in courses table)
    coverPhoto: toProxiedUrl(
      course.countries?.image_web
      || course.countries?.image_mobile
      || course.countries?.image
      || ""
    ),

    // Embed the university reference so formatUniversityName / formatUniversityLogo work
    // on the program object without needing the parent context.
    university: course.universities
      ? {
          id:   course.universities.id,
          name: course.universities.name,
          logo: toProxiedUrl(course.universities.logo),
        }
      : null,

    // Full fees object — mirrors the Nexus API response shape exactly
    fees: {
      base:             baseValue      || null,
      after_sale:       afterSaleValue || null,
      application_fees: Number(course.application_fees ?? 0) || null,
      original: {
        value:    originalValue    || null,
        currency: originalCurrency,
      },
      display: {
        value:    displayValue    || null,
        currency: displayCurrency,
      },
      // fees_with_currency is a JSON object in the live DB (not a plain string)
      raw: course.fees_with_currency ?? null,
    },

    // Intake / schedule
    dates:       Array.isArray(course.dates) ? course.dates : null,
    seasons,
    is_seasonal: Boolean(course.is_seasonal),

    // Sale info
    has_sale:       Boolean(course.has_sale),
    sale_percentage: typeof course.sale_percentage === "number"
      ? course.sale_percentage
      : null,

    // Classification — full objects from joined tables
    level:   course.levels   ? { id: course.levels.id,   name: course.levels.name   } : null,
    pathway: course.pathways ? { id: course.pathways.id, name: course.pathways.name } : null,

    // Program-level location (more accurate than university-level)
    country: course.countries
      ? {
          id:           course.countries.id,
          name:         course.countries.name,
          image:        course.countries.image        ?? null,
          image_mobile: course.countries.image_mobile ?? null,
          image_web:    course.countries.image_web    ?? null,
        }
      : null,
    city: course.cities ? { id: course.cities.id, name: course.cities.name } : null,

    address:     typeof course.address     === "string" ? course.address     : null,
    toefl_score: typeof course.toefl_score === "number" ? course.toefl_score : null,
  };
}

function normalizeDegreeLevel(levelName) {
  if (!levelName) return "bachelor";
  const lower = levelName.toLowerCase();
  if (lower.includes("postgrad") || lower.includes("master") || lower.includes("msc") || lower.includes("mba")) return "master";
  if (lower.includes("phd") || lower.includes("doctor")) return "phd";
  if (lower.includes("diploma") || lower.includes("certificate")) return "certificate";
  return "bachelor";
}

function toProxiedUrl(url, proxyPath = "/api/media/image") {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("/") || !/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${proxyPath}?url=${encodeURIComponent(trimmed)}`;
}

/**
 * Fetch the full catalog from Supabase.
 *
 * Returns { data: University[], status: "ok" } — same shape as the
 * /api/catalog/universities endpoint so bootstrapMirrorCatalogCache works
 * without any frontend changes.
 */
export async function fetchCatalogFromSupabase() {
  const supabase = getClient();

  // ── universities (actual live columns only) ──────────────────────────────
  const { data: universities, error: uniError } = await supabase
    .from("universities")
    .select(`
      id,
      name,
      logo,
      country_id,
      city_id,
      countries ( id, name, image, image_mobile, image_web ),
      cities    ( id, name )
    `);

  if (uniError) throw new Error(`Supabase universities: ${uniError.message}`);

  // ── courses — paginate in chunks of 1000 (Supabase default row cap) ──────
  const PAGE_SIZE = 1000;
  const COURSE_SELECT = `
    id,
    name,
    university_id,
    country_id,
    city_id,
    level_id,
    pathway_id,
    fees,
    fees_after_sale,
    application_fees,
    requirements,
    dates,
    seasons,
    address,
    toefl_score,
    has_sale,
    sale_percentage,
    is_seasonal,
    fees_with_currency,
    original_currency,
    original_value,
    display_currency,
    display_value,
    universities ( id, name, logo ),
    countries   ( id, name, image, image_mobile, image_web ),
    cities      ( id, name ),
    levels      ( id, name ),
    pathways    ( id, name )
  `;

  const courses = [];
  let from = 0;
  while (true) {
    const { data: page, error: courseError } = await supabase
      .from("courses")
      .select(COURSE_SELECT)
      .range(from, from + PAGE_SIZE - 1);

    if (courseError) throw new Error(`Supabase courses: ${courseError.message}`);
    if (!page || page.length === 0) break;
    courses.push(...page);
    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  // ── group courses by university ──────────────────────────────────────────
  const programsByUniversity = new Map();
  for (const course of courses ?? []) {
    const uniId = String(course.university_id);
    if (!programsByUniversity.has(uniId)) {
      programsByUniversity.set(uniId, []);
    }
    programsByUniversity.get(uniId).push(buildProgram(course));
  }

  // ── build university objects ─────────────────────────────────────────────
  const result = (universities ?? []).map((uni) => {
    const programs = programsByUniversity.get(String(uni.id)) ?? [];

    const positiveTuitions = programs
      .map((p) => p.tuitionPerYear)
      .filter((v) => Number.isFinite(v) && v > 0);
    const startingTuitionAmount = positiveTuitions.length > 0
      ? Math.min(...positiveTuitions)
      : null;
    const cheapestProgram = programs.find(
      (p) => p.tuitionPerYear === startingTuitionAmount,
    );

    return {
      id:           String(uni.id),
      name:         uni.name ?? "",
      city:         uni.cities?.name    ?? "",
      country:      uni.countries?.name ?? "",
      countryCode:  "",   // not available in live universities table
      type:         programs.some((p) => p.tuitionPerYear > 0) ? "private" : "public",
      logo:         toProxiedUrl(uni.logo),
      // Use the country's web image as a hero/cover image for the university card
      coverPhoto:   toProxiedUrl(
        uni.countries?.image_web
        || uni.countries?.image_mobile
        || uni.countries?.image
        || ""
      ),
      programsCount: programs.length,
      languages:    [],
      established:  0,
      ranking:      9999,
      description:  "",
      website:      "",
      applicationFees:        null,
      hasCourses:             programs.length > 0,
      latitude:               null,
      longitude:              null,
      startingTuitionAmount,
      startingTuitionCurrency: cheapestProgram?.tuitionCurrency ?? "",
      levels:   [...new Set(programs.map((p) => p.degreeLevel).filter(Boolean))],
      pathways: [...new Set(programs.map((p) => p.pathway?.name).filter(Boolean))],
      programs,
    };
  });

  return { data: result, status: "ok" };
}

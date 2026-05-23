const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const toNumber = (value, fallback = null) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

const normalizeDegreeLevel = (value) => {
  const text = String(value || "").toLowerCase();
  if (!text) return null;
  if (text.includes("undergraduate") || text.includes("bachelor")) return "bachelor";
  if (text.includes("graduate") || text.includes("master")) return "master";
  if (text.includes("phd") || text.includes("doctor")) return "phd";
  return text;
};

export function mapUniversityRecord(item) {
  const sourceId = String(item?.id ?? item?.source_id ?? "").trim();
  if (!sourceId) {
    return null;
  }

  const countryValue = item?.country;
  const cityValue = item?.city;

  return {
    source_id: sourceId,
    slug: item?.slug ? String(item.slug) : null,
    name: String(item?.name ?? item?.title ?? "Unknown University"),
    city: typeof cityValue === "string"
      ? cityValue
      : cityValue?.name
        ? String(cityValue.name)
        : null,
    country: typeof countryValue === "string"
      ? countryValue
      : countryValue?.name
        ? String(countryValue.name)
        : null,
    country_code: item?.countryCode
      ? String(item.countryCode)
      : item?.country_code
        ? String(item.country_code)
        : countryValue?.iso_code
          ? String(countryValue.iso_code)
          : countryValue?.isoCode
            ? String(countryValue.isoCode)
            : null,
    type: item?.type ? String(item.type) : null,
    logo: item?.logo ? String(item.logo) : null,
    cover_photo: item?.coverPhoto ? String(item.coverPhoto) : item?.cover_photo ? String(item.cover_photo) : null,
    programs_count: toNumber(item?.programsCount ?? item?.programs_count ?? (Array.isArray(item?.programs) ? item.programs.length : 0), 0),
    languages: toArray(item?.languages),
    established: toNumber(item?.established),
    ranking: toNumber(item?.ranking),
    description: item?.description ? String(item.description) : null,
    website: item?.website ? String(item.website) : null,
    payload_json: item,
    source_updated_at: parseDate(item?.updated_at ?? item?.source_updated_at),
    is_deleted: Boolean(item?.is_deleted),
  };
}

export function mapCourseRecord(item) {
  const sourceId = String(item?.id ?? item?.source_id ?? "").trim();
  if (!sourceId) {
    return null;
  }

  const universityId = item?.universityId
    ?? item?.university?.id
    ?? item?.university_source_id
    ?? null;

  const universityName = item?.universityName
    ?? item?.university_name
    ?? item?.university?.name
    ?? null;

  const tuitionDisplay = item?.fees?.display;
  const tuitionOriginal = item?.fees?.original;
  const feesBase = item?.fees?.base;
  const feesAfterSale = item?.fees?.after_sale;

  // Prefer non-zero numeric fee values: explicit overrides > display > original > base > after_sale
  const tuitionAmount = toNumber(
    item?.tuitionPerYear
    ?? item?.tuition_amount
    ?? (Number(tuitionDisplay?.value) > 0 ? tuitionDisplay?.value : undefined)
    ?? (Number(tuitionOriginal?.value) > 0 ? tuitionOriginal?.value : undefined)
    ?? (Number(feesBase) > 0 ? feesBase : undefined)
    ?? (Number(feesAfterSale) > 0 ? feesAfterSale : undefined),
  );

  const tuitionCurrency = String(
    (Number(tuitionDisplay?.value) > 0 ? tuitionDisplay?.currency : null)
    ?? (Number(tuitionOriginal?.value) > 0 ? tuitionOriginal?.currency : null)
    ?? item?.tuitionCurrency
    ?? item?.tuition_currency
    ?? "",
  ) || null;

  // Raw fees text (e.g. "200,000 TRY / year") — used as display fallback when numeric value is 0
  const feesText = typeof item?.fees?.raw === "string" ? item.fees.raw.trim() : "";

  return {
    source_id: sourceId,
    university_source_id: universityId !== null ? String(universityId) : null,
    university_name: universityName !== null ? String(universityName) : null,
    title: String(item?.title ?? item?.name ?? "Untitled Course"),
    degree_level: normalizeDegreeLevel(item?.degreeLevel ?? item?.degree_level ?? item?.level?.name),
    field: item?.field ? String(item.field) : item?.pathway?.name ? String(item.pathway.name) : "general",
    duration: item?.duration ? String(item.duration) : null,
    language: item?.language ? String(item.language) : null,
    tuition_amount: tuitionAmount,
    tuition_currency: tuitionCurrency,
    fees_text: feesText,
    description: item?.description ? String(item.description) : null,
    requirements_text: item?.requirements ? String(item.requirements) : null,
    payload_json: item,
    source_updated_at: parseDate(item?.updated_at ?? item?.source_updated_at),
    is_deleted: Boolean(item?.is_deleted),
  };
}

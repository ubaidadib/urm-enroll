import type { University, Program as UniversityProgram } from "@/data/universities";
import { refreshUniversitiesSnapshot } from "@/data/universities";
import type { Program, ProgramType } from "@/lib/programs";
import { refreshProgramsSnapshot } from "@/lib/programs";

declare global {
  interface Window {
    __URM_MIRROR_UNIVERSITIES__?: University[];
    __URM_MIRROR_PROGRAMS__?: Program[];
  }
}

type CatalogResponse<T> = {
  data?: T[];
};

export const MIRROR_CATALOG_READY_EVENT = "urm:mirror-catalog-ready";

const MODULE_SNIPPET_RE = /^\s*import\s+\{/;

const parseBoolean = (value: string | undefined, defaultValue: boolean) => {
  if (value === undefined) return defaultValue;
  return value === "true";
};

const DEGREE_TO_PROGRAM_TYPE: Record<string, ProgramType> = {
  bachelor: "bachelor",
  master: "master",
  nursing: "nursing",
  language: "language",
};

const toProgramType = (value: string | undefined): ProgramType => {
  if (!value) return "bachelor";
  return DEGREE_TO_PROGRAM_TYPE[value] || "bachelor";
};

const toUniversityType = (value: unknown): University["type"] => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized.includes("international")) return "international";
  if (normalized.includes("public") || normalized === "state") return "public";
  if (normalized.includes("private")) return "private";
  return "private";
};

const readTuitionAmount = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : -1;
  }
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : -1;
  }
  return -1;
};

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toMirrorProgram = (course: Record<string, unknown>): Program => {
  const title = String(course.title || course.name || "Untitled Program");
  const description = String(course.description || "");

  const tuitionAmount = readTuitionAmount(course.tuitionPerYear ?? course.tuitionAmount ?? course.fee ?? course.tuition);

  return {
    id: String(course.id || ""),
    countryCode: String(course.countryCode || "DE"),
    type: toProgramType(String(course.degreeLevel || "bachelor")),
    field: String(course.field || "general"),
    title: { en: title, ar: title, de: title },
    description: { en: description, ar: description, de: description },
    language: typeof course.language === "string" ? [course.language] : ["English"],
    duration: String(course.duration || ""),
    tuition: {
      amount: tuitionAmount >= 0 ? String(tuitionAmount) : "",
      currency: String(course.tuitionCurrency || course.currency || ""),
      period: "year",
    },
    featured: Boolean(course.featured),
  };
};

const toUniversityProgram = (program: Record<string, unknown>): UniversityProgram => {
  const country = (program.country && typeof program.country === "object") ? program.country as Record<string, unknown> : null;

  // Use country image as cover photo fallback when no direct cover photo is available
  const directCoverPhoto = String(program.coverPhoto || program.image || program.imageUrl || "");
  const countryImageFallback = country
    ? String(country.image_web || country.imageWeb || country.image_mobile || country.imageMobile || country.image || "")
    : "";
  const coverPhoto = directCoverPhoto || countryImageFallback;

  return {
    id: String(program.id || ""),
    name: String(program.name || program.title || "Untitled Program"),
    degreeLevel: (program.degreeLevel as UniversityProgram["degreeLevel"]) || "bachelor",
    field: String(program.field || "general"),
    duration: String(program.duration || ""),
    language: String(program.language || ""),
    tuitionPerYear: readTuitionAmount(program.tuitionPerYear ?? program.tuitionAmount ?? program.fee ?? program.tuition),
    tuitionCurrency: String(program.tuitionCurrency || program.currency || ""),
    description: String(program.description || ""),
    requirements: Array.isArray(program.requirements) ? program.requirements.map(String) : [],
    feesText: String(program.feesText || ""),
    coverPhoto,

    // Pass through all rich Nexus fields as-is — they are already structured correctly
    dates: program.dates ?? null,
    seasons: program.seasons ?? null,
    level: (program.level && typeof program.level === "object") ? program.level as UniversityProgram["level"] : null,
    pathway: (program.pathway && typeof program.pathway === "object") ? program.pathway as UniversityProgram["pathway"] : null,
    country: country as UniversityProgram["country"],
    city: (program.city && typeof program.city === "object") ? program.city as UniversityProgram["city"] : null,
    has_sale: Boolean(program.has_sale),
    sale_percentage: typeof program.sale_percentage === "number" ? program.sale_percentage : null,
    is_seasonal: Boolean(program.is_seasonal),
    address: typeof program.address === "string" ? program.address : null,
    toefl_score: typeof program.toefl_score === "number" ? program.toefl_score : null,
    fees: (program.fees && typeof program.fees === "object") ? program.fees as UniversityProgram["fees"] : null,
    // Embed university reference (mirrors the Nexus API shape: { id, name, logo })
    university: (program.university && typeof program.university === "object")
      ? program.university as UniversityProgram["university"]
      : null,
  };
};

const toMirrorUniversity = (item: Record<string, unknown>): University => {
  const programs: UniversityProgram[] = Array.isArray(item.programs)
    ? item.programs.map((program) => toUniversityProgram(program as Record<string, unknown>))
    : [];

  const hasExplicitType = typeof item.type === "string" && String(item.type).trim().length > 0;
  const inferredType: University["type"] = programs.some((program) => program.tuitionPerYear > 0) ? "private" : "public";
  const rankingValue = Number(item.ranking);

  return {
    id: String(item.id || ""),
    name: String(item.name || "Unknown University"),
    city: String(item.city || ""),
    country: String(item.country || ""),
    countryCode: String(item.countryCode || ""),
    type: hasExplicitType ? toUniversityType(item.type) : inferredType,
    logo: String(item.logo || item.logoUrl || item.image || item.imageUrl || ""),
    coverPhoto: String(
      item.image_web
      || item.imageWeb
      || item.image_mobile
      || item.imageMobile
      || item.coverPhoto
      || item.cover
      || item.banner
      || item.heroImage
      || item.image
      || item.imageUrl
      || ""
    ),
    programsCount: Number(item.programsCount || programs.length || 0),
    languages: Array.isArray(item.languages) ? item.languages.map(String) : [],
    established: Number(item.established || 0),
    ranking: Number.isFinite(rankingValue) && rankingValue > 0 ? rankingValue : 0,
    description: String(item.description || ""),
    website: item.website ? String(item.website) : undefined,
    applicationFees: toNullableNumber(item.applicationFees ?? item.application_fees),
    hasCourses: item.hasCourses === undefined ? programs.length > 0 : Boolean(item.hasCourses),
    latitude: toNullableNumber(item.latitude ?? item.lat),
    longitude: toNullableNumber(item.longitude ?? item.lng),
    startingTuitionAmount: toNullableNumber(item.startingTuitionAmount ?? item.starting_tuition_amount),
    startingTuitionCurrency: String(item.startingTuitionCurrency || item.starting_tuition_currency || ""),
    levels: Array.isArray(item.levels) ? item.levels.map(String) : [],
    pathways: Array.isArray(item.pathways) ? item.pathways.map(String) : [],
    programs,
  };
};

export async function bootstrapMirrorCatalogCache(): Promise<void> {
  const mirrorEnabled = parseBoolean(import.meta.env.VITE_ENABLE_MIRROR_CATALOG, true);
  if (!mirrorEnabled) return;

  const mirrorFallbackEnabled = parseBoolean(import.meta.env.VITE_ENABLE_MIRROR_FALLBACK, import.meta.env.DEV);
  const fetchJson = async <T>(path: string): Promise<T> => {
    const response = await fetch(path, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const contentType = String(response.headers.get("content-type") || "").toLowerCase();
    const bodyText = await response.text();

    if (!response.ok) {
      throw new Error(`Request failed for ${path}: HTTP ${response.status} ${response.statusText}`);
    }

    if (!contentType.includes("application/json")) {
      const snippet = bodyText.slice(0, 120).replace(/\s+/g, " ");
      const detail = MODULE_SNIPPET_RE.test(bodyText)
        ? "received JavaScript module output"
        : `received content-type ${contentType || "unknown"}`;
      throw new Error(`Expected JSON from ${path}, but ${detail}. Response starts with: ${snippet}`);
    }

    return JSON.parse(bodyText) as T;
  };

  try {
    const [universitiesPayload, coursesPayload] = await Promise.all([
      fetchJson<CatalogResponse<Record<string, unknown>>>("/api/catalog/universities?page=1&pageSize=500&includePrograms=true"),
      fetchJson<CatalogResponse<Record<string, unknown>>>("/api/catalog/courses?page=1&pageSize=5000"),
    ]);

    const universities = Array.isArray(universitiesPayload.data)
      ? universitiesPayload.data.map(toMirrorUniversity)
      : [];

    const programs = Array.isArray(coursesPayload.data)
      ? coursesPayload.data.map(toMirrorProgram)
      : [];

    window.__URM_MIRROR_UNIVERSITIES__ = universities;
    window.__URM_MIRROR_PROGRAMS__ = programs;
    refreshUniversitiesSnapshot();
    refreshProgramsSnapshot();
    window.dispatchEvent(new CustomEvent(MIRROR_CATALOG_READY_EVENT));

    if (!mirrorFallbackEnabled && universities.length === 0) {
      throw new Error("Mirror catalog loaded with zero universities and fallback is disabled");
    }
  } catch (error) {
    if (!mirrorFallbackEnabled) {
      throw error;
    }
  }
}

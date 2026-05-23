/**
 * Universities mock data
 * Single source of truth for all university data across the platform
 */

export type UniversityType = "public" | "private" | "international";

export interface University {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  type: UniversityType;
  logo: string;
  coverPhoto: string;
  programsCount: number;
  languages: string[];
  established: number;
  ranking: number;
  description: string;
  website?: string;
  applicationFees?: number | null;
  hasCourses?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  startingTuitionAmount?: number | null;
  startingTuitionCurrency?: string;
  levels?: string[];
  pathways?: string[];
  programs: Program[];
}

export interface ProgramEntity {
  id?: unknown;
  name?: string | null;
}

export interface ProgramCountry extends ProgramEntity {
  image?: string | null;
  image_mobile?: string | null;
  image_web?: string | null;
}

export interface Program {
  id: string;
  name: string;
  degreeLevel: "bachelor" | "master" | "phd" | "certificate";
  field: string;
  duration: string;
  language: string;
  tuitionPerYear: number;
  tuitionCurrency: string;
  description: string;
  requirements?: string[];
  /** Raw fees text from Nexus (e.g. "200,000 TRY / year") — used when tuitionPerYear is 0 but fees are not free */
  feesText?: string;
  coverPhoto?: string;

  // Rich Nexus fields (all sourced from payload_json in the mirror DB)
  /** Intake date windows: [{ from?, to?, months? }] */
  dates?: unknown;
  /** Seasonal intake labels (string or { name } objects) */
  seasons?: unknown;
  /** Structured degree level from Nexus */
  level?: ProgramEntity | null;
  /** Structured study pathway from Nexus */
  pathway?: ProgramEntity | null;
  /** Country (with name + flag image URLs) */
  country?: ProgramCountry | null;
  /** City */
  city?: ProgramEntity | null;
  /** Whether this program has an active discount */
  has_sale?: boolean | null;
  /** Discount percentage (e.g. 20 for 20% off) */
  sale_percentage?: number | null;
  /** Whether this program uses seasonal rolling intakes */
  is_seasonal?: boolean | null;
  /** Campus address */
  address?: string | null;
  /** Minimum TOEFL score required */
  toefl_score?: number | null;
  /** Full structured fees object from Nexus */
  fees?: {
    base?: number | null;
    after_sale?: number | null;
    application_fees?: number | null;
    original?: { value?: number | null; currency?: string | null };
    display?: { value?: number | null; currency?: string | null };
    raw?: unknown | null;
  } | null;
  /** University reference embedded in the program (mirrors the Nexus API shape) */
  university?: ProgramEntity & { logo?: string | null } | null;
}

const parseBooleanFlag = (value: unknown, defaultValue: boolean) => {
  if (value === undefined || value === null || value === "") return defaultValue;
  return String(value).toLowerCase() === "true";
};

const MIRROR_FALLBACK_ENABLED = parseBooleanFlag(import.meta.env.VITE_ENABLE_MIRROR_FALLBACK, false);

const STATIC_UNIVERSITIES: University[] = [
  {
    id: "uni_001",
    name: "Technical University of Munich",
    city: "Munich",
    country: "Germany",
    countryCode: "DE",
    type: "public",
    logo: "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&q=80&w=100",
    coverPhoto: "https://images.unsplash.com/photo-1501952476817-d7ae22e8ee4e?auto=format&fit=crop&q=80&w=1200",
    programsCount: 156,
    languages: ["German", "English"],
    established: 1868,
    ranking: 35,
    description:
      "One of Europe's leading technical universities, renowned for engineering, computer science, and applied sciences programs.",
    website: "https://www.tum.de",
    programs: [
      {
        id: "prog_001_001",
        name: "Bachelor of Engineering",
        degreeLevel: "bachelor",
        field: "engineering",
        duration: "3 years",
        language: "German",
        tuitionPerYear: 0,
        tuitionCurrency: "EUR",
        description: "Comprehensive engineering program with focus on mechanical and electrical engineering.",
        requirements: ["High school diploma", "B1 German proficiency"],
      },
      {
        id: "prog_001_002",
        name: "Master of Computer Science",
        degreeLevel: "master",
        field: "computer-science",
        duration: "2 years",
        language: "English",
        tuitionPerYear: 0,
        tuitionCurrency: "EUR",
        description: "Advanced computer science with specializations in AI, cybersecurity, and software engineering.",
        requirements: ["Bachelor's degree in CS", "TOEFL 80+"],
      },
    ],
  },
  {
    id: "uni_002",
    name: "University of Berlin",
    city: "Berlin",
    country: "Germany",
    countryCode: "DE",
    type: "public",
    logo: "https://images.unsplash.com/photo-1553729784-e91953dec042?auto=format&fit=crop&q=80&w=100",
    coverPhoto: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1200",
    programsCount: 203,
    languages: ["German", "English"],
    established: 1810,
    ranking: 42,
    description:
      "One of the world's leading universities with strengths in humanities, natural sciences, and social sciences.",
    website: "https://www.hu-berlin.de",
    programs: [
      {
        id: "prog_002_001",
        name: "Bachelor of Physics",
        degreeLevel: "bachelor",
        field: "science",
        duration: "3 years",
        language: "German",
        tuitionPerYear: 0,
        tuitionCurrency: "EUR",
        description: "Theoretical and experimental physics program.",
      },
      {
        id: "prog_002_002",
        name: "Master of Philosophy",
        degreeLevel: "master",
        field: "arts",
        duration: "2 years",
        language: "English",
        tuitionPerYear: 200,
        tuitionCurrency: "EUR",
        description: "Advanced philosophical studies covering major traditions and contemporary issues.",
      },
    ],
  },
  {
    id: "uni_003",
    name: "University of Milan",
    city: "Milan",
    country: "Italy",
    countryCode: "IT",
    type: "public",
    logo: "https://images.unsplash.com/photo-1541339907198-5c6009e82b3d?auto=format&fit=crop&q=80&w=100",
    coverPhoto: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&q=80&w=1200",
    programsCount: 178,
    languages: ["Italian", "English"],
    established: 1863,
    ranking: 147,
    description:
      "Italy's premier research university with focus on engineering, medicine, and design programs.",
    website: "https://www.unimi.it",
    programs: [
      {
        id: "prog_003_001",
        name: "Bachelor of Design",
        degreeLevel: "bachelor",
        field: "arts",
        duration: "3 years",
        language: "Italian",
        tuitionPerYear: 1500,
        tuitionCurrency: "EUR",
        description: "Innovative design program combining theory and practice.",
      },
    ],
  },
  {
    id: "uni_004",
    name: "Universidad Autónoma de Madrid",
    city: "Madrid",
    country: "Spain",
    countryCode: "ES",
    type: "public",
    logo: "https://images.unsplash.com/photo-1579682537521-cc4d6cfe087b?auto=format&fit=crop&q=80&w=100",
    coverPhoto: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&q=80&w=1200",
    programsCount: 145,
    languages: ["Spanish", "English"],
    established: 1968,
    ranking: 168,
    description:
      "Leading Spanish university with strengths in business, engineering, and natural sciences.",
    website: "https://www.uam.es",
    programs: [
      {
        id: "prog_004_001",
        name: "Bachelor of Business Administration",
        degreeLevel: "bachelor",
        field: "business",
        duration: "4 years",
        language: "Spanish",
        tuitionPerYear: 2000,
        tuitionCurrency: "EUR",
        description: "Comprehensive business education with international perspective.",
      },
    ],
  },
  {
    id: "uni_005",
    name: "Sorbonne University",
    city: "Paris",
    country: "France",
    countryCode: "FR",
    type: "public",
    logo: "https://images.unsplash.com/photo-1567959866433-0da4b2b615d0?auto=format&fit=crop&q=80&w=100",
    coverPhoto: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200",
    programsCount: 189,
    languages: ["French", "English"],
    established: 1257,
    ranking: 77,
    description:
      "One of the oldest and most prestigious universities in Europe with excellence in all disciplines.",
    website: "https://www.sorbonne-universite.fr",
    programs: [
      {
        id: "prog_005_001",
        name: "Bachelor of Medicine",
        degreeLevel: "bachelor",
        field: "medicine",
        duration: "6 years",
        language: "French",
        tuitionPerYear: 300,
        tuitionCurrency: "EUR",
        description: "Medical education leading to medical degree and PhD.",
      },
    ],
  },
  {
    id: "uni_006",
    name: "University of Amsterdam",
    city: "Amsterdam",
    country: "Netherlands",
    countryCode: "NL",
    type: "public",
    logo: "https://images.unsplash.com/photo-1577720643272-265f434a2c00?auto=format&fit=crop&q=80&w=100",
    coverPhoto: "https://images.unsplash.com/photo-1549887534-57f44a86a5d8?auto=format&fit=crop&q=80&w=1200",
    programsCount: 167,
    languages: ["Dutch", "English"],
    established: 1877,
    ranking: 56,
    description:
      "Renowned Dutch research university with innovative programs in science and technology.",
    website: "https://www.uva.nl",
    programs: [
      {
        id: "prog_006_001",
        name: "Master of Data Science",
        degreeLevel: "master",
        field: "computer-science",
        duration: "2 years",
        language: "English",
        tuitionPerYear: 15000,
        tuitionCurrency: "EUR",
        description: "Comprehensive data science and AI program.",
      },
    ],
  },
  {
    id: "uni_007",
    name: "University of Zurich",
    city: "Zurich",
    country: "Switzerland",
    countryCode: "CH",
    type: "public",
    logo: "https://images.unsplash.com/photo-1576401132845-0c6688953e3d?auto=format&fit=crop&q=80&w=100",
    coverPhoto: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1200",
    programsCount: 134,
    languages: ["German", "English"],
    established: 1833,
    ranking: 68,
    description:
      "Switzerland's leading university with excellence in research and education across all disciplines.",
    website: "https://www.uzh.ch",
    programs: [
      {
        id: "prog_007_001",
        name: "Bachelor of Chemistry",
        degreeLevel: "bachelor",
        field: "science",
        duration: "3 years",
        language: "German",
        tuitionPerYear: 800,
        tuitionCurrency: "CHF",
        description: "Rigorous chemistry program with lab work.",
      },
    ],
  },
  {
    id: "uni_008",
    name: "Vienna University of Technology",
    city: "Vienna",
    country: "Austria",
    countryCode: "AT",
    type: "public",
    logo: "https://images.unsplash.com/photo-1554224311-beee415c201f?auto=format&fit=crop&q=80&w=100",
    coverPhoto: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=1200",
    programsCount: 112,
    languages: ["German", "English"],
    established: 1815,
    ranking: 189,
    description:
      "Leading Austrian technical university with focus on engineering and technology innovation.",
    website: "https://www.tuwien.at",
    programs: [
      {
        id: "prog_008_001",
        name: "Master of Architecture",
        degreeLevel: "master",
        field: "engineering",
        duration: "2 years",
        language: "English",
        tuitionPerYear: 0,
        tuitionCurrency: "EUR",
        description: "Contemporary architecture and urban design.",
      },
    ],
  },
  {
    id: "uni_009",
    name: "University of Copenhagen",
    city: "Copenhagen",
    country: "Denmark",
    countryCode: "DK",
    type: "public",
    logo: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=100",
    coverPhoto: "https://images.unsplash.com/photo-1503791035218-6aa137d1b75b?auto=format&fit=crop&q=80&w=1200",
    programsCount: 128,
    languages: ["Danish", "English"],
    established: 1479,
    ranking: 81,
    description:
      "Scandinavia's oldest university with strong programs in medicine, law, and engineering.",
    website: "https://www.ku.dk",
    programs: [
      {
        id: "prog_009_001",
        name: "Bachelor of Law",
        degreeLevel: "bachelor",
        field: "law",
        duration: "3 years",
        language: "Danish",
        tuitionPerYear: 0,
        tuitionCurrency: "EUR",
        description: "Comprehensive legal education with Scandinavian focus.",
      },
    ],
  },
  {
    id: "uni_010",
    name: "University of Stockholm",
    city: "Stockholm",
    country: "Sweden",
    countryCode: "SE",
    type: "public",
    logo: "https://images.unsplash.com/photo-1563027615-cd4628902d4a?auto=format&fit=crop&q=80&w=100",
    coverPhoto: "https://images.unsplash.com/photo-1536749202784-71c2e1e59b52?auto=format&fit=crop&q=80&w=1200",
    programsCount: 141,
    languages: ["Swedish", "English"],
    established: 1878,
    ranking: 92,
    description:
      "Sweden's leading university with world-class research and education in science and humanities.",
    website: "https://www.su.se",
    programs: [
      {
        id: "prog_010_001",
        name: "Master of Environmental Science",
        degreeLevel: "master",
        field: "science",
        duration: "2 years",
        language: "English",
        tuitionPerYear: 0,
        tuitionCurrency: "EUR",
        description: "Sustainable development and environmental studies.",
      },
    ],
  },
  {
    id: "uni_011",
    name: "University of Helsinki",
    city: "Helsinki",
    country: "Finland",
    countryCode: "FI",
    type: "public",
    logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=100",
    coverPhoto: "https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?auto=format&fit=crop&q=80&w=1200",
    programsCount: 156,
    languages: ["Finnish", "English"],
    established: 1640,
    ranking: 103,
    description:
      "Finland's top university known for innovation, technology, and excellence in research.",
    website: "https://www.ucu.ac.uk",
    programs: [
      {
        id: "prog_011_001",
        name: "Bachelor of Computer Science",
        degreeLevel: "bachelor",
        field: "computer-science",
        duration: "3 years",
        language: "English",
        tuitionPerYear: 0,
        tuitionCurrency: "EUR",
        description: "Cutting-edge computer science program with focus on AI and software development.",
      },
    ],
  },
  {
    id: "uni_012",
    name: "KU Leuven",
    city: "Leuven",
    country: "Belgium",
    countryCode: "BE",
    type: "public",
    logo: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=100",
    coverPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200",
    programsCount: 167,
    languages: ["Dutch", "English"],
    established: 1425,
    ranking: 47,
    description:
      "Belgium's top university with research-intensive programs and strong industry connections.",
    website: "https://www.kuleuven.be",
    programs: [
      {
        id: "prog_012_001",
        name: "Master of Biomedical Engineering",
        degreeLevel: "master",
        field: "medicine",
        duration: "2 years",
        language: "English",
        tuitionPerYear: 4500,
        tuitionCurrency: "EUR",
        description: "Advanced biomedical engineering and healthcare technology.",
      },
    ],
  },
];

const resolveMirrorUniversities = (): University[] | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const cached = window.__URM_MIRROR_UNIVERSITIES__;
  if (!Array.isArray(cached)) {
    return null;
  }

  return cached;
};

const mirrorUniversities = resolveMirrorUniversities();

export const UNIVERSITIES: University[] =
  mirrorUniversities && mirrorUniversities.length > 0
    ? mirrorUniversities
    : MIRROR_FALLBACK_ENABLED
      ? STATIC_UNIVERSITIES
      : [];

/**
 * Get a university by ID
 */
export function getUniversityById(id: string): University | undefined {
  return UNIVERSITIES.find((u) => u.id === id);
}

/**
 * Get universities by country
 */
export function getUniversitiesByCountry(countryCode: string): University[] {
  return UNIVERSITIES.filter((u) => u.countryCode === countryCode);
}

/**
 * Get universities by type
 */
export function getUniversitiesByType(type: UniversityType): University[] {
  return UNIVERSITIES.filter((u) => u.type === type);
}

/**
 * Search universities by name or city
 */
export function searchUniversities(query: string): University[] {
  const lowerQuery = query.toLowerCase();
  return UNIVERSITIES.filter(
    (u) =>
      u.name.toLowerCase().includes(lowerQuery) ||
      u.city.toLowerCase().includes(lowerQuery) ||
      u.country.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get featured universities (top ranked)
 */
export function getFeaturedUniversities(limit = 6): University[] {
  const rankValue = (u: University) => (Number.isFinite(u.ranking) && u.ranking > 0 ? u.ranking : Number.MAX_SAFE_INTEGER);

  return [...UNIVERSITIES]
    .filter((u) => Boolean(u.id && u.name && u.country && u.city) && u.programsCount > 0)
    .sort((a, b) => rankValue(a) - rankValue(b))
    .slice(0, limit);
}

// ── Program Data Types ──────────────────────────────────────────────
export type ProgramType = 'bachelor' | 'master' | 'nursing' | 'language';

export interface ProgramTuition {
  amount: string;
  currency: string;
  period: string;
}

export interface Program {
  id: string;
  countryCode: string;
  type: ProgramType;
  field: string;
  title: { en: string; ar: string; de: string };
  description: { en: string; ar: string; de: string };
  language: string[];
  duration: string;
  tuition: ProgramTuition;
  featured: boolean;
}

// ── Static Imports ──────────────────────────────────────────────────
import dePrograms from '@/data/programs/de.json';
import itPrograms from '@/data/programs/it.json';
import esPrograms from '@/data/programs/es.json';
import frPrograms from '@/data/programs/fr.json';
import mtPrograms from '@/data/programs/mt.json';
import cyPrograms from '@/data/programs/cy.json';
import caPrograms from '@/data/programs/ca.json';
import usPrograms from '@/data/programs/us.json';
import trPrograms from '@/data/programs/tr.json';
import gePrograms from '@/data/programs/ge.json';
import huPrograms from '@/data/programs/hu.json';
import lvPrograms from '@/data/programs/lv.json';

const parseBooleanFlag = (value: unknown, defaultValue: boolean) => {
  if (value === undefined || value === null || value === '') return defaultValue;
  return String(value).toLowerCase() === 'true';
};

const MIRROR_FALLBACK_ENABLED = parseBooleanFlag(import.meta.env.VITE_ENABLE_MIRROR_FALLBACK, false);

const staticPrograms: Program[] = [
  ...dePrograms,
  ...itPrograms,
  ...esPrograms,
  ...frPrograms,
  ...mtPrograms,
  ...cyPrograms,
  ...caPrograms,
  ...usPrograms,
  ...trPrograms,
  ...gePrograms,
  ...huPrograms,
  ...lvPrograms,
] as Program[];

const resolveProgramsSnapshot = (): Program[] => {
  const mirrorPrograms =
    typeof window !== 'undefined' && Array.isArray(window.__URM_MIRROR_PROGRAMS__)
      ? window.__URM_MIRROR_PROGRAMS__
      : null;

  if (mirrorPrograms && mirrorPrograms.length > 0) {
    return mirrorPrograms as Program[];
  }

  return MIRROR_FALLBACK_ENABLED ? staticPrograms : [];
};

let allPrograms: Program[] = resolveProgramsSnapshot();

export function refreshProgramsSnapshot(): Program[] {
  allPrograms = resolveProgramsSnapshot();
  return allPrograms;
}

// ── Data Access Functions ───────────────────────────────────────────
export function getAllPrograms(): Program[] {
  return allPrograms;
}

export function getProgramsByCountry(countryCode: string): Program[] {
  return allPrograms.filter((p) => p.countryCode === countryCode);
}

export function getProgramsByType(type: ProgramType): Program[] {
  return allPrograms.filter((p) => p.type === type);
}

export function getFeaturedPrograms(): Program[] {
  return allPrograms.filter((p) => p.featured);
}

export function getProgramsByCountryAndType(
  countryCode: string,
  type?: ProgramType,
): Program[] {
  return allPrograms.filter(
    (p) => p.countryCode === countryCode && (!type || p.type === type),
  );
}

export function getAvailableCountries(): string[] {
  return [...new Set(allPrograms.map((p) => p.countryCode))];
}

export function getAvailableTypes(countryCode?: string): ProgramType[] {
  const programs = countryCode
    ? getProgramsByCountry(countryCode)
    : allPrograms;
  return [...new Set(programs.map((p) => p.type))];
}

export function getCountriesForType(type: ProgramType): string[] {
  return [...new Set(allPrograms.filter((p) => p.type === type).map((p) => p.countryCode))];
}

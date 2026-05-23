/* ------------------------------------------------------------------ */
/*  FAQ identifiers — copy resolved from i18n at                       */
/*  `chancenkarte.faq.entries.<id>.question / answer`.                  */
/* ------------------------------------------------------------------ */

export const CHANCENKARTE_FAQ_IDS = [
  "what_is_chancenkarte",
  "who_qualifies",
  "minimum_points",
  "german_required",
  "blocked_account",
  "processing_time",
  "can_work_immediately",
  "family_can_join",
  "validity_period",
  "after_finding_job",
  "lebanese_specifics",
  "urm_help",
  "salary_expectations",
  "cost_of_living",
  "job_market",
  "work_life_balance",
  "permanent_settlement",
  "relocation_support",
] as const;

export type ChancenkarteFaqId = (typeof CHANCENKARTE_FAQ_IDS)[number];

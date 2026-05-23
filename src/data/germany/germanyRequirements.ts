/* ------------------------------------------------------------------ */
/*  Chancenkarte requirements — document checklist groups.             */
/*  Display copy localised via `chancenkarte.requirements.<id>`.       */
/* ------------------------------------------------------------------ */

export type RequirementGroupId =
  | "identity"
  | "qualifications"
  | "experience"
  | "language"
  | "finance"
  | "additional";

export type RequirementItem = {
  id: string;
  group: RequirementGroupId;
  mandatory: boolean;
};

export const CHANCENKARTE_REQUIREMENTS: RequirementItem[] = [
  { id: "passport", group: "identity", mandatory: true },
  { id: "photos_biometric", group: "identity", mandatory: true },
  { id: "cv_european_format", group: "identity", mandatory: true },

  { id: "degree_certificate", group: "qualifications", mandatory: true },
  { id: "transcripts", group: "qualifications", mandatory: true },
  { id: "anabin_assessment", group: "qualifications", mandatory: true },
  { id: "vocational_certificate", group: "qualifications", mandatory: false },

  { id: "employer_letters", group: "experience", mandatory: true },
  { id: "payslips_or_contracts", group: "experience", mandatory: false },

  { id: "german_certificate", group: "language", mandatory: false },
  { id: "english_certificate", group: "language", mandatory: false },

  { id: "blocked_account_proof", group: "finance", mandatory: true },
  { id: "sponsor_letter", group: "finance", mandatory: false },
  { id: "health_insurance", group: "finance", mandatory: true },

  { id: "motivation_letter", group: "additional", mandatory: true },
  { id: "police_clearance", group: "additional", mandatory: true },
];

export const REQUIREMENT_GROUPS: RequirementGroupId[] = [
  "identity",
  "qualifications",
  "experience",
  "language",
  "finance",
  "additional",
];

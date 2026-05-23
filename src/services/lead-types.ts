/* ------------------------------------------------------------------ */
/*  Lead Types — shared interfaces for the CRM & lead pipeline         */
/* ------------------------------------------------------------------ */

export type LeadType = "student" | "agent";
export type UrgencyLevel = "low" | "medium" | "high";

/**
 * Fully qualified lead ready for CRM ingestion, webhook dispatch,
 * and automation triggers.
 */
export interface QualifiedLead {
  /* Identity */
  id: string;
  submittedAt: string;
  source: "web-lead-form";

  /* Contact */
  fullName: string;
  email: string;
  phone: string;

  /* Classification */
  leadType: LeadType;
  countryInterest: string;
  urgency: UrgencyLevel;
  qualificationScore: number;
  tags: string[];

  /* Student-specific */
  fieldOfStudy?: string;
  budgetRange?: string;
  languageLevel?: string;

  /* Agent-specific */
  agencyName?: string;
  monthlyVolume?: string;
  targetDestinations?: string;
  existingPartnerships?: string;

  /* Qualification */
  timeline: string;
  readiness: string;

  /* Experiment attribution */
  experimentVariants: Record<string, string>;
}

/**
 * Raw form data as captured by SmartLeadForm.
 * This is the input contract for LeadService.submit().
 */
export interface RawLeadFormData {
  fullName: string;
  email: string;
  phone: string;
  userType: "student" | "agent" | "";
  destination: string;
  fieldOfStudy: string;
  budgetRange: string;
  languageLevel: string;
  agencyName: string;
  monthlyVolume: string;
  targetDestinations: string;
  existingPartnerships: string;
  timeline: string;
  readiness: string;
}

/** Result of a lead submission attempt. */
export interface LeadSubmitResult {
  success: boolean;
  leadId: string;
  qualificationScore: number;
  routes: string[];
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

export const URGENCY_MAP: Record<string, UrgencyLevel> = {
  urgent: "high",
  ready: "medium",
  exploring: "low",
};

export const TIMELINE_SCORE: Record<string, number> = {
  this_month: 25,
  next_3_months: 20,
  next_6_months: 10,
  next_year: 5,
};

export const READINESS_SCORE: Record<string, number> = {
  urgent: 30,
  ready: 20,
  exploring: 5,
};

export const HIGH_VOLUME_VALUES = new Set(["50_100", "100_plus"]);

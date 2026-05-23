/* ------------------------------------------------------------------ */
/*  Lead Service — orchestrates normalization, scoring, submission,    */
/*  webhook dispatch, and tracking for every lead form submission.     */
/* ------------------------------------------------------------------ */

import type {
  QualifiedLead,
  RawLeadFormData,
  LeadSubmitResult,
  LeadType,
  UrgencyLevel,
} from "./lead-types";
import { URGENCY_MAP } from "./lead-types";
import { computeLeadScore } from "./lead-scoring";
import { dispatchWebhooks } from "./lead-webhooks";
import { secureSubmitLead } from "@/lib/secure-submit";
import { trackLeadQualified, trackLeadRouted } from "../utils/tracking";
import { getAllAssignments } from "../utils/experiments";

/* ------------------------------------------------------------------ */
/*  Normalization                                                      */
/* ------------------------------------------------------------------ */

function deriveUrgency(readiness: string): UrgencyLevel {
  return URGENCY_MAP[readiness] ?? "low";
}

function deriveCountryInterest(data: RawLeadFormData): string {
  if (data.userType === "student") {
    return data.destination.trim() || "unspecified";
  }
  return data.targetDestinations.trim() || "unspecified";
}

function deriveTags(data: RawLeadFormData, urgency: UrgencyLevel, score: number): string[] {
  const tags: string[] = [data.userType || "unknown"];

  const country = deriveCountryInterest(data);
  if (country !== "unspecified") tags.push(country.toLowerCase());

  if (urgency === "high") tags.push("urgent");
  if (score >= 70) tags.push("high-score");

  if (data.userType === "student") {
    if (data.budgetRange.trim()) tags.push("has-budget");
    if (data.languageLevel.trim()) tags.push("has-language");
  }

  if (data.userType === "agent") {
    if (data.monthlyVolume === "50_100" || data.monthlyVolume === "100_plus") {
      tags.push("high-volume");
    }
  }

  return tags;
}

/* ------------------------------------------------------------------ */
/*  Build QualifiedLead from raw form data                             */
/* ------------------------------------------------------------------ */

function normalize(data: RawLeadFormData): QualifiedLead {
  const leadType: LeadType = data.userType === "agent" ? "agent" : "student";
  const urgency = deriveUrgency(data.readiness);
  const score = computeLeadScore(data);
  const tags = deriveTags(data, urgency, score);

  const lead: QualifiedLead = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    source: "web-lead-form",

    fullName: data.fullName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),

    leadType,
    countryInterest: deriveCountryInterest(data),
    urgency,
    qualificationScore: score,
    tags,

    timeline: data.timeline,
    readiness: data.readiness,

    experimentVariants: getAllAssignments(),
  };

  // Attach type-specific fields
  if (leadType === "student") {
    lead.fieldOfStudy = data.fieldOfStudy.trim() || undefined;
    lead.budgetRange = data.budgetRange.trim() || undefined;
    lead.languageLevel = data.languageLevel.trim() || undefined;
  } else {
    lead.agencyName = data.agencyName.trim() || undefined;
    lead.monthlyVolume = data.monthlyVolume.trim() || undefined;
    lead.targetDestinations = data.targetDestinations.trim() || undefined;
    lead.existingPartnerships = data.existingPartnerships.trim() || undefined;
  }

  return lead;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * End-to-end lead submission pipeline:
 *   1. Normalize raw form data → QualifiedLead
 *   2. Score & tag the lead
 *   3. Submit to backend API
 *   4. Fire webhook adapters (CRM, WhatsApp, Email)
 *   5. Track qualification & routing
 */
export async function submitLead(
  formData: RawLeadFormData,
  turnstileToken: string,
): Promise<LeadSubmitResult> {
  // 1. Normalize
  const lead = normalize(formData);

  // 2. Track qualification
  trackLeadQualified({
    leadId: lead.id,
    leadType: lead.leadType,
    urgency: lead.urgency,
    score: lead.qualificationScore,
  });

  // 3. Submit to backend
  const submitted = await secureSubmitLead({
    fullName: lead.fullName,
    email: lead.email,
    destination: lead.countryInterest,
    studyLevel: lead.fieldOfStudy ?? "",
    field: lead.fieldOfStudy ?? "",
    budget: lead.budgetRange,
    timeline: lead.timeline,
    matchScore: lead.qualificationScore,
    language: lead.languageLevel,
    source: "web-lead-form",
    turnstileToken,
  });

  if (!submitted) {
    return {
      success: false,
      leadId: lead.id,
      qualificationScore: lead.qualificationScore,
      routes: [],
    };
  }

  // 4. Dispatch to webhook adapters
  const routes = await dispatchWebhooks(lead);

  // 5. Track routing
  trackLeadRouted({
    leadId: lead.id,
    leadType: lead.leadType,
    routes,
  });

  return {
    success: true,
    leadId: lead.id,
    qualificationScore: lead.qualificationScore,
    routes,
  };
}

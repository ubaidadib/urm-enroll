/* ------------------------------------------------------------------ */
/*  Chancenkarte lead submission.                                       */
/*                                                                      */
/*  Wraps the existing secureSubmitLead pipeline so that quiz leads     */
/*  share the same /api/lead endpoint, Turnstile, CSRF, and rate-       */
/*  limit guarantees. We encode quiz-specific fields into the existing  */
/*  payload shape (no API contract change).                             */
/* ------------------------------------------------------------------ */

import { secureSubmitLead } from "@/lib/secure-submit";
import type { QuizResult, QuizAnswers } from "@/data/germany/eligibilityQuiz";

export type ChancenkarteLeadInput = {
  fullName: string;
  email: string;
  whatsapp: string;
  profession: string;
  country: string;
  language: string;
  answers: QuizAnswers;
  result: QuizResult;
  turnstileToken: string;
  /** The page that originated the submission, e.g. "/chancenkarte/eligibility". */
  sourcePath?: string;
};

const SOURCE_TAG = "chancenkarte-eligibility-quiz";

export async function submitChancenkarteLead(
  input: ChancenkarteLeadInput,
): Promise<boolean> {
  const fieldOfStudy = [
    "Chancenkarte",
    input.profession,
  ]
    .filter(Boolean)
    .join(" — ");

  // Encode the eligibility verdict + WhatsApp number into the existing
  // free-text fields (budget / studyLevel) so we do not need an API change.
  const verdictTag = `verdict:${input.result.verdict}|points:${input.result.totalPoints}/${input.result.maxPoints}`;
  const studyLevel = `${verdictTag}|whatsapp:${input.whatsapp}`;

  // Compact answer summary — readable in CRM, ~200 chars max.
  const answerKeys: (keyof QuizAnswers)[] = [
    "age",
    "degreeType",
    "yearsExperience",
    "germanLevel",
    "englishLevel",
    "blockedAccount",
    "previousStay",
  ];
  const answerSummary = answerKeys
    .map((k) => `${k}=${input.answers[k] ?? "-"}`)
    .join(";");

  const budget = `quiz:${SOURCE_TAG}|${answerSummary}`.slice(0, 120);
  const timelineFromVerdict =
    input.result.verdict === "highly_eligible"
      ? "this_quarter"
      : input.result.verdict === "potentially_eligible"
        ? "this_year"
        : "exploring";

  return secureSubmitLead({
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    destination: "Germany — Chancenkarte",
    studyLevel,
    field: fieldOfStudy,
    budget,
    timeline: timelineFromVerdict,
    matchScore: input.result.scorePercent,
    language: input.language,
    source: input.sourcePath ?? SOURCE_TAG,
    turnstileToken: input.turnstileToken,
  });
}

/* ------------------------------------------------------------------ */
/*  Chancenkarte eligibility quiz — schema and scoring                 */
/*                                                                      */
/*  Mirrors the German "Chancenkarte" (Opportunity Card) points         */
/*  system. Values are realistic but conservative; we explicitly do     */
/*  not promise a visa outcome. Strings shown to the user come from     */
/*  the i18n namespace `eligibilityQuiz.questions.<id>`.                */
/* ------------------------------------------------------------------ */

export type QuizStepId =
  | "personal"
  | "education"
  | "experience"
  | "languages"
  | "financial"
  | "germanyConnection";

export type QuizQuestionId =
  // personal
  | "nationality"
  | "residence"
  | "age"
  | "maritalStatus"
  // education
  | "degreeType"
  | "universityRecognised"
  | "vocationalTraining"
  | "graduationYear"
  // experience
  | "profession"
  | "yearsExperience"
  | "employmentStatus"
  // languages
  | "germanLevel"
  | "englishLevel"
  | "languageCertification"
  // financial
  | "blockedAccount"
  | "sponsorAvailable"
  // germany connection
  | "previousStay"
  | "relativesInGermany"
  | "previousApplication";

export type QuizOption = {
  value: string;
  /** Points awarded by this choice (Chancenkarte-style). */
  points: number;
};

export type QuizQuestion = {
  id: QuizQuestionId;
  step: QuizStepId;
  /** Optional input kind hint. Defaults to single-choice radio cards. */
  kind?: "single" | "text";
  /** Optional quick suggestions for text questions (rendered as datalist options). */
  suggestions?: string[];
  options: QuizOption[];
};

export const QUIZ_STEPS: QuizStepId[] = [
  "personal",
  "education",
  "experience",
  "languages",
  "financial",
  "germanyConnection",
];

/* ------------------------------------------------------------------ */
/*  Question bank                                                      */
/* ------------------------------------------------------------------ */

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  /* -------- Step 1 — Personal -------------------------------------- */
  {
    id: "nationality",
    step: "personal",
    kind: "text",
    suggestions: [
      "Lebanese",
      "Syrian",
      "Jordanian",
      "Egyptian",
      "Iraqi",
      "Turkish",
      "Indian",
      "Pakistani",
      "Nigerian",
      "Other",
    ],
    options: [],
  },
  {
    id: "residence",
    step: "personal",
    kind: "text",
    suggestions: [
      "Lebanon",
      "United Arab Emirates",
      "Saudi Arabia",
      "Qatar",
      "Jordan",
      "Egypt",
      "Turkey",
      "Germany",
      "Canada",
      "Other",
    ],
    options: [],
  },
  {
    id: "age",
    step: "personal",
    options: [
      { value: "under_25", points: 4 },
      { value: "25_34", points: 4 },
      { value: "35_39", points: 2 },
      { value: "40_44", points: 1 },
      { value: "45_plus", points: 0 },
    ],
  },
  {
    id: "maritalStatus",
    step: "personal",
    options: [
      { value: "single", points: 0 },
      { value: "married", points: 0 },
      { value: "married_qualified_spouse", points: 1 },
    ],
  },

  /* -------- Step 2 — Education ------------------------------------- */
  {
    id: "degreeType",
    step: "education",
    options: [
      { value: "phd", points: 4 },
      { value: "master", points: 4 },
      { value: "bachelor", points: 3 },
      { value: "diploma", points: 2 },
      { value: "secondary", points: 0 },
    ],
  },
  {
    id: "universityRecognised",
    step: "education",
    options: [
      { value: "anabin_recognised", points: 1 },
      { value: "uncertain", points: 0 },
      { value: "not_recognised", points: 0 },
    ],
  },
  {
    id: "vocationalTraining",
    step: "education",
    options: [
      { value: "yes_two_years_plus", points: 3 },
      { value: "yes_less_than_two", points: 2 },
      { value: "no", points: 0 },
    ],
  },
  {
    id: "graduationYear",
    step: "education",
    options: [
      { value: "within_5_years", points: 1 },
      { value: "5_to_10_years", points: 0 },
      { value: "over_10_years", points: 0 },
    ],
  },

  /* -------- Step 3 — Experience ------------------------------------ */
  {
    id: "profession",
    step: "experience",
    kind: "text",
    suggestions: [
      "Software Engineer",
      "Nurse",
      "Mechanical Engineer",
      "Civil Engineer",
      "Electrician",
      "Chef",
      "Teacher",
      "Accountant",
      "Project Manager",
      "Other",
    ],
    options: [],
  },
  {
    id: "yearsExperience",
    step: "experience",
    options: [
      { value: "less_than_2", points: 0 },
      { value: "2_to_4", points: 2 },
      { value: "5_or_more", points: 3 },
    ],
  },
  {
    id: "employmentStatus",
    step: "experience",
    options: [
      { value: "employed_full_time", points: 1 },
      { value: "employed_part_time", points: 0 },
      { value: "self_employed", points: 1 },
      { value: "unemployed", points: 0 },
    ],
  },

  /* -------- Step 4 — Languages ------------------------------------- */
  {
    id: "germanLevel",
    step: "languages",
    options: [
      { value: "c1_or_higher", points: 3 },
      { value: "b2", points: 3 },
      { value: "b1", points: 2 },
      { value: "a2", points: 1 },
      { value: "a1", points: 1 },
      { value: "none", points: 0 },
    ],
  },
  {
    id: "englishLevel",
    step: "languages",
    options: [
      { value: "c1_or_higher", points: 1 },
      { value: "b2", points: 1 },
      { value: "b1", points: 1 },
      { value: "below_b1", points: 0 },
    ],
  },
  {
    id: "languageCertification",
    step: "languages",
    options: [
      { value: "certified", points: 1 },
      { value: "in_progress", points: 0 },
      { value: "none", points: 0 },
    ],
  },

  /* -------- Step 5 — Financial readiness --------------------------- */
  {
    id: "blockedAccount",
    step: "financial",
    options: [
      { value: "yes_ready", points: 2 },
      { value: "partially", points: 1 },
      { value: "no", points: 0 },
    ],
  },
  {
    id: "sponsorAvailable",
    step: "financial",
    options: [
      { value: "yes", points: 1 },
      { value: "no", points: 0 },
    ],
  },

  /* -------- Step 6 — Germany connection ---------------------------- */
  {
    id: "previousStay",
    step: "germanyConnection",
    options: [
      { value: "yes_six_months_plus", points: 1 },
      { value: "yes_under_six_months", points: 1 },
      { value: "no", points: 0 },
    ],
  },
  {
    id: "relativesInGermany",
    step: "germanyConnection",
    options: [
      { value: "yes_close", points: 1 },
      { value: "yes_extended", points: 0 },
      { value: "no", points: 0 },
    ],
  },
  {
    id: "previousApplication",
    step: "germanyConnection",
    options: [
      { value: "yes_approved", points: 1 },
      { value: "yes_rejected", points: 0 },
      { value: "no", points: 0 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Scoring                                                            */
/* ------------------------------------------------------------------ */

/** German Chancenkarte minimum threshold is 6 points; we model up to ~28. */
export const CHANCENKARTE_MIN_POINTS = 6;
export const QUIZ_MAX_POINTS = QUIZ_QUESTIONS.reduce((sum, q) => {
  if (q.kind === "text") return sum;
  const max = q.options.reduce((m, o) => (o.points > m ? o.points : m), 0);
  return sum + max;
}, 0);

export type QuizAnswers = Partial<Record<QuizQuestionId, string>>;

export type EligibilityVerdict = "highly_eligible" | "potentially_eligible" | "needs_improvement";

export type QuizCategoryScore = {
  step: QuizStepId;
  points: number;
  maxPoints: number;
};

export type QuizResult = {
  totalPoints: number;
  maxPoints: number;
  /** Normalised 0–100 score. */
  scorePercent: number;
  verdict: EligibilityVerdict;
  meetsChancenkarteMinimum: boolean;
  categories: QuizCategoryScore[];
  missingRequirements: QuizQuestionId[];
  recommendedActions: RecommendedActionId[];
};

export type RecommendedActionId =
  | "improve_german"
  | "certify_language"
  | "verify_anabin"
  | "open_blocked_account"
  | "gain_experience"
  | "book_consultation"
  | "prepare_documents";

function pointsFor(question: QuizQuestion, answer: string | undefined): number {
  if (!answer) return 0;
  const opt = question.options.find((o) => o.value === answer);
  return opt?.points ?? 0;
}

function maxPointsFor(question: QuizQuestion): number {
  if (question.kind === "text") return 0;
  return question.options.reduce((m, o) => (o.points > m ? o.points : m), 0);
}

export function computeQuizResult(answers: QuizAnswers): QuizResult {
  const categories = new Map<QuizStepId, QuizCategoryScore>();
  for (const step of QUIZ_STEPS) {
    categories.set(step, { step, points: 0, maxPoints: 0 });
  }

  let totalPoints = 0;
  for (const q of QUIZ_QUESTIONS) {
    const p = pointsFor(q, answers[q.id]);
    const max = maxPointsFor(q);
    const cat = categories.get(q.step)!;
    cat.points += p;
    cat.maxPoints += max;
    totalPoints += p;
  }

  const maxPoints = QUIZ_MAX_POINTS;
  const scorePercent = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  const meetsChancenkarteMinimum = totalPoints >= CHANCENKARTE_MIN_POINTS;

  let verdict: EligibilityVerdict;
  if (totalPoints >= 12 && meetsChancenkarteMinimum) verdict = "highly_eligible";
  else if (totalPoints >= CHANCENKARTE_MIN_POINTS) verdict = "potentially_eligible";
  else verdict = "needs_improvement";

  const missingRequirements = collectMissingRequirements(answers);
  const recommendedActions = deriveRecommendedActions(answers, verdict);

  return {
    totalPoints,
    maxPoints,
    scorePercent,
    verdict,
    meetsChancenkarteMinimum,
    categories: Array.from(categories.values()),
    missingRequirements,
    recommendedActions,
  };
}

function collectMissingRequirements(answers: QuizAnswers): QuizQuestionId[] {
  const missing: QuizQuestionId[] = [];

  const german = answers.germanLevel;
  if (!german || german === "none" || german === "a1") missing.push("germanLevel");

  const english = answers.englishLevel;
  if (!english || english === "below_b1") missing.push("englishLevel");

  const blocked = answers.blockedAccount;
  if (!blocked || blocked === "no") missing.push("blockedAccount");

  const recognised = answers.universityRecognised;
  if (!recognised || recognised === "uncertain" || recognised === "not_recognised")
    missing.push("universityRecognised");

  const yearsExp = answers.yearsExperience;
  if (!yearsExp || yearsExp === "less_than_2") missing.push("yearsExperience");

  return missing;
}

function deriveRecommendedActions(
  answers: QuizAnswers,
  verdict: EligibilityVerdict,
): RecommendedActionId[] {
  const actions: RecommendedActionId[] = [];

  const german = answers.germanLevel;
  if (!german || german === "none" || german === "a1" || german === "a2") actions.push("improve_german");

  if (answers.languageCertification !== "certified") actions.push("certify_language");

  const recognised = answers.universityRecognised;
  if (!recognised || recognised === "uncertain" || recognised === "not_recognised")
    actions.push("verify_anabin");

  if (!answers.blockedAccount || answers.blockedAccount !== "yes_ready")
    actions.push("open_blocked_account");

  if (!answers.yearsExperience || answers.yearsExperience === "less_than_2")
    actions.push("gain_experience");

  if (verdict !== "needs_improvement") actions.push("prepare_documents");
  actions.push("book_consultation");

  // de-duplicate while preserving order
  return Array.from(new Set(actions));
}

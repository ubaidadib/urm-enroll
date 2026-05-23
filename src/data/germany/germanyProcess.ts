/* ------------------------------------------------------------------ */
/*  Chancenkarte step-by-step process. Localised copy lives in         */
/*  i18n key `chancenkarte.process.steps.<id>.*`.                       */
/* ------------------------------------------------------------------ */

import {
  ClipboardCheck,
  FileSearch,
  BookOpen,
  Banknote,
  PenLine,
  Plane,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export type ChancenkarteStep = {
  id: string;
  icon: LucideIcon;
  /** Typical duration in weeks. */
  durationWeeks: [number, number];
};

export const CHANCENKARTE_PROCESS: ChancenkarteStep[] = [
  { id: "eligibility_check", icon: ClipboardCheck, durationWeeks: [1, 1] },
  { id: "document_audit", icon: FileSearch, durationWeeks: [2, 4] },
  { id: "credential_recognition", icon: BookOpen, durationWeeks: [4, 10] },
  { id: "blocked_account", icon: Banknote, durationWeeks: [1, 3] },
  { id: "visa_application", icon: PenLine, durationWeeks: [4, 12] },
  { id: "arrival_settlement", icon: Plane, durationWeeks: [1, 2] },
  { id: "job_placement", icon: Briefcase, durationWeeks: [4, 52] },
];

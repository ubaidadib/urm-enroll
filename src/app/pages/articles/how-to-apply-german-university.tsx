import { useEffect } from "react";
import { Link } from "react-router-dom";
import { m } from "motion/react";
import { FileText, Calendar, CheckSquare, Timer, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "@/app/seo/seo-manager";
import { Breadcrumbs } from "@/app/components/layout/breadcrumbs";
import {
  GuideStepList,
  GuideInfoCard,
  GuideChecklist,
  GuideFAQ,
  GuideTimeline,
} from "@/app/components/ui/guide-components";
import type { GuideStepProps, GuideFAQItem, GuideTimelineItem } from "@/app/components/ui/guide-components";

type LangKey = "en" | "ar" | "de";

const SLUG = "how-to-apply-german-university";
const BUILD_DATE = new Date().toISOString();

interface GuideContent {
  title: string;
  description: string;
  heroTagline: string;
  readTime: string;
  steps: { heading: string; items: GuideStepProps[] };
  documents: { heading: string; items: Array<{ label: string; detail?: string }> };
  timeline: { heading: string; items: GuideTimelineItem[] };
  faq: { heading: string; items: GuideFAQItem[] };
  cta: string;
  ctaNote: string;
  infoEarlyStart: { title: string; body: string };
  warningDeadline: { title: string; body: string };
  tipCompliance: { title: string; body: string };
  tocLabel: string;
  needHelp: string;
}

const CONTENT: Record<LangKey, GuideContent> = {
  en: {
    title: "How to Apply to a German University in 2026: Complete Guide",
    description:
      "A complete 2026 guide for international students applying to German universities, from eligibility to enrollment.",
    heroTagline: "Step-by-step application guide for international students",
    readTime: "8 min read",
    tocLabel: "Contents",
    needHelp: "Need help?",
    steps: {
      heading: "Application Process",
      items: [
        {
          number: 1,
          title: "Research & Shortlist Programs",
          description:
            "Build a shortlist of degree programs that match your academic background and language level. Check whether your target institutions use uni-assist or direct applications — timelines and document requirements differ.",
          tips: [
            "Filter by language of instruction (German vs. English-taught)",
            "Check degree recognition in your home country",
            "Compare semester start dates: winter (Oct) and summer (Apr)",
          ],
        },
        {
          number: 2,
          title: "Prepare Core Documents",
          description:
            "Certified transcripts, passport copy, language certificates, motivation letter, and CV are required by most programs. Start translations and legalizations early — these are the most common cause of missed deadlines.",
          tips: [
            "Official translations by sworn translators only",
            "Allow 4–8 weeks for apostille / legalization",
            "German programs: IELTS 6.5+ or TestDaF 4 minimum",
          ],
        },
        {
          number: 3,
          title: "Submit Your Application",
          description:
            "Upload or mail your complete package by the deadline. Track two separate deadlines: the admission deadline and the visa preparation deadline.",
          tips: [
            "Keep PDF copies of everything you submit",
            "Request submission confirmation emails",
            "Set calendar reminders 4 weeks before each deadline",
          ],
        },
        {
          number: 4,
          title: "Compliance Check Before Sending",
          description:
            "Run a final review of file format, naming conventions, required signatures, and completeness. A clean, complete package improves acceptance probability and reduces back-and-forth requests.",
          tips: [
            "File naming: FirstName_LastName_Document.pdf",
            "Check file size limits (usually 5 MB per file)",
            "Ensure all documents are dated within 6 months",
          ],
        },
      ],
    },
    documents: {
      heading: "Required Documents Checklist",
      items: [
        { label: "University degree / school leaving certificate", detail: "Certified + official translation" },
        { label: "Academic transcripts", detail: "All semesters, certified + translation" },
        { label: "Passport copy", detail: "Data page, valid 6 months beyond program start" },
        { label: "Language certificate", detail: "IELTS, TOEFL, TestDaF, DSH, or equivalent" },
        { label: "Motivation letter", detail: "1–2 pages, program-specific" },
        { label: "CV / Résumé", detail: "Europass format preferred" },
        { label: "Letters of recommendation", detail: "Required by some programs" },
        { label: "Portfolio / work samples", detail: "Design, architecture, arts programs" },
        { label: "APS certificate", detail: "Required for applicants from China, Vietnam, Mongolia" },
      ],
    },
    timeline: {
      heading: "Application Timeline",
      items: [
        { phase: "Research", duration: "4–6 weeks", label: "Shortlist programs & check requirements" },
        { phase: "Documents", duration: "6–10 weeks", label: "Gather, translate & certify all documents" },
        { phase: "Application", duration: "2–4 weeks", label: "Submit via uni-assist or direct portal" },
        { phase: "Decision", duration: "6–12 weeks", label: "Await admission decision" },
        { phase: "Visa", duration: "6–10 weeks", label: "Blocked account + embassy appointment" },
      ],
    },
    faq: {
      heading: "Frequently Asked Questions",
      items: [
        {
          question: "What is uni-assist and do all universities use it?",
          answer:
            "uni-assist is a shared service that processes applications for about 170 German universities. Not all universities use it — some have direct application portals. Always check the specific university's admissions page.",
        },
        {
          question: "Do I need a language certificate if I studied in English?",
          answer:
            "For English-taught programs, most universities accept IELTS 6.0–7.0 or TOEFL 80–100. Some may waive the requirement if you completed a full degree at an English-medium institution — confirm with admissions.",
        },
        {
          question: "How early should I start the process?",
          answer:
            "For winter semester (October), begin research by February–March and submit by May–June. For summer semester (April), start in July–August of the prior year.",
        },
        {
          question: "What is the blocked account requirement?",
          answer:
            "German embassies require proof of €11,208 in a blocked (Sperrkonto) account. Funds are released monthly during your studies. Providers include Fintiba, Expatrio, and Deutsche Bank.",
        },
        {
          question: "Is tuition free at German public universities?",
          answer:
            "Most German states charge only a semester administrative fee (€150–€350). Baden-Württemberg charges non-EU students €1,500 per semester. Private universities have varying tuition.",
        },
      ],
    },
    cta: "Talk to a counselor about your application",
    ctaNote: "Free 30-minute consultation — no commitment required",
    infoEarlyStart: {
      title: "Start earlier than you think",
      body: "Most students underestimate document preparation time. Translation + legalization alone can take 8–10 weeks in some countries.",
    },
    warningDeadline: {
      title: "Two separate deadlines",
      body: "Track your admission deadline AND your visa preparation deadline separately. Even a fast admission decision can be blocked by a delayed embassy appointment.",
    },
    tipCompliance: {
      title: "Compliance pays off",
      body: "Incomplete or mis-formatted applications are the #1 reason for rejection or delays. A checklist review takes 30 minutes and can save months.",
    },
  },

  ar: {
    title: "\u0643\u064a\u0641 \u062a\u062a\u0642\u062f\u0645 \u0644\u0644\u062c\u0627\u0645\u0639\u0627\u062a \u0627\u0644\u0623\u0644\u0645\u0627\u0646\u064a\u0629 \u0641\u064a 2026: \u062f\u0644\u064a\u0644 \u0634\u0627\u0645\u0644",
    description:
      "\u062f\u0644\u064a\u0644 \u0639\u0645\u0644\u064a \u0645\u062a\u0643\u0627\u0645\u0644 \u0644\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u062f\u0648\u0644\u064a\u064a\u0646 \u0644\u0644\u062a\u0642\u062f\u064a\u0645 \u0639\u0644\u0649 \u0627\u0644\u062c\u0627\u0645\u0639\u0627\u062a \u0627\u0644\u0623\u0644\u0645\u0627\u0646\u064a\u0629 \u0641\u064a 2026.",
    heroTagline: "\u062f\u0644\u064a\u0644 \u0627\u0644\u062a\u0642\u062f\u064a\u0645 \u062e\u0637\u0648\u0629 \u0628\u062e\u0637\u0648\u0629",
    readTime: "8 \u062f\u0642\u0627\u0626\u0642 \u0642\u0631\u0627\u0621\u0629",
    tocLabel: "\u0627\u0644\u0645\u062d\u062a\u0648\u064a\u0627\u062a",
    needHelp: "\u0647\u0644 \u062a\u062d\u062a\u0627\u062c \u0645\u0633\u0627\u0639\u062f\u0629\u061f",
    steps: {
      heading: "\u0645\u0631\u0627\u062d\u0644 \u0627\u0644\u062a\u0642\u062f\u064a\u0645",
      items: [
        {
          number: 1,
          title: "\u0627\u0644\u0628\u062d\u062b \u0648\u0628\u0646\u0627\u0621 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0628\u0631\u0627\u0645\u062c",
          description:
            "\u0627\u0628\u0646 \u0642\u0627\u0626\u0645\u0629 \u0628\u0631\u0627\u0645\u062c \u062a\u0646\u0627\u0633\u0628 \u062a\u062e\u0635\u0635\u0643 \u0627\u0644\u0633\u0627\u0628\u0642 \u0648\u0645\u0633\u062a\u0648\u0649 \u0644\u063a\u062a\u0643. \u062a\u062d\u0642\u0642 \u0625\u0646 \u0643\u0627\u0646\u062a \u0627\u0644\u062c\u0627\u0645\u0639\u0629 \u062a\u0633\u062a\u062e\u062f\u0645 uni-assist \u0623\u0648 \u0627\u0644\u062a\u0642\u062f\u064a\u0645 \u0627\u0644\u0645\u0628\u0627\u0634\u0631.",
          tips: [
            "\u0635\u0641\u0651 \u062d\u0633\u0628 \u0644\u063a\u0629 \u0627\u0644\u062f\u0631\u0627\u0633\u0629",
            "\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u0639\u062a\u0631\u0627\u0641 \u0628\u0627\u0644\u0634\u0647\u0627\u062f\u0629 \u0641\u064a \u0628\u0644\u062f\u0643",
            "\u0642\u0627\u0631\u0646 \u0645\u0648\u0627\u0639\u064a\u062f \u0628\u062f\u0621 \u0627\u0644\u0641\u0635\u0648\u0644",
          ],
        },
        {
          number: 2,
          title: "\u062a\u062c\u0647\u064a\u0632 \u0627\u0644\u0645\u0633\u062a\u0646\u062f\u0627\u062a \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629",
          description:
            "\u0627\u0644\u0634\u0647\u0627\u062f\u0627\u062a \u0627\u0644\u0645\u0635\u062f\u0642\u0629\u060c \u0646\u0633\u062e\u0629 \u0627\u0644\u062c\u0648\u0627\u0632\u060c \u0634\u0647\u0627\u062f\u0629 \u0627\u0644\u0644\u063a\u0629\u060c \u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062f\u0627\u0641\u0639\u060c \u0648\u0627\u0644\u0633\u064a\u0631\u0629 \u0627\u0644\u0630\u0627\u062a\u064a\u0629. \u0627\u0628\u062f\u0623 \u0628\u0627\u0644\u062a\u0631\u062c\u0645\u0629 \u0648\u0627\u0644\u062a\u0635\u062f\u064a\u0642 \u0645\u0628\u0643\u0631\u0627\u064b.",
          tips: [
            "\u0627\u0644\u062a\u0631\u062c\u0645\u0629 \u0627\u0644\u0631\u0633\u0645\u064a\u0629 \u0641\u0642\u0637 \u0645\u0646 \u0645\u062a\u0631\u062c\u0645\u064a\u0646 \u0642\u0627\u0646\u0648\u0646\u064a\u064a\u0646",
            "\u062e\u0635\u0635 4\u20138 \u0623\u0633\u0627\u0628\u064a\u0639 \u0644\u0644\u062a\u0635\u062f\u064a\u0642",
            "IELTS 6.5+ \u0623\u0648 TestDaF 4 \u0643\u062d\u062f \u0623\u062f\u0646\u0649",
          ],
        },
        {
          number: 3,
          title: "\u062a\u0642\u062f\u064a\u0645 \u0627\u0644\u0637\u0644\u0628",
          description:
            "\u0627\u0631\u0641\u0639 \u0623\u0648 \u0623\u0631\u0633\u0644 \u0645\u0644\u0641\u0643 \u0627\u0644\u0643\u0627\u0645\u0644 \u0642\u0628\u0644 \u0627\u0644\u0645\u0648\u0639\u062f. \u062a\u0627\u0628\u0639 \u0645\u0648\u0639\u062f\u064a\u0646 \u0645\u0646\u0641\u0635\u0644\u064a\u0646: \u0645\u0648\u0639\u062f \u0627\u0644\u0642\u0628\u0648\u0644 \u0648\u0645\u0648\u0639\u062f \u0627\u0644\u062a\u0623\u0634\u064a\u0631\u0629.",
          tips: [
            "\u0627\u062d\u062a\u0641\u0638 \u0628\u0646\u0633\u062e PDF \u0645\u0646 \u0643\u0644 \u0645\u0627 \u062a\u0631\u0633\u0644\u0647",
            "\u0627\u0637\u0644\u0628 \u062a\u0623\u0643\u064a\u062f \u0627\u0633\u062a\u0644\u0627\u0645 \u0628\u0627\u0644\u0628\u0631\u064a\u062f",
            "\u0636\u0639 \u062a\u0630\u0643\u064a\u0631\u0627\u062a \u0642\u0628\u0644 4 \u0623\u0633\u0627\u0628\u064a\u0639 \u0645\u0646 \u0643\u0644 \u0645\u0648\u0639\u062f",
          ],
        },
        {
          number: 4,
          title: "\u0645\u0631\u0627\u062c\u0639\u0629 \u0627\u0644\u0627\u0645\u062a\u062b\u0627\u0644 \u0642\u0628\u0644 \u0627\u0644\u0625\u0631\u0633\u0627\u0644",
          description:
            "\u0631\u0627\u062c\u0639 \u062a\u0646\u0633\u064a\u0642 \u0627\u0644\u0645\u0644\u0641\u0627\u062a \u0648\u0623\u0633\u0645\u0627\u0626\u0647\u0627 \u0648\u0627\u0644\u062a\u0648\u0627\u0642\u064a\u0639 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629. \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0643\u0627\u0645\u0644 \u0648\u0627\u0644\u0645\u0646\u0638\u0645 \u064a\u0631\u0641\u0639 \u0641\u0631\u0635 \u0627\u0644\u0642\u0628\u0648\u0644.",
          tips: [
            "\u062a\u0633\u0645\u064a\u0629 \u0627\u0644\u0645\u0644\u0641\u0627\u062a: \u0627\u0644\u0627\u0633\u0645_\u0627\u0644\u0623\u0648\u0644_\u0627\u0633\u0645_\u0627\u0644\u0645\u0633\u062a\u0646\u062f.pdf",
            "\u062a\u062d\u0642\u0642 \u0645\u0646 \u062d\u062f\u0648\u062f \u062d\u062c\u0645 \u0627\u0644\u0645\u0644\u0641",
            "\u062a\u0623\u0643\u062f \u0623\u0646 \u062c\u0645\u064a\u0639 \u0627\u0644\u0648\u062b\u0627\u0626\u0642 \u0635\u0627\u062f\u0631\u0629 \u062e\u0644\u0627\u0644 6 \u0623\u0634\u0647\u0631",
          ],
        },
      ],
    },
    documents: {
      heading: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u0645\u0633\u062a\u0646\u062f\u0627\u062a",
      items: [
        { label: "\u0634\u0647\u0627\u062f\u0629 \u0627\u0644\u062c\u0627\u0645\u0639\u0629 \u0623\u0648 \u0627\u0644\u062b\u0627\u0646\u0648\u064a\u0629", detail: "\u0645\u0635\u062f\u0642\u0629 \u0645\u0639 \u062a\u0631\u062c\u0645\u0629 \u0631\u0633\u0645\u064a\u0629" },
        { label: "\u0643\u0634\u0648\u0641 \u0627\u0644\u062f\u0631\u062c\u0627\u062a \u0627\u0644\u0623\u0643\u0627\u062f\u064a\u0645\u064a\u0629", detail: "\u062c\u0645\u064a\u0639 \u0627\u0644\u0641\u0635\u0648\u0644\u060c \u0645\u0635\u062f\u0642\u0629 \u0645\u0639 \u062a\u0631\u062c\u0645\u0629" },
        { label: "\u0646\u0633\u062e\u0629 \u062c\u0648\u0627\u0632 \u0627\u0644\u0633\u0641\u0631", detail: "\u0635\u0641\u062d\u0629 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a\u060c \u0633\u0627\u0631\u064a\u0629 6 \u0623\u0634\u0647\u0631 \u0628\u0639\u062f \u0628\u062f\u0627\u064a\u0629 \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062c" },
        { label: "\u0634\u0647\u0627\u062f\u0629 \u0627\u0644\u0644\u063a\u0629", detail: "IELTS \u0623\u0648 TOEFL \u0623\u0648 TestDaF \u0623\u0648 DSH" },
        { label: "\u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062f\u0627\u0641\u0639", detail: "1\u20132 \u0635\u0641\u062d\u0627\u062a\u060c \u062e\u0627\u0635\u0629 \u0628\u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062c" },
        { label: "\u0627\u0644\u0633\u064a\u0631\u0629 \u0627\u0644\u0630\u0627\u062a\u064a\u0629", detail: "\u0635\u064a\u063a\u0629 Europass \u0645\u0641\u0636\u0644\u0629" },
        { label: "\u062e\u0637\u0627\u0628\u0627\u062a \u062a\u0648\u0635\u064a\u0629", detail: "\u0645\u0637\u0644\u0648\u0628\u0629 \u0641\u064a \u0628\u0639\u0636 \u0627\u0644\u0628\u0631\u0627\u0645\u062c" },
        { label: "\u0645\u0644\u0641 \u0627\u0644\u0623\u0639\u0645\u0627\u0644", detail: "\u0628\u0631\u0627\u0645\u062c \u0627\u0644\u062a\u0635\u0645\u064a\u0645 \u0648\u0627\u0644\u0641\u0646\u0648\u0646" },
        { label: "\u0634\u0647\u0627\u062f\u0629 APS", detail: "\u0645\u0637\u0644\u0648\u0628\u0629 \u0644\u0644\u0645\u062a\u0642\u062f\u0645\u064a\u0646 \u0645\u0646 \u0627\u0644\u0635\u064a\u0646 \u0648\u0641\u064a\u062a\u0646\u0627\u0645 \u0648\u0645\u0646\u063a\u0648\u0644\u064a\u0627" },
      ],
    },
    timeline: {
      heading: "\u0627\u0644\u062c\u062f\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064a \u0644\u0644\u062a\u0642\u062f\u064a\u0645",
      items: [
        { phase: "\u0627\u0644\u0628\u062d\u062b", duration: "4\u20136 \u0623\u0633\u0627\u0628\u064a\u0639", label: "\u062a\u062d\u062f\u064a\u062f \u0627\u0644\u0628\u0631\u0627\u0645\u062c \u0648\u0641\u062d\u0635 \u0627\u0644\u0645\u062a\u0637\u0644\u0628\u0627\u062a" },
        { phase: "\u0627\u0644\u0645\u0633\u062a\u0646\u062f\u0627\u062a", duration: "6\u201310 \u0623\u0633\u0627\u0628\u064a\u0639", label: "\u062c\u0645\u0639 \u0648\u062a\u0631\u062c\u0645\u0629 \u0648\u062a\u0635\u062f\u064a\u0642" },
        { phase: "\u0627\u0644\u062a\u0642\u062f\u064a\u0645", duration: "2\u20134 \u0623\u0633\u0627\u0628\u064a\u0639", label: "\u062a\u0642\u062f\u064a\u0645 \u0639\u0628\u0631 uni-assist \u0623\u0648 \u0627\u0644\u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629" },
        { phase: "\u0627\u0644\u0642\u0631\u0627\u0631", duration: "6\u201312 \u0623\u0633\u0628\u0648\u0639\u0627\u064b", label: "\u0627\u0646\u062a\u0638\u0627\u0631 \u0642\u0631\u0627\u0631 \u0627\u0644\u0642\u0628\u0648\u0644" },
        { phase: "\u0627\u0644\u062a\u0623\u0634\u064a\u0631\u0629", duration: "6\u201310 \u0623\u0633\u0627\u0628\u064a\u0639", label: "\u0627\u0644\u062d\u0633\u0627\u0628 \u0627\u0644\u0645\u063a\u0644\u0642 \u0648\u0645\u0648\u0639\u062f \u0627\u0644\u0633\u0641\u0627\u0631\u0629" },
      ],
    },
    faq: {
      heading: "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629",
      items: [
        {
          question: "\u0645\u0627 \u0647\u0648 uni-assist \u0648\u0647\u0644 \u062a\u0633\u062a\u062e\u062f\u0645\u0647 \u062c\u0645\u064a\u0639 \u0627\u0644\u062c\u0627\u0645\u0639\u0627\u062a\u061f",
          answer:
            "uni-assist \u062e\u062f\u0645\u0629 \u0645\u0634\u062a\u0631\u0643\u0629 \u062a\u0639\u0627\u0644\u062c \u0637\u0644\u0628\u0627\u062a \u0627\u0644\u062a\u0642\u062f\u064a\u0645 \u0644\u0646\u062d\u0648 170 \u062c\u0627\u0645\u0639\u0629 \u0623\u0644\u0645\u0627\u0646\u064a\u0629. \u0644\u064a\u0633\u062a \u0643\u0644 \u0627\u0644\u062c\u0627\u0645\u0639\u0627\u062a \u062a\u0633\u062a\u062e\u062f\u0645\u0647\u0627. \u062a\u062d\u0642\u0642 \u062f\u0627\u0626\u0645\u0627\u064b \u0645\u0646 \u0635\u0641\u062d\u0629 \u0627\u0644\u0642\u0628\u0648\u0644 \u0641\u064a \u0627\u0644\u062c\u0627\u0645\u0639\u0629 \u0627\u0644\u0645\u0633\u062a\u0647\u062f\u0641\u0629.",
        },
        {
          question: "\u0647\u0644 \u0623\u062d\u062a\u0627\u062c \u0634\u0647\u0627\u062f\u0629 \u0644\u063a\u0629 \u0625\u0630\u0627 \u062f\u0631\u0633\u062a \u0628\u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629\u061f",
          answer:
            "\u0644\u0644\u0628\u0631\u0627\u0645\u062c \u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629\u060c \u0645\u0639\u0638\u0645 \u0627\u0644\u062c\u0627\u0645\u0639\u0627\u062a \u062a\u0642\u0628\u0644 IELTS 6.0\u20137.0 \u0623\u0648 TOEFL 80\u2013100. \u0628\u0639\u0636\u0647\u0627 \u0642\u062f \u064a\u0639\u0641\u0648\u0643 \u0625\u0630\u0627 \u0623\u062a\u0645\u0645\u062a \u062f\u0631\u062c\u0629 \u0643\u0627\u0645\u0644\u0629 \u0628\u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629.",
        },
        {
          question: "\u0643\u0645 \u0645\u0628\u0643\u0631\u0627\u064b \u064a\u062c\u0628 \u0623\u0646 \u0623\u0628\u062f\u0623\u061f",
          answer:
            "\u0644\u0641\u0635\u0644 \u0627\u0644\u0634\u062a\u0627\u0621 (\u0623\u0643\u062a\u0648\u0628\u0631)\u060c \u0627\u0628\u062f\u0623 \u0641\u064a \u0641\u0628\u0631\u0627\u064a\u0631-\u0645\u0627\u0631\u0633 \u0648\u0633\u0644\u0651\u0645 \u0627\u0644\u0645\u0633\u062a\u0646\u062f\u0627\u062a \u0641\u064a \u0645\u0627\u064a\u0648-\u064a\u0648\u0646\u064a\u0648. \u0644\u0641\u0635\u0644 \u0627\u0644\u0635\u064a\u0641 (\u0623\u0628\u0631\u064a\u0644)\u060c \u0627\u0628\u062f\u0623 \u0641\u064a \u064a\u0648\u0644\u064a\u0648-\u0623\u063a\u0633\u0637\u0633 \u0645\u0646 \u0627\u0644\u0639\u0627\u0645 \u0627\u0644\u0633\u0627\u0628\u0642.",
        },
        {
          question: "\u0645\u0627 \u0647\u0648 \u0645\u062a\u0637\u0644\u0628 \u0627\u0644\u062d\u0633\u0627\u0628 \u0627\u0644\u0645\u063a\u0644\u0642\u061f",
          answer:
            "\u062a\u0634\u062a\u0631\u0637 \u0627\u0644\u0633\u0641\u0627\u0631\u0627\u062a \u0627\u0644\u0623\u0644\u0645\u0627\u0646\u064a\u0629 \u0625\u062b\u0628\u0627\u062a \u0648\u062c\u0648\u062f 11,208 \u064a\u0648\u0631\u0648 \u0641\u064a \u062d\u0633\u0627\u0628 \u0645\u063a\u0644\u0642 (Sperrkonto). \u0645\u0646 \u0628\u064a\u0646 \u0645\u0642\u062f\u0645\u064a \u0627\u0644\u062e\u062f\u0645\u0629: Fintiba \u0648Expatrio \u0648Deutsche Bank.",
        },
        {
          question: "\u0647\u0644 \u0627\u0644\u062f\u0631\u0627\u0633\u0629 \u0645\u062c\u0627\u0646\u064a\u0629 \u0641\u064a \u0627\u0644\u062c\u0627\u0645\u0639\u0627\u062a \u0627\u0644\u062d\u0643\u0648\u0645\u064a\u0629 \u0627\u0644\u0623\u0644\u0645\u0627\u0646\u064a\u0629\u061f",
          answer:
            "\u0645\u0639\u0638\u0645 \u0627\u0644\u0648\u0644\u0627\u064a\u0627\u062a \u062a\u0641\u0631\u0636 \u0641\u0642\u0637 \u0631\u0633\u0648\u0645\u0627\u064b \u0625\u062f\u0627\u0631\u064a\u0629 (150\u2013350 \u064a\u0648\u0631\u0648). \u0628\u0627\u062f\u0646-\u0641\u0648\u0631\u062a\u0645\u0628\u064a\u0631\u063a \u062a\u0641\u0631\u0636 1,500 \u064a\u0648\u0631\u0648 \u0644\u0644\u0637\u0644\u0627\u0628 \u063a\u064a\u0631 \u0627\u0644\u0623\u0648\u0631\u0648\u0628\u064a\u064a\u0646.",
        },
      ],
    },
    cta: "\u062a\u062d\u062f\u062b \u0645\u0639 \u0645\u0633\u062a\u0634\u0627\u0631 \u062d\u0648\u0644 \u062e\u0637\u0629 \u0627\u0644\u062a\u0642\u062f\u064a\u0645",
    ctaNote: "\u0627\u0633\u062a\u0634\u0627\u0631\u0629 \u0645\u062c\u0627\u0646\u064a\u0629 30 \u062f\u0642\u064a\u0642\u0629 \u2014 \u0628\u062f\u0648\u0646 \u0623\u064a \u0627\u0644\u062a\u0632\u0627\u0645",
    infoEarlyStart: {
      title: "\u0627\u0628\u062f\u0623 \u0623\u0628\u0643\u0631 \u0645\u0645\u0627 \u062a\u0638\u0646",
      body: "\u0645\u0639\u0638\u0645 \u0627\u0644\u0637\u0644\u0627\u0628 \u064a\u0642\u0644\u0644\u0648\u0646 \u0645\u0646 \u0648\u0642\u062a \u062a\u062c\u0647\u064a\u0632 \u0627\u0644\u0645\u0633\u062a\u0646\u062f\u0627\u062a. \u0627\u0644\u062a\u0631\u062c\u0645\u0629 \u0648\u0627\u0644\u062a\u0635\u062f\u064a\u0642 \u0648\u062d\u062f\u0647\u0645\u0627 \u0642\u062f \u064a\u0633\u062a\u063a\u0631\u0642\u0627\u0646 8\u201310 \u0623\u0633\u0627\u0628\u064a\u0639.",
    },
    warningDeadline: {
      title: "\u0645\u0648\u0639\u062f\u0627\u0646 \u0645\u0646\u0641\u0635\u0644\u0627\u0646",
      body: "\u062a\u0627\u0628\u0639 \u0645\u0648\u0639\u062f \u0627\u0644\u0642\u0628\u0648\u0644 \u0648\u0645\u0648\u0639\u062f \u0627\u0644\u062a\u0623\u0634\u064a\u0631\u0629 \u0628\u0634\u0643\u0644 \u0645\u0646\u0641\u0635\u0644. \u062d\u062a\u0649 \u0642\u0631\u0627\u0631 \u0627\u0644\u0642\u0628\u0648\u0644 \u0627\u0644\u0633\u0631\u064a\u0639 \u0642\u062f \u064a\u062a\u0623\u062e\u0631 \u0628\u0633\u0628\u0628 \u0645\u0648\u0639\u062f \u0627\u0644\u0633\u0641\u0627\u0631\u0629.",
    },
    tipCompliance: {
      title: "\u0627\u0644\u0627\u0645\u062a\u062b\u0627\u0644 \u064a\u0641\u064a\u062f\u0643",
      body: "\u0627\u0644\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0646\u0627\u0642\u0635\u0629 \u0647\u064a \u0627\u0644\u0633\u0628\u0628 \u0627\u0644\u0623\u0648\u0644 \u0644\u0644\u0631\u0641\u0636 \u0623\u0648 \u0627\u0644\u062a\u0623\u062e\u064a\u0631. \u0645\u0631\u0627\u062c\u0639\u0629 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u062a\u0623\u062e\u0630 30 \u062f\u0642\u064a\u0642\u0629 \u0648\u0642\u062f \u062a\u0648\u0641\u0631 \u0623\u0634\u0647\u0631\u0627\u064b.",
    },
  },

  de: {
    title: "Bewerbung an deutschen Universit\u00e4ten 2026: Der vollst\u00e4ndige Leitfaden",
    description:
      "Vollst\u00e4ndiger Leitfaden 2026 f\u00fcr internationale Studierende zur Bewerbung an deutschen Universit\u00e4ten.",
    heroTagline: "Schritt-f\u00fcr-Schritt-Bewerbungsguide f\u00fcr internationale Studierende",
    readTime: "8 Min. Lesezeit",
    tocLabel: "Inhalt",
    needHelp: "Hilfe ben\u00f6tigt?",
    steps: {
      heading: "Bewerbungsprozess",
      items: [
        {
          number: 1,
          title: "Programme recherchieren & ausw\u00e4hlen",
          description:
            "Erstellen Sie eine Liste von Studieng\u00e4ngen, die zu Ihrem Bildungsweg und Sprachniveau passen. Pr\u00fcfen Sie fr\u00fch, ob die Hochschule uni-assist oder direkte Bewerbungen nutzt.",
          tips: [
            "Filter nach Unterrichtssprache (Deutsch vs. Englisch)",
            "Anerkennung des Abschlusses im Heimatland pr\u00fcfen",
            "Semesterbeginn vergleichen: Winter (Okt.) und Sommer (Apr.)",
          ],
        },
        {
          number: 2,
          title: "Kerndokumente vorbereiten",
          description:
            "Beglaubigte Zeugnisse, Passkopie, Sprachzertifikate, Motivationsschreiben und Lebenslauf. Beginnen Sie \u00dcbersetzungen und Beglaubigungen fr\u00fchzeitig.",
          tips: [
            "Nur beeidigte \u00dcbersetzer f\u00fcr offizielle \u00dcbersetzungen",
            "4\u20138 Wochen f\u00fcr Apostille / Beglaubigung einplanen",
            "IELTS 6,5+ oder TestDaF 4 als Minimum",
          ],
        },
        {
          number: 3,
          title: "Bewerbung einreichen",
          description:
            "Laden Sie Ihre vollst\u00e4ndigen Unterlagen hoch bis zur Frist. Beachten Sie zwei separate Fristen: Zulassungsfrist und Visavorbereitungsfrist.",
          tips: [
            "PDF-Kopien aller eingereichten Dokumente aufbewahren",
            "Eingangsbeст\u00e4tigung per E-Mail anfordern",
            "Kalender-Erinnerungen 4 Wochen vor jeder Frist setzen",
          ],
        },
        {
          number: 4,
          title: "Compliance-Check vor Abgabe",
          description:
            "Pr\u00fcfen Sie Dateiformat, Dateibenennung, Unterschriften und Vollst\u00e4ndigkeit. Eine saubere Bewerbung erh\u00f6ht die Annahmequote und reduziert Nachforderungen.",
          tips: [
            "Dateiname: Vorname_Nachname_Dokument.pdf",
            "Dateigr\u00f6\u00dfen pr\u00fcfen (meist max. 5 MB pro Datei)",
            "Alle Dokumente maximal 6 Monate alt",
          ],
        },
      ],
    },
    documents: {
      heading: "Checkliste der erforderlichen Unterlagen",
      items: [
        { label: "Hochschulabschluss / Schulabschlusszeugnis", detail: "Beglaubigt + offizielle \u00dcbersetzung" },
        { label: "Akademische Transkripte", detail: "Alle Semester, beglaubigt + \u00dcbersetzung" },
        { label: "Passkopie", detail: "Datenseite, mind. 6 Monate \u00fcber Studienbeginn g\u00fcltig" },
        { label: "Sprachzertifikat", detail: "IELTS, TOEFL, TestDaF, DSH oder gleichwertig" },
        { label: "Motivationsschreiben", detail: "1\u20132 Seiten, programmspezifisch" },
        { label: "Lebenslauf / CV", detail: "Europass-Format bevorzugt" },
        { label: "Empfehlungsschreiben", detail: "Von einigen Programmen gefordert" },
        { label: "Portfolio / Arbeitsproben", detail: "Design-, Architektur-, Kunstprogramme" },
        { label: "APS-Zertifikat", detail: "F\u00fcr Bewerber aus China, Vietnam, Mongolei" },
      ],
    },
    timeline: {
      heading: "Bewerbungszeitplan",
      items: [
        { phase: "Recherche", duration: "4\u20136 Wochen", label: "Programme ausw\u00e4hlen & Anforderungen pr\u00fcfen" },
        { phase: "Dokumente", duration: "6\u201310 Wochen", label: "Sammeln, \u00fcbersetzen & beglaubigen" },
        { phase: "Bewerbung", duration: "2\u20134 Wochen", label: "Einreichen via uni-assist oder Portal" },
        { phase: "Entscheidung", duration: "6\u201312 Wochen", label: "Auf Zulassungsbescheid warten" },
        { phase: "Visum", duration: "6\u201310 Wochen", label: "Sperrkonto + Botschaftstermin" },
      ],
    },
    faq: {
      heading: "H\u00e4ufig gestellte Fragen",
      items: [
        {
          question: "Was ist uni-assist und nutzen alle Universit\u00e4ten es?",
          answer:
            "uni-assist ist ein gemeinsamer Service, der Bewerbungen f\u00fcr ca. 170 deutsche Hochschulen bearbeitet. Nicht alle nutzen es \u2014 manche haben eigene Portale. Pr\u00fcfen Sie immer die Zulassungsseite.",
        },
        {
          question: "Brauche ich ein Sprachzertifikat, wenn ich auf Englisch studiert habe?",
          answer:
            "F\u00fcr englischsprachige Programme akzeptieren die meisten Hochschulen IELTS 6,0\u20137,0 oder TOEFL 80\u2013100. Bei einem vollst\u00e4ndigen Abschluss an einer englischsprachigen Institution kann die Anforderung entfallen.",
        },
        {
          question: "Wie fr\u00fch sollte ich beginnen?",
          answer:
            "F\u00fcr das Wintersemester (Oktober): Recherche ab Februar\u2013M\u00e4rz, Unterlagen bis Mai\u2013Juni. F\u00fcr das Sommersemester (April): Beginn im Juli\u2013August des Vorjahres.",
        },
        {
          question: "Was ist das Sperrkonto-Erfordernis?",
          answer:
            "Deutsche Botschaften verlangen den Nachweis von 11.208 \u20ac auf einem Sperrkonto. Die Mittel werden monatlich w\u00e4hrend des Studiums freigegeben. Anbieter sind u.a. Fintiba, Expatrio und Deutsche Bank.",
        },
        {
          question: "Ist das Studium an staatlichen Hochschulen kostenlos?",
          answer:
            "Staatliche Hochschulen erheben nur Semesterverwaltungsgeb\u00fchren (150\u2013350 \u20ac). Baden-W\u00fcrttemberg erhebt 1.500 \u20ac pro Semester von Nicht-EU-Studierenden.",
        },
      ],
    },
    cta: "Mit Studienberatung \u00fcber Ihre Bewerbung sprechen",
    ctaNote: "Kostenlose 30-min\u00fctige Beratung \u2014 keine Verpflichtung",
    infoEarlyStart: {
      title: "Fr\u00fcher beginnen als gedacht",
      body: "\u00dcbersetzung + Beglaubigung allein k\u00f6nnen in manchen L\u00e4ndern 8\u201310 Wochen dauern.",
    },
    warningDeadline: {
      title: "Zwei separate Fristen",
      body: "Verfolgen Sie Zulassungsfrist UND Visavorbereitungsfrist getrennt. Ein verz\u00f6gerter Botschaftstermin kann selbst bei schneller Zulassung blockieren.",
    },
    tipCompliance: {
      title: "Compliance zahlt sich aus",
      body: "Unvollst\u00e4ndige Bewerbungen sind der h\u00e4ufigste Grund f\u00fcr Ablehnung. Ein Checklisten-Review dauert 30 Minuten und kann Monate sparen.",
    },
  },
};

const TOC_IDS = ["process", "documents", "timeline", "faq"] as const;
type TocId = (typeof TOC_IDS)[number];

const TOC_LABELS: Record<LangKey, Record<TocId, string>> = {
  en: { process: "Application Process", documents: "Documents", timeline: "Timeline", faq: "FAQ" },
  ar: { process: "\u0645\u0631\u0627\u062d\u0644 \u0627\u0644\u062a\u0642\u062f\u064a\u0645", documents: "\u0627\u0644\u0645\u0633\u062a\u0646\u062f\u0627\u062a", timeline: "\u0627\u0644\u062c\u062f\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064a", faq: "\u0623\u0633\u0626\u0644\u0629 \u0634\u0627\u0626\u0639\u0629" },
  de: { process: "Bewerbungsprozess", documents: "Unterlagen", timeline: "Zeitplan", faq: "FAQ" },
};

export function HowToApplyGermanUniversityPage() {
  const { language, t, dir } = useLanguage() as { language: LangKey; t: <T = string>(key: string) => T; dir: string };
  const content = CONTENT[language];
  const base = language ? `/${language}` : "";
  const articleUrl = `https://enrollurm.com/${language}/resources/${SLUG}`;
  const tocLabels = TOC_LABELS[language];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.title,
    author: { "@type": "Organization", name: "URM Enroll" },
    publisher: { "@type": "Organization", name: "URM Enroll" },
    datePublished: BUILD_DATE,
    dateModified: BUILD_DATE,
    inLanguage: language,
    url: articleUrl,
  };

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
  }, [dir]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <SeoManager
        title={content.title}
        description={content.description}
        path={`/resources/${SLUG}`}
        structuredData={articleSchema}
        breadcrumbs={[
          { name: t<string>("seo.siteName"), path: "/" },
          { name: "Resources", path: "/resources" },
          { name: content.title, path: `/resources/${SLUG}` },
        ]}
      />

      {/* Hero */}
      <div className="page-hero-offset page-hero-pb-compact px-[var(--content-gutter)] bg-bg-surface border-b border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="page-hero-crumb-gap">
          <Breadcrumbs
            items={[
              { label: t<string>("common.home"), href: base || "/" },
              { label: "Resources", href: `${base}/resources` },
              { label: content.title, href: `${base}/resources/${SLUG}` },
            ]}
          />
          </div>
          <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-bold mb-4">
              <FileText className="w-3.5 h-3.5" />
              {content.heroTagline}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[3.75rem] font-bold text-text-primary tracking-tight leading-[1.08] mb-3">
              {content.title}
            </h1>
            <p className="text-base text-text-secondary mb-5 max-w-2xl">{content.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5" />
                {content.readTime}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(BUILD_DATE).toLocaleDateString(
                  language === "ar" ? "ar-SA" : language === "de" ? "de-DE" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </span>
            </div>
          </m.div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto page-gutter py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar ToC */}
          <aside className="lg:w-60 shrink-0">
            <div className="sticky top-24 space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3 px-3">
                {content.tocLabel}
              </p>
              {TOC_IDS.map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-primary/40 shrink-0" />
                  {tocLabels[id]}
                </a>
              ))}
              <div className="mt-6 p-4 rounded-2xl bg-accent-primary/5 border border-accent-primary/15">
                <p className="text-xs font-bold text-text-primary mb-2">{content.needHelp}</p>
                <p className="text-xs text-text-muted mb-3">{content.ctaNote}</p>
                <Link
                  to={`${base}/contact`}
                  className="flex items-center gap-1.5 text-xs font-bold text-accent-primary hover:underline"
                >
                  {content.cta}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">

            <GuideInfoCard variant="info" title={content.infoEarlyStart.title} body={content.infoEarlyStart.body} />

            <GuideStepList id="process" heading={content.steps.heading} steps={content.steps.items} />

            <GuideInfoCard variant="warning" title={content.warningDeadline.title} body={content.warningDeadline.body} />

            <GuideChecklist id="documents" heading={content.documents.heading} items={content.documents.items} />

            <GuideInfoCard variant="tip" title={content.tipCompliance.title} body={content.tipCompliance.body} />

            <GuideTimeline id="timeline" heading={content.timeline.heading} items={content.timeline.items} />

            <GuideFAQ id="faq" heading={content.faq.heading} items={content.faq.items} />

            {/* Bottom CTA */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-border/50 bg-bg-surface p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            >
              <div>
                <p className="font-black text-text-primary text-lg">{content.cta}</p>
                <p className="text-sm text-text-muted mt-1">{content.ctaNote}</p>
              </div>
              <Link
                to={`${base}/contact`}
                className="inline-flex items-center gap-2 rounded-xl bg-accent-primary text-white px-6 py-3 text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                <CheckSquare className="w-4 h-4" />
                {content.cta}
              </Link>
            </m.div>

          </main>
        </div>
      </div>
    </div>
  );
}

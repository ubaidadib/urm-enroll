import { useEffect } from "react";
import { Link } from "react-router-dom";
import { m } from "motion/react";
import { Shield, Calendar, CheckSquare, Timer, ArrowRight } from "lucide-react";
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

const SLUG = "student-visa-germany-guide";
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
  infoEarly: { title: string; body: string };
  warningFunds: { title: string; body: string };
  tipInterview: { title: string; body: string };
  tocLabel: string;
  needHelp: string;
}

const CONTENT: Record<LangKey, GuideContent> = {
  en: {
    title: "German Student Visa Guide for International Students 2026",
    description: "A practical 2026 roadmap for preparing and submitting a successful German student visa file.",
    heroTagline: "Step-by-step visa preparation guide",
    readTime: "7 min read",
    tocLabel: "Contents",
    needHelp: "Need help?",
    steps: {
      heading: "Visa Preparation Process",
      items: [
        {
          number: 1,
          title: "Start Before Final Admission",
          description:
            "Begin preparing your visa file as soon as admission documents are in progress — not after final acceptance. Embassy appointment waiting times can be 6–12 weeks in peak months.",
          tips: [
            "Book your embassy appointment as early as possible",
            "Check your local embassy's specific document list",
            "Many embassies require appointments through online portals only",
          ],
        },
        {
          number: 2,
          title: "Open a Blocked Account (Sperrkonto)",
          description:
            "German embassies require proof of €11,208 in a blocked account. This is released monthly (approximately €934/month) during your studies to cover living costs.",
          tips: [
            "Providers: Fintiba, Expatrio, Deutsche Bank",
            "Allow 2–3 weeks for account activation",
            "Funds must be transferred and confirmed before embassy appointment",
          ],
        },
        {
          number: 3,
          title: "Secure Health Insurance",
          description:
            "Public statutory health insurance (gesetzliche Krankenversicherung) is required. You must be enrolled before your visa interview. Private insurance is accepted in limited cases.",
          tips: [
            "TK, AOK, Barmer are major public providers",
            "Insurance must cover the full duration of your study",
            "Cost: approximately €110–€120 per month for students",
          ],
        },
        {
          number: 4,
          title: "Compile Your Full Document Package",
          description:
            "Assemble all required documents and verify consistency. Officers check that your motivation statement matches your program, and that your academic track is coherent with your stated goals.",
          tips: [
            "All documents must be originals or certified copies",
            "Translations must be by sworn/certified translators",
            "Keep everything organized in a labeled folder",
          ],
        },
        {
          number: 5,
          title: "Attend Your Embassy Interview",
          description:
            "Prepare concise answers on study motivation, career plans, and why Germany. Clarity and consistency matter more than language complexity. Dress professionally.",
          tips: [
            "Rehearse key answers: Why Germany? Why this program? Career plan?",
            "Bring both originals and copies of every document",
            "Arrive 15 minutes early; confirm exact address and floor",
          ],
        },
      ],
    },
    documents: {
      heading: "Visa Document Checklist",
      items: [
        { label: "Valid passport", detail: "At least 6 months validity beyond program end" },
        { label: "University admission letter", detail: "Original or certified copy" },
        { label: "Blocked account proof (Sperrkonto)", detail: "\u20ac11,208 minimum — Fintiba, Expatrio, or bank confirmation" },
        { label: "Health insurance confirmation", detail: "From a German statutory insurer" },
        { label: "Academic transcripts", detail: "Certified + official translation" },
        { label: "Language certificate", detail: "IELTS, TOEFL, TestDaF, DSH as required by program" },
        { label: "Motivation letter / study plan", detail: "Why Germany, why this program, career goals" },
        { label: "CV / Résumé", detail: "Current, in German or English" },
        { label: "Proof of accommodation", detail: "Dorm confirmation or rental agreement" },
        { label: "Visa application form", detail: "Completed, signed, two copies" },
        { label: "Biometric passport photos", detail: "Recent, per German embassy specifications" },
        { label: "Visa fee payment", detail: "\u20ac75 (non-refundable)" },
      ],
    },
    timeline: {
      heading: "Visa Preparation Timeline",
      items: [
        { phase: "Pre-apply", duration: "8–12 weeks", label: "Open blocked account + get health insurance" },
        { phase: "Documents", duration: "4–6 weeks", label: "Gather, certify, translate all documents" },
        { phase: "Appointment", duration: "6–12 weeks wait", label: "Book + attend embassy interview" },
        { phase: "Decision", duration: "4–8 weeks", label: "Visa processing time" },
        { phase: "Arrival", duration: "Before semester", label: "Register address (Anmeldung) within 14 days" },
      ],
    },
    faq: {
      heading: "Frequently Asked Questions",
      items: [
        {
          question: "How long does it take to get a German student visa?",
          answer:
            "Total timeline from starting preparations to visa approval typically ranges from 4 to 6 months. Embassy appointment wait times alone can be 6–12 weeks in peak periods.",
        },
        {
          question: "Can I work while studying in Germany?",
          answer:
            "Yes — non-EU students may work up to 120 full days or 240 half-days per year. Working beyond this requires approval from the Foreigners' Registration Office and the Federal Employment Agency.",
        },
        {
          question: "What is the Anmeldung and when do I need to do it?",
          answer:
            "Anmeldung is the mandatory resident registration at the local Bürgeramt. You must register within 14 days of moving into your accommodation. You'll need this for opening a bank account and enrolling at university.",
        },
        {
          question: "Do I need a new visa if I change universities?",
          answer:
            "Not necessarily. Your student visa is tied to your enrollment status, not a specific institution. Notify the Foreigners' Registration Office of any university change to update your records.",
        },
        {
          question: "Can I extend my student visa from inside Germany?",
          answer:
            "Yes. Apply for a residence permit extension (Aufenthaltserlaubnis) at the local Ausländerbehörde at least 6–8 weeks before your current visa expires. You can remain in Germany while the application is processed.",
        },
      ],
    },
    cta: "Get help preparing your visa file",
    ctaNote: "Free 30-minute consultation — no commitment required",
    infoEarly: {
      title: "Start visa prep before admission is final",
      body: "Embassy appointment slots fill up months in advance. Starting blocked account setup and health insurance enrollment early gives you buffer time for any delays.",
    },
    warningFunds: {
      title: "Funds must be verified, not just present",
      body: "Officers verify that funds are in the blocked account and accessible for release. Transfer the full amount and get written confirmation before your interview date.",
    },
    tipInterview: {
      title: "Clarity wins interviews",
      body: "Officers assess whether your study plan is genuine and coherent. A clear answer on career goals and program choice is more convincing than a long, complex explanation.",
    },
  },

  ar: {
    title: "\u062f\u0644\u064a\u0644 \u062a\u0623\u0634\u064a\u0631\u0629 \u0627\u0644\u0637\u0627\u0644\u0628 \u0627\u0644\u0623\u0644\u0645\u0627\u0646\u064a\u0629 \u0644\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u062f\u0648\u0644\u064a\u064a\u0646 2026",
    description: "\u062e\u0627\u0631\u0637\u0629 \u0637\u0631\u064a\u0642 \u0639\u0645\u0644\u064a\u0629 \u0641\u064a 2026 \u0644\u062a\u062c\u0647\u064a\u0632 \u0645\u0644\u0641 \u062a\u0623\u0634\u064a\u0631\u0629 \u0627\u0644\u0637\u0627\u0644\u0628 \u0627\u0644\u0623\u0644\u0645\u0627\u0646\u064a\u0629 \u0628\u0634\u0643\u0644 \u0627\u062d\u062a\u0631\u0627\u0641\u064a.",
    heroTagline: "\u062f\u0644\u064a\u0644 \u062a\u062c\u0647\u064a\u0632 \u0627\u0644\u062a\u0623\u0634\u064a\u0631\u0629 \u062e\u0637\u0648\u0629 \u0628\u062e\u0637\u0648\u0629",
    readTime: "7 \u062f\u0642\u0627\u0626\u0642 \u0642\u0631\u0627\u0621\u0629",
    tocLabel: "\u0627\u0644\u0645\u062d\u062a\u0648\u064a\u0627\u062a",
    needHelp: "\u0647\u0644 \u062a\u062d\u062a\u0627\u062c \u0645\u0633\u0627\u0639\u062f\u0629\u061f",
    steps: {
      heading: "\u0645\u0631\u0627\u062d\u0644 \u062a\u062c\u0647\u064a\u0632 \u0627\u0644\u062a\u0623\u0634\u064a\u0631\u0629",
      items: [
        {
          number: 1,
          title: "\u0627\u0628\u062f\u0623 \u0642\u0628\u0644 \u0627\u0646\u062a\u0647\u0627\u0621 \u0625\u062c\u0631\u0627\u0621\u0627\u062a \u0627\u0644\u0642\u0628\u0648\u0644",
          description:
            "\u0627\u0628\u062f\u0623 \u062a\u062c\u0647\u064a\u0632 \u0645\u0644\u0641 \u0627\u0644\u062a\u0623\u0634\u064a\u0631\u0629 \u0641\u0648\u0631 \u0628\u062f\u0621 \u0625\u062c\u0631\u0627\u0621\u0627\u062a \u0627\u0644\u0642\u0628\u0648\u0644. \u0645\u0648\u0627\u0639\u064a\u062f \u0627\u0644\u0633\u0641\u0627\u0631\u0629 \u0642\u062f \u062a\u0645\u062a\u062f 6\u201312 \u0623\u0633\u0628\u0648\u0639\u0627\u064b.",
          tips: [
            "\u0627\u062d\u062c\u0632 \u0645\u0648\u0639\u062f \u0627\u0644\u0633\u0641\u0627\u0631\u0629 \u0641\u0648\u0631\u0627\u064b",
            "\u062a\u062d\u0642\u0642 \u0645\u0646 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0633\u062a\u0646\u062f\u0627\u062a \u0627\u0644\u062e\u0627\u0635\u0629 \u0628\u0633\u0641\u0627\u0631\u062a\u0643",
            "\u0645\u0639\u0638\u0645 \u0627\u0644\u0633\u0641\u0627\u0631\u0627\u062a \u062a\u0634\u062a\u0631\u0637 \u0627\u0644\u062d\u062c\u0632 \u0639\u0628\u0631 \u0628\u0648\u0627\u0628\u0629 \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629",
          ],
        },
        {
          number: 2,
          title: "\u0641\u062a\u062d \u062d\u0633\u0627\u0628 \u0645\u063a\u0644\u0642 (Sperrkonto)",
          description:
            "\u062a\u0634\u062a\u0631\u0637 \u0627\u0644\u0633\u0641\u0627\u0631\u0627\u062a \u0627\u0644\u0623\u0644\u0645\u0627\u0646\u064a\u0629 \u0625\u062b\u0628\u0627\u062a \u0648\u062c\u0648\u062f 11,208 \u064a\u0648\u0631\u0648 \u0641\u064a \u062d\u0633\u0627\u0628 \u0645\u063a\u0644\u0642. \u064a\u064f\u0641\u0631\u062c \u0639\u0646\u0647\u0627 \u0634\u0647\u0631\u064a\u0627\u064b (\u062d\u0648\u0627\u0644\u064a 934 \u064a\u0648\u0631\u0648) \u062e\u0644\u0627\u0644 \u0627\u0644\u062f\u0631\u0627\u0633\u0629.",
          tips: [
            "\u0645\u0642\u062f\u0645\u0648 \u0627\u0644\u062e\u062f\u0645\u0629: Fintiba \u0648Expatrio \u0648Deutsche Bank",
            "\u062e\u0635\u0635 2\u20133 \u0623\u0633\u0627\u0628\u064a\u0639 \u0644\u062a\u0641\u0639\u064a\u0644 \u0627\u0644\u062d\u0633\u0627\u0628",
            "\u064a\u062c\u0628 \u062a\u062d\u0648\u064a\u0644 \u0627\u0644\u0645\u0628\u0644\u063a \u0642\u0628\u0644 \u0645\u0648\u0639\u062f \u0627\u0644\u0633\u0641\u0627\u0631\u0629",
          ],
        },
        {
          number: 3,
          title: "\u0627\u0644\u062a\u0623\u0645\u064a\u0646 \u0627\u0644\u0635\u062d\u064a",
          description:
            "\u0627\u0644\u062a\u0623\u0645\u064a\u0646 \u0627\u0644\u0635\u062d\u064a \u0627\u0644\u0642\u0627\u0646\u0648\u0646\u064a \u0627\u0644\u0623\u0644\u0645\u0627\u0646\u064a \u0645\u0637\u0644\u0648\u0628 \u0644\u0644\u062a\u0623\u0634\u064a\u0631\u0629. \u064a\u062c\u0628 \u0623\u0646 \u062a\u0643\u0648\u0646 \u0645\u0633\u062c\u0644\u0627\u064b \u0642\u0628\u0644 \u0645\u0642\u0627\u0628\u0644\u062a\u0643.",
          tips: [
            "TK \u0648AOK \u0648Barmer \u0645\u0646 \u0623\u0628\u0631\u0632 \u0645\u0632\u0648\u062f\u064a \u0627\u0644\u062a\u0623\u0645\u064a\u0646",
            "\u064a\u063a\u0637\u064a \u0643\u0627\u0645\u0644 \u0641\u062a\u0631\u0629 \u0627\u0644\u062f\u0631\u0627\u0633\u0629",
            "\u062a\u0643\u0644\u0641\u0629: \u062d\u0648\u0627\u0644\u064a 110\u2013120 \u064a\u0648\u0631\u0648 \u0634\u0647\u0631\u064a\u0627\u064b",
          ],
        },
        {
          number: 4,
          title: "\u062a\u062c\u0645\u064a\u0639 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0643\u0627\u0645\u0644",
          description:
            "\u062a\u062c\u0645\u064a\u0639 \u062c\u0645\u064a\u0639 \u0627\u0644\u0645\u0633\u062a\u0646\u062f\u0627\u062a \u0648\u0627\u0644\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u062a\u0633\u0627\u0642\u0647\u0627. \u0627\u0644\u0645\u0633\u0624\u0648\u0644\u0648\u0646 \u064a\u062a\u062d\u0642\u0642\u0648\u0646 \u0645\u0646 \u062a\u0637\u0627\u0628\u0642 \u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062f\u0627\u0641\u0639 \u0645\u0639 \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062c.",
          tips: [
            "\u062c\u0645\u064a\u0639 \u0627\u0644\u0645\u0633\u062a\u0646\u062f\u0627\u062a \u0623\u0635\u0648\u0644 \u0623\u0648 \u0646\u0633\u062e \u0645\u0635\u062f\u0642\u0629",
            "\u0627\u0644\u062a\u0631\u062c\u0645\u0627\u062a \u0645\u0646 \u0645\u062a\u0631\u062c\u0645\u064a\u0646 \u0645\u0639\u062a\u0645\u062f\u064a\u0646 \u0641\u0642\u0637",
            "\u0631\u062a\u0651\u0628 \u0643\u0644 \u0634\u064a\u0621 \u0641\u064a \u0645\u062c\u0644\u062f \u0645\u0639\u0646\u0648\u0646",
          ],
        },
        {
          number: 5,
          title: "\u062d\u0636\u0648\u0631 \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629 \u0641\u064a \u0627\u0644\u0633\u0641\u0627\u0631\u0629",
          description:
            "\u062a\u062f\u0631\u0651\u0628 \u0639\u0644\u0649 \u0625\u062c\u0627\u0628\u0627\u062a \u0645\u062e\u062a\u0635\u0631\u0629 \u062d\u0648\u0644 \u062f\u0648\u0627\u0641\u0639 \u0627\u0644\u062f\u0631\u0627\u0633\u0629 \u0648\u062e\u0637\u0637 \u0627\u0644\u0645\u0647\u0646\u0629 \u0648\u0644\u0645\u0627\u0630\u0627 \u0623\u0644\u0645\u0627\u0646\u064a\u0627. \u0627\u0644\u0648\u0636\u0648\u062d \u0623\u0647\u0645 \u0645\u0646 \u062a\u0639\u0642\u064a\u062f \u0627\u0644\u0644\u063a\u0629.",
          tips: [
            "\u062a\u062f\u0631\u0651\u0628 \u0639\u0644\u0649: \u0644\u0645\u0627\u0630\u0627 \u0623\u0644\u0645\u0627\u0646\u064a\u0627\u061f \u0644\u0645\u0627\u0630\u0627 \u0647\u0630\u0627 \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062c\u061f \u0645\u0627 \u062e\u0637\u062a\u0643 \u0627\u0644\u0645\u0647\u0646\u064a\u0629\u061f",
            "\u0623\u062d\u0636\u0631 \u0623\u0635\u0648\u0644 \u0648\u0646\u0633\u062e \u0645\u0646 \u0643\u0644 \u0648\u062b\u064a\u0642\u0629",
            "\u062d\u0636\u0631 \u0645\u0628\u0643\u0631\u0627\u064b 15 \u062f\u0642\u064a\u0642\u0629",
          ],
        },
      ],
    },
    documents: {
      heading: "\u0642\u0627\u0626\u0645\u0629 \u0645\u0633\u062a\u0646\u062f\u0627\u062a \u0627\u0644\u062a\u0623\u0634\u064a\u0631\u0629",
      items: [
        { label: "\u062c\u0648\u0627\u0632 \u0633\u0641\u0631 \u0633\u0627\u0631\u064a \u0627\u0644\u0645\u0641\u0639\u0648\u0644", detail: "\u0633\u0627\u0631\u064d \u0644\u0645\u062f\u0629 6 \u0623\u0634\u0647\u0631 \u0628\u0639\u062f \u0646\u0647\u0627\u064a\u0629 \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062c" },
        { label: "\u062e\u0637\u0627\u0628 \u0642\u0628\u0648\u0644 \u0627\u0644\u062c\u0627\u0645\u0639\u0629", detail: "\u0623\u0635\u0644\u064a \u0623\u0648 \u0646\u0633\u062e\u0629 \u0645\u0635\u062f\u0642\u0629" },
        { label: "\u0625\u062b\u0628\u0627\u062a \u0627\u0644\u062d\u0633\u0627\u0628 \u0627\u0644\u0645\u063a\u0644\u0642", detail: "11,208 \u064a\u0648\u0631\u0648 \u0643\u062d\u062f \u0623\u062f\u0646\u0649" },
        { label: "\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u062a\u0623\u0645\u064a\u0646 \u0627\u0644\u0635\u062d\u064a", detail: "\u0645\u0646 \u0645\u0624\u0645\u0651\u0646 \u0642\u0627\u0646\u0648\u0646\u064a \u0623\u0644\u0645\u0627\u0646\u064a" },
        { label: "\u0643\u0634\u0648\u0641 \u0627\u0644\u062f\u0631\u062c\u0627\u062a \u0627\u0644\u0623\u0643\u0627\u062f\u064a\u0645\u064a\u0629", detail: "\u0645\u0635\u062f\u0642\u0629 \u0645\u0639 \u062a\u0631\u062c\u0645\u0629" },
        { label: "\u0634\u0647\u0627\u062f\u0629 \u0627\u0644\u0644\u063a\u0629", detail: "IELTS \u0623\u0648 TOEFL \u0623\u0648 TestDaF" },
        { label: "\u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062f\u0627\u0641\u0639 / \u062e\u0637\u0629 \u0627\u0644\u062f\u0631\u0627\u0633\u0629", detail: "\u0644\u0645\u0627\u0630\u0627 \u0623\u0644\u0645\u0627\u0646\u064a\u0627 \u0648\u0647\u0630\u0627 \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062c" },
        { label: "\u0627\u0644\u0633\u064a\u0631\u0629 \u0627\u0644\u0630\u0627\u062a\u064a\u0629", detail: "\u062d\u062f\u064a\u062b\u0629\u060c \u0628\u0627\u0644\u0623\u0644\u0645\u0627\u0646\u064a\u0629 \u0623\u0648 \u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629" },
        { label: "\u0625\u062b\u0628\u0627\u062a \u0627\u0644\u0633\u0643\u0646", detail: "\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0633\u0643\u0646 \u0627\u0644\u062c\u0627\u0645\u0639\u064a \u0623\u0648 \u0639\u0642\u062f \u0625\u064a\u062c\u0627\u0631" },
        { label: "\u0646\u0645\u0648\u0630\u062c \u0637\u0644\u0628 \u0627\u0644\u062a\u0623\u0634\u064a\u0631\u0629", detail: "\u0645\u0643\u062a\u0645\u0644\u060c \u0645\u0648\u0642\u0651\u0639\u060c \u0646\u0633\u062e\u062a\u0627\u0646" },
        { label: "\u0635\u0648\u0631 \u0628\u064a\u0648\u0645\u062a\u0631\u064a\u0629", detail: "\u062d\u062f\u064a\u062b\u0629\u060c \u062d\u0633\u0628 \u0645\u0648\u0627\u0635\u0641\u0627\u062a \u0627\u0644\u0633\u0641\u0627\u0631\u0629" },
        { label: "\u0631\u0633\u0648\u0645 \u0627\u0644\u062a\u0623\u0634\u064a\u0631\u0629", detail: "75 \u064a\u0648\u0631\u0648 (\u063a\u064a\u0631 \u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u0627\u0633\u062a\u0631\u062f\u0627\u062f)" },
      ],
    },
    timeline: {
      heading: "\u0627\u0644\u062c\u062f\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064a \u0644\u0644\u062a\u0623\u0634\u064a\u0631\u0629",
      items: [
        { phase: "\u0627\u0644\u062a\u062d\u0636\u064a\u0631", duration: "8\u201312 \u0623\u0633\u0628\u0648\u0639\u0627\u064b", label: "\u0641\u062a\u062d \u0627\u0644\u062d\u0633\u0627\u0628 \u0627\u0644\u0645\u063a\u0644\u0642 + \u0627\u0644\u062a\u0623\u0645\u064a\u0646" },
        { phase: "\u0627\u0644\u0645\u0633\u062a\u0646\u062f\u0627\u062a", duration: "4\u20136 \u0623\u0633\u0627\u0628\u064a\u0639", label: "\u062a\u062c\u0645\u064a\u0639 \u0648\u062a\u0635\u062f\u064a\u0642 \u0648\u062a\u0631\u062c\u0645\u0629" },
        { phase: "\u0627\u0644\u0645\u0648\u0639\u062f", duration: "6\u201312 \u0623\u0633\u0628\u0648\u0639", label: "\u062d\u062c\u0632 \u0648\u062d\u0636\u0648\u0631 \u0645\u0642\u0627\u0628\u0644\u0629 \u0627\u0644\u0633\u0641\u0627\u0631\u0629" },
        { phase: "\u0627\u0644\u0642\u0631\u0627\u0631", duration: "4\u20138 \u0623\u0633\u0627\u0628\u064a\u0639", label: "\u0645\u0639\u0627\u0644\u062c\u0629 \u0637\u0644\u0628 \u0627\u0644\u062a\u0623\u0634\u064a\u0631\u0629" },
        { phase: "\u0627\u0644\u0648\u0635\u0648\u0644", duration: "\u0642\u0628\u0644 \u0627\u0644\u0641\u0635\u0644", label: "\u0627\u0644\u062a\u0633\u062c\u064a\u0644 \u0628\u0627\u0644\u0639\u0646\u0648\u0627\u0646 (Anmeldung) \u062e\u0644\u0627\u0644 14 \u064a\u0648\u0645" },
      ],
    },
    faq: {
      heading: "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629",
      items: [
        {
          question: "\u0643\u0645 \u064a\u0633\u062a\u063a\u0631\u0642 \u0627\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u062a\u0623\u0634\u064a\u0631\u0629 \u0627\u0644\u0637\u0627\u0644\u0628 \u0627\u0644\u0623\u0644\u0645\u0627\u0646\u064a\u0629\u061f",
          answer:
            "\u0627\u0644\u062c\u062f\u0648\u0644 \u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a \u0645\u0646 \u0628\u062f\u0621 \u0627\u0644\u062a\u062d\u0636\u064a\u0631 \u062d\u062a\u0649 \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u064a\u062a\u0631\u0627\u0648\u062d \u0639\u0627\u062f\u0629\u064b \u0628\u064a\u0646 4 \u0648 6 \u0623\u0634\u0647\u0631.",
        },
        {
          question: "\u0647\u0644 \u064a\u0645\u0643\u0646\u0646\u064a \u0627\u0644\u0639\u0645\u0644 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u062f\u0631\u0627\u0633\u0629 \u0641\u064a \u0623\u0644\u0645\u0627\u0646\u064a\u0627\u061f",
          answer:
            "\u0646\u0639\u0645. \u0644\u0637\u0644\u0627\u0628 \u062e\u0627\u0631\u062c \u0627\u0644\u0627\u062a\u062d\u0627\u062f \u0627\u0644\u0623\u0648\u0631\u0648\u0628\u064a: 120 \u064a\u0648\u0645\u0627\u064b \u0643\u0627\u0645\u0644\u0627\u064b \u0623\u0648 240 \u064a\u0648\u0645\u0627\u064b \u0646\u0635\u0641 \u062f\u0648\u0627\u0645 \u0633\u0646\u0648\u064a\u0627\u064b.",
        },
        {
          question: "\u0645\u0627 \u0647\u0648 Anmeldung \u0648\u0645\u062a\u0649 \u0623\u062d\u062a\u0627\u062c\u0647 \u0644\u0644\u062a\u0633\u062c\u064a\u0644\u061f",
          answer:
            "Anmeldung \u0647\u0648 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u0625\u0642\u0627\u0645\u0629 \u0627\u0644\u0625\u0644\u0632\u0627\u0645\u064a \u062e\u0644\u0627\u0644 14 \u064a\u0648\u0645\u0627\u064b \u0645\u0646 \u0627\u0644\u0648\u0635\u0648\u0644. \u0636\u0631\u0648\u0631\u064a \u0644\u0641\u062a\u062d \u062d\u0633\u0627\u0628 \u0628\u0646\u0643\u064a \u0648\u0627\u0644\u062a\u0633\u062c\u064a\u0644 \u0628\u0627\u0644\u062c\u0627\u0645\u0639\u0629.",
        },
        {
          question: "\u0647\u0644 \u0623\u062d\u062a\u0627\u062c \u062a\u0623\u0634\u064a\u0631\u0629 \u062c\u062f\u064a\u062f\u0629 \u0625\u0630\u0627 \u063a\u064a\u0651\u0631\u062a \u0627\u0644\u062c\u0627\u0645\u0639\u0629\u061f",
          answer:
            "\u0644\u064a\u0633 \u0628\u0627\u0644\u0636\u0631\u0648\u0631\u0629. \u062a\u0623\u0634\u064a\u0631\u062a\u0643 \u0645\u0631\u062a\u0628\u0637\u0629 \u0628\u0648\u0636\u0639\u0643 \u0643\u0637\u0627\u0644\u0628 \u0644\u0627 \u0628\u062c\u0627\u0645\u0639\u0629 \u0628\u0639\u064a\u0646\u0647\u0627. \u0623\u062e\u0628\u0631 \u0645\u0643\u062a\u0628 \u0634\u0624\u0648\u0646 \u0627\u0644\u0623\u062c\u0627\u0646\u0628 \u0628\u0627\u0644\u062a\u063a\u064a\u064a\u0631.",
        },
        {
          question: "\u0647\u0644 \u064a\u0645\u0643\u0646 \u062a\u062c\u062f\u064a\u062f \u0627\u0644\u062a\u0623\u0634\u064a\u0631\u0629 \u0645\u0646 \u062f\u0627\u062e\u0644 \u0623\u0644\u0645\u0627\u0646\u064a\u0627\u061f",
          answer:
            "\u0646\u0639\u0645. \u062a\u0642\u062f\u0651\u0645 \u0628\u0637\u0644\u0628 \u062a\u0645\u062f\u064a\u062f \u0644\u062f\u0649 \u0645\u0643\u062a\u0628 \u0634\u0624\u0648\u0646 \u0627\u0644\u0623\u062c\u0627\u0646\u0628 (\u0623\u0648\u0633\u0644\u0627\u0646\u062f\u0631\u0628\u0647\u0648\u0631\u062f\u0629) \u0642\u0628\u0644 \u0627\u0646\u062a\u0647\u0627\u0621 \u062a\u0623\u0634\u064a\u0631\u062a\u0643 \u0628\u0640 6\u20138 \u0623\u0633\u0627\u0628\u064a\u0639.",
        },
      ],
    },
    cta: "\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u0645\u0633\u0627\u0639\u062f\u0629 \u0641\u064a \u062a\u062c\u0647\u064a\u0632 \u0645\u0644\u0641 \u0627\u0644\u062a\u0623\u0634\u064a\u0631\u0629",
    ctaNote: "\u0627\u0633\u062a\u0634\u0627\u0631\u0629 \u0645\u062c\u0627\u0646\u064a\u0629 30 \u062f\u0642\u064a\u0642\u0629 \u2014 \u0628\u062f\u0648\u0646 \u0623\u064a \u0627\u0644\u062a\u0632\u0627\u0645",
    infoEarly: {
      title: "\u0627\u0628\u062f\u0623 \u0642\u0628\u0644 \u0627\u0643\u062a\u0645\u0627\u0644 \u0627\u0644\u0642\u0628\u0648\u0644",
      body: "\u0645\u0648\u0627\u0639\u064a\u062f \u0627\u0644\u0633\u0641\u0627\u0631\u0629 \u062a\u0645\u062a\u0644\u0626 \u0645\u0628\u0643\u0631\u0627\u064b. \u0627\u0644\u0628\u062f\u0621 \u0627\u0644\u0645\u0628\u0643\u0631 \u0628\u0641\u062a\u062d \u0627\u0644\u062d\u0633\u0627\u0628 \u0648\u0627\u0644\u062a\u0623\u0645\u064a\u0646 \u064a\u0645\u0646\u062d\u0643 \u0647\u0627\u0645\u0634\u0627\u064b \u0644\u0623\u064a \u062a\u0623\u062e\u064a\u0631.",
    },
    warningFunds: {
      title: "\u0627\u0644\u0623\u0645\u0648\u0627\u0644 \u064a\u062c\u0628 \u0623\u0646 \u062a\u0643\u0648\u0646 \u0645\u062d\u0648\u0644\u0629 \u0648\u0645\u0624\u0643\u062f\u0629",
      body: "\u0627\u0644\u0645\u0633\u0624\u0648\u0644\u0648\u0646 \u064a\u062a\u062d\u0642\u0642\u0648\u0646 \u0645\u0646 \u0648\u062c\u0648\u062f \u0627\u0644\u0645\u0628\u0644\u063a \u0641\u064a \u0627\u0644\u062d\u0633\u0627\u0628 \u0627\u0644\u0645\u063a\u0644\u0642 \u0648\u0625\u0645\u0643\u0627\u0646\u064a\u0629 \u062a\u062d\u0631\u064a\u0631\u0647. \u062d\u0648\u0651\u0644 \u0627\u0644\u0645\u0628\u0644\u063a \u0643\u0627\u0645\u0644\u0627\u064b \u0648\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u062a\u0623\u0643\u064a\u062f \u062e\u0637\u064a.",
    },
    tipInterview: {
      title: "\u0627\u0644\u0648\u0636\u0648\u062d \u0647\u0648 \u0645\u0641\u062a\u0627\u062d \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629",
      body: "\u0627\u0644\u0645\u0633\u0624\u0648\u0644\u0648\u0646 \u064a\u062a\u062d\u0642\u0642\u0648\u0646 \u0645\u0646 \u062c\u062f\u064a\u0629 \u062e\u0637\u062a\u0643 \u0627\u0644\u062f\u0631\u0627\u0633\u064a\u0629. \u0625\u062c\u0627\u0628\u0629 \u0648\u0627\u0636\u062d\u0629 \u0639\u0646 \u0623\u0647\u062f\u0627\u0641\u0643 \u0623\u0642\u0648\u0649 \u0645\u0646 \u0634\u0631\u062d \u0637\u0648\u064a\u0644.",
    },
  },

  de: {
    title: "Studienvisum Deutschland: Leitfaden f\u00fcr internationale Studierende 2026",
    description: "Praxisleitfaden 2026 f\u00fcr ein strukturiertes und belastbares Studienvisum-Dossier.",
    heroTagline: "Schritt-f\u00fcr-Schritt-Leitfaden zur Visavorbereitung",
    readTime: "7 Min. Lesezeit",
    tocLabel: "Inhalt",
    needHelp: "Hilfe ben\u00f6tigt?",
    steps: {
      heading: "Visavorbereitungsprozess",
      items: [
        {
          number: 1,
          title: "Vor der finalen Zulassung beginnen",
          description:
            "Starten Sie die Visavorbereitung fr\u00fchzeitig, sobald Zulassungsunterlagen absehbar sind. Botschaftstermine k\u00f6nnen 6\u201312 Wochen Wartezeit bedeuten.",
          tips: [
            "Botschaftstermin so fr\u00fch wie m\u00f6glich buchen",
            "Dokumentenliste der zust\u00e4ndigen Botschaft pr\u00fcfen",
            "Termine meist nur \u00fcber Online-Portal buchbar",
          ],
        },
        {
          number: 2,
          title: "Sperrkonto er\u00f6ffnen",
          description:
            "Deutsche Botschaften verlangen Nachweis von 11.208 \u20ac auf einem Sperrkonto. Monatlich werden ca. 934 \u20ac freigegeben.",
          tips: [
            "Anbieter: Fintiba, Expatrio, Deutsche Bank",
            "2\u20133 Wochen f\u00fcr Kontoaktivierung einplanen",
            "Betrag muss vor dem Botschaftstermin best\u00e4tigt sein",
          ],
        },
        {
          number: 3,
          title: "Krankenversicherung abschlie\u00dfen",
          description:
            "Gesetzliche Krankenversicherung ist f\u00fcr das Visum Pflicht. Sie m\u00fcssen vor dem Interview angemeldet sein.",
          tips: [
            "TK, AOK, Barmer: gro\u00dfe gesetzliche Kassen",
            "Muss gesamte Studienzeit abdecken",
            "Ca. 110\u2013120 \u20ac monatlich",
          ],
        },
        {
          number: 4,
          title: "Vollst\u00e4ndiges Dossier zusammenstellen",
          description:
            "Alle Unterlagen sammeln und auf Koh\u00e4renz pr\u00fcfen. Sachbearbeiter achten auf Konsistenz zwischen Motivationsschreiben und Studiengang.",
          tips: [
            "Nur Originale oder beglaubigte Kopien",
            "\u00dcbersetzungen nur durch beeidigte \u00dcbersetzer",
            "Beschriftete Mappe f\u00fcr alle Dokumente",
          ],
        },
        {
          number: 5,
          title: "Botschaftsinterview",
          description:
            "Pr\u00e4zise Antworten zu Studienplan, Karriereziel und Standortwahl Deutschland vorbereiten. Klare Formulierungen \u00fcberzeugen mehr als komplexe Erl\u00e4uterungen.",
          tips: [
            "\u00dcben: Warum Deutschland? Warum dieser Studiengang? Karriereplan?",
            "Originale UND Kopien aller Dokumente mitbringen",
            "15 Minuten fr\u00fcher erscheinen",
          ],
        },
      ],
    },
    documents: {
      heading: "Checkliste Visumdokumente",
      items: [
        { label: "G\u00fcltiger Reisepass", detail: "Mind. 6 Monate \u00fcber Studienende hinaus g\u00fcltig" },
        { label: "Zulassungsbescheid der Hochschule", detail: "Original oder beglaubigte Kopie" },
        { label: "Sperrkonto-Nachweis", detail: "11.208 \u20ac Mindestbetrag" },
        { label: "Krankenversicherungsnachweis", detail: "Von einer deutschen gesetzlichen Kasse" },
        { label: "Akademische Transkripte", detail: "Beglaubigt + \u00dcbersetzung" },
        { label: "Sprachzertifikat", detail: "IELTS, TOEFL, TestDaF, DSH" },
        { label: "Motivationsschreiben / Studienplan", detail: "Warum Deutschland, warum dieser Studiengang" },
        { label: "Lebenslauf", detail: "Aktuell, Deutsch oder Englisch" },
        { label: "Unterkunftsnachweis", detail: "Wohnheimzusage oder Mietvertrag" },
        { label: "Antragsformular", detail: "Ausgef\u00fcllt, unterschrieben, zweifach" },
        { label: "Biometrische Passfotos", detail: "Aktuell, nach Botschaftsvorgaben" },
        { label: "Visageb\u00fchr", detail: "75 \u20ac (nicht erstattungsf\u00e4hig)" },
      ],
    },
    timeline: {
      heading: "Zeitplan Visavorbereitung",
      items: [
        { phase: "Vorbereitung", duration: "8\u201312 Wochen", label: "Sperrkonto + Krankenversicherung" },
        { phase: "Dokumente", duration: "4\u20136 Wochen", label: "Sammeln, beglaubigen, \u00fcbersetzen" },
        { phase: "Termin", duration: "6\u201312 Wochen", label: "Botschaftstermin buchen & wahrnehmen" },
        { phase: "Entscheidung", duration: "4\u20138 Wochen", label: "Visumbearbeitungszeit" },
        { phase: "Ankunft", duration: "Vor Semesterstart", label: "Anmeldung beim B\u00fcrgeramt innerhalb 14 Tage" },
      ],
    },
    faq: {
      heading: "H\u00e4ufig gestellte Fragen",
      items: [
        {
          question: "Wie lange dauert die Bearbeitung des Studentenvisums?",
          answer:
            "Gesamtdauer von Beginn der Vorbereitung bis zur Visumserteilung typischerweise 4\u20136 Monate. Botschaftstermine allein k\u00f6nnen 6\u201312 Wochen Vorlaufzeit erfordern.",
        },
        {
          question: "Darf ich w\u00e4hrend des Studiums arbeiten?",
          answer:
            "Ja \u2014 Nicht-EU-Studierende d\u00fcrfen 120 ganze Tage oder 240 halbe Tage pro Jahr arbeiten. Mehr erfordert Genehmigung der Ausl\u00e4nderbeh\u00f6rde und der Bundesagentur f\u00fcr Arbeit.",
        },
        {
          question: "Was ist die Anmeldung und wann muss ich sie machen?",
          answer:
            "Die Anmeldung ist die Pflichtregistrierung beim Einwohnermeldeamt innerhalb von 14 Tagen nach Einzug. Ben\u00f6tigt f\u00fcr Bankkonto und Universit\u00e4tseinschreibung.",
        },
        {
          question: "Brauche ich ein neues Visum, wenn ich die Hochschule wechsle?",
          answer:
            "Nicht zwingend. Ihr Visum ist an Ihren Studentenstatus gebunden, nicht an eine bestimmte Hochschule. Informieren Sie die Ausl\u00e4nderbeh\u00f6rde \u00fcber den Wechsel.",
        },
        {
          question: "Kann ich das Visum innerhalb Deutschlands verl\u00e4ngern?",
          answer:
            "Ja. Stellen Sie den Verl\u00e4ngerungsantrag (Aufenthaltserlaubnis) bei der Ausl\u00e4nderbeh\u00f6rde fr\u00fchestens 6\u20138 Wochen vor Ablauf. Sie k\u00f6nnen w\u00e4hrend der Bearbeitung in Deutschland bleiben.",
        },
      ],
    },
    cta: "Visa-Unterlagen professionell vorbereiten",
    ctaNote: "Kostenlose 30-min\u00fctige Beratung \u2014 keine Verpflichtung",
    infoEarly: {
      title: "Vor der finalen Zulassung beginnen",
      body: "Botschaftstermine sind in Hauptphasen schnell ausgebucht. Fr\u00fchere Sperrkonto-Er\u00f6ffnung und Krankenversicherungsanmeldung schaffen zeitlichen Puffer.",
    },
    warningFunds: {
      title: "Gelder m\u00fcssen best\u00e4tigt sein",
      body: "Sachbearbeiter pr\u00fcfen, ob der Betrag tats\u00e4chlich im Sperrkonto liegt und freigegeben werden kann. Schriftliche Best\u00e4tigung vor dem Termin einholen.",
    },
    tipInterview: {
      title: "Klarheit \u00fcberzeugt im Interview",
      body: "Bewertet wird, ob Ihr Studienplan authentisch und koh\u00e4rent ist. Eine klare Antwort zu Karrierezielen und Programmwahl \u00fcberzeugt mehr als lange Erkl\u00e4rungen.",
    },
  },
};

const TOC_IDS = ["process", "documents", "timeline", "faq"] as const;
type TocId = (typeof TOC_IDS)[number];

const TOC_LABELS: Record<LangKey, Record<TocId, string>> = {
  en: { process: "Visa Process", documents: "Documents", timeline: "Timeline", faq: "FAQ" },
  ar: { process: "\u0645\u0631\u0627\u062d\u0644 \u0627\u0644\u062a\u0623\u0634\u064a\u0631\u0629", documents: "\u0627\u0644\u0645\u0633\u062a\u0646\u062f\u0627\u062a", timeline: "\u0627\u0644\u062c\u062f\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064a", faq: "\u0623\u0633\u0626\u0644\u0629 \u0634\u0627\u0626\u0639\u0629" },
  de: { process: "Visaprozess", documents: "Unterlagen", timeline: "Zeitplan", faq: "FAQ" },
};

export function StudentVisaGermanyGuidePage() {
  const { language, t, dir } = useLanguage() as { language: LangKey; t: <T = string>(key: string) => T; dir: string };
  const content = CONTENT[language];
  const base = language ? `/${language}` : "";
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
    url: `https://enrollurm.com/${language}/resources/${SLUG}`,
  };

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
  }, [dir]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
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
      <div className="page-hero-offset page-hero-pb-compact px-[var(--content-gutter)] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
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
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-success/10 border border-accent-success/20 text-accent-success text-xs font-bold mb-4">
              <Shield className="w-3.5 h-3.5" />
              {content.heroTagline}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
              {content.title}
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400 mb-5 max-w-2xl">{content.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
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
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-3">
                {content.tocLabel}
              </p>
              {TOC_IDS.map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-success/40 shrink-0" />
                  {tocLabels[id]}
                </a>
              ))}
              <div className="mt-6 p-4 rounded-2xl bg-accent-success/5 border border-accent-success/15">
                <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">{content.needHelp}</p>
                <p className="text-xs text-slate-400 mb-3">{content.ctaNote}</p>
                <Link
                  to={`${base}/contact`}
                  className="flex items-center gap-1.5 text-xs font-bold text-accent-success hover:underline"
                >
                  {content.cta}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">

            <GuideInfoCard variant="info" title={content.infoEarly.title} body={content.infoEarly.body} />

            <GuideStepList id="process" heading={content.steps.heading} steps={content.steps.items} />

            <GuideInfoCard variant="warning" title={content.warningFunds.title} body={content.warningFunds.body} />

            <GuideChecklist id="documents" heading={content.documents.heading} items={content.documents.items} />

            <GuideInfoCard variant="success" title={content.tipInterview.title} body={content.tipInterview.body} />

            <GuideTimeline id="timeline" heading={content.timeline.heading} items={content.timeline.items} />

            <GuideFAQ id="faq" heading={content.faq.heading} items={content.faq.items} />

            {/* Bottom CTA */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            >
              <div>
                <p className="font-black text-slate-900 dark:text-white text-lg">{content.cta}</p>
                <p className="text-sm text-slate-400 mt-1">{content.ctaNote}</p>
              </div>
              <Link
                to={`${base}/contact`}
                className="inline-flex items-center gap-2 rounded-xl bg-accent-success text-white px-6 py-3 text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
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

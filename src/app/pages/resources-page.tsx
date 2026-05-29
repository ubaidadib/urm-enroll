import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../seo/seo-manager";
import { ContextualPageHeader } from "../components/ui/contextual-page-header";
import { Building2, GraduationCap, Globe2 } from "lucide-react";

type ListingCopy = {
  title: string;
  description: string;
  cardCta: string;
  cards: Array<{ title: string; excerpt: string; slug: string }>;
};

const COPY: Record<"en" | "ar" | "de", ListingCopy> = {
  en: {
    title: "Study Abroad Resources",
    description:
      "Explore practical guides for German university applications, student visas, and tuition-free public universities.",
    cardCta: "Read guide",
    cards: [
      {
        title: "How to Apply to a German University in 2026: Complete Guide",
        excerpt:
          "A step-by-step application roadmap from shortlist strategy to final admission letters.",
        slug: "how-to-apply-german-university",
      },
      {
        title: "German Student Visa Guide for International Students 2026",
        excerpt:
          "Learn required documents, blocked account expectations, interview readiness, and realistic timelines.",
        slug: "student-visa-germany-guide",
      },
      {
        title: "Top 10 Free Universities in Germany for International Students",
        excerpt:
          "Understand tuition-free public education, semester fees, and how to evaluate program fit.",
        slug: "free-universities-germany",
      },
    ],
  },
  ar: {
    title: "موارد الدراسة بالخارج",
    description:
      "استكشف أدلة عملية للتقديم على الجامعات الألمانية وتأشيرة الطالب والجامعات الحكومية منخفضة التكلفة.",
    cardCta: "اقرأ الدليل",
    cards: [
      {
        title: "كيف تتقدم للجامعات الألمانية في 2026: دليل شامل",
        excerpt: "خارطة طريق عملية من اختيار الجامعة إلى الحصول على القبول النهائي.",
        slug: "how-to-apply-german-university",
      },
      {
        title: "دليل تأشيرة الطالب الألمانية للطلاب الدوليين 2026",
        excerpt: "تعرّف على المستندات المطلوبة والحساب المغلق وخطوات المقابلة والجدول الزمني الواقعي.",
        slug: "student-visa-germany-guide",
      },
      {
        title: "أفضل 10 جامعات مجانية في ألمانيا للطلاب الدوليين",
        excerpt: "افهم نظام الجامعات الحكومية ورسوم الفصل وكيف تختار البرنامج المناسب.",
        slug: "free-universities-germany",
      },
    ],
  },
  de: {
    title: "Ressourcen zum Auslandsstudium",
    description:
      "Praxisleitfaden zu Uni-Bewerbung, Studienvisum und gebuehrenarmen oeffentlichen Universitaeten in Deutschland.",
    cardCta: "Leitfaden lesen",
    cards: [
      {
        title: "Bewerbung an deutschen Universitaeten 2026: Der vollstaendige Leitfaden",
        excerpt: "Ein klarer Prozess von der Programmauswahl bis zum finalen Zulassungsbescheid.",
        slug: "how-to-apply-german-university",
      },
      {
        title: "Studienvisum Deutschland: Leitfaden fuer internationale Studierende",
        excerpt: "Dokumente, Sperrkonto, Interview-Vorbereitung und realistische Bearbeitungszeiten.",
        slug: "student-visa-germany-guide",
      },
      {
        title: "Die 10 besten gebuehrenfreien Universitaeten in Deutschland",
        excerpt: "So bewerten Sie Semesterbeitrag, Programmpassung und akademische Anforderungen.",
        slug: "free-universities-germany",
      },
    ],
  },
};

export function ResourcesPage() {
  const { language, t } = useLanguage();
  const copy = COPY[language as "en" | "ar" | "de"];
  const heroBadge = {
    en: "Resource Library",
    ar: "مكتبة الموارد",
    de: "Ressourcen-Bibliothek",
  }[language as "en" | "ar" | "de"];
  const base = language ? `/${language}` : "";

  return (
    <main className="dark min-h-screen transition-colors duration-500" style={{ background: "rgb(5,10,24)" }}>
      <SeoManager
        title={copy.title}
        description={copy.description}
        path="/resources"
        breadcrumbs={[
          { name: t<string>("seo.siteName"), path: "/" },
          { name: copy.title, path: "/resources" },
        ]}
      />

      <ContextualPageHeader
        badge={heroBadge}
        title={copy.title}
        description={copy.description}
        breadcrumbs={[
          { label: t<string>("common.home"), href: "/" },
          { label: copy.title, href: "/resources" },
        ]}
        stats={[
          { icon: Building2, value: "3", label: copy.cardCta },
          { icon: GraduationCap, value: "2026", label: "Updated" },
          { icon: Globe2, value: language.toUpperCase(), label: "Language" },
        ]}
      />

      <div className="max-w-6xl mx-auto page-gutter py-12">

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {copy.cards.map((card) => (
            <article
              key={card.slug}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:border-accent-tech/30 hover:shadow-lg transition-all"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{card.title}</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{card.excerpt}</p>
              <Link
                to={`${base}/resources/${card.slug}`}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-accent-tech group-hover:gap-2.5 transition-all"
              >
                {copy.cardCta}
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

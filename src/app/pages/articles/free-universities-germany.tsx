import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "@/app/seo/seo-manager";
import { Breadcrumbs } from "@/app/components/layout/breadcrumbs";

type Copy = {
  title: string;
  description: string;
  paragraphs: string[];
  cta: string;
};

const SLUG = "free-universities-germany";
const BUILD_DATE = new Date().toISOString();

const COPY: Record<"en" | "ar" | "de", Copy> = {
  en: {
    title: "Top 10 Free Universities in Germany for International Students",
    description:
      "Understand how tuition-free public universities in Germany work and how to shortlist the right programs.",
    paragraphs: [
      "Most public universities in Germany do not charge tuition for many degree paths, including for international students. However, students still pay semester contributions that cover services and transport.",
      "A strong shortlist should balance academic reputation, language of instruction, city-level cost of living, and career opportunities. Tuition-free does not mean low overall living costs.",
      "When evaluating universities, review admission criteria, prerequisite coursework, and language requirements in detail. Small differences between programs can determine eligibility.",
      "Plan your budget with a realistic monthly estimate including rent, insurance, and food. Financial clarity supports both visa approval and smoother first-year integration.",
    ],
    cta: "Compare programs with an enrollment advisor",
  },
  ar: {
    title: "أفضل 10 جامعات مجانية في ألمانيا للطلاب الدوليين",
    description: "افهم نظام الجامعات الحكومية منخفضة الرسوم في ألمانيا وكيف تختار البرامج الأنسب لك.",
    paragraphs: [
      "معظم الجامعات الحكومية في ألمانيا لا تفرض رسوماً دراسية عالية على العديد من التخصصات حتى للطلاب الدوليين، لكن توجد رسوم فصل دراسي تغطي خدمات أساسية مثل النقل.",
      "القائمة الذكية للجامعات يجب أن توازن بين السمعة الأكاديمية ولغة الدراسة وتكاليف المعيشة وفرص العمل بعد التخرج. انخفاض الرسوم لا يعني انخفاض التكلفة الكلية.",
      "عند المقارنة بين الجامعات، راجع شروط القبول والمتطلبات المسبقة ومتطلبات اللغة بدقة. فروقات بسيطة بين البرامج قد تحدد أهليتك النهائية.",
      "ضع ميزانية شهرية واقعية تشمل السكن والتأمين والطعام. وضوح الخطة المالية يساعدك في ملف التأشيرة ويجعل الاستقرار في السنة الأولى أسهل.",
    ],
    cta: "قارن البرامج مع مستشار التسجيل",
  },
  de: {
    title: "Die 10 besten gebuehrenfreien Universitaeten in Deutschland",
    description: "So funktioniert gebuehrenarmes Studium an oeffentlichen Hochschulen in Deutschland.",
    paragraphs: [
      "Viele oeffentliche Universitaeten in Deutschland erheben keine klassischen Studiengebuehren, auch nicht fuer zahlreiche internationale Bewerbergruppen. Ein Semesterbeitrag bleibt dennoch verpflichtend.",
      "Bei der Auswahl sollten Sie akademische Qualitaet, Unterrichtssprache, Lebenshaltungskosten der Stadt und Karriereoptionen gemeinsam betrachten. Niedrige Gebuehren sind nur ein Faktor.",
      "Pruefen Sie Zulassungsvoraussetzungen, Fachvorkenntnisse und Sprachanforderungen programmspezifisch. Kleine Abweichungen zwischen Studiengaengen sind oft entscheidend.",
      "Erstellen Sie einen belastbaren Finanzplan fuer Miete, Versicherung und Lebensunterhalt. Das verbessert sowohl die Visavorbereitung als auch den Start im ersten Semester.",
    ],
    cta: "Programme mit Studienberatung vergleichen",
  },
};

export function FreeUniversitiesGermanyPage() {
  const { language, t } = useLanguage();
  const copy = COPY[language as "en" | "ar" | "de"];
  const base = language ? `/${language}` : "";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.title,
    author: { "@type": "Organization", name: "URM Enroll" },
    publisher: { "@type": "Organization", name: "URM Enroll" },
    datePublished: BUILD_DATE,
    dateModified: BUILD_DATE,
    inLanguage: language,
    url: `https://enrollurm.com/${language}/resources/${SLUG}`,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-28">
      <SeoManager
        title={copy.title}
        description={copy.description}
        path={`/resources/${SLUG}`}
        structuredData={articleSchema}
        breadcrumbs={[
          { name: t<string>("seo.siteName"), path: "/" },
          { name: "Resources", path: "/resources" },
          { name: copy.title, path: `/resources/${SLUG}` },
        ]}
      />

      <div className="max-w-4xl mx-auto">
        <Breadcrumbs
          items={[
            { label: t<string>("common.home"), href: "/" },
            { label: "Resources", href: "/resources" },
            { label: copy.title, href: `/resources/${SLUG}` },
          ]}
        />
        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">{copy.title}</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">{copy.description}</p>
          <div className="mt-8 space-y-5 text-slate-600 dark:text-slate-400 leading-relaxed">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Link
            to={`${base}/contact`}
            className="mt-10 inline-flex rounded-xl bg-accent-tech text-ink px-5 py-3 text-sm font-semibold hover:opacity-90"
          >
            {copy.cta}
          </Link>
        </article>
      </div>
    </div>
  );
}

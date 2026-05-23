import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/language-context";
import { getPublicEnv } from "@/lib/env";
import { SeoHead } from "./seo-head";
import {
  PAGE_SEO,
  inferPageKeyFromPath,
  type SeoPageKey,
} from "./seo-content";

type SeoBreadcrumb = {
  name: string;
  path: string;
};

type SeoManagerProps = {
  title?: string;
  description?: string;
  path?: string;
  breadcrumbs?: SeoBreadcrumb[];
  noIndex?: boolean;
  pageKey?: SeoPageKey;
  structuredData?: object | object[];
};

const stripLangPrefix = (pathname: string): string => {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const parts = normalized.split("/").filter(Boolean);
  const first = parts[0];
  if (first === "en" || first === "ar" || first === "de") {
    const rest = parts.slice(1);
    return rest.length ? `/${rest.join("/")}` : "/";
  }
  return normalized;
};

const buildOrganizationSchema = (siteUrl: string, image: string) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "URM Enroll",
  url: siteUrl,
  logo: image,
  image,
  description: "International student enrollment and study abroad counseling platform",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Student Counseling",
    availableLanguage: ["English", "Arabic", "German"],
    email: "contact@enrollurm.com",
  },
  sameAs: [
    "https://linkedin.com/company/urmenroll",
    "https://twitter.com/urmenroll",
    "https://instagram.com/urmenroll",
  ],
});

const buildWebsiteSchema = (siteUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: siteUrl,
  name: "URM Enroll",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

const buildEducationServiceSchema = () => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "URM Enroll",
  description: "Expert guidance for international students applying to German and European universities",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Study Abroad Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "University Application Guidance",
          description: "Personalized support for applying to German universities",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Student Visa Assistance",
          description: "Expert guidance through the German student visa process",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Free Study Abroad Consultation",
          description: "Free initial consultation with an expert student counselor",
        },
      },
    ],
  },
});

const buildFaqSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I apply to a German university as an international student?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "International students can apply to German universities through uni-assist or directly. URM Enroll guides you through every step including document preparation, language requirements, and application submission.",
      },
    },
    {
      "@type": "Question",
      name: "Is studying in Germany really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most public universities in Germany charge no tuition fees for both domestic and international students. You only pay a small semester fee covering admin costs and public transport.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to get a German student visa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "German student visa processing typically takes 4 to 12 weeks. We recommend applying at least 3 months before your intended start date.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to speak German to study in Germany?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not necessarily. Many German universities offer full Bachelor and Master programs in English. Learning basic German still improves everyday life.",
      },
    },
    {
      "@type": "Question",
      name: "Is URM Enroll's consultation free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Your initial consultation with a URM Enroll student counselor is free with no commitment required.",
      },
    },
  ],
});

const buildPersonSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Senior Admissions Counselor",
      jobTitle: "Senior Admissions Counselor",
      url: "https://enrollurm.com/contact",
      image: "https://enrollurm.com/og-image.svg",
      worksFor: { "@type": "Organization", name: "URM Enroll" },
      knowsLanguage: ["Arabic", "English"],
      email: "contact@enrollurm.com",
    },
    {
      "@type": "Person",
      name: "International Enrollment Counselor",
      jobTitle: "International Enrollment Counselor",
      url: "https://enrollurm.com/contact",
      image: "https://enrollurm.com/og-image.svg",
      worksFor: { "@type": "Organization", name: "URM Enroll" },
      knowsLanguage: ["German", "English"],
      email: "contact@enrollurm.com",
    },
  ],
});

const buildBreadcrumbSchema = (siteUrl: string, breadcrumbs: SeoBreadcrumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${siteUrl}${item.path}`,
  })),
});

export function SeoManager({
  title,
  description,
  path,
  breadcrumbs,
  noIndex = false,
  pageKey,
  structuredData,
}: SeoManagerProps) {
  const { language } = useLanguage();
  const location = useLocation();
  const { siteUrl, ogImagePath } = getPublicEnv();

  const canonicalPath = useMemo(() => {
    if (path) return path;
    return stripLangPrefix(location.pathname);
  }, [location.pathname, path]);

  const derivedPageKey = pageKey ?? inferPageKeyFromPath(canonicalPath);
  const defaults = PAGE_SEO[language][derivedPageKey];

  const schema = useMemo(() => {
    const baseSchemas: object[] = [
      buildOrganizationSchema(siteUrl, `${siteUrl}${ogImagePath}`),
      buildWebsiteSchema(siteUrl),
    ];

    if (derivedPageKey === "home" || derivedPageKey === "services") {
      baseSchemas.push(buildEducationServiceSchema());
    }

    if (derivedPageKey === "home" || derivedPageKey === "contact") {
      baseSchemas.push(buildFaqSchema());
    }

    if (derivedPageKey === "contact") {
      baseSchemas.push(buildPersonSchema());
    }

    if (breadcrumbs && breadcrumbs.length > 0) {
      baseSchemas.push(buildBreadcrumbSchema(siteUrl, breadcrumbs));
    }

    if (structuredData) {
      if (Array.isArray(structuredData)) {
        baseSchemas.push(...structuredData);
      } else {
        baseSchemas.push(structuredData);
      }
    }

    return baseSchemas;
  }, [breadcrumbs, derivedPageKey, ogImagePath, siteUrl, structuredData]);

  return (
    <SeoHead
      title={title ?? defaults.title}
      description={description ?? defaults.description}
      keywords={defaults.keywords}
      canonicalPath={canonicalPath}
      ogType="website"
      noIndex={noIndex}
      structuredData={schema}
      lang={language}
    />
  );
}

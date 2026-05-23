import type { LeadPayload } from "@/lib/secure-submit";

export type FaqItem = {
  question: string;
  answer: string;
};

type SchemaContext = {
  siteUrl: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  addressLocality: string;
  addressCountry: string;
  addressRegion?: string;
  postalCode?: string;
  streetAddress?: string;
};

export const buildOrganizationSchema = (context: SchemaContext) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "URM ENROLL",
  url: context.siteUrl,
  logo: context.logoUrl,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: context.contactEmail,
      telephone: context.contactPhone,
      areaServed: "DE",
      availableLanguage: ["en", "ar", "de"],
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: context.addressLocality,
    addressCountry: context.addressCountry,
  },
});

export const buildEducationalOrgSchema = (context: SchemaContext) => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "URM ENROLL",
  url: context.siteUrl,
  logo: context.logoUrl,
  areaServed: "DE",
  address: {
    "@type": "PostalAddress",
    addressLocality: context.addressLocality,
    addressCountry: context.addressCountry,
  },
});

export const buildFaqSchema = (faq: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

export const buildBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const buildServiceSchema = (services: string[], context: SchemaContext) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Germany-first institutional education consultancy",
  areaServed: "DE",
  provider: {
    "@type": "Organization",
    name: "URM ENROLL",
    url: context.siteUrl,
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Institutional Services",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service,
      },
    })),
  },
});

export const buildLocalBusinessSchema = (context: SchemaContext) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "URM ENROLL",
  url: context.siteUrl,
  image: context.logoUrl,
  telephone: context.contactPhone,
  email: context.contactEmail,
  areaServed: "DE",
  serviceArea: {
    "@type": "AdministrativeArea",
    name: "Germany",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: context.streetAddress || "",
    addressLocality: context.addressLocality,
    addressRegion: context.addressRegion || "",
    postalCode: context.postalCode || "",
    addressCountry: context.addressCountry,
  },
});

export const buildLeadSchema = (payload: LeadPayload) => ({
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalProgram",
  name: "URM Nexus Fit Assessment",
  provider: {
    "@type": "Organization",
    name: "URM ENROLL",
  },
  educationalProgramMode: "online",
  occupationalCategory: payload.field || "Higher Education",
  timeToComplete: payload.timeline || "",
});

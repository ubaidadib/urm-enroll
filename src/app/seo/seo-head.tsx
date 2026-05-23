import { useEffect, useMemo } from "react";
import type { SupportedLanguage } from "@/i18n/types";
import { getPublicEnv } from "@/lib/env";
import { SEO_BRAND_SUFFIX, localizedPath } from "./seo-content";

type SeoHeadProps = {
  title: string;
  description: string;
  keywords?: string[];
  canonicalPath: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  structuredData?: object | object[];
  lang: SupportedLanguage;
};

const LOCALE_MAP: Record<SupportedLanguage, string> = {
  en: "en_US",
  ar: "ar",
  de: "de_DE",
};

const upsertMeta = (name: string, content: string, attribute: "name" | "property" = "name") => {
  const selector = `meta[${attribute}='${name}']`;
  const element = document.querySelector<HTMLMetaElement>(selector) ?? document.createElement("meta");
  element.setAttribute(attribute, name);
  element.setAttribute("content", content);
  if (!element.parentElement) document.head.appendChild(element);
};

const upsertLink = (id: string, rel: string, href: string, hreflang?: string) => {
  const selector = `link#${id}`;
  const element = document.querySelector<HTMLLinkElement>(selector) ?? document.createElement("link");
  element.id = id;
  element.rel = rel;
  element.href = href;
  if (hreflang) element.hreflang = hreflang;
  if (!element.parentElement) document.head.appendChild(element);
};

const upsertJsonLd = (id: string, payload: object) => {
  const selector = `script[data-schema='${id}']`;
  const element = document.querySelector<HTMLScriptElement>(selector) ?? document.createElement("script");
  element.type = "application/ld+json";
  element.setAttribute("data-schema", id);
  element.text = JSON.stringify(payload);
  if (!element.parentElement) document.head.appendChild(element);
};

const normalizePath = (path: string) => {
  const cleaned = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return cleaned;
};

export function SeoHead({
  title,
  description,
  keywords = [],
  canonicalPath,
  ogImage,
  ogType = "website",
  noIndex = false,
  structuredData,
  lang,
}: SeoHeadProps) {
  const { siteUrl, ogImagePath } = getPublicEnv();

  const data = useMemo(() => {
    const normalizedPath = normalizePath(canonicalPath);
    const canonical = `${siteUrl}${localizedPath(lang, normalizedPath)}`;
    const alternateEn = `${siteUrl}${localizedPath("en", normalizedPath)}`;
    const alternateAr = `${siteUrl}${localizedPath("ar", normalizedPath)}`;
    const alternateDe = `${siteUrl}${localizedPath("de", normalizedPath)}`;
    const image = ogImage?.startsWith("http") ? ogImage : `${siteUrl}${ogImage ?? ogImagePath}`;

    const containsBrand = title.includes("URM Enroll");
    const fullTitle = containsBrand
      ? title
      : `${title} | ${SEO_BRAND_SUFFIX}`;

    return {
      canonical,
      alternateEn,
      alternateAr,
      alternateDe,
      image,
      fullTitle,
    };
  }, [canonicalPath, lang, ogImage, ogImagePath, siteUrl, title]);

  useEffect(() => {
    document.title = data.fullTitle;

    upsertMeta("description", description);
    upsertMeta("keywords", keywords.join(", "));
    upsertMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");
    upsertMeta("author", "URM Enroll");
    upsertMeta("publisher", "URM Enroll");
    upsertMeta("copyright", `URM Enroll ${new Date().getFullYear()}`);
    upsertMeta("category", "Education, Study Abroad, University Enrollment");
    upsertMeta("coverage", "Worldwide");
    upsertMeta("revisit-after", "7 days");
    upsertMeta("rating", "General");
    upsertMeta("theme-color", "#011C40");

    upsertMeta("og:title", data.fullTitle, "property");
    upsertMeta("og:description", description, "property");
    upsertMeta("og:image", data.image, "property");
    upsertMeta("og:url", data.canonical, "property");
    upsertMeta("og:type", ogType, "property");
    upsertMeta("og:site_name", "URM Enroll", "property");
    upsertMeta("og:locale", LOCALE_MAP[lang], "property");

    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:title", data.fullTitle);
    upsertMeta("twitter:description", description);
    upsertMeta("twitter:image", data.image);

    upsertLink("canonical-link", "canonical", data.canonical);
    upsertLink("hreflang-en", "alternate", data.alternateEn, "en");
    upsertLink("hreflang-ar", "alternate", data.alternateAr, "ar");
    upsertLink("hreflang-de", "alternate", data.alternateDe, "de");
    upsertLink("hreflang-default", "alternate", data.alternateEn, "x-default");

    if (structuredData) {
      const payloads = Array.isArray(structuredData) ? structuredData : [structuredData];
      payloads.forEach((item, index) => upsertJsonLd(`seo-schema-${index}`, item));
    }
  }, [data, description, keywords, lang, noIndex, ogType, structuredData]);

  return null;
}

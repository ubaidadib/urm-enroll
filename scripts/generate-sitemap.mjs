import { writeFileSync } from "node:fs";

const siteUrl = (process.env.VITE_PUBLIC_SITE_URL || "https://enrollurm.com").replace(/\/$/, "");
const languages = ["en", "ar", "de"];
const buildDate = new Date().toISOString().split("T")[0];

const routes = [
  { path: "", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "weekly", priority: "0.9" },
  { path: "/programs", changefreq: "weekly", priority: "0.9" },
  { path: "/destinations", changefreq: "weekly", priority: "0.9" },
  { path: "/contact", changefreq: "monthly", priority: "0.9" },
  { path: "/resources", changefreq: "weekly", priority: "0.8" },
  { path: "/resources/how-to-apply-german-university", changefreq: "monthly", priority: "0.7" },
  { path: "/resources/student-visa-germany-guide", changefreq: "monthly", priority: "0.7" },
  { path: "/resources/free-universities-germany", changefreq: "monthly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/nursing", changefreq: "monthly", priority: "0.8" },
  { path: "/nursing-assessment", changefreq: "monthly", priority: "0.8" },
  { path: "/partnerships", changefreq: "monthly", priority: "0.8" },
  { path: "/quiz", changefreq: "monthly", priority: "0.8" },
  { path: "/germany-careers", changefreq: "weekly", priority: "0.95" },
  { path: "/germany-jobs", changefreq: "weekly", priority: "0.85" },
  { path: "/germany-relocation", changefreq: "monthly", priority: "0.8" },
  { path: "/chancenkarte", changefreq: "weekly", priority: "0.95" },
  { path: "/chancenkarte/eligibility", changefreq: "weekly", priority: "0.9" },
  { path: "/chancenkarte/process", changefreq: "monthly", priority: "0.8" },
  { path: "/chancenkarte/requirements", changefreq: "monthly", priority: "0.8" },
  { path: "/chancenkarte/success-stories", changefreq: "monthly", priority: "0.7" },
  { path: "/chancenkarte/faq", changefreq: "monthly", priority: "0.75" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/cookies", changefreq: "yearly", priority: "0.3" },
  { path: "/impressum", changefreq: "yearly", priority: "0.3" },
];

const buildAlternateLinks = (path) => {
  const links = languages
    .map(
      (lang) =>
        `    <xhtml:link rel="alternate" hreflang="${lang}" href="${siteUrl}/${lang}${path}"/>`,
    )
    .join("\n");
  return `${links}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/en${path}"/>`;
};

const buildLanguageSitemap = (lang) => {
  const urls = routes
    .map(({ path, changefreq, priority }) => {
      return [
        "  <url>",
        `    <loc>${siteUrl}/${lang}${path}</loc>`,
        `    <lastmod>${buildDate}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        buildAlternateLinks(path),
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
};

const sitemapIndex = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...languages.map(
    (lang) =>
      `  <sitemap>\n    <loc>${siteUrl}/sitemap-${lang}.xml</loc>\n    <lastmod>${buildDate}</lastmod>\n  </sitemap>`,
  ),
  "</sitemapindex>",
  "",
].join("\n");

writeFileSync("public/sitemap.xml", sitemapIndex, "utf8");
languages.forEach((lang) => {
  writeFileSync(`public/sitemap-${lang}.xml`, buildLanguageSitemap(lang), "utf8");
});

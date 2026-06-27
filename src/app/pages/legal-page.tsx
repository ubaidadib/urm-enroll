import { m } from "motion/react";
import { Shield } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../seo/seo-manager";

export type LegalPageKey = "privacy" | "terms" | "cookies" | "impressum";

type LegalSection = {
  title: string;
  body: string;
};

type LegalPageContent = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalPage({ pageKey }: { pageKey: LegalPageKey }) {
  const { t } = useLanguage();
  const page = t<LegalPageContent>(`legalPages.${pageKey}`);
  const seoKey = pageKey;

  return (
    <>
      <section className="relative bg-bg-primary transition-colors duration-500">
        <SeoManager pageKey={seoKey} path={`/${pageKey}`} />
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(var(--accent-tech), 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(var(--accent-tech), 0.12) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>
        <div className="absolute top-24 right-20 w-72 h-72 bg-accent-success/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-24 left-16 w-72 h-72 bg-accent-tech/15 rounded-full blur-[120px]" />

        <div className="relative page-container-narrow py-16 sm:py-24">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-tech/10 border border-accent-tech/20 mb-6">
              <Shield className="w-4 h-4 text-accent-tech" />
              <span className="text-accent-tech text-xs font-semibold uppercase tracking-wider">
                {t<string>("legalPagesLabel")}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {page.title}
            </h1>
            <p className="text-text-muted text-sm mb-4">
              {page.updated}
            </p>
            <p className="text-text-secondary text-lg leading-relaxed">
              {page.intro}
            </p>
          </m.div>

          <div className="space-y-8">
            {page.sections.map((section) => (
              <m.section
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="p-6 rounded-2xl bg-bg-surface border border-border/50 backdrop-blur-sm"
              >
                <h2 className="text-text-primary text-xl font-semibold mb-3">
                  {section.title}
                </h2>
                <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                  {section.body}
                </p>
              </m.section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

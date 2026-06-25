import { useEffect } from "react";
import { m } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Stethoscope, BadgeCheck, HeartPulse, Timer, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { Breadcrumbs } from "../components/layout/breadcrumbs";
import { GermanyWorkforceModule } from "../sections/germany-workforce-module";
import { WorkforceCalculator } from "../sections/workforce-calculator";
import { SeoManager } from "../seo/seo-manager";
import { usePersonalization } from "@/hooks/usePersonalization";

export function NursingPage() {
  const { t } = useLanguage();
  const { recordSignal } = usePersonalization();

  useEffect(() => {
    recordSignal({ type: "page_view", page: "/nursing" });
  }, [recordSignal]);

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-500">
      <SeoManager
        title={t<string>("seo.sections.workforce.title")}
        description={t<string>("seo.sections.workforce.description")}
        path="/nursing"
        breadcrumbs={[
          { name: t<string>("seo.siteName"), path: "/" },
          { name: t<string>("seo.sections.workforce.title"), path: "/nursing" },
        ]}
      />

      <GermanyWorkforceModule />

      <section id="workforce-calculator" className="pt-8 md:pt-10">
        <WorkforceCalculator />
      </section>
    </main>
  );
}

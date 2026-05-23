import { Link } from "react-router-dom";
import { m } from "motion/react";
import { ArrowRight, Plane } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../../seo/seo-manager";
import { Breadcrumbs } from "../../components/layout/breadcrumbs";
import { ChancenkarteTimeline } from "../../components/germany/chancenkarte-timeline";
import { ChancenkarteFinalCta } from "../../sections/germany/chancenkarte-final-cta";
import { useLocalizedPath } from "../../components/germany/useLocalizedPath";

export function GermanyRelocationPage() {
  const { t, dir } = useLanguage();
  const localizedPath = useLocalizedPath();
  return (
    <main dir={dir} className="bg-slate-50 dark:bg-slate-950">
      <SeoManager path="/germany-relocation" pageKey="germanyRelocation" />
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-500">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[38rem] h-[38rem] bg-accent-tech/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[34rem] h-[34rem] bg-accent-success/8 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
          </div>
        </div>
        <div className="relative max-w-5xl mx-auto">
          <Breadcrumbs
            items={[
              { label: t<string>("common.home"), href: localizedPath("/") },
              { label: "Germany Relocation", href: localizedPath("/germany-relocation") },
            ]}
          />
          <span className="inline-flex items-center gap-3 mt-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
            <Plane className="w-4 h-4 text-accent-tech" />
            {t<string>("germany.relocation.hero.badge")}
          </span>
          <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
            {t<string>("germany.relocation.hero.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            {t<string>("germany.relocation.hero.description")}
          </p>
          <div className="mt-8">
            <Link
              to={localizedPath("/chancenkarte/eligibility")}
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              {t<string>("germany.relocation.hero.cta")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t<readonly { title: string; body: string }[]>("germany.relocation.services").map((s, i) => (
            <m.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <p className="text-sm font-bold text-slate-900 dark:text-white">{s.title}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.body}</p>
            </m.div>
          ))}
        </div>
      </section>

      <ChancenkarteTimeline />
      <ChancenkarteFinalCta />
    </main>
  );
}

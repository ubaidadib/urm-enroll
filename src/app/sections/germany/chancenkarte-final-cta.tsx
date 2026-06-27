import { m } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { useLocalizedPath } from "../../components/germany/useLocalizedPath";

export function ChancenkarteFinalCta() {
  const { t, dir } = useLanguage();
  const localizedPath = useLocalizedPath();

  return (
    <section className="page-section-y px-[var(--content-gutter)] bg-bg-primary relative overflow-hidden transition-colors duration-500" dir={dir}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[38rem] h-[38rem] bg-accent-tech/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[34rem] h-[34rem] bg-accent-success/8 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
      </div>
      <m.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="relative max-w-4xl mx-auto text-center"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-accent-tech">
          {t<string>("germany.meta.tagline")}
        </p>
        <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-text-primary">
          {t<string>("chancenkarte.finalCta.title")}
        </h2>
        <p className="mt-5 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          {t<string>("chancenkarte.finalCta.description")}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={localizedPath("/chancenkarte/eligibility")}
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl btn-gold-primary font-bold hover:-translate-y-0.5 hover:shadow-xl transition-all"
          >
            {t<string>("chancenkarte.finalCta.primary")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to={localizedPath("/contact")}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border/50 bg-bg-surface text-text-primary hover:border-accent-tech/40 shadow-sm transition-all font-semibold"
          >
            <MessageCircle className="w-4 h-4 text-accent-tech" />
            {t<string>("chancenkarte.finalCta.secondary")}
          </Link>
        </div>
      </m.div>
    </section>
  );
}

import { m } from "motion/react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../seo/seo-manager";

export function LegalNotFound() {
  const { t } = useLanguage();

  return (
    <section className="max-w-3xl mx-auto page-gutter py-24">
        <SeoManager pageKey="notFound" noIndex path="/404" />
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-accent-success/20 border border-accent-success/30 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-accent-success" />
          </div>
          <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight mb-3">{t<string>("notFound.title")}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {t<string>("notFound.description")}
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-accent-tech text-ink font-semibold hover:bg-accent-tech/80 transition-all"
          >
            {t<string>("notFound.backHome")}
          </Link>
        </m.div>
    </section>
  );
}

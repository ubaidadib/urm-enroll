import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { ScrollToTop } from "./scroll-to-top";
import { useLanguage } from "@/i18n/language-context";

export function FocusShell() {
  const { dir, language, t } = useLanguage();

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden bg-bg-primary text-text-primary ${dir === "rtl" ? "font-arabic" : ""}`}
      dir={dir}
      lang={language}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 premium-grid opacity-45" />
      <div aria-hidden="true" className="app-noise -z-10" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent-tech focus:text-ink focus:font-semibold focus:text-sm"
      >
        {t<string>("common.skipToContent")}
      </a>
      <ScrollToTop />
      <Header isCompact />
      <main id="main-content" tabIndex={-1} className="relative z-10 pt-14 xl:pt-24 3xl:pt-20">
        <Outlet />
      </main>
    </div>
  );
}

import { Outlet } from "react-router-dom";
import { Header } from "./header.tsx";
import { Footer } from "./footer.tsx";
import { CookieBanner } from "../ui/cookie-banner";
import { ScrollToTop } from "./scroll-to-top";
import { PreferencesToast } from "../ui/preferences-toast";
import { ComparisonFloatingBar } from "../compare/comparison-floating-bar";
import { WhatsAppCTA } from "../germany/whatsapp-cta";
import { useLanguage } from "@/i18n/language-context";

export function AppShell() {
  const { dir, language, t } = useLanguage();

  return (
    <div
      className={`relative min-h-screen bg-bg-primary text-text-primary overflow-x-hidden ${dir === "rtl" ? "font-arabic" : ""}`}
      dir={dir}
      lang={language}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 premium-grid opacity-55" />
      <div aria-hidden="true" className="app-noise -z-10" />
      <div aria-hidden="true" className="ambient-glow ambient-glow-primary w-[36rem] h-[36rem] -top-40 -left-36" />
      <div aria-hidden="true" className="ambient-glow ambient-glow-secondary w-[30rem] h-[30rem] top-[28%] -right-28" />
      <div aria-hidden="true" className="ambient-glow ambient-glow-teal w-[26rem] h-[26rem] bottom-[8%] left-[14%]" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent-tech focus:text-ink focus:font-semibold focus:text-sm"
      >
        {t<string>("common.skipToContent")}
      </a>
      <ScrollToTop />
      <Header />
      <main id="main-content" tabIndex={-1} className="relative z-10 pt-14 xl:pt-24 pb-0">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
      <PreferencesToast />
      <ComparisonFloatingBar />
      <WhatsAppCTA />
    </div>
  );
}

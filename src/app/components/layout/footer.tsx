import { Link } from "react-router-dom";
import {
  Facebook,
  Linkedin,
  Instagram,
  ArrowUp,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  ExternalLink,
  Building2,
  Wallet,
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

const AGENT_PORTAL_URL = "https://agents-portal.enrollurm.com/";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.16 8.16 0 004.77 1.52V7.02a4.85 4.85 0 01-1-.33z" />
    </svg>
  );
}

export function Footer() {
  const { t, dir } = useLanguage();
  const currentYear = new Date().getFullYear();
  const isRtl = dir === "rtl";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCookieSettings = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event("urm:open-cookie-preferences"));
  };

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/urmenroll", label: "Instagram" },
    { icon: Facebook, href: "https://www.facebook.com/URMENROLL", label: "Facebook" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/urm-enroll", label: "LinkedIn" },
    { icon: TikTokIcon, href: "https://www.tiktok.com/@urm.enroll.ltd", label: "TikTok" },
  ];

  const legalLinks = [
    { label: t<string>("footer.legal.privacy"), path: "/privacy" },
    { label: t<string>("footer.legal.terms"), path: "/terms" },
    { label: t<string>("footer.legal.cookies"), path: "/cookies" },
    { label: t<string>("footer.legal.impressum"), path: "/impressum" },
  ];

  return (
    <footer className="relative w-full overflow-hidden border-t border-border/50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 premium-grid opacity-30" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-bg-secondary/60 to-bg-primary"
      />

      <div className="relative z-10 border-t border-border/40 bg-bg-surface/88 backdrop-blur-xl shadow-[var(--surface-shadow)]">
        <div className="content-shell mx-auto w-full px-4 sm:px-6 lg:px-8 3xl:px-10 4xl:px-12 py-10 md:py-12 lg:py-14 3xl:py-16">
          {/* Brand + navigation links */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
            <div className="space-y-5 lg:col-span-4 xl:col-span-4">
              <Link to="/" className="group flex w-fit items-center gap-3" aria-label="URM ENROLL — Home">
                <img
                  src="/img/logo-mark.png"
                  alt=""
                  aria-hidden="true"
                  className="h-11 w-11 shrink-0 object-contain block dark:hidden"
                  draggable={false}
                />
                <img
                  src="/img/logo-mark-light.png"
                  alt=""
                  aria-hidden="true"
                  className="h-11 w-11 shrink-0 object-contain hidden dark:block"
                  draggable={false}
                />
                <div>
                  <span className="block text-[15px] font-black leading-none tracking-tight text-text-primary transition-colors duration-200 group-hover:text-accent-primary">
                    URM <span className="text-accent-primary">ENROLL</span>
                  </span>
                  <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted">
                    Your Bridge to Global Education
                  </span>
                </div>
              </Link>

              <p className="max-w-sm text-sm leading-relaxed text-text-secondary">{t<string>("footer.description")}</p>

              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${social.label} profile`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/55 bg-background-primary/80 text-text-secondary transition-all duration-200 hover:border-accent-tech/55 hover:bg-background-hover hover:text-text-primary"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 xl:col-span-8">
              <FooterColumn
                title={t<string>("footer.journeys.studyTitle")}
                links={[
                  { href: "/universities", label: t<string>("footer.journeys.universities") },
                  { href: "/programs", label: t<string>("footer.journeys.programs") },
                  { href: "/destinations", label: t<string>("footer.destinations") },
                  { href: "/quiz", label: t<string>("footer.journeys.quiz") },
                ]}
              />

              <FooterColumn
                title={t<string>("footer.journeys.germanyTitle")}
                links={[
                  { href: "/services", label: t<string>("footer.services") },
                  { href: "/nursing", label: t<string>("footer.explore.nursingProgram") },
                  { href: "/germany-jobs", label: t<string>("footer.journeys.germanyJobs") },
                  { href: "/chancenkarte", label: t<string>("footer.journeys.chancenkarte") },
                ]}
              />

              <FooterColumn
                className="col-span-2 sm:col-span-1"
                title={t<string>("footer.journeys.supportTitle")}
                links={[
                  { href: "/about", label: t<string>("footer.journeys.about") },
                  { href: "/contact", label: t<string>("footer.journeys.contact") },
                  { href: "/compare", label: t<string>("header.nav.compare") },
                  { href: "/resources", label: t<string>("footer.resourcesTitle") },
                ]}
              />
            </div>
          </div>

          {/* Partner cards */}
          <section
            aria-labelledby="footer-partners-heading"
            className="mt-10 border-t border-border/50 pt-10 md:mt-12 md:pt-12"
          >
            <h2
              id="footer-partners-heading"
              className="mb-5 text-xs font-semibold uppercase tracking-[0.17em] text-text-muted"
            >
              {t<string>("footer.partnersTitle")}
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <a
                href={AGENT_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-2xl border border-accent-primary/20 bg-accent-primary/6 p-4 transition-all duration-200 hover:border-accent-primary/45 hover:bg-accent-primary/10"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-primary/12">
                  <Wallet className="h-4 w-4 text-accent-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-text-primary">{t<string>("header.nav.agentPortal")}</p>
                    <ExternalLink className="h-3 w-3 text-text-muted transition-colors group-hover:text-accent-primary" />
                  </div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-accent-primary">
                    {t<string>("footer.partners.agentsAudience")}
                  </p>
                  <p className="text-xs leading-relaxed text-text-secondary">{t<string>("footer.partners.agentsDescription")}</p>
                </div>
              </a>

              <Link
                to="/partnerships"
                className="group flex items-start gap-3 rounded-2xl border border-accent-tech/20 bg-accent-tech/5 p-4 transition-all duration-200 hover:border-accent-tech/45 hover:bg-accent-tech/10"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-tech/12">
                  <Building2 className="h-4 w-4 text-accent-tech" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-0.5 text-sm font-semibold text-text-primary">{t<string>("footer.partners.institutionsTitle")}</p>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-accent-tech">
                    {t<string>("footer.partners.institutionsAudience")}
                  </p>
                  <p className="text-xs leading-relaxed text-text-secondary">
                    {t<string>("footer.partners.institutionsDescription")}
                  </p>
                </div>
              </Link>
            </div>
          </section>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TrustBadge
              icon={ShieldCheck}
              title={t<string>("footer.badges.gdpr.title")}
              note={t<string>("footer.badges.gdpr.note")}
              tone="success"
            />
            <TrustBadge
              icon={Globe}
              title={t<string>("footer.badges.network.title")}
              note={t<string>("footer.badges.network.note")}
              tone="info"
            />
          </div>

          {/* Legal bar */}
          <div
            className={`mt-8 flex flex-col gap-5 border-t border-border/55 pt-8 md:mt-10 md:gap-6 md:pt-8 lg:flex-row lg:items-end lg:justify-between ${isRtl ? "lg:flex-row-reverse" : ""}`}
          >
            <div className={`space-y-3 text-center lg:text-start ${isRtl ? "lg:text-end" : ""}`}>
              <p className="text-xs leading-relaxed text-text-muted">
                {`© ${currentYear} ${t<string>("seo.siteName")}. ${t<string>("footer.legal.rights")}`}
              </p>
              <p className="text-[11px] leading-relaxed text-text-muted/90">{t<string>("footer.legal.registration")}</p>

              <nav
                aria-label="Legal"
                className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-start ${isRtl ? "lg:justify-end" : ""}`}
              >
                {legalLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="group inline-flex items-center gap-1 text-xs text-text-secondary transition-colors duration-200 hover:text-text-primary"
                  >
                    {item.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-70" />
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={openCookieSettings}
                  className="group inline-flex items-center gap-1 text-xs text-text-secondary transition-colors duration-200 hover:text-text-primary"
                >
                  {t<string>("footer.legal.cookieSettings")}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-70" />
                </button>
              </nav>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-center rounded-full border border-border/60 bg-background-surface px-4 py-2.5 text-xs font-semibold text-text-secondary transition-all duration-200 hover:border-accent-tech/60 hover:bg-background-hover hover:text-text-primary lg:self-auto"
            >
              {t<string>("footer.backToTop")}
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  className = "",
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.17em] text-text-muted">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              to={link.href}
              className="group inline-flex min-h-9 items-center gap-2 py-0.5 text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary sm:min-h-0"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-tech/50 transition-colors group-hover:bg-accent-primary" />
              <span className="group-hover:underline group-hover:decoration-accent-primary/40 group-hover:underline-offset-4">
                {link.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrustBadge({
  icon: Icon,
  title,
  note,
  tone,
}: {
  icon: typeof ShieldCheck;
  title: string;
  note: string;
  tone: "success" | "info";
}) {
  const iconWrapClass =
    tone === "success"
      ? "bg-success/15 text-success"
      : "bg-info/15 text-info";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/55 bg-background-primary/70 p-3.5">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconWrapClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-text-primary">{title}</p>
        <p className="text-[10px] leading-snug text-text-muted">{note}</p>
      </div>
    </div>
  );
}

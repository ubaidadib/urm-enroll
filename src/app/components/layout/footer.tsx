import { Link } from "react-router-dom";
import { Facebook, Linkedin, Instagram, ArrowUpRight, ShieldCheck, Globe, ExternalLink, Building2, Wallet } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCookieSettings = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event("urm:open-cookie-preferences"));
  };

  return (
    <footer className="relative w-full border-t border-border/50 overflow-hidden">
      <div className="absolute inset-0 premium-grid opacity-35 pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-bg-secondary/70 to-bg-primary pointer-events-none" />

      <div className="relative z-10 w-full bg-background-surface/82 backdrop-blur-xl shadow-[0_22px_52px_rgba(6,19,42,0.2)]">
          <div className="w-full px-6 sm:px-8 lg:px-10 py-10 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto">
              <div className="lg:col-span-4 space-y-6">
                <Link to="/" className="group flex items-center gap-3 w-fit" aria-label="URM ENROLL — Home">
                  {/* Real brand mark — light variant for the dark footer */}
                  <img
                    src="/img/logo-mark-light.png"
                    alt=""
                    aria-hidden="true"
                    className="h-12 w-12 shrink-0 object-contain"
                    draggable={false}
                  />
                  {/* Brand wordmark */}
                  <div>
                    <span className="block text-[15px] font-black tracking-tight text-text-primary leading-none group-hover:text-accent-primary transition-colors duration-200">
                      URM <span className="text-accent-primary">ENROLL</span>
                    </span>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted mt-1">
                      Your Bridge to Global Education
                    </span>
                  </div>
                </Link>

                <p className="text-sm text-text-secondary leading-relaxed max-w-sm">{t<string>("footer.description")}</p>

                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: Instagram, href: "https://www.instagram.com/urmenroll", label: "Instagram" },
                    { icon: Facebook, href: "https://www.facebook.com/URMENROLL", label: "Facebook" },
                    { icon: Linkedin, href: "https://www.linkedin.com/company/urm-enroll", label: "LinkedIn" },
                    { icon: TikTokIcon, href: "https://www.tiktok.com/@urm.enroll.ltd", label: "TikTok" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit our ${social.label} profile`}
                      className="w-10 h-10 rounded-xl border border-border/55 bg-background-primary/85 text-text-secondary hover:text-text-primary hover:border-accent-tech/55 transition-all flex items-center justify-center"
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

                {/* Agent Platform — spans full width on mobile, own column on lg */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <h3 className="text-xs uppercase tracking-[0.17em] font-semibold text-text-muted mb-4">
                    {t<string>("footer.partnersTitle")}
                  </h3>

                  {/* Card 1 — Agents (individuals, earn commissions) */}
                  <a
                    href="https://agents-portal.enrollurm.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 rounded-2xl p-4 mb-3 transition-all duration-300"
                    style={{ background: "rgba(212,175,55,0.06)", border: "1.5px solid rgba(212,175,55,0.2)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.45)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.2)"; }}
                  >
                    <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5" style={{ background: "rgba(212,175,55,0.12)" }}>
                      <Wallet className="w-4 h-4" style={{ color: "rgb(212,175,55)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-sm font-semibold text-text-primary">{t<string>("header.nav.agentPortal")}</p>
                        <ExternalLink className="w-3 h-3 text-text-muted" />
                      </div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "rgb(212,175,55)" }}>For Individuals</p>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Refer students and earn commissions — a flexible side income. No company required.
                      </p>
                    </div>
                  </a>

                  {/* Card 2 — Institutions (universities joining URM Nexus) */}
                  <Link
                    to="/partnerships"
                    className="group flex items-start gap-3 rounded-2xl p-4 transition-all duration-300"
                    style={{ background: "rgba(0,184,217,0.05)", border: "1.5px solid rgba(0,184,217,0.2)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,184,217,0.45)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,184,217,0.2)"; }}
                  >
                    <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5" style={{ background: "rgba(0,184,217,0.12)" }}>
                      <Building2 className="w-4 h-4" style={{ color: "rgb(0,184,217)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary mb-0.5">Partner With Us</p>
                      <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "rgb(0,184,217)" }}>For Institutions</p>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Universities &amp; schools — join the URM Nexus network and recruit globally.
                      </p>
                    </div>
                  </Link>

                  <ul className="space-y-2.5 mt-4">
                    {[
                      { href: "/about", label: "About URM" },
                      { href: "/contact", label: "Contact Support" },
                    ].map((link) => (
                      <li key={link.href}>
                        <Link to={link.href} className="group inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-primary/60 group-hover:bg-accent-primary transition-colors" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* Trust badges inside partner column */}
                  <div className="mt-5 space-y-2">
                    <div className="rounded-xl border border-border/55 bg-background-primary/70 p-3 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-primary">{t<string>("footer.badges.gdpr.title")}</p>
                        <p className="text-[10px] text-text-muted">{t<string>("footer.badges.gdpr.note")}</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/55 bg-background-primary/70 p-3 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0">
                        <Globe className="w-3.5 h-3.5 text-cyan-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-primary">{t<string>("footer.badges.network.title")}</p>
                        <p className="text-[10px] text-text-muted">{t<string>("footer.badges.network.note")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`mt-8 pt-8 border-t border-border/55 flex flex-col-reverse md:flex-row gap-4 items-center justify-between max-w-7xl mx-auto ${dir === "rtl" ? "md:flex-row-reverse" : ""}`}>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <span className="text-xs text-text-muted">{`© ${currentYear} ${t<string>("seo.siteName")}. ${t<string>("footer.legal.rights")}`}</span>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {[
                    { label: t<string>("footer.legal.privacy"), path: "/privacy" },
                    { label: t<string>("footer.legal.terms"), path: "/terms" },
                    { label: t<string>("footer.legal.cookies"), path: "/cookies" },
                    { label: t<string>("footer.legal.impressum"), path: "/impressum" },
                  ].map((item) => (
                    <Link key={item.path} to={item.path} className="text-xs text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-1 group">
                      {item.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={openCookieSettings}
                    className="text-xs text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {t<string>("footer.legal.cookieSettings")}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>

              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background-surface px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:border-accent-tech/60 transition-all"
              >
                {t<string>("footer.backToTop")}
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.17em] font-semibold text-text-muted mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link to={link.href} className="group inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-tech/60 group-hover:bg-accent-primary transition-colors" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Facebook, Linkedin, Instagram, ArrowUpRight, ShieldCheck, Globe } from "lucide-react";
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

  return (
    <footer className="relative w-full border-t border-border/50 overflow-hidden">
      <div className="absolute inset-0 premium-grid opacity-35 pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-bg-secondary/70 to-bg-primary pointer-events-none" />

      <div className="relative z-10 w-full bg-background-surface/82 backdrop-blur-xl shadow-[0_22px_52px_rgba(6,19,42,0.2)]">
          <div className="w-full px-6 sm:px-8 lg:px-10 py-10 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto">
              <div className="lg:col-span-4 space-y-6">
                <Link to="/" className="group flex items-center gap-3 w-fit" aria-label="URM ENROLL — Home">
                  {/* Square icon mark — always visible on any background */}
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-border/40 shadow-sm group-hover:shadow-md transition-shadow duration-200">
                    <img
                      src="/img/logo-favicon.png"
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </div>
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

                <div>
                  <h3 className="text-xs uppercase tracking-[0.17em] font-semibold text-text-muted mb-4">
                    {t<string>("footer.accreditationTitle")}
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-border/55 bg-background-primary/70 p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-primary">{t<string>("footer.badges.gdpr.title")}</p>
                        <p className="text-[10px] text-text-muted">{t<string>("footer.badges.gdpr.note")}</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/55 bg-background-primary/70 p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-cyan-500" />
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

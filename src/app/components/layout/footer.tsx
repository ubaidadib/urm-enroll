import { Link } from "react-router-dom";
import { useMemo, useState, type FormEvent } from "react";
import {
  Facebook,
  Linkedin,
  Instagram,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  Building2,
  Wallet,
  Mail,
  Lock,
  Sparkles,
} from "lucide-react";
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
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const footerSections = useMemo(
    () => [
      {
        title: "Company",
        links: [
          { href: "/about", label: "About URM" },
          { href: "/services", label: t<string>("footer.services") },
          { href: "/partnerships", label: t<string>("footer.explore.forInstitutions") },
        ],
      },
      {
        title: "Programs",
        links: [
          { href: "/programs", label: t<string>("footer.journeys.programs") },
          { href: "/universities", label: t<string>("footer.journeys.universities") },
          { href: "/quiz", label: t<string>("footer.journeys.quiz") },
        ],
      },
      {
        title: "Destinations",
        links: [
          { href: "/destinations", label: t<string>("footer.destinations") },
          { href: "/chancenkarte", label: t<string>("footer.journeys.chancenkarte") },
          { href: "/germany-jobs", label: t<string>("footer.journeys.germanyJobs") },
        ],
      },
      {
        title: "Help",
        links: [
          { href: "/contact", label: "Contact & Book" },
          { href: "/resources/how-to-apply-german-university", label: "How To Apply" },
          { href: "/resources/student-visa-germany-guide", label: "Visa Guide" },
        ],
      },
    ],
    [t],
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCookieSettings = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event("urm:open-cookie-preferences"));
  };

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = newsletterEmail.trim();
    if (!email) return;
    window.location.href = `/contact?topic=newsletter&subject=${encodeURIComponent("Newsletter subscription")}&message=${encodeURIComponent(email)}`;
  };

  return (
    <footer className="relative w-full overflow-hidden border-t border-border/60 bg-bg-secondary text-text-primary">
      <div className="pointer-events-none absolute inset-0 premium-grid opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-bg-secondary/80 to-bg-primary" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
        <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-bg-surface/88 p-8 shadow-[0_24px_60px_rgba(7,18,40,0.15)] backdrop-blur-xl md:p-12">
          <div className="pointer-events-none absolute -top-28 -right-20 h-64 w-64 rounded-full bg-accent-primary/16 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-accent-tech/14 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-tech">Admissions Support</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-text-primary sm:text-4xl">
                Ready to Start Your Study Journey?
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
                Talk to an advisor, build your shortlist, and move from program discovery to application with a clear plan.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent-primary px-6 py-3 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Book A Free Consultation
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/programs"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border-strong bg-bg-primary/70 px-6 py-3 text-sm font-semibold text-text-primary transition-all hover:-translate-y-0.5 hover:border-accent-tech/60"
                >
                  Explore Programs
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="rounded-3xl border border-border/70 bg-bg-primary/72 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-2xl bg-accent-primary/14 p-3 text-accent-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary">Weekly Admissions Brief</p>
                  <p className="mt-1 text-xs text-text-muted">Updates on intakes, visas, and scholarships.</p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="footer-newsletter-email">Email address</label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 rounded-2xl border border-border bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-4 focus:ring-accent-primary/10"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-accent-tech/35 bg-bg-surface px-4 py-3 text-sm font-semibold text-text-primary transition-all hover:-translate-y-0.5 hover:border-accent-tech/65"
                >
                  <Mail className="h-4 w-4" />
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="mt-14 border-t border-border/60 pt-12">
          <div className="mb-10 flex items-start justify-between gap-6">
            <Link to="/" className="group inline-flex items-center gap-3" aria-label="URM ENROLL — Home">
              <img src="/img/logo-mark.png" alt="" aria-hidden="true" className="h-11 w-11 shrink-0 object-contain dark:hidden" draggable={false} />
              <img src="/img/logo-mark-light.png" alt="" aria-hidden="true" className="hidden h-11 w-11 shrink-0 object-contain dark:block" draggable={false} />
              <div>
                <span className="block text-[15px] font-black tracking-tight leading-none text-text-primary transition-colors group-hover:text-accent-primary">
                  URM <span className="text-accent-primary">ENROLL</span>
                </span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                  Global Student Admissions
                </span>
              </div>
            </Link>

            <div className="hidden gap-2 sm:flex">
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
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-bg-surface text-text-secondary transition-all hover:-translate-y-0.5 hover:border-accent-tech/55 hover:text-text-primary"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerSections.map((section) => (
              <FooterColumn key={section.title} title={section.title} links={section.links} />
            ))}
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {[
              { title: t<string>("footer.badges.gdpr.title"), note: t<string>("footer.badges.gdpr.note"), icon: ShieldCheck },
              { title: t<string>("footer.badges.icef.title"), note: t<string>("footer.badges.icef.note"), icon: Lock },
              { title: t<string>("footer.badges.network.title"), note: t<string>("footer.badges.network.note"), icon: Globe },
            ].map(({ title, note, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-border bg-bg-surface/85 p-4 shadow-sm">
                <Icon className="h-4 w-4 text-accent-tech" />
                <p className="mt-3 text-sm font-semibold text-text-primary">{title}</p>
                <p className="mt-1 text-xs text-text-muted">{note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`mt-12 border-t border-border/60 pt-7 ${dir === "rtl" ? "text-right" : ""}`}>
          <div className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${dir === "rtl" ? "md:flex-row-reverse" : ""}`}>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-secondary">
              <span className="text-text-muted">{`© ${currentYear} ${t<string>("seo.siteName")}. ${t<string>("footer.legal.rights")}`}</span>
              {[
                { label: t<string>("footer.legal.privacy"), path: "/privacy" },
                { label: t<string>("footer.legal.terms"), path: "/terms" },
                { label: t<string>("footer.legal.cookies"), path: "/cookies" },
                { label: t<string>("footer.legal.impressum"), path: "/impressum" },
              ].map((item) => (
                <Link key={item.path} to={item.path} className="group inline-flex items-center gap-1 transition-colors hover:text-text-primary">
                  {item.label}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
              <button
                type="button"
                onClick={openCookieSettings}
                className="group inline-flex items-center gap-1 transition-colors hover:text-text-primary"
              >
                {t<string>("footer.legal.cookieSettings")}
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://agents-portal.enrollurm.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-surface px-3 py-2 text-xs font-semibold text-text-secondary transition-all hover:border-accent-primary/55 hover:text-text-primary"
              >
                <Wallet className="h-3.5 w-3.5" />
                {t<string>("header.nav.agentPortal")}
              </a>
              <Link
                to="/partnerships"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-surface px-3 py-2 text-xs font-semibold text-text-secondary transition-all hover:border-accent-tech/55 hover:text-text-primary"
              >
                <Building2 className="h-3.5 w-3.5" />
                Partner With Us
              </Link>
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-surface px-3 py-2 text-xs font-semibold text-text-secondary transition-all hover:-translate-y-0.5 hover:border-accent-tech/60 hover:text-text-primary"
              >
                {t<string>("footer.backToTop")}
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </section>
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
            <Link to={link.href} className="group inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-tech/60 group-hover:bg-accent-primary transition-colors" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import {
  Menu,
  X,
  Globe2,
  ChevronRight,
  Sparkles,
  Heart,
  Compass,
  BookCheck,
  Briefcase,
  ArrowUpRight,
  LayoutDashboard,
  ExternalLink,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { languageOptions, useLanguage } from "@/i18n/language-context";
import { ThemeToggle } from "../ui/theme-toggle";
import { useTheme } from "../ui/theme-provider";
import { hasSavedLanguageChoice } from "@/i18n/detectLanguage";
import { SEO_EVENTS } from "@/lib/analytics";
import { useFavorites } from "@/app/context/favorites-context";
import { NavDropdown } from "../ui/nav-dropdown";

const DESKTOP_PRIMARY_ITEMS = [
  { href: "/universities", labelKey: "header.nav.universities" },
  { href: "/programs", labelKey: "header.nav.programs" },
  { href: "/nursing", labelKey: "header.nav.nursing" },
  { href: "/chancenkarte", labelKey: "header.nav.chancenkarte" },
];

const MOBILE_PRIMARY_ITEMS = [
  { href: "/universities", labelKey: "header.nav.universities" },
  { href: "/programs", labelKey: "header.nav.programs" },
  { href: "/nursing", labelKey: "header.nav.nursing" },
  { href: "/chancenkarte", labelKey: "header.nav.chancenkarte" },
  { href: "/contact", labelKey: "header.nav.chatWithUs" },
];

const MOBILE_SECONDARY_ITEMS = [
  { href: "/destinations", labelKey: "header.nav.destinations" },
  { href: "/compare", labelKey: "header.nav.compare" },
  { href: "/services", labelKey: "header.nav.services" },
  { href: "/about", labelKey: "header.nav.about" },
];

const AGENT_PORTAL_URL = "https://agents-portal.enrollurm.com/";

type HeaderProps = {
  isCompact?: boolean;
};

type NavItem = {
  href: string;
  labelKey: string;
};

export function Header({ isCompact = false }: HeaderProps) {
  const { language, setLanguage, resetLanguageToAuto, t, dir } = useLanguage();
  const { themeSource, setTheme } = useTheme();
  const { totalFavoritesCount } = useFavorites();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [hasSavedPreferences, setHasSavedPreferences] = useState(false);
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);

  const { scrollY } = useScroll();
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/^\/(en|de|ar)(?=\/|$)/, "") || "/";
  const isNavActive = (href: string) => normalizedPath === href || normalizedPath.startsWith(`${href}/`);

  const moreDropdownItems = [
    {
      href: "/destinations",
      label: t<string>("header.nav.destinations"),
      icon: <Compass className="w-4 h-4" />,
    },
    {
      href: "/compare",
      label: t<string>("header.nav.compare"),
      icon: <BookCheck className="w-4 h-4" />,
    },
    {
      href: "/contact",
      label: t<string>("header.nav.chatWithUs"),
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      href: "/services",
      label: t<string>("header.nav.services"),
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      href: "/about",
      label: t<string>("header.nav.about"),
      icon: <ArrowUpRight className="w-4 h-4" />,
    },
    {
      href: "https://agents-portal.enrollurm.com/",
      label: t<string>("header.nav.agentPortal"),
      icon: <LayoutDashboard className="w-4 h-4" />,
      external: true,
    },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrolled = latest > 20;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  });

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsLanguageOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isMobileMenuOpen) {
        mobileMenuBtnRef.current?.focus();
      }
      setIsMobileMenuOpen(false);
      setIsLanguageOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setHasSavedPreferences(themeSource === "manual" || hasSavedLanguageChoice());
  }, [themeSource, language]);

  const handleResetToSystemDefaults = () => {
    resetLanguageToAuto();
    setTheme("system");
    setIsLanguageOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass-nav border-b border-border/70 shadow-[0_16px_36px_rgba(8,23,52,0.24)]"
            : "bg-bg-surface/62 backdrop-blur-xl border-b border-border/35"
        }`}
        style={{ height: isCompact ? 80 : isScrolled ? 88 : 100 }}
      >
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-9 h-full flex items-center justify-between gap-4 lg:gap-10">
          <Link to="/" className="flex items-center gap-3 shrink-0 group min-w-0" aria-label="URM ENROLL — Home">
            {/* Real brand mark — theme-aware (navy on light, white on dark) */}
            <img
              src="/img/logo-mark.png"
              alt=""
              aria-hidden="true"
              className="h-11 w-11 object-contain block dark:hidden"
              draggable={false}
            />
            <img
              src="/img/logo-mark-light.png"
              alt=""
              aria-hidden="true"
              className="h-11 w-11 object-contain hidden dark:block"
              draggable={false}
            />
            <span className="flex flex-col leading-none">
              <span className="text-[19px] font-extrabold tracking-tight text-[#15233F] dark:text-white">
                URM <span className="text-accent-primary">ENROLL</span>
              </span>
              <span className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-text-muted hidden sm:block">
                Your Bridge to Global Education
              </span>
            </span>
          </Link>

          <nav className={`hidden xl:flex items-center gap-1.5 flex-1 justify-center min-w-0 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            {DESKTOP_PRIMARY_ITEMS.map((item) => {
              const isActive = isNavActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`inline-flex items-center whitespace-nowrap rounded-full px-4 py-2.5 text-[14px] font-medium transition-all ${
                    isActive
                      ? "bg-background-hover text-text-primary border border-border/65 shadow-[0_10px_24px_rgba(8,31,80,0.12)]"
                      : "text-text-secondary hover:bg-background-hover hover:text-text-primary"
                  }`}
                >
                  {t<string>(item.labelKey)}
                </Link>
              );
            })}

            <NavDropdown
              title={t<string>("header.nav.exploreMore")}
              items={moreDropdownItems}
              onNavigate={(href) => navigate(href)}
              isActive={moreDropdownItems.some((item) => isNavActive(item.href))}
            />

            <a
              href="https://agents-portal.enrollurm.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t<string>("header.nav.agentPortal")}
              className="ml-1 inline-flex items-center whitespace-nowrap gap-2 px-4 py-2.5 rounded-full text-[14px] font-semibold transition-all hover:-translate-y-[1px]"
              style={{
                background: "rgba(15,28,52,0.85)",
                border: "1.5px solid rgba(212,175,55,0.35)",
                color: "rgb(212,175,55)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.7)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(212,175,55,0.15)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.35)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
              }}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              {t<string>("header.nav.agentPortal")}
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <Link
              to="/partnerships"
              className="ml-1 inline-flex items-center whitespace-nowrap gap-2 px-4 py-2.5 rounded-full bg-linear-to-r from-accent-primary to-accent-tech text-ink text-[14px] font-semibold transition-all hover:-translate-y-[1px] hover:shadow-[0_16px_36px_rgba(30,113,184,0.34)]"
            >
              {t<string>("header.cta")}
              <Sparkles className="w-3.5 h-3.5" />
            </Link>
          </nav>

          <div className={`hidden xl:flex items-center gap-2 shrink-0 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <Link
              to="/saved"
              className="relative hidden xl:flex w-10 h-10 rounded-full border border-border/65 bg-background-surface/92 hover:bg-background-hover hover:border-border transition-all items-center justify-center"
              aria-label={t<string>("header.nav.saved")}
              title={t<string>("header.nav.saved")}
            >
              <Heart className="w-4 h-4 text-text-secondary" />
              {totalFavoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-accent-primary text-ink text-[9px] font-bold flex items-center justify-center leading-none shadow-sm">
                  {totalFavoritesCount > 99 ? "99+" : totalFavoritesCount}
                </span>
              )}
            </Link>

            <div className="hidden lg:block">
              <ThemeToggle iconOnly />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={isLanguageOpen}
                aria-label={`${t<string>("header.selectLanguage")}: ${language.toUpperCase()}`}
                title={`${t<string>("header.selectLanguage")}: ${language.toUpperCase()}`}
                className="h-10 w-10 rounded-full border border-border/65 bg-background-surface/92 hover:bg-background-hover hover:border-border transition-all flex items-center justify-center"
              >
                <Globe2 className="w-3.5 h-3.5 text-text-secondary" />
                <span className="sr-only">{language.toUpperCase()}</span>
              </button>

              <AnimatePresence>
                {isLanguageOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsLanguageOpen(false)} />
                    <m.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      className="absolute right-0 top-full mt-3 w-56 p-2 rounded-2xl border border-border/70 glass-card-medium z-50"
                      role="listbox"
                      aria-label={t<string>("header.selectLanguage")}
                    >
                      <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                        {t<string>("header.selectLanguage")}
                      </p>
                      {languageOptions.map((option) => (
                        <button
                          key={option.code}
                          role="option"
                          aria-selected={language === option.code}
                          onClick={() => {
                            setLanguage(option.code);
                            SEO_EVENTS.LANGUAGE_SWITCHED(option.code);
                            setIsLanguageOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            language === option.code
                              ? "bg-background-hover text-text-primary"
                              : "text-text-secondary hover:bg-background-hover hover:text-text-primary"
                          }`}
                        >
                          {option.nativeLabel}
                        </button>
                      ))}
                      {hasSavedPreferences && (
                        <button
                          onClick={handleResetToSystemDefaults}
                          className="w-full mt-1 pt-2 border-t border-border/60 px-3 py-2.5 rounded-xl text-left text-sm text-text-secondary hover:bg-background-hover hover:text-text-primary transition-all"
                        >
                          {t<string>("header.useSystemDefaults")}
                        </button>
                      )}
                    </m.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            ref={mobileMenuBtnRef}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="xl:hidden relative z-50 min-w-11 min-h-11 rounded-xl border border-border/60 bg-background-surface/80 text-foreground transition-colors hover:bg-background-hover flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <m.div
                  key="close"
                  initial={{ rotate: -80, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 80, opacity: 0 }}
                >
                  <X className="w-5 h-5" />
                </m.div>
              ) : (
                <m.div
                  key="menu"
                  initial={{ rotate: 80, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -80, opacity: 0 }}
                >
                  <Menu className="w-5 h-5" />
                </m.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 xl:hidden"
            style={{
              background: "rgba(4, 13, 32, 0.66)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            <div className="h-full flex flex-col pt-24 px-5 pb-7 overflow-y-auto">
              <div className="glass-card-medium rounded-[1.6rem] p-4">
                <nav className="space-y-1.5">
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted pt-1 pb-1">
                    {t<string>("header.nav.quickLinks")}
                  </p>
                  {MOBILE_PRIMARY_ITEMS.map((item, index) => (
                    <MobileMenuItem
                      key={item.href}
                      item={item}
                      index={index}
                      t={t}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  ))}

                  <div className="h-px bg-border/40 my-3" />
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted pt-1 pb-1">
                    {t<string>("header.nav.exploreMore")}
                  </p>
                  {MOBILE_SECONDARY_ITEMS.map((item, index) => (
                    <MobileMenuItem
                      key={item.href}
                      item={item}
                      index={MOBILE_PRIMARY_ITEMS.length + index}
                      t={t}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  ))}
                </nav>

                <div className="mt-5 space-y-4 pt-4 border-t border-border/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2.5">{t<string>("header.appearance")}</p>
                      <ThemeToggle />
                    </div>

                    <div>
                      <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2.5">{t<string>("header.language")}</p>
                      <div className="flex flex-wrap gap-2">
                        {languageOptions.map((opt) => (
                          <button
                            key={opt.code}
                            onClick={() => {
                              setLanguage(opt.code);
                              SEO_EVENTS.LANGUAGE_SWITCHED(opt.code);
                            }}
                            className={`text-xs px-3 py-1.5 rounded-full border ${
                              language === opt.code
                                ? "border-accent-tech/80 bg-accent-tech/12 text-accent-tech"
                                : "border-border text-text-secondary"
                            }`}
                          >
                            {opt.code.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      {hasSavedPreferences && (
                        <button
                          onClick={handleResetToSystemDefaults}
                          className="mt-2 text-xs px-3 py-1.5 rounded-full border border-border text-text-secondary hover:text-text-primary hover:border-accent-tech/60 transition-all"
                        >
                          {t<string>("header.useSystemDefaults")}
                        </button>
                      )}
                    </div>
                  </div>

                  <Link
                    to="/saved"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 border border-border rounded-2xl font-medium text-text-secondary flex items-center justify-center gap-2 hover:bg-background-hover transition-all"
                  >
                    <Heart className="w-4 h-4" />
                    {t<string>("header.nav.saved")}
                    {totalFavoritesCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-accent-primary text-ink text-xs font-bold">
                        {totalFavoritesCount}
                      </span>
                    )}
                  </Link>

                  <a
                    href={AGENT_PORTAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2"
                    style={{
                      background: "rgba(15,28,52,0.9)",
                      border: "1.5px solid rgba(212,175,55,0.4)",
                      color: "rgb(212,175,55)",
                    }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {t<string>("header.nav.agentPortal")}
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  <Link
                    to="/partnerships"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3.5 bg-linear-to-r from-accent-primary to-accent-tech text-ink rounded-2xl font-bold shadow-[0_18px_30px_rgba(24,112,176,0.35)] flex items-center justify-center gap-2"
                  >
                    {t<string>("header.cta")}
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileMenuItem({
  item,
  index,
  t,
  onClick,
}: {
  item: NavItem;
  index: number;
  t: (key: string) => string;
  onClick: () => void;
}) {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/^\/(en|de|ar)(?=\/|$)/, "") || "/";
  const isActive = normalizedPath === item.href || normalizedPath.startsWith(`${item.href}/`);

  return (
    <m.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08 + index * 0.03 }}
    >
      <Link
        to={item.href}
        onClick={onClick}
        className={`group flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
          isActive
            ? "bg-background-hover border border-border/60"
            : "hover:bg-background-hover/70 border border-transparent"
        }`}
      >
        <span className={`text-sm font-medium ${isActive ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"}`}>
          {t(item.labelKey)}
        </span>
        <ChevronRight className={`w-4 h-4 ${isActive ? "text-accent-tech" : "text-text-muted"}`} />
      </Link>
    </m.div>
  );
}

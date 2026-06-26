import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import { useLanguage } from "@/i18n/language-context";
import { ArrowRight, Award, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useExperiment } from "@/hooks/useExperiment";
import { trackExperimentView, trackPersonalizationApplied } from "@/utils/tracking";
import { usePersonalization } from "@/hooks/usePersonalization";
import { useTheme } from "@/app/components/ui/theme-provider";

// ─── Types ──────────────────────────────────────────────────────────────────

interface DestinationCard {
  flag: string;
  country: string;
  programs: string;
  rotation: number;
  floatDelay: number;
  floatDuration: number;
  offset: { x: number; y: number };
}

interface StatItem {
  value: number;
  suffix: string;
  labelKey: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const ROTATING_COUNTRIES = [
  { flag: "🇩🇪", name: "Germany" },
  { flag: "🇬🇧", name: "UK" },
  { flag: "🇹🇷", name: "Turkey" },
  { flag: "🇨🇦", name: "Canada" },
];

const PARTICLES = [
  { size: 3, x: 12, y: 18, delay: 0,    dur: 6.2 },
  { size: 2, x: 24, y: 72, delay: 1.4,  dur: 7.8 },
  { size: 4, x: 38, y: 38, delay: 0.6,  dur: 5.5 },
  { size: 2, x: 62, y: 15, delay: 2.2,  dur: 8.4 },
  { size: 3, x: 78, y: 68, delay: 0.9,  dur: 6.8 },
  { size: 2, x: 88, y: 45, delay: 1.7,  dur: 7.3 },
  { size: 3, x: 52, y: 88, delay: 0.2,  dur: 5.9 },
  { size: 4, x: 6,  y: 55, delay: 2.8,  dur: 9.1 },
  { size: 2, x: 93, y: 80, delay: 1.1,  dur: 7.0 },
];

const DESTINATIONS: DestinationCard[] = [
  { flag: "🇩🇪", country: "Germany",   programs: "3,200+ programs", rotation: -2,  floatDelay: 0,   floatDuration: 3.4, offset: { x: 0,   y: 0   } },
  { flag: "🇬🇧", country: "UK",        programs: "4,800+ programs", rotation:  3,  floatDelay: 0.6, floatDuration: 3.8, offset: { x: 10,  y: -15 } },
  { flag: "🇹🇷", country: "Turkey",    programs: "1,100+ programs", rotation: -4,  floatDelay: 1.1, floatDuration: 4.0, offset: { x: -8,  y: 20  } },
  { flag: "🇨🇦", country: "Canada",    programs: "2,400+ programs", rotation:  2,  floatDelay: 1.6, floatDuration: 3.6, offset: { x: 12,  y: 30  } },
];

const STATS: StatItem[] = [
  { value: 500,  suffix: "+", labelKey: "hero.stats.students_label"     },
  { value: 20,   suffix: "+", labelKey: "hero.stats.universities_label" },
  { value: 10,   suffix: "+", labelKey: "hero.stats.countries_label"    },
  { value: 5,    suffix: "+", labelKey: "hero.stats.years_label"        },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function CountUp({ target, suffix, inView, shouldReduceMotion }: {
  target: number;
  suffix: string;
  inView: boolean;
  shouldReduceMotion: boolean | null;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion) { setCount(target); return; }
    const duration = 1400;
    const startTime = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, shouldReduceMotion]);

  return <>{count}{suffix}</>;
}

function DestinationCardItem({ card, index, shouldReduceMotion }: {
  card: DestinationCard;
  index: number;
  shouldReduceMotion: boolean | null;
}) {
  const floatAnimation = shouldReduceMotion
    ? {}
    : {
        y: [0, -8, 0],
        transition: {
          duration: card.floatDuration,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: card.floatDelay,
        },
      };

  return (
    <m.div
      initial={{ opacity: 0, x: 40, rotate: card.rotation }}
      animate={{ opacity: 1, x: 0, rotate: card.rotation, ...floatAnimation }}
      transition={{
        opacity: { delay: 0.5 + index * 0.15, duration: 0.5 },
        x: { delay: 0.5 + index * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      }}
      style={{ transform: `translate(${card.offset.x}px, ${card.offset.y}px) rotate(${card.rotation}deg)` }}
      className="surface-glass hero-destination-card rounded-2xl p-4 3xl:p-5 hover:border-accent-primary/40 transition-colors duration-300"
    >
      <div className="flex items-center gap-3 mb-1.5">
        <span className="text-2xl 3xl:text-3xl leading-none">{card.flag}</span>
        <span className="text-text-primary font-semibold text-sm 3xl:text-base">{card.country}</span>
      </div>
      <p className="text-text-muted text-xs 3xl:text-sm">{card.programs}</p>
    </m.div>
  );
}

function FloatingParticles({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
  if (shouldReduceMotion) return null;
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <m.div
          key={i}
          className="absolute rounded-full hero-particle"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [-8, 8, -8], opacity: [0.2, 0.55, 0.2] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function DestinationCycler({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const t = setInterval(() => setIdx(i => (i + 1) % ROTATING_COUNTRIES.length), 2200);
    return () => clearInterval(t);
  }, [shouldReduceMotion]);

  return (
    <m.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.35 }}
      className="inline-flex items-center gap-2 mb-4 lg:mb-5"
    >
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hero-live-badge">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <span className="text-xs text-text-muted font-medium">Enrolling in</span>
        <div className="relative overflow-hidden" style={{ height: "1.15em", width: "6rem" }}>
          <AnimatePresence mode="wait">
            <m.span
              key={idx}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="absolute left-0 top-0 text-xs font-semibold text-text-primary flex items-center gap-1 whitespace-nowrap"
            >
              <span>{ROTATING_COUNTRIES[idx]?.flag}</span>
              <span>{ROTATING_COUNTRIES[idx]?.name}</span>
            </m.span>
          </AnimatePresence>
        </div>
      </div>
    </m.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const { t, dir } = useLanguage();
  const { variant: heroVariant } = useExperiment("hero_headline");
  const { resolveContent, isSlotPersonalized, segment } = usePersonalization();
  const { resolvedTheme } = useTheme();

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  useEffect(() => {
    trackExperimentView({ experiment: "hero_headline", variant: heroVariant, page: "home" });
  }, [heroVariant]);

  useEffect(() => {
    if (isSlotPersonalized("hero.title")) {
      trackPersonalizationApplied({
        slot: "hero.title",
        segment,
        contentKey: resolveContent("hero.title"),
      });
    }
  }, [isSlotPersonalized, segment, resolveContent]);

  const headline1: string = t("hero.headline_1");
  const countryWord: string = t("hero.headline_country");
  const headlineParts = headline1.split(countryWord);

  const tickerText: string = t("hero.trust_ticker");
  const isRtl = dir === "rtl";
  const pulseOpacity = resolvedTheme === "dark" ? [0.15, 0.25, 0.15] : [0.08, 0.14, 0.08];

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex flex-col overflow-hidden section-gradient-hero"
    >
      {/* Radial glow blobs + particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute rounded-full hero-ambient-gold"
          style={{
            width: 480,
            height: 480,
            top: "10%",
            left: isRtl ? "auto" : "-8%",
            right: isRtl ? "-8%" : "auto",
          }}
        />
        <div
          className="absolute rounded-full hero-ambient-steel"
          style={{
            width: 420,
            height: 420,
            bottom: "5%",
            right: isRtl ? "auto" : "-4%",
            left: isRtl ? "-4%" : "auto",
          }}
        />
        <div className="absolute inset-0 hero-grid-overlay" />
        <FloatingParticles shouldReduceMotion={shouldReduceMotion} />
      </div>

      {/* ── 1. Trust Bar ─────────────────────────────────────────────────── */}
      <div
        className="relative z-10 border-b trust-bar-surface"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-6 min-w-0">
          {/* ICEF Badge */}
          <a
            href="https://www.icef.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t<string>("icef.accredited")} ${t<string>("icef.member")}`}
            className="shrink-0 flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-accent-primary/30 bg-accent-primary/6 transition-colors duration-200 hover:border-accent-primary/50"
          >
            <Award className="w-4 h-4 text-accent-primary" aria-hidden="true" />
            <div className="leading-none">
              <p className="text-text-primary font-semibold text-xs">{t<string>("hero.icef_label")}</p>
              <p className="text-text-muted text-xs mt-0.5">#6507</p>
            </div>
            <CheckCircle2 className="w-3.5 h-3.5 text-accent-primary" aria-hidden="true" />
          </a>

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px shrink-0 bg-accent-primary/20" />

          {/* Ticker */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <m.div
              aria-hidden="true"
              className="flex gap-16 whitespace-nowrap"
              animate={{ x: isRtl ? ["0%", "50%"] : ["0%", "-50%"] }}
              transition={shouldReduceMotion ? {} : { duration: 22, repeat: Infinity, ease: "linear" }}
            >
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className="text-xs font-medium tracking-wide flex-shrink-0 text-text-muted"
                >
                  {tickerText}
                </span>
              ))}
            </m.div>
            <span className="sr-only">{tickerText}</span>
          </div>
        </div>
      </div>

      {/* ── 2. Main Hero Content ──────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-[var(--content-gutter)] pt-10 sm:pt-14 md:pt-20 lg:pt-12 xl:pt-14 3xl:pt-20 4xl:pt-24 pb-10 sm:pb-14 md:pb-20 lg:pb-12 xl:pb-14 3xl:pb-20 4xl:pb-24 grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-14 3xl:gap-16 items-center min-w-0 w-full">

        {/* Left Column */}
        <div className={isRtl ? "text-right" : "text-left"}>

          {/* Destination cycler badge */}
          <DestinationCycler shouldReduceMotion={shouldReduceMotion} />

          {/* Eyebrow */}
          <m.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] mb-4 lg:mb-4 text-accent-tech"
          >
            {t<string>("hero.eyebrow")}
          </m.p>

          {/* Headline */}
          <m.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              id="hero-title"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[3.75rem] 3xl:text-[4.5rem] 4xl:text-[5.5rem] font-bold leading-[1.08] tracking-tight mb-4 lg:mb-4 text-text-primary"
            >
              {/* Line 1 with gold country word */}
              <span className="block">
                {headlineParts[0]}
                <span className="relative inline-block">
                  <span className="hero-shimmer-text">{countryWord}</span>
                  {/* Animated underline */}
                  <m.span
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                    className="absolute bottom-0.5 left-0 right-0 h-[3px] rounded-full bg-accent-primary"
                  />
                </span>
                {headlineParts[1] ?? ""}
              </span>
              {/* Line 2 */}
              <span className="block mt-1 text-text-secondary">
                {t<string>("hero.headline_2")}
              </span>
            </h1>
          </m.div>

          {/* Subheadline */}
          <m.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.45 }}
            className="text-base sm:text-lg leading-relaxed mb-6 sm:mb-7 lg:mb-6 max-w-xl text-text-muted"
          >
            {t<string>("hero.subheadline")}
          </m.p>

          {/* CTAs */}
          <m.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.45 }}
            className={`flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-4 sm:mb-5 lg:mb-5 ${isRtl ? "sm:flex-row-reverse" : ""}`}
          >
            <Link
              to="/universities"
              aria-label={t<string>("hero.new_cta_primary")}
              className="group inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-8 sm:py-4 rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-[1.03] hover:shadow-xl btn-gold-primary"
            >
              <span>{t<string>("hero.new_cta_primary")}</span>
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
                aria-hidden="true"
              />
            </Link>

            <Link
              to="/programs"
              aria-label={t<string>("hero.new_cta_secondary")}
              className="group inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-8 sm:py-4 rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-[1.02] btn-outline-subtle"
            >
              <span>{t<string>("hero.new_cta_secondary")}</span>
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
                aria-hidden="true"
              />
            </Link>
          </m.div>

          {/* Social proof */}
          <m.div
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}
          >
            <span className="text-base" aria-hidden="true">🎓</span>
            <span className="text-sm text-text-disabled">
              {t<string>("hero.social_proof")}
            </span>
          </m.div>
        </div>

        {/* Right Column — Destination Cards */}
        <m.div
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="hidden lg:flex relative w-full max-w-[420px] xl:max-w-[480px] 3xl:max-w-[560px] justify-self-end items-center justify-center"
          aria-hidden="true"
        >
          {/* Glow background */}
          <div className="absolute inset-0 rounded-3xl hero-cards-ambient pointer-events-none" />

          {/* Subtle pulse ring */}
          {!shouldReduceMotion && (
            <m.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: pulseOpacity,
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none hero-pulse-ring"
              style={{ width: 300, height: 300 }}
            />
          )}

          {/* Orbit ring decorations */}
          {!shouldReduceMotion && (
            <>
              <m.div
                animate={{ rotate: 360 }}
                transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
                className="hero-orbit-ring pointer-events-none"
                style={{ width: 370, height: 370, top: "50%", left: "50%", marginTop: -185, marginLeft: -185 }}
              />
              <m.div
                animate={{ rotate: -360 }}
                transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
                className="hero-orbit-ring-inner pointer-events-none"
                style={{ width: 240, height: 240, top: "50%", left: "50%", marginTop: -120, marginLeft: -120 }}
              />
            </>
          )}

          {/* Card grid */}
          <div className="relative grid grid-cols-2 gap-3 sm:gap-4 p-4 w-full">
            {DESTINATIONS.map((card, i) => (
              <DestinationCardItem
                key={card.country}
                card={card}
                index={i}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>

          {/* Floating label */}
          <m.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full border border-accent-primary/30 bg-bg-secondary/90 text-accent-primary text-xs font-medium whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[rgb(0,184,217)] animate-pulse" />
            10,000+ programs across 4 destinations
          </m.div>
        </m.div>
      </div>

      {/* ── 3. Stats Bar ─────────────────────────────────────────────────── */}
      <div
        ref={statsRef}
        className="relative z-10 border-t stats-bar-surface"
      >
        <div className="max-w-7xl mx-auto px-[var(--content-gutter)] py-7 sm:py-9 md:py-10 lg:py-8 xl:py-9 3xl:py-11 w-full">
          <m.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-7 md:gap-0"
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.labelKey}
                className={`flex flex-col items-center text-center px-4 xl:px-6 border-accent-primary/15 ${
                  i < STATS.length - 1 ? "md:border-r" : ""
                }`}
              >
                <span className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl 3xl:text-5xl font-bold tabular-nums mb-1.5 text-accent-primary">
                  <CountUp
                    target={stat.value}
                    suffix={stat.suffix}
                    inView={statsInView}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                </span>
                <span className="text-xs sm:text-sm 3xl:text-base font-medium text-text-disabled">
                  {t<string>(stat.labelKey)}
                </span>
              </div>
            ))}
          </m.div>
        </div>
      </div>
    </section>
  );
}

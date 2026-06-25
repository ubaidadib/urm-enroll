import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion, useInView } from "motion/react";
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
      className="surface-glass hero-destination-card rounded-2xl p-4 3xl:p-5 4xl:p-6 hover:border-accent-primary/40 transition-colors duration-300"
    >
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl leading-none">{card.flag}</span>
        <span className="text-text-primary font-semibold text-sm 3xl:text-base">{card.country}</span>
      </div>
      <p className="text-text-muted text-xs 3xl:text-sm">{card.programs}</p>
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
      {/* Radial glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute rounded-full hero-ambient-gold"
          style={{
            width: 560,
            height: 560,
            top: "8%",
            left: isRtl ? "auto" : "-10%",
            right: isRtl ? "-10%" : "auto",
          }}
        />
        <div
          className="absolute rounded-full hero-ambient-steel"
          style={{
            width: 480,
            height: 480,
            bottom: "3%",
            right: isRtl ? "auto" : "-5%",
            left: isRtl ? "-5%" : "auto",
          }}
        />
        {/* Teal accent blob */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 360,
            height: 260,
            top: "55%",
            left: isRtl ? "auto" : "25%",
            right: isRtl ? "25%" : "auto",
            background: "radial-gradient(circle, rgba(0,184,217,0.055) 0%, transparent 70%)",
            filter: "blur(72px)",
            opacity: 0.7,
          }}
        />
        <div className="absolute inset-0 hero-grid-overlay" />
      </div>

      {/* ── 1. Trust Bar ─────────────────────────────────────────────────── */}
      <div
        className="relative z-10 border-b trust-bar-surface"
        style={{ animation: "border-glow 4s ease-in-out infinite" }}
      >
        <div className="content-shell mx-auto px-[var(--content-gutter)] py-3 3xl:py-4 flex items-center gap-3 sm:gap-6 3xl:gap-8 min-w-0">
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
      <div className="relative z-10 content-shell mx-auto px-[var(--content-gutter)] py-[var(--hero-y)] grid lg:grid-cols-[minmax(0,1.08fr)_minmax(25rem,0.92fr)] 3xl:grid-cols-[minmax(0,1fr)_minmax(34rem,0.9fr)] gap-8 sm:gap-10 lg:gap-10 xl:gap-14 3xl:gap-20 items-center min-w-0 w-full">

        {/* Left Column */}
        <div className={isRtl ? "text-right" : "text-left"}>

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
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] xl:text-[3.9rem] 3xl:text-[5rem] 4xl:text-[6.25rem] font-bold leading-[1.04] tracking-tight mb-4 lg:mb-5 3xl:mb-7 text-text-primary max-w-[13ch]"
            >
              {/* Line 1 with gold country word */}
              <span className="block">
                {headlineParts[0]}
                <span className="relative inline-block">
                  <span className="text-gradient-gold">{countryWord}</span>
                  {/* Animated underline */}
                  <m.span
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
                    className="absolute -bottom-0.5 left-0 right-0 h-[3px] rounded-full"
                    style={{
                      background: "linear-gradient(90deg, rgba(212,175,55,0.4), rgba(212,175,55,0.95), rgba(212,175,55,0.4))",
                      boxShadow: "0 0 12px rgba(212,175,55,0.45)",
                    }}
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
            className="text-base sm:text-lg 3xl:text-xl 4xl:text-2xl leading-relaxed mb-6 sm:mb-7 lg:mb-8 3xl:mb-10 max-w-2xl text-text-muted"
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
          className="hidden lg:block relative w-full max-w-md 3xl:max-w-xl 4xl:max-w-2xl justify-self-end"
          aria-hidden="true"
        >
          {/* Glow background */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(79,107,138,0.14) 0%, rgba(212,175,55,0.06) 50%, transparent 80%)",
              filter: "blur(32px)",
            }}
          />

          {/* Subtle pulse ring */}
          {!shouldReduceMotion && (
            <m.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: pulseOpacity,
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none hero-pulse-ring"
              style={{ width: "clamp(300px, 18vw, 520px)", height: "clamp(300px, 18vw, 520px)" }}
            />
          )}

          {/* Card grid */}
          <div className="relative grid grid-cols-2 gap-3 3xl:gap-5 p-4 3xl:p-6">
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
        <div className="content-shell mx-auto px-[var(--content-gutter)] py-6 sm:py-8 md:py-10 lg:py-8 3xl:py-10 4xl:py-12 w-full">
          <m.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 3xl:gap-10 md:gap-0"
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.labelKey}
                className={`flex flex-col items-center text-center px-4 border-accent-primary/15 ${
                  i < STATS.length - 1 ? "md:border-r" : ""
                }`}
              >
                <span
                  className="text-3xl sm:text-4xl 3xl:text-5xl font-bold tabular-nums mb-1 3xl:mb-2 text-accent-primary"
                >
                  <CountUp
                    target={stat.value}
                    suffix={stat.suffix}
                    inView={statsInView}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                </span>
                <span className="text-xs sm:text-sm font-medium text-text-disabled">
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

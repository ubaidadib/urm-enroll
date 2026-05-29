import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion, useInView } from "motion/react";
import { useLanguage } from "@/i18n/language-context";
import { ArrowRight, Award, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useExperiment } from "@/hooks/useExperiment";
import { trackExperimentView, trackPersonalizationApplied } from "@/utils/tracking";
import { usePersonalization } from "@/hooks/usePersonalization";

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
      className="bg-[rgba(15,28,52,0.85)] backdrop-blur-md border border-[rgba(212,175,55,0.2)] rounded-2xl p-4 shadow-xl shadow-black/30 hover:border-[rgba(212,175,55,0.4)] transition-colors duration-300"
    >
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl leading-none">{card.flag}</span>
        <span className="text-white font-semibold text-sm">{card.country}</span>
      </div>
      <p className="text-[rgb(145,177,210)] text-xs">{card.programs}</p>
    </m.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const { t, dir } = useLanguage();
  const { variant: heroVariant } = useExperiment("hero_headline");
  const { resolveContent, isSlotPersonalized, segment } = usePersonalization();

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

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(160deg, rgb(5,10,24) 0%, rgb(8,14,28) 40%, rgb(11,21,48) 100%)" }}
    >
      {/* Radial glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full blur-[120px] opacity-20"
          style={{
            width: 600,
            height: 600,
            top: "10%",
            left: isRtl ? "auto" : "-10%",
            right: isRtl ? "-10%" : "auto",
            background: "radial-gradient(circle, rgba(212,175,55,0.35) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full blur-[160px] opacity-15"
          style={{
            width: 500,
            height: 500,
            bottom: "5%",
            right: isRtl ? "auto" : "-5%",
            left: isRtl ? "-5%" : "auto",
            background: "radial-gradient(circle, rgba(79,107,138,0.4) 0%, transparent 70%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.15) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* ── 1. Trust Bar ─────────────────────────────────────────────────── */}
      <div
        className="relative z-10 border-b"
        style={{ borderColor: "rgba(212,175,55,0.2)", background: "rgba(8,14,28,0.6)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
          {/* ICEF Badge */}
          <a
            href="https://www.icef.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ICEF IAS Accredited Agency #6507"
            className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors duration-200 hover:border-[rgba(212,175,55,0.5)]"
            style={{
              borderColor: "rgba(212,175,55,0.3)",
              background: "rgba(212,175,55,0.06)",
            }}
          >
            <Award className="w-4 h-4" style={{ color: "rgb(212,175,55)" }} aria-hidden="true" />
            <div className="leading-none">
              <p className="text-white font-semibold text-xs">{t<string>("hero.icef_label")}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgb(145,177,210)" }}>#6507</p>
            </div>
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "rgb(212,175,55)" }} aria-hidden="true" />
          </a>

          {/* Divider */}
          <div className="h-6 w-px flex-shrink-0" style={{ background: "rgba(212,175,55,0.2)" }} />

          {/* Ticker */}
          <div className="flex-1 overflow-hidden">
            <m.div
              aria-hidden="true"
              className="flex gap-16 whitespace-nowrap"
              animate={{ x: isRtl ? ["0%", "50%"] : ["0%", "-50%"] }}
              transition={shouldReduceMotion ? {} : { duration: 22, repeat: Infinity, ease: "linear" }}
            >
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className="text-xs font-medium tracking-wide flex-shrink-0"
                  style={{ color: "rgb(145,177,210)" }}
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 md:pt-24 md:pb-20 grid lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-center">

        {/* Left Column */}
        <div className={isRtl ? "text-right" : "text-left"}>

          {/* Eyebrow */}
          <m.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] mb-5"
            style={{ color: "rgb(0,184,217)" }}
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
              className="text-4xl sm:text-5xl lg:text-[3.4rem] xl:text-[4rem] font-bold leading-[1.1] tracking-tight mb-5"
              style={{ color: "rgb(248,250,252)" }}
            >
              {/* Line 1 with gold country word */}
              <span className="block">
                {headlineParts[0]}
                <span className="relative inline-block">
                  <span style={{ color: "rgb(212,175,55)" }}>{countryWord}</span>
                  {/* Animated underline */}
                  <m.span
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                    className="absolute bottom-0.5 left-0 right-0 h-[3px] rounded-full"
                    style={{
                      background: "rgb(212,175,55)",
                      transformOrigin: isRtl ? "right" : "left",
                    }}
                  />
                </span>
                {headlineParts[1] ?? ""}
              </span>
              {/* Line 2 */}
              <span className="block mt-1" style={{ color: "rgb(212,224,239)" }}>
                {t<string>("hero.headline_2")}
              </span>
            </h1>
          </m.div>

          {/* Subheadline */}
          <m.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.45 }}
            className="text-base sm:text-lg leading-relaxed mb-9 max-w-xl"
            style={{ color: "rgb(145,177,210)" }}
          >
            {t<string>("hero.subheadline")}
          </m.p>

          {/* CTAs */}
          <m.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.45 }}
            className={`flex flex-col sm:flex-row gap-3 mb-7 ${isRtl ? "sm:flex-row-reverse" : ""}`}
          >
            <Link
              to="/universities"
              aria-label={t<string>("hero.new_cta_primary")}
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-200 hover:scale-[1.03] hover:shadow-xl"
              style={{
                background: "rgb(212,175,55)",
                color: "rgb(8,14,28)",
                boxShadow: "0 4px 24px rgba(212,175,55,0.25)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(212,175,55,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 24px rgba(212,175,55,0.25)";
              }}
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
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-200 hover:scale-[1.02]"
              style={{
                border: "1.5px solid rgba(212,224,239,0.25)",
                color: "rgb(212,224,239)",
                background: "rgba(255,255,255,0.04)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.09)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,224,239,0.25)";
              }}
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
            <span className="text-sm" style={{ color: "rgb(105,133,166)" }}>
              {t<string>("hero.social_proof")}
            </span>
          </m.div>
        </div>

        {/* Right Column — Destination Cards */}
        <m.div
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="hidden lg:block relative"
          aria-hidden="true"
        >
          {/* Glow background */}
          <div
            className="absolute inset-0 rounded-3xl blur-3xl opacity-60 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(79,107,138,0.25) 0%, rgba(11,21,48,0.4) 70%)",
            }}
          />

          {/* Teal pulse ring */}
          {!shouldReduceMotion && (
            <m.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                width: 320,
                height: 320,
                background: "radial-gradient(circle, rgba(0,184,217,0.2) 0%, transparent 70%)",
              }}
            />
          )}

          {/* Card grid */}
          <div className="relative grid grid-cols-2 gap-4 p-6">
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
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium whitespace-nowrap"
            style={{
              background: "rgba(8,14,28,0.9)",
              borderColor: "rgba(212,175,55,0.3)",
              color: "rgb(212,175,55)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[rgb(0,184,217)] animate-pulse" />
            10,000+ programs across 4 destinations
          </m.div>
        </m.div>
      </div>

      {/* ── 3. Stats Bar ─────────────────────────────────────────────────── */}
      <div
        ref={statsRef}
        className="relative z-10 border-t"
        style={{ borderColor: "rgba(212,175,55,0.12)", background: "rgba(5,10,24,0.6)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-10">
          <m.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0"
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.labelKey}
                className={`flex flex-col items-center text-center px-4 ${
                  i < STATS.length - 1 ? "md:border-r" : ""
                }`}
                style={{ borderColor: "rgba(212,175,55,0.15)" }}
              >
                <span
                  className="text-3xl sm:text-4xl font-bold tabular-nums mb-1"
                  style={{ color: "rgb(212,175,55)" }}
                >
                  <CountUp
                    target={stat.value}
                    suffix={stat.suffix}
                    inView={statsInView}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                </span>
                <span className="text-xs sm:text-sm font-medium" style={{ color: "rgb(105,133,166)" }}>
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

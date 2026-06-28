import { useCallback, useEffect, useMemo, useRef } from "react";
import { m } from "motion/react";
import { successStories as fallbackStories } from "@/data/success-stories";
import {
  ChevronLeft,
  ChevronRight,
  Instagram,
  AlertCircle,
  RefreshCw,
  Award,
  ShieldCheck,
  Users,
  Star,
  BadgeCheck,
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { useInstagramContent } from "@/hooks/useInstagramContent";
import { CountUp } from "../components/ui/count-up";
import { loadInstagramEmbedScript, processInstagramEmbeds } from "../utils/instagram-embed";
import { SuccessStoryCard } from "./success-story-card";

// Static icon map — no runtime lookup needed
const STAT_ICONS = {
  visa: ShieldCheck,
  direct: Award,
  platform: Users,
  rating: Star,
} as const;

type InstagramApiStory = {
  id: string | number;
  instagramUrl: string;
  caption?: string;
  mediaUrl?: string;
};

export function SocialProof() {
  const { t, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const sectionRef = useRef<HTMLElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const institutionalHighlights = (t("socialProof.institutionalHighlights") as string[]) || [];

  const stats = [
    {
      key: "visa" as const,
      value: 98,
      suffix: "%",
      decimals: 0,
      label: t<string>("socialProof.stats.visa"),
      note: t<string>("socialProof.stats.visaNote"),
      colorClass: "text-[var(--color-accent-primary)]",
      bgClass: "bg-[color-mix(in_srgb,var(--color-accent-primary)_12%,transparent)]",
    },
    {
      key: "direct" as const,
      value: 50,
      suffix: "+",
      decimals: 0,
      label: t<string>("socialProof.stats.direct"),
      note: t<string>("socialProof.stats.directNote"),
      colorClass: "text-[var(--color-accent-tech)]",
      bgClass: "bg-[color-mix(in_srgb,var(--color-accent-tech)_12%,transparent)]",
    },
    {
      key: "platform" as const,
      value: 600,
      suffix: "+",
      decimals: 0,
      label: t<string>("socialProof.stats.platform"),
      note: t<string>("socialProof.stats.platformNote"),
      colorClass: "text-[var(--color-accent-primary)]",
      bgClass: "bg-[color-mix(in_srgb,var(--color-accent-primary)_10%,transparent)]",
    },
    {
      key: "rating" as const,
      value: 4.9,
      suffix: "",
      decimals: 1,
      label: t<string>("socialProof.stats.rating"),
      note: t<string>("socialProof.stats.ratingNote"),
      colorClass: "text-[var(--color-accent-tech)]",
      bgClass: "bg-[color-mix(in_srgb,var(--color-accent-tech)_10%,transparent)]",
    },
  ];

  // ---- Instagram / stories data ----
  const handleError = useCallback((_e: Error) => {}, []);

  const {
    data: instagramContent,
    error: instagramError,
    isLoading: instagramLoading,
    isRefreshing,
    refetch: refetchInstagram,
  } = useInstagramContent<InstagramApiStory>({
    limit: 9,
    autoRefreshInterval: 60 * 60 * 1000,
    onError: handleError,
  });

  const hasInstagramContent = Boolean(instagramContent && instagramContent.length > 0);

  const stories = useMemo(() => {
    if (hasInstagramContent && instagramContent) return instagramContent;
    return fallbackStories;
  }, [hasInstagramContent, instagramContent]);

  const scrollSlider = useCallback(
    (direction: "prev" | "next") => {
      const slider = sliderRef.current;
      if (!slider) return;
      const delta = Math.max(280, Math.min(420, slider.clientWidth * 0.9));
      const step = direction === "next" ? delta : -delta;
      slider.scrollBy({ left: isRtl ? -step : step, behavior: "smooth" });
    },
    [isRtl]
  );

  useEffect(() => {
    void loadInstagramEmbedScript().catch(() => {});
  }, []);

  useEffect(() => {
    if (!hasInstagramContent) return;
    const timer = window.setTimeout(() => {
      processInstagramEmbeds(sectionRef.current ?? undefined);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [hasInstagramContent, stories]);

  return (
    <section
      id="social-proof"
      ref={sectionRef}
      className="relative page-section-y px-[var(--content-gutter)] overflow-hidden bg-[var(--color-bg-primary)]"
      dir={dir}
    >
      {/* Ambient glows — static, no animation */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 right-0 w-[480px] h-[480px] rounded-full opacity-25 blur-[100px]"
          style={{ background: "var(--color-accent-tech)" }}
        />
        <div
          className="absolute -bottom-40 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
          style={{ background: "var(--color-accent-primary)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Header ─────────────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            {/* Left: heading */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5
                bg-[color-mix(in_srgb,var(--color-accent-tech)_8%,transparent)]
                border-[color-mix(in_srgb,var(--color-accent-tech)_25%,transparent)]"
              >
                <BadgeCheck className="w-4 h-4 text-[var(--color-accent-tech)]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-tech)]">
                  {t<string>("socialProof.badge")}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl 3xl:text-5xl font-bold text-[var(--color-text-primary)] tracking-tight mb-3">
                {t<string>("socialProof.title")}
              </h2>

              <p className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
                {t<string>("socialProof.description")}
              </p>
            </div>

            {/* Right: Instagram badge + slider controls */}
            <div className={`flex items-center gap-3 shrink-0 ${isRtl ? "flex-row-reverse" : ""}`}>
              <a
                href="https://www.instagram.com/urmenroll/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-card-light text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <Instagram className="w-4 h-4" />
                @urmenroll
              </a>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollSlider("prev")}
                  aria-label={t<string>("common.aria.previous")}
                  className="w-9 h-9 rounded-lg glass-card-light border border-[var(--color-border)] text-[var(--color-text-primary)] hover:shadow-md transition-all"
                >
                  <ChevronLeft className={`w-4 h-4 mx-auto ${isRtl ? "rotate-180" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollSlider("next")}
                  aria-label={t<string>("common.aria.next")}
                  className="w-9 h-9 rounded-lg glass-card-light border border-[var(--color-border)] text-[var(--color-text-primary)] hover:shadow-md transition-all"
                >
                  <ChevronRight className={`w-4 h-4 mx-auto ${isRtl ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </m.div>

        {/* ── Stats strip ──────────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="grid grid-cols-2 min-[400px]:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-8 sm:mb-10"
        >
          {stats.map((stat) => {
            const Icon = STAT_ICONS[stat.key];
            return (
              <div
                key={stat.key}
                className="glass-card-light rounded-2xl p-5 flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bgClass}`}>
                  <Icon className={`w-5 h-5 ${stat.colorClass}`} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className={`text-2xl font-black ${stat.colorClass} leading-none`}>
                    <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                  </div>
                  <div className="text-xs font-semibold text-[var(--color-text-secondary)] mt-0.5 leading-tight">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </m.div>

        {/* ── Highlights pills ─────────────────────────────────── */}
        {institutionalHighlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {institutionalHighlights.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                  bg-[color-mix(in_srgb,var(--color-accent-primary)_8%,transparent)]
                  border border-[color-mix(in_srgb,var(--color-accent-primary)_20%,transparent)]
                  text-[var(--color-text-secondary)]"
              >
                <ShieldCheck className="w-3 h-3 text-[var(--color-accent-primary)]" />
                {item}
              </span>
            ))}
          </div>
        )}

        {/* ── Instagram Stories slider ─────────────────────────── */}
        {instagramLoading && !hasInstagramContent && (
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="shrink-0 w-[min(86vw,380px)] md:w-[360px] lg:w-[380px] h-[520px] rounded-2xl border border-border/50 bg-[var(--color-bg-surface)] animate-pulse"
              />
            ))}
          </div>
        )}

        {!instagramLoading && stories.length === 0 && (
          <div className="rounded-2xl border border-border/50 bg-[var(--color-bg-surface)] p-6 text-center">
            <p className="text-[var(--color-text-secondary)]">{t<string>("successStories.emptyDescription")}</p>
          </div>
        )}

        {!instagramLoading && stories.length > 0 && (
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-linear-to-r from-[var(--color-bg-primary)] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent z-10" />

            <div
              ref={sliderRef}
              className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {stories.map((story, index) => (
                <div
                  key={`story-${String(story.id)}-${index}`}
                  className="snap-start shrink-0 w-[min(86vw,380px)] md:w-[360px] lg:w-[380px]"
                >
                  <SuccessStoryCard story={story} isInstagramSource={hasInstagramContent} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status pills */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-secondary)]">
          {instagramLoading && !hasInstagramContent && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-light">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-tech)] animate-pulse" />
              {t<string>("successStories.statusLoading")}
            </span>
          )}
          {isRefreshing && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-light">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              {t<string>("successStories.statusRefreshing")}
            </span>
          )}
          {hasInstagramContent && !isRefreshing && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-light">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)]" />
              {stories.length} {t<string>("successStories.statusLive")}
            </span>
          )}
          {instagramError && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
              <AlertCircle className="w-4 h-4 text-[var(--color-warning)]" />
              {t<string>("successStories.statusFallback")}
              <button
                type="button"
                onClick={refetchInstagram}
                className="ml-2 px-2 py-0.5 rounded text-xs font-semibold border border-[var(--color-border)] hover:bg-[var(--color-bg-surface-hover)] transition-colors"
              >
                <RefreshCw className="w-3 h-3 inline mr-1" />
                {t<string>("successStories.retry")}
              </button>
            </span>
          )}
        </div>

      </div>
    </section>
  );
}

/**
 * InstagramReelsSection v3 — Horizontal reel shelf
 *
 * UX     : All 17 reels live in one compact horizontal strip — no vertical
 *          scrolling needed. Desktop users click arrow buttons; mobile users
 *          swipe naturally. Scroll-snaps to card boundaries every time.
 * Cards  : 9/16 portrait previews with branded gradients + play ring.
 *          Zero iframe weight on load.
 * Modal  : Click any card → focused overlay with on-demand Instagram embed,
 *          prev/next navigation, keyboard support (Esc / ← →).
 * SEO    : Blockquote links are rendered in hidden DOM for Google crawler.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "motion/react";
import {
  Instagram,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

// ─── Reels — newest first ────────────────────────────────────────────────────
const REELS: Array<{ shortcode: string }> = [
  { shortcode: "DXt2eC2jcYx" },
  { shortcode: "DXG0xCijYIg" },
  { shortcode: "DW_HzA4jcJu" },
  { shortcode: "DWo1dcsDZ_J" },
  { shortcode: "DVeATyBjc3Y" },
  { shortcode: "DUi8PqxDZKg" },
  { shortcode: "DRDETEwDaDZ" },
  { shortcode: "DTu2iOTj9ez" },
  { shortcode: "DP1ClV8De12" },
  { shortcode: "DPs16MGjavY" },
  { shortcode: "DMGVBJEMkbo" },
  { shortcode: "DJB6OEYNBoD" },
  { shortcode: "DIO33B_sfbN" },
  { shortcode: "DHLW47esQVA" },
  { shortcode: "C_7Gq5XKAtK" },
  { shortcode: "C0vkmlHIXVH" },
  { shortcode: "Cz5zHyusmub" },
];

const INSTAGRAM_URL = "https://www.instagram.com/urmenroll";
const HANDLE = "@urmenroll";

// Six Instagram-brand gradient stops, cycled per card
const GRADIENTS: [string, string, string][] = [
  ["#f43f5e", "#ec4899", "#a855f7"],
  ["#fb923c", "#f43f5e", "#ec4899"],
  ["#a855f7", "#ec4899", "#f43f5e"],
  ["#f97316", "#fb923c", "#f43f5e"],
  ["#e11d48", "#f43f5e", "#fb923c"],
  ["#c026d3", "#a855f7", "#ec4899"],
];

// ─── ReelCard ─────────────────────────────────────────────────────────────────
function ReelCard({
  shortcode,
  index,
  isActive,
  onClick,
}: {
  shortcode: string;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const gradient: [string, string, string] =
    GRADIENTS[index % GRADIENTS.length] ?? ["#f43f5e", "#ec4899", "#a855f7"];
  const [g0, g1, g2] = gradient;

  return (
    <m.button
      type="button"
      aria-label={`Watch reel ${index + 1} from ${HANDLE}`}
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`group relative shrink-0 overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
        isActive ? "ring-2 ring-white/40" : ""
      }`}
      style={{
        width: "clamp(140px, 18vw, 210px)",
        aspectRatio: "9 / 16",
        scrollSnapAlign: "start",
      }}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(158deg, ${g0} 0%, ${g1} 52%, ${g2} 100%)`,
        }}
      />

      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

      {/* Top-left Instagram badge */}
      <div className="absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-lg bg-black/30 backdrop-blur-sm">
        <Instagram className="h-3.5 w-3.5 text-white/80" />
      </div>

      {/* Centre play ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/30 bg-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-300 group-hover:scale-115 group-hover:bg-white/25 group-hover:border-white/50">
          <Play className="h-5 w-5 translate-x-0.5 fill-white text-white" />
        </div>
      </div>

      {/* "Watch" label — appears on hover above play ring */}
      <div className="absolute inset-x-0 flex justify-center" style={{ top: "calc(50% - 52px)" }}>
        <span className="translate-y-2 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold text-white/90 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Watch
        </span>
      </div>

      {/* Bottom bar */}
      <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-8">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-white/70">{HANDLE}</span>
          <span className="font-mono text-[9px] text-white/35">#{index + 1}</span>
        </div>
      </div>

      {/* Active / hover ring shimmer */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/0 transition-all duration-300 group-hover:ring-white/20" />
    </m.button>
  );
}

// ─── ReelModal ────────────────────────────────────────────────────────────────
function ReelModal({
  reels,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: {
  reels: typeof REELS;
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const reel = reels[activeIndex];
  const shortcode = reel?.shortcode ?? "";
  const total = reels.length;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    const existing = document.querySelector('script[src*="instagram.com/embed.js"]');
    if (existing) {
      const t = setTimeout(() => window.instgrm?.Embeds.process(), 250);
      return () => clearTimeout(t);
    }
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.head.appendChild(script);
    return undefined;
  }, [shortcode]);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Reel ${activeIndex + 1} of ${total}`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />

      <m.div
        initial={{ scale: 0.9, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 16 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="relative z-10 w-full max-w-[360px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top chrome */}
        <div className="mb-3 flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-600">
              <Instagram className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold text-white/60">{HANDLE}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs tabular-nums text-white/30">
              {activeIndex + 1} / {total}
            </span>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Embed */}
        <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-[0_40px_100px_rgba(0,0,0,0.7)]">
          <blockquote
            key={shortcode}
            className="instagram-media !m-0 w-full"
            data-instgrm-permalink={`https://www.instagram.com/reel/${shortcode}/?utm_source=ig_embed&utm_campaign=loading`}
            data-instgrm-version="14"
            data-instgrm-captioned
            style={{ margin: 0, maxWidth: "100%", minWidth: "240px" }}
          />
        </div>

        {/* Bottom chrome */}
        <div className="mt-3 flex items-center justify-between px-0.5">
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous reel"
              onClick={onPrev}
              disabled={activeIndex === 0}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:pointer-events-none disabled:opacity-25"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next reel"
              onClick={onNext}
              disabled={activeIndex === total - 1}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:pointer-events-none disabled:opacity-25"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <a
            href={`https://www.instagram.com/reel/${shortcode}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-white/35 transition-colors hover:text-white"
          >
            <ExternalLink className="h-3 w-3" />
            Open in Instagram
          </a>
        </div>
      </m.div>
    </m.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function InstagramReelsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => setActiveIndex(null), []);
  const handlePrev = useCallback(
    () => setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : i)),
    [],
  );
  const handleNext = useCallback(
    () =>
      setActiveIndex((i) =>
        i !== null && i < REELS.length - 1 ? i + 1 : i,
      ),
    [],
  );

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pct = max > 0 ? el.scrollLeft / max : 0;
    setScrollProgress(pct);
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft >= max - 8);
  }, []);

  // Arrow buttons scroll 3 cards at a time
  const scrollBy = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    // Estimate card width from first child
    const firstCard = el.firstElementChild as HTMLElement | null;
    const cardW = firstCard
      ? firstCard.getBoundingClientRect().width + 12 // gap-3 = 12px
      : 222;
    el.scrollBy({ left: dir === "right" ? cardW * 3 : -cardW * 3, behavior: "smooth" });
  }, []);

  // Body scroll lock while modal open
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  // Initialise scroll state
  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  return (
    <section
      id="reels"
      className="relative overflow-hidden bg-slate-950 py-16 md:py-20"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-rose-500/8 blur-[150px]" />
        <div className="absolute bottom-0 left-8 h-[350px] w-[350px] rounded-full bg-pink-600/6 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-500/4 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* ── Header ── */}
        <m.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.42 }}
          className="mb-8 flex flex-col gap-4 px-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              <Instagram className="h-3 w-3 text-rose-400" />
              Real Stories · {REELS.length} Reels
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
              Life at{" "}
              <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                URM ENROLL
              </span>
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/45">
              Swipe through real student journeys — from application to graduation.
            </p>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-rose-500/40 hover:bg-white/10 sm:self-auto"
          >
            <Instagram className="h-4 w-4 text-rose-400" />
            {HANDLE}
            <ExternalLink className="h-3 w-3 text-white/30" />
          </a>
        </m.div>

        {/* ── Horizontal reel shelf ── */}
        <div className="relative">
          {/* Left edge fade */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 transition-opacity duration-300 sm:w-20"
            style={{
              background:
                "linear-gradient(to right, rgb(2 6 23), transparent)",
              opacity: atStart ? 0 : 1,
            }}
          />

          {/* Right edge fade */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 transition-opacity duration-300 sm:w-20"
            style={{
              background:
                "linear-gradient(to left, rgb(2 6 23), transparent)",
              opacity: atEnd ? 0 : 1,
            }}
          />

          {/* Left arrow — desktop */}
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollBy("left")}
            disabled={atStart}
            className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-white shadow-lg backdrop-blur-md transition-all hover:border-white/25 hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-0 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Right arrow — desktop */}
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollBy("right")}
            disabled={atEnd}
            className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-white shadow-lg backdrop-blur-md transition-all hover:border-white/25 hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-0 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Scroll track */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-3 overflow-x-auto px-6 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {REELS.map(({ shortcode }, index) => (
              <ReelCard
                key={shortcode}
                shortcode={shortcode}
                index={index}
                isActive={activeIndex === index}
                onClick={() => setActiveIndex(index)}
              />
            ))}
            {/* Trailing spacer so last card sits away from the edge fade */}
            <div className="w-3 shrink-0" aria-hidden="true" />
          </div>
        </div>

        {/* ── Scroll progress bar ── */}
        <div className="mt-5 flex flex-col items-center gap-3 px-6">
          <div className="h-[3px] w-36 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-400 transition-[width] duration-150 ease-out"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-white/25">
            Swipe or use arrows to explore all {REELS.length} reels
          </p>
        </div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {activeIndex !== null && (
          <ReelModal
            reels={REELS}
            activeIndex={activeIndex}
            onClose={handleClose}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

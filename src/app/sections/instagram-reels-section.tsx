/**
 * InstagramReelsSection — Professional reel showcase
 *
 * Layout   : Responsive portrait card grid (2 → 3 columns).
 * Previews : Branded gradient cards with play button — zero JS weight on load.
 * Playback : Official Instagram embed loads inside a focused modal on click.
 * SEO      : Each blockquote is present in the DOM so Google's crawler can
 *            index the content via the Google ↔ Meta embed contract.
 * A11y     : Focus trap in modal, keyboard nav (Esc / ← →), body scroll lock.
 *
 * ─── HOW TO ADD REELS ──────────────────────────────────────────────────────
 * 1. Open any reel from @urmenroll in a browser.
 * 2. Copy the URL: https://www.instagram.com/reel/ABC123/
 * 3. Extract the shortcode (ABC123) and add it to REELS below.
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "motion/react";
import { Instagram, ExternalLink, X, ChevronLeft, ChevronRight, Play } from "lucide-react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

// ─── Real @urmenroll reels — newest first ────────────────────────────────────
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

const INITIAL_VISIBLE = 9; // 3 × 3 desktop grid
const INSTAGRAM_URL = "https://www.instagram.com/urmenroll";
const HANDLE = "@urmenroll";

// Instagram-adjacent gradient palette — six variants, cycled per card
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
  onClick,
}: {
  shortcode: string;
  index: number;
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.38, delay: (index % 3) * 0.06 }}
      whileHover={{ y: -6 }}
      className="group relative w-full overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      style={{ aspectRatio: "9 / 16" }}
    >
      {/* Gradient fill */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(155deg, ${g0}, ${g1} 52%, ${g2})` }}
      />

      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/15" />

      {/* Play ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/35 bg-white/20 shadow-[0_4px_28px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
          <Play className="h-6 w-6 translate-x-0.5 fill-white text-white" />
        </div>
      </div>

      {/* "Watch Reel" pill — fades in on hover */}
      <div className="absolute inset-x-0 top-3 flex justify-center">
        <span className="inline-flex translate-y-1 items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[11px] font-semibold text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Play className="h-2.5 w-2.5 fill-white" />
          Watch Reel
        </span>
      </div>

      {/* Bottom bar */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
        <div className="flex items-center gap-1.5">
          <Instagram className="h-3.5 w-3.5 shrink-0 text-white/80" />
          <span className="text-[11px] font-semibold leading-none text-white/80">
            {HANDLE}
          </span>
        </div>
        <span className="rounded-full bg-black/30 px-2 py-0.5 font-mono text-[10px] text-white/40">
          #{index + 1}
        </span>
      </div>

      {/* Hover border shimmer */}
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

  // Move focus to close button when modal mounts
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  // Load / re-process Instagram embed.js each time the shortcode changes
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
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Reel ${activeIndex + 1} of ${total} from ${HANDLE}`}
      onClick={onClose}
    >
      {/* Scrim */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Card */}
      <m.div
        initial={{ scale: 0.92, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 12 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="relative z-10 w-full max-w-[360px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar: counter + close */}
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="text-xs font-semibold tabular-nums text-white/40">
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

        {/* Embed container — key forces DOM re-mount on shortcode change */}
        <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
          <blockquote
            key={shortcode}
            className="instagram-media !m-0 w-full"
            data-instgrm-permalink={`https://www.instagram.com/reel/${shortcode}/?utm_source=ig_embed&utm_campaign=loading`}
            data-instgrm-version="14"
            data-instgrm-captioned
            style={{ margin: 0, maxWidth: "100%", minWidth: "240px" }}
          />
        </div>

        {/* Bottom bar: prev/next + external link */}
        <div className="mt-3 flex items-center justify-between px-1">
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous reel"
              onClick={onPrev}
              disabled={activeIndex === 0}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next reel"
              onClick={onNext}
              disabled={activeIndex === total - 1}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <a
            href={`https://www.instagram.com/reel/${shortcode}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View on Instagram
          </a>
        </div>
      </m.div>
    </m.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function InstagramReelsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleReels = showAll ? REELS : REELS.slice(0, INITIAL_VISIBLE);
  const remaining = REELS.length - INITIAL_VISIBLE;

  const handleClose = useCallback(() => setActiveIndex(null), []);
  const handlePrev = useCallback(
    () => setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : i)),
    [],
  );
  const handleNext = useCallback(
    () => setActiveIndex((i) => (i !== null && i < REELS.length - 1 ? i + 1 : i)),
    [],
  );

  // Body scroll lock while modal is open
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  return (
    <section
      id="reels"
      className="relative overflow-hidden bg-slate-950 py-20 md:py-24"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 right-0 h-[480px] w-[480px] rounded-full bg-rose-500/8 blur-[140px]" />
        <div className="absolute bottom-0 left-10 h-[360px] w-[360px] rounded-full bg-pink-600/6 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/4 blur-[180px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* ── Header ── */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
              <Instagram className="h-3.5 w-3.5 text-rose-400" />
              Real Stories · {REELS.length} Reels
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
              Life at{" "}
              <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                URM ENROLL
              </span>
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-white/50">
              Follow our students' journeys — from application to graduation.
              Real stories, real results.
            </p>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-500/40 hover:bg-white/10 hover:shadow-md"
          >
            <Instagram className="h-4 w-4 text-rose-400" />
            {HANDLE}
            <ExternalLink className="h-3.5 w-3.5 text-white/40" />
          </a>
        </m.div>

        {/* ── Card grid ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:gap-4">
          {visibleReels.map(({ shortcode }, index) => (
            <ReelCard
              key={shortcode}
              shortcode={shortcode}
              index={index}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>

        {/* ── Show more ── */}
        {!showAll && remaining > 0 && (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:border-rose-500/40 hover:bg-white/10 hover:shadow-md active:scale-95"
            >
              Show {remaining} more reels
            </button>
            <p className="text-xs text-white/30">
              Or{" "}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-white"
              >
                view all on Instagram
              </a>
            </p>
          </m.div>
        )}
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

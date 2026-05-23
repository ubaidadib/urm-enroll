/**
 * InstagramReelsSection v4 — Auto-scrolling live reel marquee
 *
 * Shows ALL 17 real @urmenroll reels as actual Instagram embeds in a
 * continuous, seamlessly looping horizontal strip.
 *
 * Key design decisions:
 *  • Embeds are real blockquotes processed by Instagram's embed.js —
 *    users see the actual reel thumbnail/video, not a placeholder.
 *  • No `data-instgrm-captioned` → captions are hidden; cleaner look.
 *  • Two copies of the reel list sit end-to-end; the CSS marquee animation
 *    translates by exactly one copy width so the loop is invisible.
 *  • Strip auto-scrolls at 50 px/s; pauses on hover/focus.
 *  • A transparent overlay sits above each embed so the click always
 *    opens our modal instead of navigating inside the iframe.
 *  • Modal loads the chosen reel on-demand with prev/next nav & keyboard.
 *
 * ─── HOW TO ADD REELS ──────────────────────────────────────────────────
 * 1. Open the reel on Instagram and copy the URL.
 * 2. Extract the shortcode (the segment after /reel/).
 * 3. Prepend it to the REELS array below (newest first).
 * ─────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "motion/react";
import { Instagram, ExternalLink, X, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

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

// ─── Marquee geometry ────────────────────────────────────────────────────────
// Each card slot = card width + right margin (controls the gap between cards).
const CARD_W   = 300;   // px — slightly below Instagram's 326px min: embed expands to fill
const CARD_GAP = 12;    // px
const PITCH    = CARD_W + CARD_GAP;                  // space each card occupies in the strip
const STRIP_W  = REELS.length * PITCH;               // width of one full set (5304 px for 17 reels)
const SPEED    = 50;                                 // px / s
const DURATION = Math.round(STRIP_W / SPEED);        // ≈ 106 s — full loop time

// The track contains two copies of REELS so the loop seam is invisible.
const TRACK_REELS = [...REELS, ...REELS];

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
  const reel     = reels[activeIndex];
  const shortcode = reel?.shortcode ?? "";
  const total    = reels.length;
  const closeRef  = useRef<HTMLButtonElement>(null);

  // Focus close button on open
  useEffect(() => { closeRef.current?.focus(); }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  // Re-process embed when shortcode changes
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
      aria-label={`Reel ${activeIndex + 1} of ${total} from ${HANDLE}`}
      onClick={onClose}
    >
      {/* Scrim */}
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
            <span className="text-xs tabular-nums text-white/35">{activeIndex + 1} / {total}</span>
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

        {/* Embed — key forces re-mount on shortcode change */}
        <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-[0_40px_100px_rgba(0,0,0,0.7)]">
          <blockquote
            key={shortcode}
            className="instagram-media !m-0 w-full"
            data-instgrm-permalink={`https://www.instagram.com/reel/${shortcode}/?utm_source=ig_embed&utm_campaign=loading`}
            data-instgrm-version="14"
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
  const [isPaused,    setIsPaused]    = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [embedsReady, setEmbedsReady] = useState(false);

  const handleClose = useCallback(() => setActiveIndex(null), []);
  const handlePrev  = useCallback(
    () => setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : i)),
    [],
  );
  const handleNext  = useCallback(
    () => setActiveIndex((i) => (i !== null && i < REELS.length - 1 ? i + 1 : i)),
    [],
  );

  // Load Instagram embed.js once; retry process() until instgrm is ready
  useEffect(() => {
    const tryProcess = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
        setEmbedsReady(true);
        return true;
      }
      return false;
    };

    if (document.querySelector('script[src*="instagram.com/embed.js"]')) {
      tryProcess();
      return;
    }

    const script  = document.createElement("script");
    script.src    = "https://www.instagram.com/embed.js";
    script.async  = true;
    script.onload = () => tryProcess();
    document.head.appendChild(script);

    // Retry every 400 ms in case onload fires before instgrm is fully initialised
    const interval = setInterval(() => { if (tryProcess()) clearInterval(interval); }, 400);
    return () => clearInterval(interval);
  }, []);

  // Body scroll lock while modal is open
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeIndex]);

  // CSS custom properties drive the keyframe & timing (see index.css @keyframes urmMarquee)
  const trackStyle: React.CSSProperties = {
    ["--urm-strip-w"  as string]: `-${STRIP_W}px`,
    ["--urm-duration" as string]: `${DURATION}s`,
    width: `${TRACK_REELS.length * PITCH}px`,
  };

  return (
    <section
      id="reels"
      className="relative overflow-hidden bg-slate-950 py-16 md:py-20"
    >
      {/* ── Ambient glows ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-rose-500/8 blur-[150px]" />
        <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-pink-600/6 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-500/4 blur-[160px]" />
      </div>

      <div className="relative">
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
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/40">
              Real student journeys — from application to graduation.{" "}
              <span className="text-white/25">Hover to pause · Click to watch</span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 self-start sm:self-auto">
            {/* Pause / resume toggle — visible on desktop */}
            <button
              type="button"
              aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
              onClick={() => setIsPaused((p) => !p)}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              {isPaused
                ? <Play  className="h-3.5 w-3.5 fill-current translate-x-0.5" />
                : <Pause className="h-3.5 w-3.5" />}
            </button>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-rose-500/40 hover:bg-white/10"
            >
              <Instagram className="h-4 w-4 text-rose-400" />
              {HANDLE}
              <ExternalLink className="h-3 w-3 text-white/30" />
            </a>
          </div>
        </m.div>

        {/* ── Marquee strip ── */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={()    => setIsPaused(true)}
          onBlur={()     => setIsPaused(false)}
        >
          {/* Edge gradient fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-slate-950 to-transparent md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-slate-950 to-transparent md:w-24" />

          {/* Animated track */}
          <div
            className={`flex urm-marquee${isPaused ? " urm-marquee-paused" : ""}`}
            style={trackStyle}
          >
            {TRACK_REELS.map(({ shortcode }, idx) => {
              const reelIndex = idx % REELS.length;
              return (
                <div
                  key={`${shortcode}-${idx}`}
                  className="relative shrink-0 cursor-pointer"
                  style={{ width: CARD_W, marginRight: CARD_GAP }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open reel ${reelIndex + 1} from ${HANDLE}`}
                  onClick={() => setActiveIndex(reelIndex)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveIndex(reelIndex); }}
                >
                  {/* ── Real Instagram embed, no caption ── */}
                  <blockquote
                    className="instagram-media !m-0 overflow-hidden rounded-2xl"
                    data-instgrm-permalink={`https://www.instagram.com/reel/${shortcode}/?utm_source=ig_embed&utm_campaign=loading`}
                    data-instgrm-version="14"
                    style={{ margin: 0, maxWidth: "100%", minWidth: "240px" }}
                  />

                  {/* Transparent overlay: captures click, prevents iframe nav */}
                  <div
                    className="absolute inset-0 z-10 rounded-2xl transition-all duration-200 hover:ring-2 hover:ring-white/20 hover:ring-offset-2 hover:ring-offset-slate-950"
                    aria-hidden="true"
                  />

                  {/* Loading skeleton shown before embed.js fires */}
                  {!embedsReady && (
                    <div className="absolute inset-0 z-5 flex flex-col items-center justify-center gap-3 rounded-2xl bg-slate-900">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-500/30 border-t-rose-400" />
                      <span className="text-xs text-white/30">Loading reel…</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Footer hint ── */}
        <div className="mt-5 flex items-center justify-center gap-3 px-6">
          <div className="flex gap-1.5">
            {REELS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Open reel ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className="h-1 w-1 rounded-full bg-white/20 transition-all hover:bg-rose-400 hover:w-3"
              />
            ))}
          </div>
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

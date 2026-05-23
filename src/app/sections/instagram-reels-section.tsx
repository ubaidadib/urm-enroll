/**
 * InstagramReelsSection
 *
 * Embeds real Instagram Reels using the official Instagram embed.js script.
 * Google indexes embedded Instagram content — this directly contributes to SEO
 * via the Google ↔ Meta content-indexing partnership.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO ADD REELS
 * 1. Open any Instagram Reel from the @urmenroll account in a browser.
 * 2. Copy the URL (e.g. https://www.instagram.com/reel/ABC123xyz/)
 * 3. Extract the shortcode (the part after /reel/ before the next /)
 * 4. Add an entry to the REELS array below.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import { Instagram, ExternalLink, Play } from "lucide-react";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

/** ← UPDATE: add real reel shortcodes from @urmenroll here */
const REELS: Array<{ shortcode: string; label?: string }> = [
  // { shortcode: "REPLACE_WITH_REAL_SHORTCODE", label: "Study in Germany 🎓" },
  // { shortcode: "REPLACE_WITH_REAL_SHORTCODE", label: "Student Life in Europe" },
  // { shortcode: "REPLACE_WITH_REAL_SHORTCODE", label: "Visa Tips for Students" },
];

const INSTAGRAM_URL = "https://www.instagram.com/urmenroll";
const HANDLE = "@urmenroll";

function ReelEmbed({ shortcode }: { shortcode: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    // Trigger Instagram's processor after the blockquote mounts
    const timer = setTimeout(() => {
      window.instgrm?.Embeds.process();
      setLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [shortcode]);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-primary/30 border-t-accent-primary" />
        </div>
      )}
      {/* Official Instagram embed blockquote — processed by embed.js into an interactive reel */}
      <blockquote
        className="instagram-media w-full"
        data-instgrm-permalink={`https://www.instagram.com/reel/${shortcode}/?utm_source=ig_embed&utm_campaign=loading`}
        data-instgrm-version="14"
        data-instgrm-captioned
        style={{ margin: 0, maxWidth: "100%", minWidth: "240px" }}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-span-full"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <a
            key={i}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-10 transition-all duration-300 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-lg hover:shadow-rose-500/10"
            style={{ minHeight: 320 }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 text-white shadow-lg">
              <Play className="h-7 w-7 fill-white" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Reel #{i}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                Follow {HANDLE} on Instagram
              </p>
            </div>
            <ExternalLink className="absolute bottom-4 right-4 h-4 w-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-600">
        Add real reel shortcodes in{" "}
        <code className="rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 font-mono text-[10px]">
          src/app/sections/instagram-reels-section.tsx
        </code>{" "}
        to display live content.
      </p>
    </m.div>
  );
}

export function InstagramReelsSection() {
  const hasReels = REELS.length > 0;

  // Load Instagram embed.js once
  useEffect(() => {
    if (!hasReels) return;
    if (document.querySelector('script[src*="instagram.com/embed.js"]')) {
      // Already loaded — just re-process
      window.instgrm?.Embeds.process();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    return () => {
      // Do not remove — embed.js should persist for other instances
    };
  }, [hasReels]);

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 py-20 md:py-24">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-rose-500/6 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-pink-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <Instagram className="h-3.5 w-3.5 text-rose-500" />
              Real Stories
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
              Life at{" "}
              <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                URM ENROLL
              </span>
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-500 dark:text-slate-400">
              Follow our students&apos; journeys — from application to graduation. Real stories, real results.
            </p>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-900 dark:text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-md"
          >
            <Instagram className="h-4 w-4 text-rose-500" />
            {HANDLE}
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>
        </m.div>

        {/* Reels grid */}
        <div className={`grid gap-6 ${hasReels ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {hasReels
            ? REELS.map(({ shortcode }) => (
                <m.div
                  key={shortcode}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4 }}
                >
                  <ReelEmbed shortcode={shortcode} />
                </m.div>
              ))
            : <EmptyState />}
        </div>
      </div>
    </section>
  );
}

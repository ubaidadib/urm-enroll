import { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "motion/react";
import {
  Instagram,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";

import { useInstagramContent } from "@/hooks/useInstagramContent";
import type { InstagramFeedItem } from "@/types/instagram-feed";

const INSTAGRAM_URL = "https://www.instagram.com/urmenroll";
const HANDLE = "@urmenroll";

const PLACEHOLDER_GRADIENTS: [string, string, string][] = [
  ["#f59e0b", "#ec4899", "#7c3aed"],
  ["#fb7185", "#f97316", "#facc15"],
  ["#38bdf8", "#8b5cf6", "#ec4899"],
  ["#14b8a6", "#3b82f6", "#8b5cf6"],
  ["#f97316", "#ef4444", "#a855f7"],
  ["#0ea5e9", "#22c55e", "#eab308"],
];

function formatPublishedAt(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return null;
  }
}

function getPlaceholderGradient(index: number) {
  return (
    PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length] ??
    PLACEHOLDER_GRADIENTS[0] ??
    ["#f59e0b", "#ec4899", "#7c3aed"]
  );
}

function FeedCard({
  item,
  index,
  isActive,
  onClick,
}: {
  item: InstagramFeedItem;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const [g0, g1, g2] = getPlaceholderGradient(index);

  return (
    <m.button
      type="button"
      aria-label={`Open Instagram success story ${index + 1}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.36, delay: (index % 4) * 0.04 }}
      whileHover={{ y: -4 }}
      className={`group relative w-[210px] shrink-0 overflow-hidden rounded-[1.75rem] border border-border/70 bg-bg-surface/80 p-2 text-left backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary sm:w-[224px] ${
        isActive ? "border-accent-tech/45 shadow-[0_20px_60px_rgba(2,4,12,0.2)]" : ""
      }`}
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative overflow-hidden rounded-[1.35rem]" style={{ aspectRatio: "9 / 16" }}>
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.altText}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(160deg, ${g0} 0%, ${g1} 48%, ${g2} 100%)` }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(8,14,28,0.08)] via-transparent to-[rgba(8,14,28,0.74)]" />

        <div className="absolute inset-x-0 top-0 p-3.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[rgba(8,14,28,0.34)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/82 backdrop-blur-md">
            <Instagram className="h-3.5 w-3.5 text-rose-300" />
            Success story
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/12 shadow-[0_16px_40px_rgba(2,4,12,0.24)] backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-white/30 group-hover:bg-white/18">
            <Play className="h-4.5 w-4.5 translate-x-0.5 fill-white text-white" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3.5">
          <div className="rounded-[1.15rem] border border-white/10 bg-[rgba(8,14,28,0.4)] p-3 backdrop-blur-md">
            <p
              className="line-clamp-2 text-base font-bold leading-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.excerpt}
            </p>
            {item.publishedAt && (
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/56">
                {formatPublishedAt(item.publishedAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-transparent transition-all duration-300 group-hover:ring-accent-tech/30" />
    </m.button>
  );
}

function LoadingCard({ index }: { index: number }) {
  const [g0, g1, g2] = getPlaceholderGradient(index);

  return (
    <div
      className="relative w-[210px] shrink-0 overflow-hidden rounded-[1.75rem] border border-border/70 bg-bg-surface/72 p-2 sm:w-[224px]"
      style={{ scrollSnapAlign: "start" }}
    >
      <div
        className="relative animate-pulse overflow-hidden rounded-[1.35rem]"
        style={{ aspectRatio: "9 / 16", background: `linear-gradient(160deg, ${g0} 0%, ${g1} 48%, ${g2} 100%)` }}
      >
        <div className="absolute inset-x-0 bottom-0 p-3.5">
          <div className="rounded-[1.15rem] border border-white/10 bg-[rgba(8,14,28,0.28)] p-3 backdrop-blur-md">
            <div className="h-4 w-28 rounded-full bg-white/20" />
            <div className="mt-2 h-3 w-24 rounded-full bg-white/15" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedModal({
  items,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: {
  items: InstagramFeedItem[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[activeIndex];
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  if (!item) {
    return null;
  }

  const publishedAt = formatPublishedAt(item.publishedAt);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Instagram success story ${activeIndex + 1} of ${items.length}`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[rgba(8,14,28,0.82)] backdrop-blur-xl" />

      <m.div
        initial={{ scale: 0.92, opacity: 0, y: 18 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 18 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="glass-modal relative z-10 w-full max-w-[460px] overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-[rgba(8,14,28,0.38)] p-4 md:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                Instagram success story
              </p>
              <p className="mt-1 text-sm text-white/72">
                {activeIndex + 1} of {items.length} from {HANDLE}
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/18"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-[rgb(8,14,28)] shadow-[0_28px_80px_rgba(2,4,12,0.44)]">
            {item.thumbnailUrl ? (
              <img
                src={item.thumbnailUrl}
                alt={item.altText}
                className="h-auto w-full object-cover"
              />
            ) : (
              <div className="aspect-[9/16] bg-[linear-gradient(160deg,#f59e0b_0%,#ec4899_48%,#7c3aed_100%)]" />
            )}
          </div>

          <div className="mt-4 rounded-[1.2rem] border border-white/10 bg-white/[0.06] p-4">
            <p
              className="text-lg font-bold leading-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.excerpt}
            </p>
            {item.caption && item.caption !== item.excerpt && (
              <p className="mt-2 text-sm leading-relaxed text-white/68">{item.caption}</p>
            )}
            {publishedAt && (
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/48">{publishedAt}</p>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous story"
                onClick={onPrev}
                disabled={activeIndex === 0}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/18 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next story"
                onClick={onNext}
                disabled={activeIndex === items.length - 1}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/18 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <a
              href={item.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/16"
            >
              Open in Instagram
              <ExternalLink className="h-3.5 w-3.5 text-white/70" />
            </a>
          </div>
        </div>
      </m.div>
    </m.div>
  );
}

export function InstagramReelsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, error, isLoading, refetch } = useInstagramContent<InstagramFeedItem>({ limit: 18 });
  const items = data ?? [];

  const handleClose = useCallback(() => setActiveIndex(null), []);
  const handlePrev = useCallback(
    () => setActiveIndex((index) => (index !== null && index > 0 ? index - 1 : index)),
    [],
  );
  const handleNext = useCallback(
    () => setActiveIndex((index) => (index !== null && index < items.length - 1 ? index + 1 : index)),
    [items.length],
  );

  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const maxScroll = element.scrollWidth - element.clientWidth;
    const progress = maxScroll > 0 ? element.scrollLeft / maxScroll : 0;
    setScrollProgress(progress);
    setAtStart(element.scrollLeft < 8);
    setAtEnd(element.scrollLeft >= maxScroll - 8);
  }, []);

  const scrollBy = useCallback((direction: "left" | "right") => {
    const element = scrollRef.current;
    if (!element) return;

    const card = element.querySelector("[data-feed-card]") as HTMLElement | null;
    const cardWidth = card ? card.getBoundingClientRect().width + 16 : 244;
    element.scrollBy({
      left: direction === "right" ? cardWidth * 2 : -cardWidth * 2,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  useEffect(() => {
    handleScroll();
  }, [handleScroll, items.length, isLoading]);

  useEffect(() => {
    if (activeIndex !== null && activeIndex >= items.length) {
      setActiveIndex(null);
    }
  }, [activeIndex, items.length]);

  const showEmptyState = !isLoading && !error && items.length === 0;
  const showErrorState = !isLoading && Boolean(error) && items.length === 0;

  return (
    <section
      id="reels"
      className="relative overflow-hidden bg-linear-to-b from-bg-secondary to-bg-primary py-18 md:py-22 dark:from-bg-primary dark:to-bg-secondary"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-20 left-[12%] h-64 w-64 rounded-full bg-[rgba(244,114,182,0.1)] blur-[120px]" />
        <div className="absolute right-[10%] top-16 h-72 w-72 rounded-full bg-[rgba(56,189,248,0.08)] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-bg-surface/76 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted">
              <Instagram className="h-3.5 w-3.5 text-rose-400" />
              Instagram success stories
            </div>
            <h2
              className="max-w-3xl text-3xl font-bold tracking-tight text-[rgb(var(--text-primary))] md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Real student wins, synced from our Instagram feed.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[rgb(var(--text-muted))]">
              The website now reads from a dedicated feed pipeline, so new success stories can appear here without manual shortcode updates.
            </p>
          </m.div>

          <m.a
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-bg-surface/82 px-4 py-2.5 text-sm font-semibold text-text-primary transition-all hover:-translate-y-0.5 hover:border-border-strong hover:bg-bg-surface"
          >
            Visit {HANDLE}
            <ExternalLink className="h-3.5 w-3.5 text-[rgb(var(--text-muted))]" />
          </m.a>
        </div>

        <m.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.48, delay: 0.08 }}
          className="glass-card relative mt-8 overflow-hidden p-4 sm:p-5"
        >
          <div className="relative mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm leading-relaxed text-[rgb(var(--text-muted))] md:max-w-xl">
                Browse the latest stories from our student community and open any post for the full Instagram view.
              </p>
            </div>

            {!showErrorState && !showEmptyState && (
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  aria-label="Scroll left"
                  onClick={() => scrollBy("left")}
                  disabled={atStart || isLoading || items.length === 0}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg-surface text-text-primary transition-all hover:border-border-strong hover:bg-bg-surface-hover disabled:pointer-events-none disabled:opacity-35"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Scroll right"
                  onClick={() => scrollBy("right")}
                  disabled={atEnd || isLoading || items.length === 0}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg-surface text-text-primary transition-all hover:border-border-strong hover:bg-bg-surface-hover disabled:pointer-events-none disabled:opacity-35"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {showErrorState ? (
            <div className="rounded-[1.35rem] border border-[rgb(var(--error))]/20 bg-[rgb(var(--error))]/5 p-5 text-[rgb(var(--text-primary))]">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-[rgb(var(--error))]" />
                <div className="flex-1">
                  <p className="font-semibold">Instagram stories are temporarily unavailable.</p>
                  <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
                    The feed could not be loaded right now. You can retry or open the Instagram page directly.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => void refetch()}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition-all hover:border-border-strong hover:bg-bg-surface-hover"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Retry
                    </button>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition-all hover:border-border-strong hover:bg-bg-surface-hover"
                    >
                      Open Instagram
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : showEmptyState ? (
            <div className="rounded-[1.35rem] border border-border bg-bg-surface/72 p-5 text-[rgb(var(--text-primary))]">
              <p className="font-semibold">No stories are available yet.</p>
              <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
                Once the feed sync runs and Instagram content is available, stories will appear here automatically.
              </p>
            </div>
          ) : (
            <>
              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 transition-opacity duration-300 sm:w-16"
                  style={{
                    background: "linear-gradient(to right, rgb(var(--bg-primary) / 0.9), transparent)",
                    opacity: atStart || isLoading ? 0 : 1,
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 transition-opacity duration-300 sm:w-16"
                  style={{
                    background: "linear-gradient(to left, rgb(var(--bg-primary) / 0.9), transparent)",
                    opacity: atEnd || isLoading ? 0 : 1,
                  }}
                />

                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="flex gap-4 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  style={{ scrollSnapType: "x mandatory" }}
                >
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, index) => <LoadingCard key={index} index={index} />)
                    : items.map((item, index) => (
                        <div key={item.id} data-feed-card>
                          <FeedCard
                            item={item}
                            index={index}
                            isActive={activeIndex === index}
                            onClick={() => setActiveIndex(index)}
                          />
                        </div>
                      ))}
                </div>
              </div>

              <div className="relative mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-36 overflow-hidden rounded-full bg-border/75 sm:w-44">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,rgb(var(--accent-primary)),rgb(var(--accent-tech-hover)),rgb(var(--accent-tech)))] transition-[width] duration-150 ease-out"
                      style={{ width: `${Math.max(scrollProgress * 100, isLoading ? 22 : 8)}%` }}
                    />
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[rgb(var(--text-muted))]">
                    {isLoading ? "Loading stories" : `${items.length} stories`}
                  </span>
                </div>

                <p className="text-sm text-[rgb(var(--text-muted))]">
                  Scroll or use the arrows to explore the synced feed.
                </p>
              </div>
            </>
          )}
        </m.div>
      </div>

      <AnimatePresence>
        {activeIndex !== null && items.length > 0 && (
          <FeedModal
            items={items}
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

export default InstagramReelsSection;

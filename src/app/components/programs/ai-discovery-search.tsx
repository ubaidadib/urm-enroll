import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { Command, Mic, Search, Sparkles, TrendingUp } from "lucide-react";

interface AiDiscoverySearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  trendingQueries: string[];
  recentQueries: string[];
}

export function AiDiscoverySearch({
  value,
  onChange,
  onSubmit,
  trendingQueries,
  recentQueries,
}: AiDiscoverySearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const base = [
      "AI + Germany + English + low tuition",
      "Cybersecurity in Netherlands with scholarships",
      "Medicine in Europe visa friendly",
      "Business analytics remote-work careers",
      "Nursing pathways with high employability",
    ];

    if (!value.trim()) return base;

    const query = value.toLowerCase();
    const merged = [...recentQueries, ...trendingQueries, ...base];
    return merged
      .filter((item, index, self) => self.indexOf(item) === index)
      .filter((item) => item.toLowerCase().includes(query))
      .slice(0, 7);
  }, [recentQueries, trendingQueries, value]);

  useEffect(() => {
    const handleCommandPalette = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleCommandPalette);
    return () => window.removeEventListener("keydown", handleCommandPalette);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value.trim());
    setIsFocused(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="group relative">
        {/* Gradient border effect - more subtle in light mode */}
        <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-brand-steel-400/20 dark:from-brand-steel-400/40 via-brand-steel-400/15 dark:via-brand-steel-400/40 to-brand-gold-400/20 dark:to-brand-gold-400/40 opacity-60 dark:opacity-80 blur-sm transition-opacity duration-300 group-hover:opacity-100" />

        {/* Main search container */}
        <div className="relative flex items-center gap-3 rounded-3xl border border-gray-300 dark:border-white/15 bg-white dark:bg-brand-softnav-900/50 p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_45px_rgba(2,6,23,0.28)] backdrop-blur-xl">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white">
            <Search className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <input
              ref={inputRef}
              type="search"
              value={value}
              onChange={(event) => {
                onChange(event.target.value);
                setActiveSuggestionIndex(-1);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 120)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActiveSuggestionIndex((current) => Math.min(current + 1, suggestions.length - 1));
                }
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActiveSuggestionIndex((current) => Math.max(current - 1, -1));
                }
                if (event.key === "Enter" && activeSuggestionIndex >= 0) {
                  event.preventDefault();
                  const selected = suggestions[activeSuggestionIndex];
                  if (!selected) return;
                  onChange(selected);
                  onSubmit(selected);
                  setIsFocused(false);
                }
              }}
              aria-label="AI-powered program search"
              placeholder="Describe your dream future: AI + Berlin + English + scholarship"
              className="h-11 w-full bg-transparent text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/70 outline-none md:text-base"
            />

            <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-white/60">
              Smart query understanding with dynamic career matching
            </p>
          </div>

          <button
            type="button"
            aria-label="Voice search"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-300 dark:border-white/25 text-gray-600 dark:text-white/85 transition-colors hover:bg-gray-100 dark:hover:bg-white/15 hover:text-gray-900 dark:hover:text-white"
          >
            <Mic className="h-4.5 w-4.5" />
          </button>

          <button
            type="submit"
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-brand-navy-900 dark:bg-brand-gold-500 px-4 text-sm font-bold text-white dark:text-brand-navy-950 transition-all hover:scale-[1.02] hover:shadow-lg"
          >
            <Sparkles className="h-4 w-4" />
            Match
          </button>
        </div>
      </form>

      {/* Trending queries chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600 dark:text-white/65">
        <span className="inline-flex items-center gap-1 rounded-full border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 px-3 py-1 text-gray-700 dark:text-white/80">
          <Command className="h-3.5 w-3.5" />
          Cmd K
        </span>
        <span className="text-gray-500 dark:text-gray-400">Trending</span>
        {trendingQueries.slice(0, 4).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              onChange(item);
              onSubmit(item);
            }}
            className="rounded-full border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 px-3 py-1 text-[11px] font-semibold text-gray-700 dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isFocused && suggestions.length > 0 ? (
          <m.div
            initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[calc(100%+14px)] z-40 overflow-hidden rounded-2xl border border-gray-300 dark:border-white/20 bg-white dark:bg-brand-softnav-900/95 p-3 shadow-2xl dark:shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-2 flex items-center justify-between px-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-gray-600 dark:text-white/55">AI suggestions</p>
              <p className="text-[11px] text-gray-500 dark:text-white/50">Enter to apply</p>
            </div>
            <div className="space-y-1">
              {suggestions.map((item, index) => (
                <button
                  key={`${item}-${index}`}
                  type="button"
                  onMouseEnter={() => setActiveSuggestionIndex(index)}
                  onClick={() => {
                    onChange(item);
                    onSubmit(item);
                    setIsFocused(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    activeSuggestionIndex === index
                      ? "bg-brand-navy-900/10 dark:bg-white/15 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10"
                  }`}
                >
                  <span className="truncate">{item}</span>
                  <TrendingUp className="h-4 w-4 shrink-0 text-brand-steel-500 dark:text-brand-steel-300" />
                </button>
              ))}
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

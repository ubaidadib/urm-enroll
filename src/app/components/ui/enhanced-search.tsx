import { FormEvent, useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

interface EnhancedSearchProps {
  value?: string;
  defaultValue?: string;
  variant?: "default" | "hero";
  placeholder?: string;
  submitLabel?: string;
  clearLabel?: string;
  onSearch?: (query: string) => void;
  onChange?: (query: string) => void;
  className?: string;
}

export function EnhancedSearch({
  value,
  defaultValue = "",
  variant = "default",
  placeholder = "Search universities, programs...",
  submitLabel = "Search",
  clearLabel = "Clear",
  onSearch,
  onChange,
  className = "",
}: EnhancedSearchProps) {
  const { dir } = useLanguage();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const isControlled = value !== undefined;
  const query = isControlled ? value : internalValue;
  const isHero = variant === "hero";
  const isRtl = dir === "rtl";

  useEffect(() => {
    if (!isControlled) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  const updateValue = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(query.trim());
  };

  const baseWrapper = isHero
    ? "border border-white/30 bg-white/10 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-sm"
    : "border border-border bg-bg-surface text-text-primary shadow-sm";
  const focusWrapper = isHero
    ? "border-white shadow-[0_0_0_4px_rgba(255,255,255,0.2)]"
    : "border-accent-primary shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-accent-primary)_20%,transparent)]";
  const iconClass = isHero ? "text-white/70" : "text-text-muted";
  const inputClass = isHero
    ? "text-white placeholder:text-white/65"
    : "text-text-primary placeholder:text-text-muted";
  const clearClass = isHero ? "text-white/70 hover:text-white" : "text-text-muted hover:text-text-primary";
  const submitClass = isHero
    ? "bg-white text-accent-primary-text hover:bg-white/90"
    : "bg-accent-primary text-white hover:opacity-90";

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`.trim()}>
      <div
        className={`flex items-stretch overflow-hidden rounded-xl transition-all motion-fast ${
          isRtl ? "flex-row-reverse" : ""
        } ${baseWrapper} ${isFocused ? focusWrapper : ""}`}
      >
        <div className="relative flex-1">
          <Search
            className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 ${iconClass} ${
              isRtl ? "right-4" : "left-4"
            }`}
          />
          <input
            aria-label={placeholder || submitLabel}
            type="search"
            value={query}
            onChange={(event) => updateValue(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`h-12 w-full bg-transparent text-sm outline-none md:h-14 md:text-base ${inputClass} ${
              isRtl ? "pr-12 pl-12 text-right" : "pl-12 pr-12 text-left"
            }`}
          />

          {query ? (
            <button
              type="button"
              onClick={() => {
                updateValue("");
                onSearch?.("");
              }}
              aria-label={clearLabel}
              className={`absolute top-1/2 -translate-y-1/2 transition-colors ${clearClass} ${
                isRtl ? "left-4" : "right-4"
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>

        <button
          type="submit"
          className={`h-12 shrink-0 px-5 text-sm font-semibold transition-all md:h-14 md:px-6 ${submitClass}`}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

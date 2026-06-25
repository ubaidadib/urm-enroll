import { useMemo } from "react";
import { AnimatePresence, m } from "motion/react";
import { SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

export type SmartFilterId =
  | "best-match"
  | "trending"
  | "high-employability"
  | "scholarships"
  | "english-friendly"
  | "visa-friendly";

interface OptionItem {
  id: string;
  label: string;
}

interface FloatingFiltersProps {
  countryOptions: OptionItem[];
  degreeOptions: OptionItem[];
  languageOptions: OptionItem[];
  selectedCountry: string | null;
  selectedDegree: string | null;
  selectedLanguage: string | null;
  smartFilters: SmartFilterId[];
  onChangeCountry: (value: string | null) => void;
  onChangeDegree: (value: string | null) => void;
  onChangeLanguage: (value: string | null) => void;
  onToggleSmartFilter: (id: SmartFilterId) => void;
  onOpenMobileSheet: () => void;
  onClearAll: () => void;
}

const SMART_FILTER_IDS: SmartFilterId[] = [
  "best-match",
  "trending",
  "high-employability",
  "scholarships",
  "english-friendly",
  "visa-friendly",
];

const SMART_FILTER_LABEL_KEYS: Record<SmartFilterId, string> = {
  "best-match": "programs.discovery.smartFilters.bestMatch",
  trending: "programs.discovery.smartFilters.trending",
  "high-employability": "programs.discovery.smartFilters.highEmployability",
  scholarships: "programs.discovery.smartFilters.scholarships",
  "english-friendly": "programs.discovery.smartFilters.englishFriendly",
  "visa-friendly": "programs.discovery.smartFilters.visaFriendly",
};

export function FloatingFilters({
  countryOptions,
  degreeOptions,
  languageOptions,
  selectedCountry,
  selectedDegree,
  selectedLanguage,
  smartFilters,
  onChangeCountry,
  onChangeDegree,
  onChangeLanguage,
  onToggleSmartFilter,
  onOpenMobileSheet,
  onClearAll,
}: FloatingFiltersProps) {
  const { t } = useLanguage();

  const activeCount = useMemo(
    () => [selectedCountry, selectedDegree, selectedLanguage].filter(Boolean).length + smartFilters.length,
    [selectedCountry, selectedDegree, selectedLanguage, smartFilters]
  );

  return (
    <>
      <section className="sticky top-[76px] z-30 hidden lg:block">
        <div className="rounded-3xl border border-border/80 bg-white/70 p-3 shadow-[0_14px_45px_rgba(15,23,42,0.15)] backdrop-blur-2xl dark:bg-brand-softnav-900/55">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-brand-navy-900 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white dark:bg-brand-steel-500 dark:text-brand-navy-950">
              <Sparkles className="h-3.5 w-3.5" />
              {t<string>("programs.discovery.smartFilters.title")}
            </div>

            <FilterSelect label={t<string>("programs.listing.filters.country")} options={countryOptions} value={selectedCountry} onChange={onChangeCountry} anyLabel={t<string>("common.any")} />
            <FilterSelect label={t<string>("programs.listing.filters.degree")} options={degreeOptions} value={selectedDegree} onChange={onChangeDegree} anyLabel={t<string>("common.any")} />
            <FilterSelect label={t<string>("programs.listing.filters.language")} options={languageOptions} value={selectedLanguage} onChange={onChangeLanguage} anyLabel={t<string>("common.any")} />

            <div className="ml-auto flex items-center gap-2">
              {activeCount > 0 ? (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="inline-flex h-10 items-center gap-1 rounded-xl border border-border px-3 text-xs font-semibold text-text-secondary transition-colors hover:bg-bg-surface-hover hover:text-text-primary"
                >
                  <X className="h-3.5 w-3.5" />
                  {t<string>("programs.discovery.smartFilters.reset")}
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {SMART_FILTER_IDS.map((id) => {
              const active = smartFilters.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onToggleSmartFilter(id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? "bg-brand-steel-500 text-brand-navy-950 shadow-sm"
                      : "border border-border bg-bg-surface text-text-secondary hover:border-brand-steel-400/60"
                  }`}
                >
                  {t<string>(SMART_FILTER_LABEL_KEYS[id])}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-4 z-40 px-4 lg:hidden">
        <button
          type="button"
          onClick={onOpenMobileSheet}
          className="mx-auto flex h-14 w-full max-w-md items-center justify-between rounded-2xl border border-white/30 bg-brand-navy-900/85 px-5 text-white shadow-2xl backdrop-blur-xl"
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="h-4 w-4" />
            {t<string>("programs.discovery.smartFilters.mobileCta")}
          </span>
          <span className="rounded-full bg-brand-steel-500 px-2.5 py-1 text-xs font-bold text-brand-navy-950">
            {activeCount}
          </span>
        </button>
      </div>
    </>
  );
}

interface FilterSelectProps {
  label: string;
  options: OptionItem[];
  value: string | null;
  onChange: (value: string | null) => void;
  anyLabel: string;
}

function FilterSelect({ label, options, value, onChange, anyLabel }: FilterSelectProps) {
  return (
    <label className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-bg-surface px-3 text-xs font-semibold text-text-secondary">
      <span>{label}</span>
      <select
        aria-label={label}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value ? event.target.value : null)}
        className="min-w-28 bg-transparent text-text-primary outline-none"
      >
        <option value="">{anyLabel}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

interface MobileFiltersSheetProps {
  open: boolean;
  onClose: () => void;
  countryOptions: OptionItem[];
  degreeOptions: OptionItem[];
  languageOptions: OptionItem[];
  selectedCountry: string | null;
  selectedDegree: string | null;
  selectedLanguage: string | null;
  smartFilters: SmartFilterId[];
  onChangeCountry: (value: string | null) => void;
  onChangeDegree: (value: string | null) => void;
  onChangeLanguage: (value: string | null) => void;
  onToggleSmartFilter: (id: SmartFilterId) => void;
  onClearAll: () => void;
}

export function MobileFiltersSheet({
  open,
  onClose,
  countryOptions,
  degreeOptions,
  languageOptions,
  selectedCountry,
  selectedDegree,
  selectedLanguage,
  smartFilters,
  onChangeCountry,
  onChangeDegree,
  onChangeLanguage,
  onToggleSmartFilter,
  onClearAll,
}: MobileFiltersSheetProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t<string>("programs.listing.filters.title")}>
          <m.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-navy-900/65"
            onClick={onClose}
          />

          <m.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl border border-border bg-bg-surface p-4 shadow-[0_-12px_45px_rgba(0,0,0,0.35)]"
          >
            <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-border" />
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black text-text-primary">{t<string>("programs.discovery.smartFilters.mobileSheetTitle")}</h2>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <FilterSelect label={t<string>("programs.listing.filters.country")} options={countryOptions} value={selectedCountry} onChange={onChangeCountry} anyLabel={t<string>("common.any")} />
              <FilterSelect label={t<string>("programs.listing.filters.degree")} options={degreeOptions} value={selectedDegree} onChange={onChangeDegree} anyLabel={t<string>("common.any")} />
              <FilterSelect label={t<string>("programs.listing.filters.language")} options={languageOptions} value={selectedLanguage} onChange={onChangeLanguage} anyLabel={t<string>("common.any")} />

              <div className="rounded-2xl border border-border p-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-text-muted">{t<string>("programs.discovery.smartFilters.aiLabel")}</p>
                <div className="flex flex-wrap gap-2">
                  {SMART_FILTER_IDS.map((id) => {
                    const active = smartFilters.includes(id);
                    return (
                      <button
                        key={`mobile-${id}`}
                        type="button"
                        onClick={() => onToggleSmartFilter(id)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          active
                            ? "bg-brand-gold-500 text-brand-navy-950"
                            : "border border-border bg-bg-surface text-text-secondary"
                        }`}
                      >
                        {t<string>(SMART_FILTER_LABEL_KEYS[id])}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onClearAll}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border text-sm font-semibold text-text-secondary"
              >
                {t<string>("programs.listing.filters.clearAll")}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-steel-500 text-sm font-bold text-brand-navy-950"
              >
                {t<string>("programs.discovery.smartFilters.apply")}
              </button>
            </div>
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

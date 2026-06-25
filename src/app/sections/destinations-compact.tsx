import { m } from "motion/react";
import { Globe2, MapPin, ArrowRight, Landmark, TrendingUp, Shield, GraduationCap, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/language-context";
import { usePersonalization } from "@/hooks/usePersonalization";
import { trackRecommendationShown } from "@/utils/tracking";
import { useEffect, useRef } from "react";
import { DESTINATIONS as ALL_DESTINATIONS, TIER_META, type LangKey } from "@/data/destinations";

// ─── Derive compact preview from shared data ─────────────────────────────────

const COMPACT_CODES = ["Germany", "Italy", "Spain", "France", "Canada", "Turkey"];

const DESTINATIONS = ALL_DESTINATIONS
  .filter((d) => COMPACT_CODES.includes(d.code))
  .map((d) => ({
    code: d.code,
    tier: d.tier,
    name: d.name,
    image: d.image.replace("w=1200", "w=600"),
    score: d.nexusBaseScore,
    accent: d.accentSolid,
    tag: TIER_META[d.tier].label,
    featured: d.highlight,
  }));

// ─── Mini Score Arc ───────────────────────────────────────────────────────────

function ScoreArc({ score, accent }: { score: number; accent: string }) {
  const pct = (score / 100) * 94.2;
  return (
    <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
      <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor"
        className="text-border/70" strokeWidth="2.5" />
      <circle cx="18" cy="18" r="15" fill="none"
        stroke={accent} strokeWidth="2.5" strokeLinecap="round"
        strokeDasharray={`${pct} 94.2`} />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DestinationsCompact() {
  const { t, dir, language } = useLanguage();
  const lang = (language as LangKey) || "en";
  const { countryOrder, recordSignal } = usePersonalization();
  const trackedRef = useRef(false);

  // Sort destinations by personalized scores
  const sortedDestinations = (() => {
    const ordered = countryOrder(DESTINATIONS.map((d) => d.code));
    return [...DESTINATIONS].sort(
      (a, b) => ordered.indexOf(a.code) - ordered.indexOf(b.code),
    );
  })();

  // Track recommendation shown once
  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    trackRecommendationShown({ type: "country", items: sortedDestinations.map((d) => d.code) });
  }, [sortedDestinations]);

  const countries = (t("destinations.network.countries") as string[]) || [];
  const homeLogos = (t("destinations.network.germanyInstitutions") as string[]) || [];

  // Build set of routable country names (countries that have a destination profile)
  const routableCountries = new Set(
    ALL_DESTINATIONS.flatMap((d) => [d.code, d.name.en, d.name.ar, d.name.de])
  );

  const tx = (key: string, _fallback: string): string => t<string>(key);

  const stats = [
    { value: "14", label: tx("destinations.stats.countries", "Countries"), icon: Globe2, color: "#10b981" },
    { value: "1,400+", label: tx("destinations.stats.universities", "Universities"), icon: GraduationCap, color: "#3b82f6" },
    { value: "94%", label: tx("destinations.stats.successRate", "Success Rate"), icon: TrendingUp, color: "#f59e0b" },
    { value: "50+", label: tx("destinations.stats.partners", "Direct Partners"), icon: Shield, color: "#4F6B8A" },
  ];

  return (
    <section
      dir={dir}
      className="relative overflow-hidden bg-linear-to-b from-bg-secondary to-bg-primary py-24 dark:from-bg-primary dark:to-bg-secondary"
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-125 h-125 rounded-full blur-[120px] opacity-10" style={{ background: "rgb(212,175,55)" }} />
        <div className="absolute bottom-0 right-0 w-125 h-125 rounded-full blur-[100px] opacity-8" style={{ background: "rgb(0,184,217)" }} />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(var(--grid),0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--grid),0.2) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">

        {/* ── Section Header ── */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-tech/25 bg-accent-tech/8 px-3 py-1.5">
              <Globe2 className="h-3.5 w-3.5 text-accent-tech" />
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-accent-tech">
                {tx("destinations.badge", "Global Access")}
              </span>
            </div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl">
              {tx("destinations.compact.title", "Study Destinations.")}
            </h2>
            <p className="mt-3 max-w-lg text-lg leading-relaxed text-text-secondary">
              {tx(
                "destinations.compact.subtitle",
                "14 countries. 1,400+ universities. Three strategic tiers for every student profile."
              )}
            </p>
          </div>

          <Link
            to="/destinations"
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent-primary px-6 py-3 text-sm font-bold text-ink transition-all duration-200 hover:scale-[1.03] hover:shadow-xl"
            style={{ boxShadow: "0 4px 20px rgba(212,175,55,0.25)" }}
          >
            <span>{tx("destinations.homeCta", "Explore All")}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </m.div>

        {/* ── Stats Row ── */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map(({ value, label, icon: Icon, color }, i) => (
            <m.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="p-5 rounded-2xl transition-all duration-300"
              style={{ background: "rgb(var(--bg-surface) / 0.86)", border: "1.5px solid rgb(var(--border-default) / 0.8)" }}
            >
              <Icon className="w-5 h-5 mb-3" style={{ color }} />
              <div className="text-3xl font-bold" style={{ color: "rgb(212,175,55)" }}>{value}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</div>
            </m.div>
          ))}
        </m.div>

        {/* ── Destination Cards Grid ── */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sortedDestinations.map((dest, i) => (
              <m.div
                key={dest.code}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={`/destinations?country=${dest.code}`}
                  onClick={() => recordSignal({ type: "country_explored", country: dest.code })}
                  className={`group relative block overflow-hidden rounded-2xl border bg-bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(8,21,48,0.12)] ${
                    dest.featured
                      ? "md:col-span-1 border-accent-primary/25 shadow-[0_2px_8px_rgba(8,21,48,0.06)]"
                      : "border-border/80 shadow-[0_2px_8px_rgba(8,21,48,0.06)]"
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name[lang]}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    {/* Accent tint */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-300"
                      style={{ background: `linear-gradient(135deg, ${dest.accent}, transparent)` }}
                    />

                    {/* Tag badge */}
                    {dest.tag && (
                      <div
                        className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-widest"
                        style={{ backgroundColor: dest.accent }}
                      >
                        {dest.tag[lang]}
                      </div>
                    )}

                    {/* Score arc top-right */}
                    <div className="absolute top-2 right-2 flex items-center justify-center">
                      <div className="relative">
                        <ScoreArc score={dest.score} accent={dest.accent} />
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white">
                          {dest.score}
                        </span>
                      </div>
                    </div>

                    {/* Name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-black text-white text-base leading-tight">
                        {dest.name[lang]}
                      </h3>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="flex items-center justify-between border-t border-border/80 bg-bg-surface px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dest.accent }} />
                      <span className="text-[11px] font-bold uppercase tracking-wide text-text-muted">
                        {tx("destinations.card.fitScore", "Fit Score")}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-all" style={{ color: "rgba(212,175,55,0.4)" }} />
                  </div>
                </Link>
              </m.div>
            ))}
          </div>
        </m.div>

        {/* ── Partners Strip + CTA Card ── */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgb(var(--bg-surface) / 0.88)", border: "1.5px solid rgb(var(--border-default) / 0.8)" }}
        >
          <div className="grid lg:grid-cols-12">

            {/* Left: Dark CTA panel */}
            <div className="relative flex flex-col justify-between overflow-hidden p-10 lg:col-span-4" style={{ background: "rgb(var(--bg-primary) / 0.75)" }}>
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.08), transparent)" }} />

              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-primary/30 bg-accent-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-primary">
                  <Landmark className="w-3.5 h-3.5" />
                  {tx("destinations.network.germanyPartnersTitle", "Germany Partners")}
                </div>
                <h3 className="mb-3 text-3xl font-bold leading-tight text-text-primary">
                  {tx("destinations.compact.partnerTitle", "1,400+ verified institutions.")}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {tx(
                    "destinations.compact.partnerSub",
                    "Direct agreements and platform access to universities, language schools, and medical institutions."
                  )}
                </p>
              </div>

              <div className="relative z-10 mt-8">
                <Link
                  to="/destinations"
                  className="group inline-flex items-center gap-2 rounded-xl bg-accent-primary px-6 py-3 text-sm font-bold text-ink transition-all duration-200 hover:scale-[1.03]"
                  style={{ boxShadow: "0 4px 20px rgba(212,175,55,0.25)" }}
                >
                  <span>{tx("destinations.homeCta", "Explore All Destinations")}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right: Partner logos + country pills */}
            <div className="space-y-10 p-10 lg:col-span-8" style={{ borderLeft: "1px solid rgb(var(--border-default) / 0.8)" }}>

              {/* Partner institution tags */}
              <div>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">
                  {tx("destinations.network.germanyPartnersTitle", "Featured Partners")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(homeLogos.length > 0 ? homeLogos : [
                    "TU Munich", "LMU Munich", "Heidelberg Uni", "HU Berlin",
                    "RWTH Aachen", "KIT", "Uni Hamburg", "Charité Berlin"
                  ]).slice(0, 10).map((logo, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-default"
                      style={{ background: "rgb(var(--bg-primary) / 0.58)", border: "1px solid rgb(var(--border-default) / 0.8)", color: "rgb(var(--text-secondary))" }}
                    >
                      {logo}
                    </span>
                  ))}
                  {(homeLogos.length > 10) && (
                    <span className="rounded-xl px-4 py-2 text-xs font-medium" style={{ border: "1px dashed rgba(212,175,55,0.2)", color: "rgb(var(--text-muted))" }}>
                      +{homeLogos.length - 10} {tx("destinations.compact.more", "more")}
                    </span>
                  )}
                </div>
              </div>

              <div className="h-px" style={{ background: "rgb(var(--border-default) / 0.8)" }} />

              {/* Country network pills */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-text-muted" />
                  <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
                    {tx("destinations.network.title", "Global Network")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(countries.length > 0 ? countries : ALL_DESTINATIONS.map((d) => d.name[lang])).map((country, i) =>
                    routableCountries.has(country) ? (
                    <Link
                      key={i}
                      to={`/destinations?country=${country}`}
                      className="group flex items-center gap-2 rounded-xl border border-border bg-bg-primary/52 px-4 py-2 text-text-secondary transition-all duration-200 hover:border-accent-primary/40 hover:text-text-primary"
                    >
                      <div className="w-1.5 h-1.5 rounded-full group-hover:scale-125 transition-transform" style={{ background: "rgb(212,175,55)" }} />
                      <span className="text-xs font-semibold">{country}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" style={{ color: "rgb(212,175,55)" }} />
                    </Link>
                    ) : (
                    <span
                      key={i}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl"
                      style={{ border: "1px solid rgb(var(--border-default) / 0.8)", background: "rgb(var(--bg-primary) / 0.35)" }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(105,133,166,0.4)" }} />
                      <span className="text-xs font-semibold text-text-muted">
                        {country}
                      </span>
                    </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </m.div>

      </div>
    </section>
  );
}
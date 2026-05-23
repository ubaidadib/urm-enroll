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
        className="text-white/10" strokeWidth="2.5" />
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
      className="relative py-24 bg-[#f8f7f4] dark:bg-slate-900 overflow-hidden transition-colors duration-500"
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-125 h-125 rounded-full bg-emerald-400/8 dark:bg-emerald-400/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-125 h-125 rounded-full bg-blue-400/8 dark:bg-blue-400/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-size-[32px_32px]" />
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-300/50 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-sm mb-5">
              <Globe2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-slate-500 dark:text-slate-400">
                {tx("destinations.badge", "Global Access")}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
              {tx("destinations.compact.title", "Study Destinations.")}
            </h2>
            <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              {tx(
                "destinations.compact.subtitle",
                "14 countries. 1,400+ universities. Three strategic tiers for every student profile."
              )}
            </p>
          </div>

          <Link
            to="/destinations"
            className="group shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black hover:opacity-80 transition-opacity shadow-lg"
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
              className="p-5 rounded-2xl bg-white dark:bg-[#0d1829] border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_8px_rgba(8,21,48,0.06)] hover:shadow-[0_8px_32px_rgba(8,21,48,0.12)] transition-shadow"
            >
              <Icon className="w-5 h-5 mb-3" style={{ color }} />
              <div className="text-3xl font-black text-slate-900 dark:text-white">{value}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-1">{label}</div>
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
                  className={`group relative block rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-[0_8px_32px_rgba(8,21,48,0.12)] hover:-translate-y-1 ${
                    dest.featured
                      ? "md:col-span-1 border-transparent shadow-[0_2px_8px_rgba(8,21,48,0.06)]"
                      : "border-slate-200/80 dark:border-slate-800 shadow-[0_2px_8px_rgba(8,21,48,0.06)]"
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
                  <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dest.accent }} />
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                        {tx("destinations.card.fitScore", "Fit Score")}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
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
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 glass-card-light overflow-hidden"
        >
          <div className="grid lg:grid-cols-12">

            {/* Left: Dark CTA panel */}
            <div className="lg:col-span-4 relative bg-slate-950 p-10 flex flex-col justify-between overflow-hidden">
              {/* Subtle grid on dark */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute inset-0 bg-linear-to-br from-emerald-500/15 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80 text-[10px] font-black uppercase tracking-widest mb-6">
                  <Landmark className="w-3.5 h-3.5" />
                  {tx("destinations.network.germanyPartnersTitle", "Germany Partners")}
                </div>
                <h3 className="text-3xl font-black text-white leading-tight mb-3">
                  {tx("destinations.compact.partnerTitle", "1,400+ verified institutions.")}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {tx(
                    "destinations.compact.partnerSub",
                    "Direct agreements and platform access to universities, language schools, and medical institutions."
                  )}
                </p>
              </div>

              <div className="relative z-10 mt-8">
                <Link
                  to="/destinations"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl text-sm font-black hover:bg-slate-100 transition-colors shadow-lg"
                >
                  <span>{tx("destinations.homeCta", "Explore All Destinations")}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right: Partner logos + country pills */}
            <div className="lg:col-span-8 p-10 space-y-10">

              {/* Partner institution tags */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                  {tx("destinations.network.germanyPartnersTitle", "Featured Partners")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(homeLogos.length > 0 ? homeLogos : [
                    "TU Munich", "LMU Munich", "Heidelberg Uni", "HU Berlin",
                    "RWTH Aachen", "KIT", "Uni Hamburg", "Charité Berlin"
                  ]).slice(0, 10).map((logo, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/8 text-slate-700 dark:text-slate-300 text-xs font-bold hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default"
                    >
                      {logo}
                    </span>
                  ))}
                  {(homeLogos.length > 10) && (
                    <span className="px-4 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-xs font-medium">
                      +{homeLogos.length - 10} {tx("destinations.compact.more", "more")}
                    </span>
                  )}
                </div>
              </div>

              <div className="h-px bg-slate-100 dark:bg-white/5" />

              {/* Country network pills */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    {tx("destinations.network.title", "Global Network")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(countries.length > 0 ? countries : ALL_DESTINATIONS.map((d) => d.name[lang])).map((country, i) =>
                    routableCountries.has(country) ? (
                    <Link
                      key={i}
                      to={`/destinations?country=${country}`}
                      className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/3 hover:border-slate-300 dark:hover:border-white/15 hover:bg-white dark:hover:bg-white/8 transition-all"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {country}
                      </span>
                      <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                    ) : (
                    <span
                      key={i}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
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
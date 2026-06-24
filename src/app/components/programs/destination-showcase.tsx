import { m } from "motion/react";
import { Globe2, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

interface DestinationCard {
  id: string;
  country: string;
  programCount: number;
  flag?: string;
  image?: string;
}

interface DestinationShowcaseProps {
  destinations: DestinationCard[];
  onSelectDestination: (country: string) => void;
}

export function DestinationShowcase({ destinations, onSelectDestination }: DestinationShowcaseProps) {
  const { t } = useLanguage();

  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* Section header */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">{t<string>("programs.discovery.destinations.eyebrow")}</p>
          <h2 className="mt-2 text-3xl font-black text-text-primary">
            {t<string>("programs.discovery.destinations.title")}
          </h2>
          <p className="mt-3 max-w-2xl text-text-secondary">
            {t<string>("programs.discovery.destinations.description")}
          </p>
        </m.div>

        {/* Destinations grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination, index) => (
            <m.button
              key={destination.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              onClick={() => onSelectDestination(destination.country)}
              className="group relative overflow-hidden rounded-3xl border border-border bg-white transition-all hover:border-brand-gold-400/60 hover:shadow-[0_20px_48px_rgba(212,175,55,0.12)] dark:bg-brand-softnav-800/50 dark:hover:shadow-[0_20px_48px_rgba(212,175,55,0.08)]"
            >
              {/* Background image */}
              {destination.image && (
                <div className="absolute inset-0 -z-10">
                  <img
                    src={destination.image}
                    alt={destination.country}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
              )}

              {/* Fallback background gradient */}
              {!destination.image && (
                <>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-softnav-100 to-brand-steel-100 dark:from-brand-softnav-900/30 dark:to-brand-steel-900/20" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-brand-gold-500/5 to-transparent group-hover:from-brand-gold-500/10 transition-all" />
                </>
              )}

              {/* Content */}
              <div className="relative flex flex-col justify-between h-64 p-6">
                {/* Top section with flag/icon */}
                <div className="flex items-start justify-between">
                  <div className="text-5xl font-black text-white drop-shadow-lg">{destination.flag || "🌍"}</div>
                  <Globe2 className="h-5 w-5 text-brand-gold-400 drop-shadow" />
                </div>

                {/* Bottom section */}
                <div className="space-y-3 text-left">
                  <div>
                    <h3 className="text-2xl font-black text-white drop-shadow">{destination.country}</h3>
                    <p className="mt-1 text-sm font-semibold text-white/80">
                      {t<string>("programs.discovery.destinations.programsAvailable").replace("{{count}}", String(destination.programCount))}
                    </p>
                  </div>

                  {/* CTA indicator */}
                  <div className="inline-flex items-center gap-1 rounded-full bg-brand-gold-400 px-3 py-1 text-xs font-bold text-brand-navy-950 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t<string>("programs.discovery.destinations.explore")} <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </m.button>
          ))}
        </div>
      </div>
    </section>
  );
}

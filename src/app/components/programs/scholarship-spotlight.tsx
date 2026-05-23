import { m } from "motion/react";
import { Award, Sparkles } from "lucide-react";

interface ScholarshipSpotlightProps {
  scholarshipCount: number;
  onViewScholarships: () => void;
}

export function ScholarshipSpotlight({ scholarshipCount, onViewScholarships }: ScholarshipSpotlightProps) {
  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-brand-gold-400/40 bg-gradient-to-br from-brand-gold-100/60 via-brand-sand-100/40 to-brand-steel-100/30 p-8 dark:from-brand-gold-900/20 dark:via-brand-sand-900/10 dark:to-brand-steel-900/10"
        >
          {/* Decorative glow elements */}
          <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-brand-gold-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-brand-sand-500/8 blur-2xl" />

          <div className="relative">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              {/* Left content */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-brand-gold-500/20 p-3">
                    <Award className="h-6 w-6 text-brand-gold-600" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-gold-700 dark:text-brand-gold-300">
                    Scholarship Accelerator
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-black text-text-primary">
                    Unlock full-funded pathways to your dream program
                  </h3>
                  <p className="mt-3 text-text-secondary">
                    Discover {scholarshipCount}+ programs with active scholarship opportunities. Get AI-powered funding
                    recommendations and timeline guidance to maximize your chances.
                  </p>
                </div>

                {/* Key benefits */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-brand-gold-600" />
                    <span className="text-sm font-semibold text-text-secondary">Full-funded & partial scholarships</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-brand-gold-600" />
                    <span className="text-sm font-semibold text-text-secondary">AI funding match scoring</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-brand-gold-600" />
                    <span className="text-sm font-semibold text-text-secondary">Application timeline planning</span>
                  </div>
                </div>

                {/* CTA Button */}
                <m.button
                  type="button"
                  onClick={onViewScholarships}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-brand-navy-900 px-6 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl dark:bg-brand-gold-600 dark:text-brand-navy-950"
                >
                  Explore Scholarship Programs
                  <Sparkles className="h-4 w-4" />
                </m.button>
              </div>

              {/* Right side - Visual element */}
              <div className="hidden lg:block">
                <m.div
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="relative"
                >
                  {/* Premium stat cards */}
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-brand-gold-400/40 bg-white/50 backdrop-blur-sm p-4 dark:bg-brand-softnav-900/40">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                        Total Funding Available
                      </p>
                      <p className="mt-2 text-3xl font-black text-brand-gold-600">€2.4B+</p>
                    </div>

                    <div className="rounded-2xl border border-brand-steel-400/40 bg-white/50 backdrop-blur-sm p-4 dark:bg-brand-softnav-900/40">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                        Success Rate
                      </p>
                      <p className="mt-2 text-3xl font-black text-brand-steel-600">73%</p>
                    </div>

                    <div className="rounded-2xl border border-brand-softnav-400/40 bg-white/50 backdrop-blur-sm p-4 dark:bg-brand-softnav-900/40">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                        Average Award
                      </p>
                      <p className="mt-2 text-3xl font-black text-brand-softnav-600">€18,500</p>
                    </div>
                  </div>

                  {/* Decorative accent */}
                  <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-brand-gold-400/15 blur-3xl" />
                </m.div>
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

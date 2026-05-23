import { m } from "motion/react";
import { Compass, Sparkles } from "lucide-react";

interface FinalCtaSectionProps {
  onStartMatch: () => void;
  onCompare: () => void;
}

export function FinalCtaSection({ onStartMatch, onCompare }: FinalCtaSectionProps) {
  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-border bg-gradient-to-br from-bg-surface to-brand-softnav-50/40 p-12 text-center dark:from-brand-softnav-900/40 dark:to-brand-softnav-900/20 dark:border-border/50"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none">
            <div className="absolute -top-20 left-1/4 h-40 w-40 rounded-full bg-brand-gold-500/8 blur-3xl" />
            <div className="absolute -bottom-20 right-1/4 h-40 w-40 rounded-full bg-brand-steel-500/8 blur-3xl" />
          </div>

          <div className="relative space-y-6">
            {/* Headline */}
            <m.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-3xl font-black text-text-primary sm:text-4xl"
            >
              Ready to discover your next global career move?
            </m.h2>

            {/* Subtext */}
            <m.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mx-auto max-w-2xl text-lg text-text-secondary"
            >
              Create your AI profile, compare future outcomes, and get personalized recommendations that align with your
              ambitions, lifestyle, and budget.
            </m.p>

            {/* CTA Buttons */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-4"
            >
              {/* Primary CTA */}
              <m.button
                type="button"
                onClick={onStartMatch}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 24px 48px rgba(212, 175, 55, 0.24)",
                }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-navy-900 to-brand-navy-800 px-8 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl dark:from-brand-gold-600 dark:to-brand-gold-500 dark:text-brand-navy-950"
              >
                <Sparkles className="h-5 w-5" />
                Start AI Match
              </m.button>

              {/* Secondary CTA */}
              <m.button
                type="button"
                onClick={onCompare}
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgb(212, 175, 55)",
                }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-white px-8 py-4 font-bold text-text-primary shadow-sm transition-all hover:border-brand-gold-400/70 hover:shadow-md dark:bg-brand-softnav-800/50 dark:text-white dark:border-border/50"
              >
                <Compass className="h-5 w-5" />
                Compare Programs
              </m.button>
            </m.div>

            {/* Trust note */}
            <m.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xs text-text-muted"
            >
              ✓ No hidden fees • ✓ Free advice • ✓ 24/7 expert support
            </m.p>
          </div>
        </m.div>
      </div>
    </section>
  );
}

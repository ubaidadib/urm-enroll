import { Link } from "react-router-dom";
import { m } from "motion/react";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

const AVATARS = ["NA", "MK", "YP", "AF", "LT"];

export function HomeFinalCtaBanner() {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 premium-grid opacity-30 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] border border-border/55 bg-background-surface/82 backdrop-blur-xl p-7 md:p-10 lg:p-12 shadow-[0_24px_56px_rgba(8,24,52,0.22)]"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent-primary/16 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-accent-tech/16 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-[1fr_320px] gap-8 items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background-primary/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-secondary mb-5">
                <Sparkles className="w-3.5 h-3.5 text-accent-tech" />
                Personalized Admissions Support
              </div>

              <h2 className="text-[clamp(1.9rem,4vw,3.1rem)] font-bold text-text-primary tracking-tight leading-[1.08]">
                Ready to Find Your Dream University?
              </h2>
              <p className="text-text-secondary text-[clamp(1rem,1.3vw,1.16rem)] mt-4 leading-relaxed">
                Build your shortlist, compare options, and start applications with confidence.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/programs"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-linear-to-r from-accent-primary to-accent-tech text-ink font-semibold hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(28,115,178,0.3)] transition-all"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-border/65 bg-background-primary/70 text-text-primary font-semibold hover:bg-background-hover transition-all"
                >
                  Speak to Advisor
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background-primary/75 backdrop-blur p-4">
              <div className="flex items-center mb-3">
                {AVATARS.map((avatar, index) => (
                  <span
                    key={avatar}
                    className="w-9 h-9 rounded-full border-2 border-background-primary bg-accent-tech/15 text-accent-tech text-xs font-bold flex items-center justify-center"
                    style={{ marginInlineStart: index === 0 ? 0 : -10 }}
                  >
                    {avatar}
                  </span>
                ))}
              </div>

              <p className="text-sm font-semibold text-text-primary">2,400+ students enrolled this year</p>
              <p className="text-xs text-text-secondary mt-1">Across 50+ partner universities in Europe</p>

              <div className="mt-4 rounded-xl border border-border/55 bg-background-surface/75 p-3 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-text-secondary">Trusted by students from 20+ countries</span>
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

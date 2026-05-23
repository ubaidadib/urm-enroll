import { m } from "motion/react";
import { Link } from "react-router-dom";
import { FileSearch, School, FileCheck2, PlaneTakeoff, ArrowRight } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Discover Programs",
    description: "Browse curated university programs that match your goals, budget, and destination preferences.",
    icon: FileSearch,
  },
  {
    number: "02",
    title: "Shortlist Universities",
    description: "Compare admission criteria, tuition, and outcomes to build your best-fit shortlist.",
    icon: School,
  },
  {
    number: "03",
    title: "Prepare Application",
    description: "Get guided support for documents, language proofs, and timeline planning.",
    icon: FileCheck2,
  },
  {
    number: "04",
    title: "Start Your Journey",
    description: "Submit confidently and move from acceptance to relocation with ongoing assistance.",
    icon: PlaneTakeoff,
  },
] as const;

export function HomeHowItWorks() {
  return (
    <section className="py-20 md:py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-sm tracking-[0.2em] uppercase text-text-muted mb-3">Simple Process</p>
          <h2 className="text-3xl md:text-4xl font-black text-text-primary">How It Works</h2>
        </m.div>

        <div className="hidden lg:block relative mb-10">
          <div className="absolute left-0 right-0 top-10 border-t-2 border-dashed border-border" />
          <div className="grid grid-cols-4 gap-6">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <m.div
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="relative"
                >
                  <div className="w-20 h-20 rounded-full bg-accent-primary text-white mx-auto mb-5 flex items-center justify-center border-4 border-bg-primary z-10 relative">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold tracking-widest text-accent-primary mb-2">STEP {step.number}</p>
                    <h3 className="text-xl font-bold text-text-primary mb-2">{step.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:hidden mb-10">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <m.div
                key={step.number}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="rounded-2xl border border-border bg-bg-surface p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest text-accent-primary mb-1">STEP {step.number}</p>
                    <h3 className="text-lg font-bold text-text-primary mb-1">{step.title}</h3>
                    <p className="text-sm text-text-secondary">{step.description}</p>
                  </div>
                </div>
              </m.div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-accent-primary text-white font-semibold hover:shadow-lg transition-all"
          >
            Explore Programs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

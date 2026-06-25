import { m } from "motion/react";

const TESTIMONIALS = [
  {
    name: "Amina Khaled",
    initials: "AK",
    country: "🇪🇬",
    university: "Technical University of Munich",
    quote:
      "URM Enroll helped me compare options clearly and submit my application with confidence. I got accepted faster than expected.",
  },
  {
    name: "Luca Moretti",
    initials: "LM",
    country: "🇮🇹",
    university: "University of Amsterdam",
    quote:
      "The guidance was practical and transparent. From shortlist to visa prep, each step was simple and well-structured.",
  },
  {
    name: "Sara Al-Hassan",
    initials: "SA",
    country: "🇯🇴",
    university: "Sorbonne University",
    quote:
      "I loved how easy it was to find programs by field. The advisor support made the whole process feel manageable.",
  },
] as const;

export function HomeTestimonials() {
  return (
    <section className="py-20 md:py-24 bg-bg-secondary/40">
      <div className="max-w-7xl mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm tracking-[0.2em] uppercase text-text-muted mb-3">Student Voices</p>
          <h2 className="text-3xl md:text-4xl font-black text-text-primary">What Our Students Say</h2>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, index) => (
            <m.article
              key={item.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="rounded-2xl border border-border/80 bg-bg-surface p-6 shadow-[0_2px_8px_rgba(8,21,48,0.06)] transition-shadow hover:shadow-[0_8px_32px_rgba(8,21,48,0.12)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-accent-tech/15 text-accent-tech font-bold flex items-center justify-center">
                  {item.initials}
                </div>
                <div>
                  <p className="font-bold text-text-primary leading-tight">
                    {item.name} <span className="ml-1">{item.country}</span>
                  </p>
                  <p className="text-sm text-text-secondary">{item.university}</p>
                </div>
              </div>
              <div className="text-amber-500 text-sm mb-3">★★★★★</div>
              <p className="text-sm leading-relaxed text-text-secondary">"{item.quote}"</p>
            </m.article>
          ))}
        </div>
      </div>
    </section>
  );
}

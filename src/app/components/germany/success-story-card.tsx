import { m } from "motion/react";
import { Quote, MapPin, Briefcase, Star } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import type { GermanyTestimonial } from "@/data/germany/germanyTestimonials";

export function SuccessStoryCard({
  testimonial,
  index = 0,
}: {
  testimonial: GermanyTestimonial;
  index?: number;
}) {
  const { t } = useLanguage();
  return (
    <m.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative p-6 rounded-2xl border border-border bg-background-surface hover:shadow-[0_24px_60px_-30px_rgba(11,21,48,0.3)] transition-shadow"
    >
      <Quote className="absolute -top-3 -left-2 w-7 h-7 text-accent-primary" />
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 text-accent-primary fill-accent-primary" />
        ))}
      </div>
      <p className="text-sm md:text-base text-text-primary leading-relaxed italic">
        “{t<string>(`chancenkarte.successStories.entries.${testimonial.id}.quote`)}”
      </p>
      <div className="mt-5 pt-4 border-t border-border">
        <p className="font-semibold text-text-primary">
          {t<string>(`chancenkarte.successStories.entries.${testimonial.id}.name`)}
        </p>
        <p className="text-xs text-text-secondary mt-1">
          {t<string>(`chancenkarte.successStories.entries.${testimonial.id}.title`)}
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            {t<string>(`chancenkarte.successStories.cities.${testimonial.cityKey}`)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="w-3 h-3" />
            {t<string>(`germany.professions.items.${testimonial.professionKey}.label`)}
          </span>
          <span>
            {t<string>("chancenkarte.successStories.arrivedIn")} · {testimonial.yearArrived}
          </span>
        </div>
      </div>
    </m.article>
  );
}

import { m } from "motion/react";
import { Star } from "lucide-react";

interface SuccessStory {
  id: string;
  quote: string;
  studentName: string;
  program: string;
  country: string;
  image?: string;
}

interface SuccessStoriesProps {
  stories: SuccessStory[];
}

export function SuccessStories({ stories }: SuccessStoriesProps) {
  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        {/* Section header */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Student Voices</p>
          <h2 className="mt-2 text-3xl font-black text-text-primary">
            How students like you transformed their futures
          </h2>
        </m.div>

        {/* Stories grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, index) => (
            <m.article
              key={story.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="group rounded-3xl border border-border bg-white p-6 transition-all hover:border-brand-gold-400/50 hover:shadow-[0_20px_48px_rgba(15,23,42,0.1)] dark:bg-brand-softnav-800/60 dark:border-border/50 dark:hover:shadow-[0_20px_48px_rgba(212,175,55,0.08)]"
            >
              {/* Star rating */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-brand-gold-500 text-brand-gold-500"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mt-4">
                <p className="text-sm leading-relaxed text-text-secondary">
                  &quot;{story.quote}&quot;
                </p>
              </blockquote>

              {/* Student info */}
              <div className="mt-6 border-t border-border pt-4 dark:border-border/50">
                <p className="font-semibold text-text-primary">{story.studentName}</p>
                <p className="text-xs text-text-muted mt-1">{story.program}</p>
                <p className="text-xs text-brand-steel-600 dark:text-brand-steel-400 font-medium mt-1">
                  📍 {story.country}
                </p>
              </div>

              {/* Hover accent */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </m.article>
          ))}
        </div>
      </div>
    </section>
  );
}

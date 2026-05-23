import { useEffect, useMemo, useState } from "react";
import { m, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedUniversities } from "@/data/universities";
import { UniversityCardModern } from "../components/ui/modern-cards";

const SLIDE_VARIANTS = {
  enter: (dir: number) => ({ x: dir > 0 ? "35%" : "-35%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-35%" : "35%", opacity: 0 }),
};

const SLIDE_TRANSITION = { type: "spring" as const, stiffness: 260, damping: 30, mass: 0.9 };

export function FeaturedUniversitiesCarousel() {
  const featured = useMemo(() => getFeaturedUniversities(6), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || featured.length < 2) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [featured.length, isPaused]);

  const visible = useMemo(() => {
    if (featured.length === 0) return [];
    const count = Math.min(3, featured.length);
    return Array.from({ length: count }, (_, i) => featured[(currentIndex + i) % featured.length])
      .filter((university): university is (typeof featured)[number] => Boolean(university));
  }, [featured, currentIndex]);

  const handlePrev = () => {
    if (featured.length < 2) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const handleNext = () => {
    if (featured.length < 2) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="relative py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 premium-grid opacity-45 pointer-events-none" />
      <div className="absolute -top-20 -right-16 w-[24rem] h-[24rem] rounded-full bg-accent-primary/16 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-10 w-[20rem] h-[20rem] rounded-full bg-accent-tech/16 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-9 flex items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-text-muted mb-3 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-accent-tech" />
              Top Picks
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">Featured Universities</h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/universities" className="text-sm text-accent-tech font-semibold hover:underline">
              View All
            </Link>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-xl border border-border/65 bg-background-surface/85 text-text-primary hover:bg-background-hover transition-all flex items-center justify-center"
                aria-label="Previous featured universities"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-xl border border-border/65 bg-background-surface/85 text-text-primary hover:bg-background-hover transition-all flex items-center justify-center"
                aria-label="Next featured universities"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <m.div
              key={currentIndex}
              custom={direction}
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={SLIDE_TRANSITION}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              {visible.map((university) => (
                <UniversityCardModern
                  key={`${university.id}-${currentIndex}`}
                  variant="featured"
                  id={university.id}
                  countryCode={university.countryCode}
                  name={university.name}
                  country={university.country}
                  city={university.city}
                  programsCount={university.programsCount}
                  logo={university.logo}
                  coverPhoto={university.coverPhoto}
                  ranking={university.ranking}
                  type={university.type}
                  languages={university.languages.slice(0, 2)}
                  established={university.established}
                  description={university.description}
                  website={university.website}
                />
              ))}
            </m.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {featured.map((u, index) => (
            <button
              key={u.id}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2.5 rounded-full transition-all ${currentIndex === index ? "w-9 bg-accent-tech" : "w-2.5 bg-border"}`}
              aria-label={`Go to featured university ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

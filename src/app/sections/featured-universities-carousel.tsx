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
    <section className="relative overflow-hidden bg-linear-to-b from-bg-secondary to-bg-primary py-20 md:py-24 dark:from-bg-primary dark:to-bg-secondary">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(var(--grid),0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--grid),0.2) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
      <div className="absolute -top-20 -right-16 w-[24rem] h-[24rem] rounded-full blur-[100px] pointer-events-none" style={{ background: "rgba(212,175,55,0.06)" }} />
      <div className="absolute -bottom-20 -left-10 w-[20rem] h-[20rem] rounded-full blur-[100px] pointer-events-none" style={{ background: "rgba(0,184,217,0.06)" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-9 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-accent-primary">
              <Sparkles className="w-3.5 h-3.5" />
              Top Picks
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">Featured Universities</h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/universities" className="text-sm font-semibold text-accent-tech transition-opacity hover:opacity-70">
              View All
            </Link>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-surface text-text-secondary transition-all duration-200 hover:border-accent-primary/50 hover:text-text-primary"
                aria-label="Previous featured universities"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-surface text-text-secondary transition-all duration-200 hover:border-accent-primary/50 hover:text-text-primary"
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
              className={`h-2 rounded-full transition-all ${currentIndex === index ? "w-8" : "w-2"}`}
            style={{ background: currentIndex === index ? "rgb(212,175,55)" : "rgba(212,175,55,0.2)" }}
              aria-label={`Go to featured university ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

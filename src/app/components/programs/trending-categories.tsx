import { m } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

interface TrendingCategory {
  id: string;
  name: string;
  icon?: string;
  count?: number;
}

interface TrendingCategoriesPillsProps {
  categories: TrendingCategory[];
  onSelectCategory: (id: string) => void;
  selectedCategory?: string | null;
}

export function TrendingCategoriesPills({
  categories,
  onSelectCategory,
  selectedCategory,
}: TrendingCategoriesPillsProps) {
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      setCanScrollLeft(scrollContainerRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollContainerRef.current.scrollLeft <
          scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const amount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-600 dark:text-text-muted">{t<string>("programs.discovery.trending.eyebrow")}</p>
          <h2 className="mt-1 text-2xl font-black text-gray-900 dark:text-text-primary">{t<string>("programs.discovery.trending.title")}</h2>
        </div>

        {/* Scroll container with gradient fade */}
        <div className="relative group">
          {/* Left fade gradient */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-bg-primary to-transparent z-10 pointer-events-none" />
          )}

          {/* Right fade gradient */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-bg-primary to-transparent z-10 pointer-events-none" />
          )}

          {/* Scroll buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 hidden lg:flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 dark:border-border bg-white dark:bg-bg-surface shadow-md transition-all hover:bg-gray-100 dark:hover:bg-brand-navy-900/10"
              aria-label={t<string>("common.aria.scrollLeft")}
            >
              <ChevronLeft className="h-5 w-5 text-gray-900 dark:text-text-primary" />
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 hidden lg:flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 dark:border-border bg-white dark:bg-bg-surface shadow-md transition-all hover:bg-gray-100 dark:hover:bg-brand-navy-900/10"
              aria-label={t<string>("common.aria.scrollRight")}
            >
              <ChevronRight className="h-5 w-5 text-gray-900 dark:text-text-primary" />
            </button>
          )}

          {/* Pills container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
          >
            {categories.map((category, index) => (
              <m.button
                key={category.id}
                type="button"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04, duration: 0.4 }}
                onClick={() => onSelectCategory(category.id)}
                className={`flex-shrink-0 inline-flex items-center gap-2 snap-center px-5 py-3 rounded-full font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-brand-navy-900 dark:bg-brand-gold-500 text-white dark:text-brand-navy-950 shadow-lg border border-brand-gold-400/50 dark:border-brand-gold-400"
                    : "bg-white dark:bg-bg-surface text-gray-900 dark:text-text-primary border border-gray-300 dark:border-border hover:border-brand-gold-400/70 dark:hover:border-brand-gold-400/50 hover:shadow-md"
                }`}
              >
                {category.icon && <span className="text-lg">{category.icon}</span>}
                <span>{category.name}</span>
                {category.count && (
                  <span
                    className={`text-xs font-bold ml-1 ${
                      selectedCategory === category.id
                        ? "text-brand-gold-300"
                        : "text-text-muted"
                    }`}
                  >
                    {category.count}+
                  </span>
                )}
              </m.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

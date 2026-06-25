import { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useLanguage } from "@/i18n/language-context";

interface HorizontalScrollCarouselProps {
  title: string;
  items: ReactNode[];
  viewAllHref?: string;
}

export function HorizontalScrollCarousel({ title, items, viewAllHref }: HorizontalScrollCarouselProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const canShowArrows = useMemo(() => items.length > 1, [items.length]);

  const scrollByAmount = (direction: "left" | "right") => {
    const node = containerRef.current;
    if (!node) return;
    const amount = Math.round(node.clientWidth * 0.8);
    node.scrollBy({ left: direction === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="group">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-2xl font-bold text-text-primary">{title}</h3>
        {viewAllHref ? (
          <Link to={viewAllHref} className="text-sm font-semibold text-accent-primary transition-colors hover:text-accent-primary-hover">
            View All →
          </Link>
        ) : null}
      </div>

      <div className="relative">
        {canShowArrows ? (
          <>
            <button
              type="button"
              onClick={() => scrollByAmount("left")}
              className="absolute left-2 top-1/2 z-10 hidden min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-surface/90 text-text-primary opacity-0 shadow transition-opacity group-hover:opacity-100 lg:inline-flex"
              aria-label={t<string>("common.aria.scrollLeft")}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              className="absolute right-2 top-1/2 z-10 hidden min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-surface/90 text-text-primary opacity-0 shadow transition-opacity group-hover:opacity-100 lg:inline-flex"
              aria-label={t<string>("common.aria.scrollRight")}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        ) : null}

        <div
          ref={containerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        >
          {items.map((item, index) => (
            <div key={index} className="min-w-[280px] flex-1 snap-start sm:min-w-[340px] lg:min-w-[360px]">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

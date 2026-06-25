export function SectionSkeleton() {
  return (
    <section className="page-section-y px-[var(--content-gutter)]">
      <div className="content-shell animate-pulse">
        <div className="premium-filter-panel rounded-[1.75rem] p-6 md:p-8">
          <div className="h-8 w-44 rounded-full bg-accent-primary/12 mb-6" />
          <div className="h-12 w-3/4 max-w-3xl rounded-2xl bg-bg-secondary/85 mb-4" />
          <div className="h-6 w-2/3 max-w-2xl rounded-xl bg-bg-secondary/70 mb-10" />
          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-44 rounded-2xl border border-border/55 bg-bg-surface/72 shadow-premium-soft" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

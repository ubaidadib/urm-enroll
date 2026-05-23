export function SectionSkeleton() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6 animate-pulse">
        <div className="h-6 w-40 bg-background-surface/30 rounded-full mb-6" />
        <div className="h-10 w-3/4 bg-background-surface/35 rounded-lg mb-4" />
        <div className="h-6 w-2/3 bg-background-surface/25 rounded-lg mb-10" />
        <div className="grid md:grid-cols-3 gap-6">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-40 rounded-2xl bg-background-surface/25 border border-border/55" />
          ))}
        </div>
      </div>
    </section>
  );
}

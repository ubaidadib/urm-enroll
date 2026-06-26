import { useMemo } from "react";
import { Link } from "react-router-dom";
import { m } from "motion/react";
import { Plus, Scale } from "lucide-react";
import { useComparison } from "@/app/context/comparison-context";
import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../seo/seo-manager";
import { ProgramCardModern } from "../components/ui/modern-cards";
import { EmptyState } from "../components/ui/empty-state";
import { ContextualPageHeader } from "../components/ui/contextual-page-header";

function durationToMonths(duration: string): number {
  const number = parseInt(duration, 10);
  if (Number.isNaN(number)) return 999;
  return number * 12;
}

export function ComparePage() {
  const { items, removeFromComparison } = useComparison();
  const { t } = useLanguage();

  const rowLabels = {
    programName: t<string>("comparison.table.programName"),
    university: t<string>("comparison.table.university"),
    degreeLevel: t<string>("comparison.table.degreeLevel"),
    duration: t<string>("comparison.table.duration"),
    language: t<string>("comparison.table.language"),
    tuitionPerYear: t<string>("comparison.table.tuitionPerYear"),
    field: t<string>("comparison.table.field"),
    requirements: t<string>("comparison.table.requirements"),
    deadline: t<string>("comparison.table.deadline"),
    rating: t<string>("comparison.table.rating"),
  };

  const bestTuition = useMemo(() => {
    if (items.length === 0) return Infinity;
    return Math.min(...items.map((item) => item.tuitionPerYear));
  }, [items]);

  const bestDurationMonths = useMemo(() => {
    if (items.length === 0) return Infinity;
    return Math.min(...items.map((item) => durationToMonths(item.duration)));
  }, [items]);

  return (
    <>
      <SeoManager
        title={t<string>("comparison.title")}
        description={t<string>("comparison.subtitle")}
        path="/compare"
      />

      <main className="min-h-screen bg-bg-primary transition-colors duration-500">
        <ContextualPageHeader
          variant="listing"
          badge={t<string>("comparison.hero.badge")}
          title={t<string>("comparison.title")}
          description={t<string>("comparison.subtitle")}
          breadcrumbs={[
            { label: t<string>("common.home"), href: "/" },
            { label: t<string>("header.nav.programs"), href: "/programs" },
            { label: t<string>("comparison.title"), href: "/compare" },
          ]}
          stats={[
            { icon: Scale, value: `${items.length}`, label: t<string>("comparison.title") },
            { icon: Plus, value: `${Math.max(0, 4 - items.length)}`, label: t<string>("comparison.browsePrograms") },
          ]}
        />

        <section className="py-10">
          <div className="page-container">
            {items.length === 0 ? (
              <EmptyState
                icon={Scale}
                title={t<string>("comparison.emptyTitle")}
                description={t<string>("comparison.emptyDescription")}
                cta={{ label: t<string>("comparison.browsePrograms"), href: "/programs" }}
              />
            ) : (
              <>
              <div className="rounded-2xl border border-border/50 bg-bg-surface shadow-sm overflow-x-auto">
                <table className="min-w-[900px] w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-bg-primary/60">
                      <th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-text-muted">{t<string>("comparison.table.criteria")}</th>
                      {items.map((item) => (
                        <th key={item.id} className="p-4 text-left">
                          <ProgramCardModern
                            id={item.id}
                            universityId={item.universityId}
                            name={item.name}
                            university={item.universityName}
                            universityLogo={item.universityLogo}
                            degreeLevel={item.degreeLevel}
                            field={item.field}
                            duration={item.duration}
                            language={item.language}
                            tuitionPerYear={item.tuitionPerYear}
                            requirements={item.requirements}
                            size="compact"
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    <ComparisonRow label={rowLabels.programName} values={items.map((item) => item.name)} />
                    <ComparisonRow label={rowLabels.university} values={items.map((item) => item.universityName)} />
                    <ComparisonRow label={rowLabels.degreeLevel} values={items.map((item) => item.degreeLevel.toUpperCase())} />
                    <ComparisonRow
                      label={rowLabels.duration}
                      values={items.map((item) => item.duration)}
                      highlightIndexes={items
                        .map((item, index) => ({ index, months: durationToMonths(item.duration) }))
                        .filter((entry) => entry.months === bestDurationMonths)
                        .map((entry) => entry.index)}
                    />
                    <ComparisonRow label={rowLabels.language} values={items.map((item) => item.language)} />
                    <ComparisonRow
                      label={rowLabels.tuitionPerYear}
                      values={items.map((item) => (item.tuitionPerYear > 0 ? `EUR ${item.tuitionPerYear.toLocaleString()}` : "—"))}
                      highlightIndexes={items
                        .map((item, index) => ({ index, tuition: item.tuitionPerYear }))
                        .filter((entry) => entry.tuition === bestTuition)
                        .map((entry) => entry.index)}
                    />
                    <ComparisonRow label={rowLabels.field} values={items.map((item) => item.field)} />
                    <ComparisonRow label={rowLabels.requirements} values={items.map((item) => item.requirements?.slice(0, 2).join(", ") || t<string>("comparison.table.seeDetails"))} />
                    <ComparisonRow label={rowLabels.deadline} values={items.map((item) => item.deadline || t<string>("comparison.table.defaultDeadline"))}/>
                    <ComparisonRow label={rowLabels.rating} values={items.map((item) => `${(item.rating || 4.6).toFixed(1)} / 5`)} />

                    <tr className="border-t border-border/50">
                      <td className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">{t<string>("comparison.table.actions")}</td>
                      {items.map((item) => (
                        <td key={`actions-${item.id}`} className="p-4">
                          <div className="flex flex-col gap-2">
                            <Link
                              to={`/programs/${item.id}`}
                              className="px-4 py-2 rounded-lg btn-gold-primary text-sm font-bold text-center hover:shadow-lg transition-all"
                            >
                              {t<string>("comparison.table.apply")}
                            </Link>
                            <button
                              onClick={() => removeFromComparison(item.id)}
                              className="px-4 py-2 rounded-lg border border-border/50 text-sm font-semibold text-text-secondary hover:bg-bg-secondary transition-colors"
                            >
                              {t<string>("comparison.table.remove")}
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:hidden">
                {items.map((item) => (
                  <article key={`mobile-${item.id}`} className="rounded-xl border border-border/50 bg-bg-surface shadow-sm p-4">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={item.universityLogo}
                          alt={item.universityName}
                          className="h-11 w-11 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-bold text-text-primary">{item.name}</p>
                          <p className="text-xs text-text-muted">{item.universityName}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromComparison(item.id)}
                        className="rounded-lg border border-border/50 px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-bg-secondary transition-colors"
                      >
                        {t<string>("comparison.table.remove")}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <MobileRow label={rowLabels.programName} value={item.name} />
                      <MobileRow label={rowLabels.university} value={item.universityName} />
                      <MobileRow label={rowLabels.degreeLevel} value={item.degreeLevel.toUpperCase()} />
                      <MobileRow label={rowLabels.duration} value={item.duration} />
                      <MobileRow label={rowLabels.language} value={item.language} />
                      <MobileRow label={rowLabels.tuitionPerYear} value={item.tuitionPerYear > 0 ? `EUR ${item.tuitionPerYear.toLocaleString()}` : "—"} />
                      <MobileRow label={rowLabels.field} value={item.field} />
                      <MobileRow label={rowLabels.requirements} value={item.requirements?.slice(0, 2).join(", ") || t<string>("comparison.table.seeDetails")} />
                      <MobileRow label={rowLabels.deadline} value={item.deadline || t<string>("comparison.table.defaultDeadline")} />
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/programs/${item.id}`}
                        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg btn-gold-primary px-4 py-2 text-sm font-bold"
                      >
                        {t<string>("comparison.table.apply")}
                      </Link>
                    </div>
                  </article>
                ))}

                {items.length === 1 ? (
                  <Link
                    to="/programs"
                    className="inline-flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-bg-secondary/60 p-6 text-center hover:border-accent-tech/40 transition-colors"
                  >
                    <span className="mb-3 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-bg-surface text-accent-tech">
                      <Plus className="h-5 w-5" />
                    </span>
                    <p className="font-bold text-text-primary">{t<string>("comparison.partialState.title")}</p>
                    <p className="mt-2 text-sm text-text-muted dark:text-text-muted">{t<string>("comparison.partialState.description")}</p>
                  </Link>
                ) : null}
              </div>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

function MobileRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">{label}</p>
      <p className="mt-1 text-sm text-text-primary">{value}</p>
    </div>
  );
}

function ComparisonRow({
  label,
  values,
  highlightIndexes = [],
}: {
  label: string;
  values: string[];
  highlightIndexes?: number[];
}) {
  return (
    <tr className="border-t border-border/50">
      <td className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted align-top">{label}</td>
      {values.map((value, index) => {
        const highlighted = highlightIndexes.includes(index);
        return (
          <td key={`${label}-${index}`} className="p-4 align-top">
            <span
              className={`text-sm ${
                highlighted
                  ? "px-2 py-1 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-text-primary"
              }`}
            >
              {value}
            </span>
          </td>
        );
      })}
    </tr>
  );
}

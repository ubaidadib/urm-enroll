import { m } from "motion/react";
import { Award, TrendingUp, Users, Globe, Newspaper, Zap } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

// Visual config for timeline nodes
const MILESTONE_VISUALS = [
  { icon: Award, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { icon: Users, color: "text-accent-tech", bg: "bg-accent-tech/10", border: "border-accent-tech/20" },
];

const MEDIA_LOGOS = [
  { name: 'Times Higher Education', icon: Newspaper },
  { name: 'Study International', icon: Globe },
  { name: 'Education Today', icon: Award },
  { name: 'International Educator', icon: Zap }
];

export function CompanyTimeline() {
  const { t, dir } = useLanguage();

  // Data Retrieval
  const milestones = [
    {
      year: t<string>('timeline.phases.phase1'),
      title: t<string>('timeline.phases.phase1Desc'),
      description: t<string>('timeline.phases.phase1Detail'),
    },
    {
      year: t<string>('timeline.phases.phase2'),
      title: t<string>('timeline.phases.phase2Desc'),
      description: t<string>('timeline.phases.phase2Detail'),
    },
    {
      year: t<string>('timeline.phases.phase3'),
      title: t<string>('timeline.phases.phase3Desc'),
      description: t<string>('timeline.phases.phase3Detail'),
    },
    {
      year: t<string>('timeline.phases.phase4'),
      title: t<string>('timeline.phases.phase4Desc'),
      description: t<string>('timeline.phases.phase4Detail'),
    }
  ];

  return (
    <section
      id="timeline"
      className="relative overflow-hidden section-gradient page-section-y"
    >
      {/* --- Ambient Background (Matches Destinations Page) --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-125 h-125 bg-accent-tech/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-125 h-125 bg-accent-success/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-[var(--content-gutter)] relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center page-section-header-gap">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6"
            style={{ background: "rgba(0,184,217,0.08)", border: "1px solid rgba(0,184,217,0.25)" }}
          >
            <TrendingUp className="w-4 h-4" style={{ color: "rgb(0,184,217)" }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgb(0,184,217)" }}>
              {t<string>('timeline.badge')}
            </span>
          </m.div>
          
          <m.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight text-text-primary"
          >
            {t<string>('timeline.title')}
          </m.h2>
          
          <m.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-text-muted"
          >
            {t<string>('timeline.description')}
          </m.p>
        </div>

        {/* --- The Timeline --- */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.3), transparent)" }} />

          <div className="space-y-16">
            {milestones.map((milestone, index) => {
              const visual = MILESTONE_VISUALS[index % MILESTONE_VISUALS.length] || MILESTONE_VISUALS[0];
              if (!visual) return null;
              const Icon = visual.icon;
              
              return (
                <m.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content Card */}
                  <div className={`flex-1 w-full md:w-auto ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-20 md:pl-0`}>
                    <div className={`group relative inline-block p-8 rounded-[2rem] transition-all duration-300 hover:-translate-y-1 surface-glass-subtle ${index % 2 === 0 ? 'mr-0 md:mr-12' : 'ml-0 md:ml-12'}`}>
                      {/* Decorative colored bar */}
                      <div className={`absolute top-10 bottom-10 w-1 rounded-full ${visual.bg.replace('/10', '')} ${index % 2 === 0 ? 'right-0 md:right-auto md:left-0' : 'left-0 md:left-auto md:right-0'}`} />
                      
                      <div className="text-sm font-bold uppercase tracking-wider mb-2 text-text-disabled">
                        {milestone.year}
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-text-primary">
                        {milestone.title}
                      </h3>
                      <p className="font-medium text-text-muted">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Central Node */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-full blur-md opacity-50 ${visual.bg.replace('/10', '/30')}`} />
                      <div className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center relative z-10 bg-bg-primary border-4 border-accent-primary/30 ${visual.border}`}>
                        <Icon className={`w-6 h-6 ${visual.color}`} strokeWidth={2} />
                      </div>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block" />
                </m.div>
              );
            })}
          </div>
        </div>

        {/* --- Media Mentions --- */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-32 pt-16 text-center" style={{ borderTop: "1px solid rgba(212,175,55,0.12)" }}
        >
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-10">
            {t<string>('timeline.mediaTitle')}
          </h3>
          
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 hover:opacity-100 transition-all duration-500">
            {MEDIA_LOGOS.map((media, index) => (
              <div key={index} className="flex items-center gap-3 group cursor-default">
                <media.icon className="w-8 h-8 text-text-muted group-hover:text-accent-primary transition-colors" />
                <span className="text-lg font-bold transition-colors text-text-disabled">
                  {media.name}
                </span>
              </div>
            ))}
          </div>
        </m.div>

      </div>
    </section>
  );
}
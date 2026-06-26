import { m, useReducedMotion } from "motion/react";
import { ImageWithFallback } from "../components/ui/image-with-fallback";
import { 
  Sparkles,
  ArrowUpRight,
  Circle,
  Quote,
  MapPin,
  Linkedin
} from 'lucide-react';
import { useLanguage } from "@/i18n/language-context";

export function FounderVision() {
  const { t, dir } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  // --- Data Retrieval ---
  const bio = (t("founder.bio") as string[]) || [];
  const highlights = (t("founder.highlights") as string[]) || [];
  const credentials = (t("founder.credentials") as string[]) || [];
  const skills = (t("founder.skills") as string[]) || [];
  const projects = (t("founder.projects") as string[]) || [];

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative overflow-hidden section-gradient page-section-y"
    >
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-tech/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-150 h-150 bg-accent-success/5 rounded-full blur-[150px]" />
        {/* Architectural Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-[var(--content-gutter)] relative z-10">
        
        {/* --- Header --- */}
        <div className="page-section-header-gap">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-8"
            style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)" }}
          >
            <Sparkles className="w-4 h-4" style={{ color: "rgb(212,175,55)" }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgb(212,175,55)" }}>
              {t<string>('founder.badge')}
            </span>
          </m.div>
          
          <m.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6 tracking-tight leading-[1.1] text-text-primary"
          >
            {t<string>('founder.titleLine1')} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-accent-primary to-accent-tech">
              {t<string>('founder.titleLine2')}
            </span>
          </m.h2>
        </div>

        {/* --- Main Content Grid --- */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          
          {/* Left: Image & Stats (Sticky) */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative lg:sticky lg:top-32"
          >
            <div className="relative group">
              {/* Image Container with Depth */}
              <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none border border-border/50">
                <ImageWithFallback
                  src="/img/ubaidadib-founder.JPEG"
                  alt={t<string>('founder.imageAlt')}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Gradient Overlay for Text Readability if needed */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating Glass Card (Stats) */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`absolute -bottom-8 ${dir === 'rtl' ? '-left-8' : '-right-8'} backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-xs`}
                style={{ background: "rgba(8,14,28,0.85)", border: "1.5px solid rgba(212,175,55,0.2)" }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                  <div>
                    <div className="text-4xl font-bold mb-1" style={{ color: "rgb(212,175,55)" }}>
                      {t<string>('founder.stats.direct')}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-text-disabled">
                      {t<string>('founder.stats.directLabel')}
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-1" style={{ color: "rgb(212,175,55)" }}>
                      {t<string>('founder.stats.reach')}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-text-disabled">
                      {t<string>('founder.stats.reachLabel')}
                    </div>
                  </div>
                </div>
              </m.div>

              {/* Location Tag */}
              <div className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                <MapPin className="w-4 h-4 text-accent-primary" />
                <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
                  {t<string>('founder.originLabel')} → {t<string>('founder.londonLabel')}
                </span>
              </div>
            </div>
          </m.div>

          {/* Right: Narrative Content */}
          <div className="space-y-10 lg:space-y-12">
            
            {/* Bio Section */}
            <div className="space-y-6">
              <Quote className="w-12 h-12 text-accent-primary/20 mb-4" />
              {bio.map((paragraph, index) => (
                <m.p
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-lg md:text-xl text-text-secondary leading-relaxed font-light"
                >
                  {paragraph}
                </m.p>
              ))}
            </div>

            <div className="h-px bg-border/40 w-full" />

            {/* Highlights Grid */}
            <div>
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-8 flex items-center gap-2">
                <span className="w-8 h-px bg-accent-primary" />
                {t<string>('founder.sections.highlights')}
              </h3>
              <div className="space-y-4">
                {highlights.map((item, index) => (
                  <m.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex items-start gap-4 p-5 rounded-2xl glass-card-light hover:border-accent-primary/30 transition-all hover:shadow-md"
                  >
                    <div className="mt-1.5 p-1 rounded-full bg-accent-primary/10">
                      <div className="w-2 h-2 rounded-full bg-accent-primary" />
                    </div>
                    <span className="text-text-primary font-medium leading-relaxed">
                      {item}
                    </span>
                  </m.div>
                ))}
              </div>
            </div>

            {/* Skills Tag Cloud */}
            <div>
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6">
                {t<string>('founder.sections.skills')}
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 rounded-lg bg-bg-secondary text-text-secondary text-xs font-bold border border-border/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Signature / Links */}
            <div className="pt-8">
              <a 
                href="https://www.linkedin.com/in/ubaidadib/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-text-primary font-bold hover:text-accent-primary transition-colors group"
              >
                <Linkedin className="w-5 h-5" />
                <span>{t<string>('founder.linkedinCta')}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
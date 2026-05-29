import { m } from "motion/react";
import { Link } from "react-router-dom";
import { 
  GraduationCap, FileCheck, Languages, Home, 
  Briefcase, Plane, Stethoscope, Landmark, ArrowRight, CheckCircle2 
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { SEO_EVENTS } from "@/lib/analytics";

// Visual Configuration (Icons & Colors)
const VISUAL_CONFIG = [
  {
    icon: GraduationCap,
    gradient: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-500 dark:text-blue-400",
    hoverBorder: "group-hover:border-blue-500/30",
    glow: "group-hover:shadow-blue-500/10"
  },
  {
    icon: FileCheck,
    gradient: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    hoverBorder: "group-hover:border-emerald-500/30",
    glow: "group-hover:shadow-emerald-500/10"
  },
  {
    icon: Languages,
    gradient: "from-rose-500/20 to-rose-600/5",
    iconColor: "text-rose-500 dark:text-rose-400",
    hoverBorder: "group-hover:border-rose-500/30",
    glow: "group-hover:shadow-rose-500/10"
  },
  {
    icon: Home,
    gradient: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-500 dark:text-amber-400",
    hoverBorder: "group-hover:border-amber-500/30",
    glow: "group-hover:shadow-amber-500/10"
  },
  {
    icon: Briefcase,
    gradient: "from-accent-tech/20 to-accent-tech/5",
    iconColor: "text-accent-tech",
    hoverBorder: "group-hover:border-accent-tech/30",
    glow: "group-hover:shadow-accent-tech/10"
  },
  {
    icon: Plane,
    gradient: "from-sky-500/20 to-sky-600/5",
    iconColor: "text-sky-500 dark:text-sky-400",
    hoverBorder: "group-hover:border-sky-500/30",
    glow: "group-hover:shadow-sky-500/10"
  },
  {
    icon: Stethoscope,
    gradient: "from-teal-500/20 to-teal-600/5",
    iconColor: "text-teal-500 dark:text-teal-400",
    hoverBorder: "group-hover:border-teal-500/30",
    glow: "group-hover:shadow-teal-500/10"
  },
  {
    icon: Landmark,
    gradient: "from-indigo-500/20 to-indigo-600/5",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    hoverBorder: "group-hover:border-indigo-500/30",
    glow: "group-hover:shadow-indigo-500/10"
  }
];

interface ServicesGridProps {
  compact?: boolean;
}

interface ServiceItem {
  title: string;
  description: string;
  features?: string[];
}

// Standardized Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as const, stiffness: 300, damping: 24 } 
  }
};

export function ServicesGrid({ compact = false }: ServicesGridProps) {
  const { t, dir } = useLanguage();
  const isRtl = dir === 'rtl';

  const serviceItems = t<ServiceItem[]>("services.items") || [];
  const allServices = serviceItems.map((item, index) => {
    const visual = VISUAL_CONFIG[index % VISUAL_CONFIG.length] ?? VISUAL_CONFIG[0]!;
    return { ...item, ...visual };
  });

  const displayedServices = compact ? allServices.slice(0, 6) : allServices;

  return (
    <section 
      dir={dir}
      className="relative py-24 overflow-hidden"
      style={{ background: "linear-gradient(180deg, rgb(8,14,28) 0%, rgb(5,10,24) 100%)" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -right-48 w-[800px] h-[800px] rounded-full blur-[160px] opacity-8" style={{ background: "rgb(0,184,217)" }} />
        <div className="absolute -bottom-48 -left-48 w-[700px] h-[700px] rounded-full blur-[140px] opacity-6" style={{ background: "rgb(212,175,55)" }} />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-6">
        
        {/* Section Header */}
        <div className="mb-16">
          {compact ? (
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: "rgb(248,250,252)", fontSize: "clamp(2.5rem, 4.5vw, 4rem)" }}>
                  {t<string>("services.homeTitle")}
                </h2>
                <p className="text-lg md:text-xl font-medium leading-relaxed max-w-2xl" style={{ color: "rgb(145,177,210)" }}>
                  {t<string>("services.homeSubtitle")}
                </p>
              </div>
              <Link 
                to="/services" 
                className="hidden md:flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 group"
                style={{ background: "rgba(15,28,52,0.7)", border: "1.5px solid rgba(212,175,55,0.2)", color: "rgb(212,175,55)" }}
              >
                <span>{t<string>("services.viewAll")}</span>
                <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: "rgb(248,250,252)" }}>
                {t<string>("services.catalogTitle")}
              </h2>
              <p className="text-lg md:text-xl font-medium leading-relaxed" style={{ color: "rgb(145,177,210)" }}>
                {t<string>("services.catalogSubtitle")}
              </p>
            </div>
          )}
        </div>

        {/* Grid Container */}
        <m.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {displayedServices.map((service, index) => {
            const Icon = service.icon ?? GraduationCap;
            return (
            <m.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              onClick={() => SEO_EVENTS.PROGRAM_VIEWED(service.title)}
              className={`group relative flex flex-col p-8 rounded-[2rem] overflow-hidden transition-all duration-300 ${service.glow}`}
              style={{ background: "rgba(15,28,52,0.7)", border: "1.5px solid rgba(212,175,55,0.1)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.1)")}
            >
              {/* Card Header: Icon & Action */}
              <div className="flex items-start justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${service.gradient} flex items-center justify-center border border-white/60 dark:border-white/10 shadow-inner`}>
                  <Icon className={`w-7 h-7 ${service.iconColor}`} strokeWidth={1.75} />
                </div>
                
                {compact ? (
                  <Link 
                    to="/services" 
                    className={`w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                    aria-label={t<string>("services.viewDetails")}
                  >
                     <ArrowRight className={`w-4 h-4 text-slate-900 dark:text-white ${isRtl ? 'rotate-180' : ''}`} />
                  </Link>
                ) : (
                  <div className={`w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
                     <ArrowRight className={`w-4 h-4 text-slate-900 dark:text-white ${isRtl ? 'rotate-180' : ''}`} />
                  </div>
                )}
              </div>

              {/* Title & Desc */}
              <h3 className="text-xl md:text-2xl font-bold mb-3 transition-colors duration-300" style={{ color: "rgb(248,250,252)" }}>
                {service.title}
              </h3>
              
              <p className="text-sm leading-relaxed mb-8 flex-grow" style={{ color: "rgb(145,177,210)" }}>
                {service.description}
              </p>

              {/* Feature List */}
              <div className="mt-auto space-y-3 pt-6 border-t" style={{ borderColor: "rgba(212,175,55,0.12)" }}>
                {service.features?.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "rgb(145,177,210)" }}>
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${service.iconColor}`} strokeWidth={2.5} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Hover Glow Border Effect */}
              <div className={`absolute inset-0 rounded-[2rem] border-2 border-transparent ${service.hoverBorder} pointer-events-none transition-colors duration-300`} />
            </m.div>
            );
          })}
        </m.div>

        {/* Mobile "View All" Button */}
        {compact && (
          <div className="mt-12 flex justify-center md:hidden">
            <Link 
              to="/services" 
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
              style={{ background: "rgb(212,175,55)", color: "rgb(8,14,28)" }}
            >
              <span>{t<string>("services.viewAll")}</span>
              <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
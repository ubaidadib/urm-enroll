import { m } from "motion/react";
import { Brain, ShieldCheck, Scan, Sparkles, Target, Cpu, Network } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

// Visual config for capabilities
const CAPABILITY_VISUALS = [
  { icon: Brain, color: "text-accent-tech", bg: "bg-accent-tech/10", border: "border-accent-tech/20" },
  { icon: Target, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  { icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { icon: Scan, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
];

export function NexusLaunch() {
  const { t, dir } = useLanguage();

  const capabilities = (t("nexusLaunch.capabilities") as string[]) || [];

  return (
    <section
      id="nexus-launch"
      className="relative py-32 px-6 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500"
    >
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,rgba(var(--accent-tech),0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-24">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-accent-tech" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
              {t<string>("nexusLaunch.badge")}
            </span>
          </m.div>
          
          <m.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight max-w-4xl mx-auto"
          >
            {t<string>("nexusLaunch.title")}
          </m.h2>
          
          <m.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            {t<string>("nexusLaunch.description")}
          </m.p>
        </div>

        {/* --- Dual Core Architecture (The "Split") --- */}
        <div className="grid lg:grid-cols-2 gap-8 mb-24">
          {[
            { label: t<string>("nexusLaunch.authorityLabel"), icon: Network, sub: "Human Expertise" },
            { label: t<string>("nexusLaunch.infrastructureLabel"), icon: Cpu, sub: "Digital Core" }
          ].map((item, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative p-10 rounded-[2.5rem] glass-card hover:border-accent-tech/50 transition-all duration-500 overflow-hidden"
            >
              {/* Internal Glow */}
              <div className="absolute inset-0 bg-linear-to-br from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500 border border-slate-200 dark:border-slate-700">
                  <item.icon className="w-10 h-10 text-slate-900 dark:text-white" strokeWidth={1.5} />
                </div>
                <div className="text-sm font-bold text-accent-tech uppercase tracking-widest mb-2">{item.sub}</div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">{item.label}</h3>
              </div>
            </m.div>
          ))}
        </div>

        {/* --- Capabilities Grid --- */}
        <div className="relative">
          <div className={`flex items-center justify-between mb-12 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t<string>("nexusLaunch.capabilitiesTitle")}
            </h3>
            <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              {t<string>("nexusLaunch.launchNote")}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((capability, index) => {
              const visual = CAPABILITY_VISUALS[index % CAPABILITY_VISUALS.length];
              if (!visual) return null;
              const Icon = visual.icon;
              
              return (
                <m.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 glass-card-light hover:shadow-[0_8px_32px_rgba(8,21,48,0.12)] transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${visual.bg} border ${visual.border}`}>
                    <Icon className={`w-6 h-6 ${visual.color}`} />
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-accent-tech transition-colors">
                    {capability}
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
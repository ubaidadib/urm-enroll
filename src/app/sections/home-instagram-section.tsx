import { m } from "motion/react";
import { Instagram, Facebook, Linkedin, ArrowUpRight, Users, Heart, MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

const SOCIAL_LINKS = [
  {
    platform: "Instagram",
    handle: "@urmenroll",
    url: "https://www.instagram.com/urmenroll",
    descriptionKey: "social.instagram.description",
    icon: Instagram,
    gradient: "from-rose-500 via-pink-500 to-orange-400",
    glow: "group-hover:shadow-rose-500/20",
    statKey: "social.instagram.stat",
  },
  {
    platform: "TikTok",
    handle: "@urm.enroll.ltd",
    url: "https://www.tiktok.com/@urm.enroll.ltd",
    descriptionKey: "social.tiktok.description",
    icon: null,
    gradient: "from-slate-900 via-slate-800 to-slate-700",
    glow: "group-hover:shadow-slate-500/20",
    statKey: "social.tiktok.stat",
  },
  {
    platform: "Facebook",
    handle: "URMENROLL",
    url: "https://www.facebook.com/URMENROLL",
    descriptionKey: "social.facebook.description",
    icon: Facebook,
    gradient: "from-blue-600 via-blue-500 to-sky-500",
    glow: "group-hover:shadow-blue-500/20",
    statKey: "social.facebook.stat",
  },
  {
    platform: "LinkedIn",
    handle: "urm-enroll",
    url: "https://www.linkedin.com/company/urm-enroll",
    descriptionKey: "social.linkedin.description",
    icon: Linkedin,
    gradient: "from-sky-700 via-sky-600 to-blue-500",
    glow: "group-hover:shadow-sky-500/20",
    statKey: "social.linkedin.stat",
  },
];

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.16 8.16 0 004.77 1.52V7.02a4.85 4.85 0 01-1-.33z" />
    </svg>
  );
}

const STATS = [
  { icon: Users, labelKey: "social.stats.followers", value: "50K+" },
  { icon: Heart, labelKey: "social.stats.posts", value: "1,200+" },
  { icon: MessageCircle, labelKey: "social.stats.stories", value: "500+" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export function HomeInstagramSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-bg-secondary py-20 md:py-24 transition-colors duration-500">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-rose-500/8 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-sky-500/8 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-accent-primary/5 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-bg-surface/80 dark:border-white/10 dark:bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
            <Instagram className="h-3.5 w-3.5 text-rose-400" />
            {t<string>("social.badge")}
          </p>
          <h2 className="text-3xl font-black tracking-tight text-text-primary dark:text-white md:text-5xl">
            {t<string>("social.heading")}{" "}
            <span className="bg-linear-to-r from-rose-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              {t<string>("social.headingHighlight")}
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-muted">
            {t<string>("social.description")}
          </p>
        </m.div>

        {/* Social cards grid */}
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SOCIAL_LINKS.map((social) => {
            const Icon = social.icon;
            return (
              <m.a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-surface dark:border-white/[0.08] dark:bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:border-border-strong dark:hover:border-white/20 hover:bg-bg-secondary dark:hover:bg-white/[0.07] hover:shadow-2xl ${social.glow}`}
              >
                {/* Platform icon badge */}
                <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${social.gradient} text-white shadow-lg`}>
                  {Icon
                    ? <Icon className="h-6 w-6" />
                    : <TikTokIcon className="h-5 w-5" />
                  }
                </div>

                {/* Content */}
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted mb-1">
                  {social.platform}
                </p>
                <p className="text-base font-bold text-text-primary dark:text-white mb-2">{social.handle}</p>
                <p className="text-sm leading-relaxed text-text-muted flex-1">{t<string>(social.descriptionKey)}</p>

                {/* Stat label */}
                <div className="mt-5 flex items-center justify-between">
                  <span className="rounded-full bg-bg-secondary dark:bg-white/[0.06] border border-border dark:border-white/[0.08] px-3 py-1 text-[11px] font-semibold text-text-muted">
                    {t<string>(social.statKey)}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-text-muted transition-all duration-200 group-hover:text-text-primary dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </m.a>
            );
          })}
        </m.div>

        {/* Stats bar */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 rounded-2xl border border-border bg-bg-surface dark:border-white/[0.07] dark:bg-white/[0.03] py-6 px-8"
        >
          {STATS.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <div key={stat.labelKey} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-primary/15 text-accent-primary">
                  <StatIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-lg font-black text-text-primary dark:text-white leading-none">{stat.value}</p>
                  <p className="text-[11px] text-text-muted mt-0.5">{t<string>(stat.labelKey)}</p>
                </div>
              </div>
            );
          })}
        </m.div>
      </div>
    </section>
  );
}

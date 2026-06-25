import { Link } from "react-router-dom";
import { m } from "motion/react";
import { ArrowRight, ShieldCheck, GraduationCap, Users } from "lucide-react";

const AVATARS = ["NA", "MK", "YP", "AF", "LT"];

const PROOF_ITEMS = [
  { icon: GraduationCap, text: "2,400+ students enrolled this year" },
  { icon: Users, text: "Across 50+ partner universities in Europe" },
  { icon: ShieldCheck, text: "Trusted by students from 20+ countries" },
];

export function HomeFinalCtaBanner() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-bg-primary via-bg-secondary to-bg-primary py-24 md:py-28 dark:from-bg-primary dark:via-bg-secondary dark:to-bg-primary">
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(var(--grid),0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--grid),0.2) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-12 lg:p-16"
          style={{
            background: "rgb(var(--bg-surface) / 0.86)",
            border: "1.5px solid rgb(var(--border-default) / 0.8)",
            boxShadow: "0 24px 64px rgba(7,18,40,0.15), 0 0 80px rgba(212,175,55,0.05)",
          }}
        >
          {/* Blobs */}
          <div
            className="absolute -top-24 -right-24 rounded-full blur-3xl pointer-events-none"
            style={{ width: 320, height: 320, background: "rgba(212,175,55,0.1)" }}
          />
          <div
            className="absolute -bottom-24 -left-16 rounded-full blur-3xl pointer-events-none"
            style={{ width: 280, height: 280, background: "rgba(0,184,217,0.08)" }}
          />

          <div className="relative z-10 grid lg:grid-cols-[1fr_300px] gap-12 items-center">
            {/* Left */}
            <div>
              <p className="mb-5 text-xs font-semibold tracking-[0.2em] uppercase text-accent-tech">
                Personalized Admissions Support
              </p>

              <h2 className="mb-5 text-4xl font-bold leading-[1.08] tracking-tight text-text-primary md:text-5xl">
                Ready to Find Your{" "}
                <span style={{ color: "rgb(212,175,55)" }}>Dream University?</span>
              </h2>

              <p className="mb-9 text-lg leading-relaxed text-text-secondary">
                Build your shortlist, compare options, and start applications with confidence.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/programs"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-[1.03] hover:shadow-xl"
                  style={{
                    background: "rgb(212,175,55)",
                    color: "rgb(8,14,28)",
                    boxShadow: "0 4px 24px rgba(212,175,55,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(212,175,55,0.45)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 24px rgba(212,175,55,0.3)";
                  }}
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-[1.01]"
                  style={{
                    border: "1.5px solid rgb(var(--border-default) / 0.8)",
                    color: "rgb(var(--text-primary))",
                    background: "rgb(var(--bg-primary) / 0.55)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgb(var(--bg-primary) / 0.75)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgb(var(--bg-primary) / 0.55)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgb(var(--border-default) / 0.8)";
                  }}
                >
                  Speak to an Advisor
                </Link>
              </div>
            </div>

            {/* Right — social proof card */}
            <m.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="rounded-2xl p-6"
              style={{
                background: "rgb(var(--bg-primary) / 0.62)",
                border: "1.5px solid rgb(var(--border-default) / 0.6)",
              }}
            >
              {/* Avatar stack */}
              <div className="flex items-center mb-4">
                {AVATARS.map((avatar, index) => (
                  <span
                    key={avatar}
                    className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                    style={{
                      marginInlineStart: index === 0 ? 0 : -10,
                      background: "rgba(0,184,217,0.15)",
                      borderColor: "rgb(5,10,24)",
                      color: "rgb(0,184,217)",
                    }}
                  >
                    {avatar}
                  </span>
                ))}
                <span className="ms-3 text-sm font-medium text-text-primary">
                  +495 others
                </span>
              </div>

              {/* Proof items */}
              <div className="space-y-3">
                {PROOF_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.text}
                      className="flex items-center gap-3 rounded-xl p-3"
                      style={{ background: "rgb(var(--bg-surface) / 0.6)", border: "1px solid rgb(var(--border-default) / 0.6)" }}
                    >
                      <Icon className="w-4 h-4 shrink-0" style={{ color: "rgb(212,175,55)" }} />
                      <span className="text-xs text-text-secondary">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </m.div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

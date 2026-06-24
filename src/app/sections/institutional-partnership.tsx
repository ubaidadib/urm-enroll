import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "motion/react";
import {
  ArrowRight, ShieldCheck, ClipboardCheck, Building2, Users, TrendingUp,
  Award, CheckCircle2, Clock, Target, ChevronRight,
  Landmark, Handshake, HeartPulse, X, Zap, Globe2
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { Breadcrumbs } from "../components/layout/breadcrumbs";
import { SeoManager } from "../seo/seo-manager";
import { secureSubmitPartner, type PartnerPayload } from "@/lib/partner-submit";
import {
  closePartnershipModal,
  listenPartnershipModal,
  openPartnershipModal,
} from "@/lib/partnership-modal";
import { TurnstileWidget } from "../components/ui/turnstile-widget";
import { getPublicEnv } from "@/lib/env";

// ─── Config ───────────────────────────────────────────────────────────────────

const SEGMENT_ICONS = {
  university: Building2,
  hospital:   HeartPulse,
  agency:     Handshake,
  government: Landmark,
  student:    Users,
};

const SEGMENT_COLORS: Record<string, string> = {
  university: "#3b82f6",
  hospital:   "#f43f5e",
  agency:     "#10b981",
  government: "#4F6B8A",
  student:    "#f59e0b",
};

const PROCESS_ICONS = [ClipboardCheck, Users, Target, TrendingUp];

type Status = "idle" | "submitting" | "success" | "error";
type LangKey = "en" | "ar" | "de";

type SelectOption = {
  value: string;
  label: string;
};

type CapabilityItem = {
  title: string;
  description: string;
};

type SegmentItem = {
  value: string;
  label: string;
  description: string;
  highlights?: string[];
};

type ProcessStep = {
  title: string;
  description: string;
};

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "select";
  options?: SelectOption[];
  placeholder?: string;
  selectPlaceholder?: string;
};

// ─── InputField ───────────────────────────────────────────────────────────────

let _fieldIdCounter = 0;

function InputField({ label, value, onChange, type = "text", options, placeholder, selectPlaceholder }: InputFieldProps) {
  const [fieldId] = useState(() => `partner-field-${++_fieldIdCounter}`);
  return (
    <div>
      <label htmlFor={fieldId} className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
        {label}
      </label>
      {type === "select" ? (
        <div className="relative">
          <select
            id={fieldId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/8 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
          >
            <option value="">{selectPlaceholder}</option>
            {options?.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronRight className="w-3.5 h-3.5 rotate-90" />
          </div>
        </div>
      ) : (
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/8 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all placeholder:text-slate-400"
        />
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function InstitutionalPartnershipPage() {
  const { t, dir, language } = useLanguage();
  const lang = (language as LangKey) || "en";

  const [status, setStatus]       = useState<Status>("idle");
  const [error, setError]         = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep]           = useState<1 | 2>(1);
  const [activeSegment, setActiveSegment] = useState<string>("university");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const { turnstileSiteKey } = getPublicEnv();

  const [formData, setFormData] = useState<PartnerPayload>({
    organizationType: "university",
    organizationName: "",
    contactName: "",
    contactEmail: "",
    roleTitle: "",
    organizationSize: "",
    geographicScope: "",
    partnershipType: "",
    budgetAuthority: "",
    candidateVolume: "",
    complianceTimeline: "",
    notes: "",
    turnstileToken: "",
  });

  const capabilityItems   = t<CapabilityItem[]>("institutional.capabilities.items") || [];
  const trustMarkers      = (t("institutional.trustMarkers")           as string[]) || [];
  const segments          = t<SegmentItem[]>("institutional.segments") || [];
  const processSteps      = t<ProcessStep[]>("institutional.process.steps") || [];
  const organizationTypes = t<SelectOption[]>("institutional.form.organizationTypes") || [];
  const organizationSizes = t<SelectOption[]>("institutional.form.organizationSizes") || [];
  const geographicScopes  = t<SelectOption[]>("institutional.form.geographicScopes") || [];
  const partnershipTypes  = t<SelectOption[]>("institutional.form.partnershipTypes") || [];
  const budgetAuthorities = t<SelectOption[]>("institutional.form.budgetAuthorities") || [];

  const requiresVolume = useMemo(
    () => ["hospital", "agency", "government"].includes(formData.organizationType),
    [formData.organizationType]
  );

  const activeSegmentData = segments.find((s) => s.value === activeSegment) || segments[0];
  const activeColor = SEGMENT_COLORS[activeSegment] ?? "#3b82f6";

  const tx = (key: string, _fb: string) => t<string>(key);

  useEffect(() => listenPartnershipModal((action) => setIsModalOpen(action === "open")), []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeModal(); return; }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen]);

  const handleChange = (field: keyof PartnerPayload, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleNext = () => {
    const required: Array<keyof PartnerPayload> = [
      "organizationType", "organizationName", "contactName", "contactEmail", "roleTitle",
    ];
    if (required.some((f) => !formData[f])) {
      setError(tx("institutional.form.validation", "Please complete all required fields."));
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      setError(tx("institutional.form.validation", "Please complete all required fields."));
      return;
    }

    setStatus("submitting");
    const success = await secureSubmitPartner({ ...formData, turnstileToken });
    setStatus(success ? "success" : "error");
    if (success) {
      setTurnstileToken("");
      setTurnstileResetKey((prev) => prev + 1);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setStatus("idle");
      setStep(1);
      setError("");
      setTurnstileToken("");
      setTurnstileResetKey((prev) => prev + 1);
    }, 300);
    closePartnershipModal();
  };

  // Hero quick stats
  const heroStats = [
    { icon: Building2,  value: "5",     label: { en: "Org Types",      ar: "أنواع مؤسسات",  de: "Org-Typen"    }, color: "#3b82f6" },
    { icon: Globe2,     value: "6",     label: { en: "Countries",      ar: "دول",           de: "Länder"       }, color: "#10b981" },
    { icon: Award,      value: "50+",   label: { en: "Partners",       ar: "شركاء",         de: "Partner"      }, color: "#f59e0b" },
    { icon: TrendingUp, value: "48hr",  label: { en: "Response Time",  ar: "وقت الاستجابة", de: "Reaktionszeit"}, color: "#4F6B8A" },
  ];

  return (
    <div className="min-h-screen bg-bg-primary transition-colors duration-500" dir={dir}>
      <SeoManager
        title={tx("seo.sections.institutional.title", "Institutional Partnerships – URM Enroll")}
        description={tx("seo.sections.institutional.description", "A compliance-first partnership framework for universities, hospitals, and agencies.")}
        path="/partnerships"
        breadcrumbs={[
          { name: tx("seo.siteName", "URM Enroll"), path: "/" },
          { name: tx("institutional.badge", "Partnerships"), path: "/partnerships" },
        ]}
      />

      {/* ── Hero ── */}
      <div className="relative page-hero-offset page-hero-pb-compact px-[var(--content-gutter)] overflow-hidden border-b border-slate-100 dark:border-white/5">

        {/* Ambient */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] rounded-full bg-blue-50 dark:bg-blue-500/5 blur-[160px]" />
          <div className="absolute -bottom-40 right-1/4 w-150 h-150 rounded-full bg-accent-tech/5 dark:bg-accent-tech/4 blur-[140px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[32px_32px]" />
        </div>

        <div className="page-hero-inner">

          <div className="page-hero-crumb-gap">
            <Breadcrumbs
              items={[
                { label: tx("common.home", "Home"), href: "/" },
                { label: tx("institutional.badge", "Partnerships"), href: "/partnerships" },
              ]}
            />
          </div>

          <div className="page-hero-grid">
            {/* Left */}
            <div className="page-hero-main">
              <m.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm page-hero-badge-gap"
              >
                <Handshake className="w-4 h-4 text-accent-tech" />
                <span className="text-xs font-bold tracking-widest uppercase text-slate-900 dark:text-white">
                  {tx("institutional.badge", "Partnership Access")}
                </span>
              </m.div>

              <m.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.07 }}
                className="font-black text-slate-900 dark:text-white leading-[0.95] tracking-tight mb-5 lg:mb-5"
                style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
              >
                {tx("institutional.title", "Built for Institutions\nthat Move Fast.")}
              </m.h1>

              <m.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.13 }}
                className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-6 lg:mb-6"
              >
                {tx("institutional.description", "A compliance-first partnership framework for universities, hospitals, and agencies operating at scale.")}
              </m.p>

              {/* Hero stats */}
              <m.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {heroStats.map(({ icon: Icon, value, label, color }, i) => (
                  <m.div
                    key={label.en}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.26 + i * 0.07 }}
                    className="p-4 rounded-2xl bg-white dark:bg-white/4 border border-slate-200/80 dark:border-white/6 shadow-sm"
                  >
                    <Icon className="w-4 h-4 mb-2" style={{ color }} />
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">
                      {label[lang]}
                    </div>
                  </m.div>
                ))}
              </m.div>
            </div>

            {/* Right — abstract network visual */}
            <m.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="page-hero-aside hidden lg:block"
            >
              <div className="relative aspect-[4/3] max-h-[280px] w-full max-w-sm ml-auto">
                <div className="absolute inset-0 bg-linear-to-br from-blue-100 to-slate-100 dark:from-blue-500/10 dark:to-accent-tech/8 rounded-[3rem] blur-[60px]" />
                <div className="relative h-full rounded-[3rem] bg-white/70 dark:bg-white/4 border border-slate-200/80 dark:border-white/8 backdrop-blur-xl shadow-2xl overflow-hidden flex items-center justify-center">

                  {/* Background icon */}
                  <Handshake className="w-56 h-56 text-slate-100 dark:text-white/5" />

                  {/* Segment nodes */}
                  {[
                    { top: "20%", left: "50%", color: "#3b82f6", Icon: Building2,  delay: 0.6  },
                    { top: "45%", left: "18%", color: "#f43f5e", Icon: HeartPulse, delay: 0.75 },
                    { top: "45%", left: "82%", color: "#10b981", Icon: Handshake,  delay: 0.9  },
                    { top: "72%", left: "32%", color: "#4F6B8A", Icon: Landmark,   delay: 1.05 },
                    { top: "72%", left: "68%", color: "#f59e0b", Icon: Users,      delay: 1.2  },
                  ].map(({ top, left, color, Icon, delay }, i) => (
                    <m.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay, type: "spring", stiffness: 260 }}
                      className="absolute flex items-center justify-center w-10 h-10 rounded-xl border-2 border-white dark:border-slate-900 shadow-lg"
                      style={{ top, left, backgroundColor: color, transform: "translate(-50%, -50%)" }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </m.div>
                  ))}

                  {/* Connecting lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10 dark:opacity-20">
                    <line x1="50%" y1="20%" x2="18%" y2="45%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="50%" y1="20%" x2="82%" y2="45%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="18%" y1="45%" x2="32%" y2="72%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="82%" y1="45%" x2="68%" y2="72%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="32%" y1="72%" x2="68%" y2="72%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
                  </svg>
                </div>
              </div>
            </m.div>

          </div>
        </div>
      </div>

      {/* ── Page Body ── */}
      <div className="relative page-section-y px-[var(--content-gutter)]">
        <div className="max-w-7xl mx-auto space-y-16 lg:space-y-20">

          {/* ── 1. Segment Selector ── */}
          <div>
            <div className="text-center mb-12">
              <m.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-black text-slate-900 dark:text-white tracking-tight mb-3"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
              >
                {tx("institutional.segment.title", "Who Do We Serve?")}
              </m.h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                {tx("institutional.segment.sub", "Tailored solutions for every type of institution.")}
              </p>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-5">
              {segments.map((seg) => {
                const Icon = SEGMENT_ICONS[seg.value as keyof typeof SEGMENT_ICONS] || Building2;
                const color = SEGMENT_COLORS[seg.value] ?? "#3b82f6";
                const isActive = activeSegment === seg.value;
                return (
                  <button
                    key={seg.value}
                    onClick={() => setActiveSegment(seg.value)}
                    className={`relative group p-5 rounded-2xl text-left border transition-all duration-300 ${
                      isActive
                        ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 shadow-xl"
                        : "bg-slate-50 dark:bg-white/3 border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/6 hover:shadow-md hover:border-slate-200 dark:hover:border-white/10"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-0 left-4 right-4 h-0.5 rounded-b-full" style={{ backgroundColor: color }} />
                    )}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors"
                      style={{ backgroundColor: isActive ? `${color}18` : undefined }}
                    >
                      <Icon
                        className="w-4 h-4 transition-colors"
                        style={{ color: isActive ? color : "#94a3b8" }}
                      />
                    </div>
                    <div className={`text-sm font-black leading-tight ${isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                      {seg.label}
                    </div>
                    {isActive && (
                      <m.div layoutId="seg-check" className="absolute top-3 right-3">
                        <CheckCircle2 className="w-4 h-4" style={{ color }} />
                      </m.div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Segment detail */}
            <AnimatePresence mode="wait">
              {activeSegmentData && (
                <m.div
                  key={activeSegment}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-3xl surface-card-elevated shadow-2xl overflow-hidden"
                  >
                  <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, ${activeColor}, transparent)` }} />
                  <div className="grid lg:grid-cols-2 min-h-[260px]">
                    <div className="p-10 flex flex-col justify-center">
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5 w-fit"
                        style={{ backgroundColor: `${activeColor}18`, borderColor: `${activeColor}30` }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeColor }} />
                        <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: activeColor }}>
                          {activeSegmentData.label}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-text-primary mb-3 leading-tight">
                        {activeSegmentData.label} {tx("institutional.segment.solutions", "Solutions")}
                      </h3>
                      <p className="text-text-muted leading-relaxed mb-5 max-w-md text-sm">
                        {activeSegmentData.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {activeSegmentData.highlights?.map((h: string) => (
                          <span key={h} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary surface-inset">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-l border-border flex flex-col items-center justify-center p-10 gap-4">
                      <button
                        onClick={openPartnershipModal}
                        className="group w-full max-w-xs flex items-center justify-center gap-2.5 px-8 py-4 btn-gold-primary rounded-2xl text-sm font-black transition-all"
                      >
                        <Zap className="w-4 h-4" style={{ color: activeColor }} />
                        <span>{tx("institutional.cta.partner", "Initialize Partnership")}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {tx("institutional.responseTime", "Avg. Response: 48 Hours")}
                      </p>
                    </div>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── 2. Capability Cards ── */}
          <div>
            <div className="text-center mb-10">
              <h2
                className="font-black text-slate-900 dark:text-white tracking-tight mb-3"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
              >
                {tx("institutional.capabilities.title", "What We Offer")}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
                {tx("institutional.capabilities.sub", "End-to-end support from compliance to placement.")}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {capabilityItems.map((item, i: number) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group p-7 rounded-2xl bg-white dark:bg-white/4 border border-slate-200/80 dark:border-white/6 hover:border-slate-300 dark:hover:border-white/12 hover:shadow-lg transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-5">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                </m.div>
              ))}
            </div>
          </div>

          {/* ── 3. Process Timeline ── */}
          <div>
            <div className="text-center mb-12">
              <h2
                className="font-black text-slate-900 dark:text-white tracking-tight mb-3"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
              >
                {tx("institutional.process.title", "How It Works")}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
                {tx("institutional.process.sub", "From first contact to active partnership in four clear steps.")}
              </p>
            </div>

            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-8 left-[10%] right-[10%] h-px bg-linear-to-r from-transparent via-slate-200 dark:via-white/8 to-transparent hidden md:block" />

              <div className="grid md:grid-cols-4 gap-6">
                {processSteps.map((s, i: number) => {
                  const Icon = PROCESS_ICONS[i % PROCESS_ICONS.length]!;
                  return (
                    <m.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.09 }}
                      className="flex flex-col items-center text-center group"
                    >
                      <div className="relative mb-5">
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/8 shadow-sm group-hover:shadow-md group-hover:border-blue-200 dark:group-hover:border-blue-500/20 flex items-center justify-center transition-all">
                          <Icon className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center shadow">
                          {i + 1}
                        </div>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1.5">{s.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">{s.description}</p>
                    </m.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── 4. Trust Strip ── */}
          <div className="flex flex-col items-center gap-5 py-10 border-t border-slate-100 dark:border-white/6">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              {tx("institutional.trust.label", "Verified Compliance")}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {trustMarkers.map((m: string) => (
                <div key={m} className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 dark:bg-white/4 border border-slate-200/60 dark:border-white/6 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  {m}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Partnership Modal (portal escapes main z-10 stacking context) ── */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 glass-backdrop"
              onClick={closeModal}
            >
              <m.div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-label={t<string>("institutional.form.title")}
                tabIndex={-1}
                initial={{ scale: 0.96, opacity: 0, y: 16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: 16 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-5xl max-h-[min(90vh,calc(100dvh-3rem))] translate-y-2 sm:translate-y-3 glass-card-medium overflow-hidden flex flex-col lg:flex-row shrink-0"
              >
              {/* Sidebar */}
              <div className="lg:w-[38%] bg-bg-secondary dark:bg-slate-950 text-text-primary dark:text-white p-9 flex flex-col justify-between relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/20 mb-7">
                    <Handshake className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[10px] font-black tracking-widest uppercase text-blue-400">
                      {tx("institutional.badge", "Partnership")}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-text-primary dark:text-white mb-3 leading-tight">
                    {tx("institutional.form.title", "Let's build together.")}
                  </h2>
                  <p className="text-text-muted dark:text-slate-400 text-sm leading-relaxed">
                    {tx("institutional.form.subtitle", "Fill out the details to fast-track your institution's verification.")}
                  </p>
                </div>

                {/* Step indicators */}
                <div className="relative z-10 space-y-4 mt-10 lg:mt-0">
                  {[
                    tx("institutional.form.stepOne", "Organisation Details"),
                    tx("institutional.form.stepTwo", "Partnership Scope"),
                  ].map((label, i) => {
                    const stepNum = (i + 1) as 1 | 2;
                    const isActive = step === stepNum;
                    const isDone = step > stepNum;
                    return (
                      <div key={i}>
                        <div className={`flex items-center gap-3 transition-opacity ${isActive || isDone ? "opacity-100" : "opacity-40"}`}>
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border shrink-0 transition-all"
                            style={
                              isDone   ? { backgroundColor: "#10b981", borderColor: "#10b981", color: "#fff" } :
                              isActive ? { backgroundColor: "#3b82f6", borderColor: "#3b82f6", color: "#fff" } :
                                         { borderColor: "#475569", color: "#94a3b8" }
                            }
                          >
                            {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : stepNum}
                          </div>
                          <span className={`text-sm font-semibold ${isActive ? "text-text-primary dark:text-white" : "text-text-muted dark:text-slate-400"}`}>
                            {label}
                          </span>
                        </div>
                        {i === 0 && <div className="ms-3.5 my-1.5 w-px h-5 bg-border dark:bg-slate-700" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form panel */}
              <div className="flex-1 flex flex-col overflow-hidden bg-bg-surface dark:bg-slate-950">
                {/* Form header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-white/6 shrink-0">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                      {tx("institutional.form.stepLabel", "Step")} {step} / 2
                    </div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {step === 1
                        ? tx("institutional.form.stepOne", "Organisation Details")
                        : tx("institutional.form.stepTwo", "Partnership Scope")}
                    </div>
                  </div>
                  <button onClick={closeModal} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/8 transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="h-0.5 bg-slate-100 dark:bg-white/5 shrink-0">
                  <m.div
                    className="h-full bg-blue-500 rounded-full"
                    animate={{ width: step === 1 ? "50%" : "100%" }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                {/* Form body */}
                <div className="flex-1 overflow-y-auto p-8">
                  {status === "success" ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-16">
                      <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-5">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                        {tx("institutional.form.successTitle", "Application Received")}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">
                        {tx("institutional.form.success", "Our partnerships team will review your submission and respond within 48 hours.")}
                      </p>
                      <button
                        onClick={closeModal}
                        className="px-7 py-3 rounded-xl btn-gold-primary text-sm font-black hover:opacity-80 transition-opacity"
                      >
                        {tx("institutional.form.close", "Close")}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5">
                      <AnimatePresence mode="wait">
                        {step === 1 ? (
                          <m.div
                            key="step1"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            className="space-y-5"
                          >
                            <div className="grid sm:grid-cols-2 gap-5">
                              <InputField
                                label={tx("institutional.form.organizationType", "Organisation Type")}
                                value={formData.organizationType}
                                onChange={(v: string) => handleChange("organizationType", v)}
                                type="select"
                                options={organizationTypes}
                                selectPlaceholder={tx("institutional.form.selectPlaceholder", "Select")}
                              />
                              <InputField
                                label={tx("institutional.form.organizationName", "Organisation Name")}
                                value={formData.organizationName}
                                onChange={(v: string) => handleChange("organizationName", v)}
                                placeholder={tx("institutional.form.organizationNamePlaceholder", "e.g. Berlin Medical Center")}
                              />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                              <InputField
                                label={tx("institutional.form.contactName", "Contact Name")}
                                value={formData.contactName}
                                onChange={(v: string) => handleChange("contactName", v)}
                                placeholder={tx("institutional.form.contactNamePlaceholder", "Full Name")}
                              />
                              <InputField
                                label={tx("institutional.form.contactEmail", "Work Email")}
                                value={formData.contactEmail}
                                onChange={(v: string) => handleChange("contactEmail", v)}
                                placeholder={tx("institutional.form.contactEmailPlaceholder", "work@email.com")}
                                type="email"
                              />
                            </div>
                            <InputField
                              label={tx("institutional.form.roleTitle", "Role / Title")}
                              value={formData.roleTitle}
                              onChange={(v: string) => handleChange("roleTitle", v)}
                              placeholder={tx("institutional.form.roleTitlePlaceholder", "e.g. Head of HR")}
                            />
                          </m.div>
                        ) : (
                          <m.div
                            key="step2"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            className="space-y-5"
                          >
                            <div className="grid sm:grid-cols-2 gap-5">
                              <InputField
                                label={tx("institutional.form.organizationSize", "Organisation Size")}
                                value={formData.organizationSize}
                                onChange={(v: string) => handleChange("organizationSize", v)}
                                type="select"
                                options={organizationSizes}
                                selectPlaceholder={tx("institutional.form.selectPlaceholder", "Select")}
                              />
                              <InputField
                                label={tx("institutional.form.geographicScope", "Geographic Scope")}
                                value={formData.geographicScope}
                                onChange={(v: string) => handleChange("geographicScope", v)}
                                type="select"
                                options={geographicScopes}
                                selectPlaceholder={tx("institutional.form.selectPlaceholder", "Select")}
                              />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                              <InputField
                                label={tx("institutional.form.partnershipType", "Partnership Type")}
                                value={formData.partnershipType}
                                onChange={(v: string) => handleChange("partnershipType", v)}
                                type="select"
                                options={partnershipTypes}
                                selectPlaceholder={tx("institutional.form.selectPlaceholder", "Select")}
                              />
                              <InputField
                                label={tx("institutional.form.budgetAuthority", "Budget Authority")}
                                value={formData.budgetAuthority}
                                onChange={(v: string) => handleChange("budgetAuthority", v)}
                                type="select"
                                options={budgetAuthorities}
                                selectPlaceholder={tx("institutional.form.selectPlaceholder", "Select")}
                              />
                            </div>
                            {requiresVolume && (
                              <InputField
                                label={tx("institutional.form.candidateVolume", "Est. Annual Candidate Volume")}
                                value={formData.candidateVolume ?? ""}
                                onChange={(v: string) => handleChange("candidateVolume", v)}
                                placeholder={tx("institutional.form.candidateVolumePlaceholder", "e.g. 50–200")}
                              />
                            )}
                            <div>
                              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                {tx("institutional.form.notes", "Additional Notes")}
                              </label>
                              <textarea
                                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/8 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all resize-none placeholder:text-slate-400"
                                rows={3}
                                value={formData.notes}
                                onChange={(e) => handleChange("notes", e.target.value)}
                                placeholder={tx("institutional.form.notesPlaceholder", "Anything else we should know…")}
                              />
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>

                      {error && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                          <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                        </div>
                      )}

                      <div>
                        {turnstileSiteKey ? (
                          <TurnstileWidget
                            siteKey={turnstileSiteKey}
                            onTokenChange={setTurnstileToken}
                            resetKey={String(turnstileResetKey)}
                          />
                        ) : (
                          <p className="text-xs font-semibold text-red-500">
                            Turnstile is not configured. Please set `VITE_TURNSTILE_SITE_KEY`.
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-5 border-t border-slate-100 dark:border-white/6 mt-6">
                        {step === 2 ? (
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                          >
                            <ChevronRight className="w-4 h-4 rotate-180" />
                            {tx("institutional.form.back", "Back")}
                          </button>
                        ) : <span />}

                        <button
                          type={step === 1 ? "button" : "submit"}
                          onClick={step === 1 ? handleNext : undefined}
                          disabled={status === "submitting"}
                          className="flex items-center gap-2 px-7 py-3 btn-gold-primary rounded-xl text-sm font-black hover:opacity-80 transition-opacity disabled:opacity-50"
                        >
                          {status === "submitting" ? (
                            <>
                              <Clock className="w-4 h-4 animate-spin" />
                              {tx("institutional.form.submitting", "Processing…")}
                            </>
                          ) : (
                            <>
                              {step === 1
                                ? tx("institutional.form.next", "Continue")
                                : tx("institutional.form.submit", "Submit Application")}
                              <ChevronRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}

export { InstitutionalPartnershipPage as InstitutionalPartnership };
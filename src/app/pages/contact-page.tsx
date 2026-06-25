import { useState, useMemo, useEffect } from "react";
import { m, AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Calendar,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Shield,
  Clock,
  Building2,
  Globe2,
  Sparkles,
  User,
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { Breadcrumbs } from "../components/layout/breadcrumbs";
import { SeoManager } from "../seo/seo-manager";
import { SEO_EVENTS, trackEvent } from "@/lib/analytics";
import { secureSubmitContact } from "@/lib/contact-submit";
import { getPublicEnv } from "@/lib/env";
import { TurnstileWidget } from "../components/ui/turnstile-widget";
import { usePersonalization } from "@/hooks/usePersonalization";
import { InlineCalendly } from "../components/ui/inline-calendly";
import { buildCalendlyUrl, getCalendlyUrl } from "../utils/calendly-embed";

type Status = "idle" | "submitting" | "success" | "error";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 22 } },
};

/* ──────────────────────────────────────────────────────────── */
/*  InputField                                                  */
/* ──────────────────────────────────────────────────────────── */
function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-bold uppercase tracking-wider mb-2 text-text-disabled"
      >
        {label}
        {required && <span className="text-red-500 ms-1">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-2xl px-4 py-4 font-semibold transition-all duration-300 outline-none
          bg-bg-surface/80 border border-accent-primary/15 text-text-primary placeholder:text-text-disabled/60 focus:border-accent-primary/40"
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  SelectField                                                 */
/* ──────────────────────────────────────────────────────────── */
function SelectField({
  id,
  label,
  value,
  onChange,
  placeholder,
  options,
  disabled,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  options: { label: string; value: string }[];
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="block text-xs font-bold uppercase tracking-wider mb-2 text-text-disabled"
      >
        {label}
        {required && <span className="text-red-500 ms-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full appearance-none rounded-2xl px-4 py-4 font-semibold transition-all duration-300 outline-none
            bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800
            hover:border-accent-tech/40 hover:shadow-sm
            focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:shadow-sm
            text-slate-900 dark:text-white"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="absolute end-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  FAQ Accordion Item                                          */
/* ──────────────────────────────────────────────────────────── */
function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="glass-card-light rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 p-6 text-start font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <span className="text-base">{question}</span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed">
              {answer}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  ContactPage                                                 */
/* ──────────────────────────────────────────────────────────── */
export function ContactPage() {
  const { t, dir } = useLanguage();
  const location = useLocation();
  const isRtl = dir === "rtl";
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [consentChecked, setConsentChecked] = useState(false);

  const { recordSignal } = usePersonalization();
  useEffect(() => { recordSignal({ type: "page_view", page: "/contact" }); }, [recordSignal]);

  const { turnstileSiteKey } = getPublicEnv();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    studyLevel: "",
    destination: "",
    topic: "",
    subject: "",
    message: "",
  });

  const topicOptions =
    (t("contact.form.topicOptions") as { label: string; value: string }[]) || [];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const topic = params.get("topic")?.trim() || "";
    const action = params.get("action")?.trim() || "";
    const destination = params.get("destination")?.trim() || "";
    const subject = params.get("subject")?.trim() || "";
    const message = params.get("message")?.trim() || "";
    const validTopic = topicOptions.some((option) => option.value === topic) ? topic : "";

    const nextSubject =
      subject ||
      (validTopic === "nursing" && action === "application"
        ? t<string>("contact.form.prefill.nursingApplicationSubject")
        : "");

    const nextMessage =
      message ||
      (validTopic === "nursing" && action === "application"
        ? t<string>("contact.form.prefill.nursingApplicationMessage")
        : "");

    if (!validTopic && !destination && !nextSubject && !nextMessage && location.hash !== "#contact-form") {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      topic: validTopic || prev.topic,
      destination: destination || prev.destination,
      subject: nextSubject || prev.subject,
      message: nextMessage || prev.message,
    }));

    if (location.hash === "#contact-form" || action === "application") {
      window.setTimeout(() => {
        document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }, [location.search, location.hash, topicOptions, t]);

  const counselorItems =
    (t("contact.counselors.items") as {
      name: string;
      role: string;
      bio: string;
      email: string;
      whatsapp: string;
      calendly: string;
      calendlyLabel: string;
    }[]) || [];

  const faqItems =
    (t("contact.faqItems") as { question: string; answer: string }[]) || [];


  const isFormValid = useMemo(() => {
    return (
      formData.fullName.trim().length > 0 &&
      formData.email.includes("@") &&
      formData.email.includes(".") &&
      formData.topic.trim().length > 0 &&
      formData.subject.trim().length > 0 &&
      formData.message.trim().length > 0 &&
      consentChecked &&
      turnstileToken.trim().length > 0
    );
  }, [formData, consentChecked, turnstileToken]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setStatus("submitting");
    trackEvent({ name: "contact_page_submit_start", properties: { topic: formData.topic } });

    try {
      const success = await secureSubmitContact({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        topic: formData.topic,
        subject: formData.subject,
        message: formData.message,
        turnstileToken,
      });

      if (!success) {
        setStatus("error");
        setError(t<string>("contact.form.error.submit"));
        return;
      }

      setStatus("success");
      SEO_EVENTS.CONTACT_FORM_SUBMIT();

      setTimeout(() => {
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          country: "",
          studyLevel: "",
          destination: "",
          topic: "",
          subject: "",
          message: "",
        });
        setConsentChecked(false);
        setTurnstileToken("");
        setTurnstileResetKey((prev) => prev + 1);
        setStatus("idle");
      }, 4000);
    } catch {
      setStatus("error");
      setError(t<string>("contact.form.error.submit"));
    }
  };

  const COUNSELOR_COLORS = [
    { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500/20" },
    { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", ring: "ring-blue-500/20" },
    { bg: "bg-accent-tech/10", text: "text-accent-tech dark:text-accent-tech", ring: "ring-accent-tech/20" },
  ];

  const trustBadges = (t("contact.trustBadges") as string[]) || [];

  return (
    <main dir={dir} className="min-h-screen section-gradient">
      <SeoManager
        path="/contact"
        breadcrumbs={[
          { name: t<string>("seo.siteName"), path: "/" },
          { name: t<string>("contact.title"), path: "/contact" },
        ]}
      />

      {/* ════════════════════════════════════════════════════════ */}
      {/* SECTION 1: HERO                                         */}
      {/* ════════════════════════════════════════════════════════ */}
      <section className="relative page-hero-offset page-hero-pb-compact px-[var(--content-gutter)] overflow-hidden" style={{ borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-150 h-150 rounded-full blur-[150px] opacity-10" style={{ background: "rgb(74,222,128)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-125 h-125 rounded-full blur-[150px] opacity-8" style={{ background: "rgb(0,184,217)" }} />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
        </div>

        <div className="page-hero-inner">
          <div className="page-hero-crumb-gap">
            <Breadcrumbs
              items={[
                { label: t<string>("common.home"), href: "/" },
                { label: t<string>("contact.title"), href: "/contact" },
              ]}
            />
          </div>

          <div className="page-hero-grid">
            <div className="page-hero-main">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full page-hero-badge-gap"
              style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)" }}
            >
              <MessageCircle className="w-4 h-4" style={{ color: "rgb(74,222,128)" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgb(74,222,128)" }}>
                {t<string>("contact.badge")}
              </span>
            </m.div>

            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-bold mb-4 sm:mb-5 leading-tight tracking-tight text-text-primary"
            >
              {t<string>("contact.title")}
            </m.h1>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xl mb-5 lg:mb-0 leading-relaxed max-w-2xl lg:max-w-none text-text-muted"
            >
              {t<string>("contact.description")}
            </m.p>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base text-slate-400 lg:mb-0"
            >
              {t<string>("contact.heroSubtitle")}
            </m.p>
            </div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="page-hero-aside flex flex-col gap-3"
            >
              {trustBadges.map((badge, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 text-sm font-medium text-emerald-700 dark:text-emerald-400"
                >
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  {badge}
                </span>
              ))}
            </m.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* SECTION 2: QUICK CONTACT OPTIONS                        */}
      {/* ════════════════════════════════════════════════════════ */}
      <section className="page-section-y px-[var(--content-gutter)]">
        <div className="max-w-7xl mx-auto">
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* WhatsApp */}
            <m.a
              variants={itemVariants}
              href="https://wa.me/96170585052"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t<string>("contact.quickContact.whatsapp.title")}
              onClick={() => SEO_EVENTS.WHATSAPP_CLICK("quick_contact")}
              className="glass-card group p-8 rounded-2xl flex flex-col items-start gap-4 hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500 group-hover:shadow-lg group-hover:shadow-green-500/20 transition-all duration-300">
                <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {t<string>("contact.quickContact.whatsapp.title")}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t<string>("contact.quickContact.whatsapp.description")}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-400 group-hover:gap-3 transition-all">
                {t<string>("contact.quickContact.whatsapp.cta")}
                <ArrowRight className="w-4 h-4" />
              </span>
            </m.a>

            {/* Email */}
            <m.a
              variants={itemVariants}
              href="mailto:contact@enrollurm.com"
              aria-label={t<string>("contact.quickContact.email.title")}        
              onClick={() => SEO_EVENTS.EMAIL_CLICK("quick_contact")}
              className="glass-card group p-8 rounded-2xl flex flex-col items-start gap-4 hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {t<string>("contact.quickContact.email.title")}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t<string>("contact.quickContact.email.description")}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
                {t<string>("contact.quickContact.email.cta")}
                <ArrowRight className="w-4 h-4" />
              </span>
            </m.a>

            {/* Book a Call */}
            <m.a
              variants={itemVariants}
              href={getCalendlyUrl(import.meta.env.VITE_CALENDLY_URL)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t<string>("contact.quickContact.call.title")}          
              onClick={() => SEO_EVENTS.BOOK_CALL_CLICK("quick_contact")}
              className="glass-card group p-8 rounded-2xl flex flex-col items-start gap-4 hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent-tech/10 flex items-center justify-center group-hover:bg-accent-tech group-hover:shadow-lg group-hover:shadow-accent-tech/20 transition-all duration-300">
                <Calendar className="w-6 h-6 text-accent-tech group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {t<string>("contact.quickContact.call.title")}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t<string>("contact.quickContact.call.description")}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-accent-tech group-hover:gap-3 transition-all">
                {t<string>("contact.quickContact.call.cta")}
                <ArrowRight className="w-4 h-4" />
              </span>
            </m.a>
          </m.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* SECTION 3: MEET YOUR COUNSELORS                         */}
      {/* ════════════════════════════════════════════════════════ */}
      <section id="contact-form" className="page-section-y px-[var(--content-gutter)] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              {t<string>("contact.counselors.title")}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {t<string>("contact.counselors.subtitle")}
            </p>
          </m.div>

          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {counselorItems.map((counselor, i) => {
              const idx = i % COUNSELOR_COLORS.length;
              const color = COUNSELOR_COLORS[idx]!;
              return (
                <m.div
                  key={`${counselor.email}-${i}`}
                  variants={itemVariants}
                  className="glass-card rounded-2xl p-8 flex flex-col items-center text-center"
                >
                  {/* Avatar */}
                  <div
                    className={`w-20 h-20 rounded-full ${color.bg} ring-4 ${color.ring} flex items-center justify-center mb-6`}
                  >
                    <User className={`w-8 h-8 ${color.text}`} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {counselor.name}
                  </h3>
                  <p className={`text-sm font-semibold ${color.text} mb-4`}>
                    {counselor.role}
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {counselor.bio}
                  </p>

                  {/* Contact Links */}
                  <div className="mt-auto flex flex-wrap justify-center gap-3 w-full">
                    <a
                      href={`mailto:${counselor.email}`}
                      aria-label={`Email ${counselor.name}`}
                      onClick={() => SEO_EVENTS.EMAIL_CLICK(counselor.name)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {t<string>("contact.quickContact.email.cta")}
                    </a>

                    {counselor.whatsapp && (
                      <a
                        href={`https://wa.me/${counselor.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp ${counselor.name}`}
                        onClick={() => SEO_EVENTS.WHATSAPP_CLICK(counselor.name)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-500/20 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    )}

                    {counselor.calendly && (
                      <a
                        href={counselor.calendly}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Book a call with ${counselor.name}`}
                        onClick={() => SEO_EVENTS.BOOK_CALL_CLICK(counselor.name)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-tech/10 text-sm font-medium text-accent-tech hover:bg-accent-tech/20 transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {counselor.calendlyLabel}
                      </a>
                    )}
                  </div>
                </m.div>
              );
            })}
          </m.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* SECTION 3.5: INLINE CALENDLY BOOKING                   */}
      {/* ════════════════════════════════════════════════════════ */}
      <section className="page-section-y px-[var(--content-gutter)] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
              {t<string>("booking.heading")}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {t<string>("booking.subheading")}
            </p>
          </m.div>

          {/* Calendly Inline Widget */}
          <m.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <InlineCalendly
              url={buildCalendlyUrl(import.meta.env.VITE_CALENDLY_URL, {
                hide_gdpr_banner: 1,
                primary_color: 'E6C200',
              })}
              height={650}
              lazy
              className="rounded-2xl overflow-hidden shadow-lg"
            />
          </m.div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-12">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-sm font-medium text-slate-400 px-3">
              {t<string>("booking.orDivider")}
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* SECTION 4: SMART CONTACT FORM                           */}
      {/* ════════════════════════════════════════════════════════ */}
      <section className="page-section-y px-[var(--content-gutter)] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card-medium rounded-[2rem] p-8 md:p-12"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  {t<string>("contact.badge")}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                {t<string>("contact.form.subject") === "Subject" ? "Send Us a Message" : t<string>("contact.form.submit")}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  id="fullName"
                  label={t<string>("contact.form.fullName")}
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={t<string>("contact.form.fullNamePlaceholder")}
                  disabled={status === "submitting"}
                  required
                />
                <InputField
                  id="email"
                  type="email"
                  label={t<string>("contact.form.email")}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t<string>("contact.form.emailPlaceholder")}
                  disabled={status === "submitting"}
                  required
                />
              </div>

              {/* Row 2: Phone + Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  id="phone"
                  type="tel"
                  label={t<string>("contact.form.phone")}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t<string>("contact.form.phonePlaceholder")}
                  disabled={status === "submitting"}
                />
                <InputField
                  id="country"
                  label={t<string>("contact.form.country")}
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder={t<string>("contact.form.countryPlaceholder")}
                  disabled={status === "submitting"}
                />
              </div>

              {/* Row 3: Topic + Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  id="topic"
                  label={t<string>("contact.form.topic")}
                  value={formData.topic}
                  onChange={handleInputChange}
                  placeholder={t<string>("contact.form.topicPlaceholder")}
                  options={topicOptions}
                  disabled={status === "submitting"}
                  required
                />
                <InputField
                  id="destination"
                  label={t<string>("contact.form.destination")}
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder={t<string>("contact.form.destinationPlaceholder")}
                  disabled={status === "submitting"}
                />
              </div>

              {/* Subject */}
              <InputField
                id="subject"
                label={t<string>("contact.form.subject")}
                value={formData.subject}
                onChange={handleInputChange}
                placeholder={t<string>("contact.form.subjectPlaceholder")}
                disabled={status === "submitting"}
                required
              />

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-bold uppercase tracking-wider mb-2 text-text-disabled"
                >
                  {t<string>("contact.form.message")}
                  <span className="text-red-500 ms-1">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t<string>("contact.form.messagePlaceholder")}
                  disabled={status === "submitting"}
                  className="w-full rounded-2xl px-4 py-4 font-semibold transition-all duration-300 outline-none resize-y
                    bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800
                    hover:border-accent-tech/40 hover:shadow-sm
                    focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:shadow-sm
                    text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              {/* Consent */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  disabled={status === "submitting"}
                  className="mt-1 h-5 w-5 rounded-md border-accent-tech/40 text-emerald-500 focus:ring-emerald-500/20 transition"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t<string>("contact.form.consent")}
                </span>
              </label>

              {/* Turnstile */}
              {turnstileSiteKey && (
                <div className="flex justify-center">
                  <TurnstileWidget
                    siteKey={turnstileSiteKey}
                    onTokenChange={setTurnstileToken}
                    resetKey={String(turnstileResetKey)}
                  />
                </div>
              )}

              {/* Error */}
              <AnimatePresence>
                {status === "error" && error && (
                  <m.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium"
                  >
                    {error}
                  </m.div>
                )}
              </AnimatePresence>

              {/* Success */}
              <AnimatePresence>
                {status === "success" && (
                  <m.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-center"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                      {t<string>("contact.form.success.title")}
                    </p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400/80 mt-1">
                      {t<string>("contact.form.success.message")}
                    </p>
                  </m.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              {status !== "success" && (
                <div className="flex flex-col items-center gap-4">
                  <button
                    type="submit"
                    disabled={!isFormValid || status === "submitting"}
                    className="btn-primary w-full md:w-auto px-10 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t<string>("contact.form.submitting")}
                      </>
                    ) : (
                      <>
                        {t<string>("contact.form.submit")}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    {t<string>("contact.form.privacy")}
                  </p>
                </div>
              )}
            </form>
          </m.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* SECTION 5: FAQ STRIP                                    */}
      {/* ════════════════════════════════════════════════════════ */}
      <section className="page-section-y px-[var(--content-gutter)] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t<string>("contact.faqHeading")}
            </h2>
          </m.div>

          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-3"
          >
            {faqItems.map((item, i) => (
              <m.div key={i} variants={itemVariants}>
                <FaqItem
                  question={item.question}
                  answer={item.answer}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* SECTION 6: OFFICES & AVAILABILITY                       */}
      {/* ════════════════════════════════════════════════════════ */}
      <section className="page-section-y px-[var(--content-gutter)] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t<string>("contact.offices.title")}
            </h2>
          </m.div>

          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* London Office */}
            <m.div variants={itemVariants} className="glass-card rounded-2xl p-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {t<string>("contact.offices.london.label")}
              </h3>
              <div className="space-y-3 mt-4 text-sm text-slate-400">
                <p className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                  {t<string>("contact.offices.london.address")}
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                  <a href={`tel:${t<string>("contact.offices.london.phone")}`} className="hover:text-slate-900 dark:text-white transition-colors">
                    {t<string>("contact.offices.london.phone")}
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                  <a href={`mailto:${t<string>("contact.offices.london.email")}`} className="hover:text-slate-900 dark:text-white transition-colors">
                    {t<string>("contact.offices.london.email")}
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <Globe2 className="w-4 h-4 shrink-0 text-slate-400" />
                  {t<string>("contact.offices.london.companyNumberLabel")}: {t<string>("contact.offices.london.companyNumber")}
                </p>
              </div>
            </m.div>

            {/* Lebanon Office */}
            <m.div variants={itemVariants} className="glass-card rounded-2xl p-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {t<string>("contact.offices.lebanon.label")}
              </h3>
              <div className="space-y-3 mt-4 text-sm text-slate-400">
                <p className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                  {t<string>("contact.offices.lebanon.address")}
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                  <a href={`tel:${t<string>("contact.offices.lebanon.phone")}`} className="hover:text-slate-900 dark:text-white transition-colors">
                    {t<string>("contact.offices.lebanon.phone")}
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                  <a href={`mailto:${t<string>("contact.offices.lebanon.email")}`} className="hover:text-slate-900 dark:text-white transition-colors">
                    {t<string>("contact.offices.lebanon.email")}
                  </a>
                </p>
              </div>
            </m.div>

            {/* Business Hours */}
            <m.div variants={itemVariants} className="glass-card rounded-2xl p-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {t<string>("contact.businessHours.label")}
              </h3>
              <div className="space-y-3 mt-4 text-sm text-slate-400">
                <p>{t<string>("contact.businessHours.weekdays")}</p>
                <p>{t<string>("contact.businessHours.friday")}</p>
                <p>{t<string>("contact.businessHours.saturday")}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/50 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {t<string>("contact.responseTime.value")}
                </span>
              </div>
            </m.div>
          </m.div>
        </div>
      </section>
    </main>
  );
}

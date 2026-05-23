import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { useLanguage } from "@/i18n/language-context";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useExperiment } from "@/hooks/useExperiment";
import { trackExperimentView, trackPersonalizationApplied } from "@/utils/tracking";
import { usePersonalization } from "@/hooks/usePersonalization";

export function HeroSection() {
  const MOTION = { fast: 0.24, medium: 0.4, slow: 0.6 } as const;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { t, dir } = useLanguage();
  const { variant: heroVariant, isVariantB: isHeroB } = useExperiment("hero_headline");
  const { resolveContent, isSlotPersonalized, segment, recordSignal } = usePersonalization();
  const [fieldIndex, setFieldIndex] = useState(0);
  const [enableEnhancedVisuals, setEnableEnhancedVisuals] = useState(false);
  const rotatingFields = ["Engineering", "Medicine", "Business", "Arts & Design", "Science", "Law"];

  useEffect(() => {
    if (shouldReduceMotion) return;

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => setEnableEnhancedVisuals(true), { timeout: 800 })
      : window.setTimeout(() => setEnableEnhancedVisuals(true), 300);

    return () => {
      if (typeof idle === "number") {
        window.clearTimeout(idle);
      } else if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idle);
      }
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    trackExperimentView({ experiment: "hero_headline", variant: heroVariant, page: "home" });
  }, [heroVariant]);

  useEffect(() => {
    recordSignal({ type: "page_view", page: "home" });
  }, [recordSignal]);

  useEffect(() => {
    if (!isHeroB && isSlotPersonalized("hero.title")) {
      trackPersonalizationApplied({
        slot: "hero.title",
        segment,
        contentKey: resolveContent("hero.title"),
      });
    }
  }, [isHeroB, isSlotPersonalized, segment, resolveContent]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const timer = window.setInterval(() => {
      setFieldIndex((prev) => (prev + 1) % rotatingFields.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [shouldReduceMotion, rotatingFields.length]);

  /* ── Canvas globe ── */
  useEffect(() => {
    if (shouldReduceMotion || !enableEnhancedVisuals) return;
    if (typeof window !== "undefined" && !window.matchMedia("(min-width: 1024px)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const centerX = () => width / 2;
    const centerY = () => height / 2;
    const radius = () => Math.min(width, height) * 0.32;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; alpha: number }> = [];
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * (canvas.width || 800),
        y: Math.random() * (canvas.height || 600),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.5 + 0.15,
      });
    }

    let animationFrame: number;
    let rotation = 0;

    const getCssRgb = (token: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(token).trim() || "212 175 55";

    let techRgb = getCssRgb("--theme-accent-primary");
    const updateTheme = () => { techRgb = getCssRgb("--theme-accent-primary"); };
    window.addEventListener("urm-theme-change", updateTheme);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      rotation += 0.0008;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.fillStyle = `rgba(${techRgb}, ${p.alpha * 0.2})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.save();
      ctx.translate(centerX(), centerY());
      ctx.rotate(rotation);

      ctx.strokeStyle = `rgba(${techRgb}, 0.18)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, radius(), 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = `rgba(${techRgb}, 0.08)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const angle = (i / 6) * Math.PI * 2;
        ctx.ellipse(0, 0, radius() * Math.abs(Math.cos(angle)), radius(), angle, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      const points = [
        { x: centerX() - radius() * 0.5, y: centerY() - radius() * 0.3 },
        { x: centerX() + radius() * 0.6, y: centerY() - radius() * 0.4 },
        { x: centerX() + radius() * 0.3, y: centerY() + radius() * 0.5 },
        { x: centerX() - radius() * 0.4, y: centerY() + radius() * 0.4 },
      ];

      const time = Date.now() / 1000;

      points.forEach((point, i) => {
        ctx.strokeStyle = `rgba(${techRgb}, 0.12)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX(), centerY());
        ctx.lineTo(point.x, point.y);
        ctx.stroke();

        ctx.fillStyle = `rgba(${techRgb}, 0.8)`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();

        const pulse = Math.sin(time * 1.5 + i * 0.5) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(${techRgb}, ${pulse * 0.25})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8 + pulse * 6, 0, Math.PI * 2);
        ctx.stroke();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener("urm-theme-change", updateTheme);
    };
  }, [shouldReduceMotion, enableEnhancedVisuals]);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative min-h-svh flex items-center justify-center overflow-hidden bg-linear-to-br from-bg-tertiary via-bg-secondary to-bg-tertiary pt-20"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-150 h-150 bg-accent-primary/5 rounded-full blur-[120px] ${enableEnhancedVisuals ? "animate-pulse" : ""}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-125 h-125 bg-accent-primary/5 rounded-full blur-[120px] ${enableEnhancedVisuals ? "animate-pulse" : ""}`} style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(var(--theme-grid),0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--theme-grid),0.1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        {/* Left Content */}
        <m.div
          initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: MOTION.slow, ease: [0.16, 1, 0.3, 1] }}
          className={dir === 'rtl' ? 'rtl-text-right' : ''}
        >
          {/* Badge */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: MOTION.medium }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-surface-glass/5 backdrop-blur-xl border border-border/40 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
              <span className="text-text-primary text-sm font-medium tracking-wide">
                {t('hero.badge')}
              </span>
            </div>
          </m.div>

          {/* Headline */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: MOTION.medium }}
          >
            <h1
              id="hero-title"
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.15] text-text-primary mb-4 tracking-tight"
            >
              {isHeroB ? t('hero.titleLine1VariantB') : t(resolveContent('hero.title'))}
                <span className="block mt-2 bg-linear-to-r from-accent-primary via-[#b48b1f] to-accent-primary bg-clip-text text-transparent">
                {isHeroB ? t('hero.titleLine2VariantB') : t('hero.titleLine2')}
              </span>
            </h1>
          </m.div>

          {/* Description */}
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: MOTION.medium }}
            className="text-base md:text-lg text-text-secondary mb-8 leading-relaxed max-w-xl"
          >
            {t(resolveContent('hero.description'))}
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: MOTION.medium }}
            className="mb-8"
          >
            <p className="text-sm uppercase tracking-[0.18em] text-text-muted mb-2">Popular Fields</p>
            <p className="text-xl md:text-2xl font-bold text-accent-primary">
              {rotatingFields[fieldIndex]}
            </p>
          </m.div>

          {/* CTAs */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: MOTION.medium }}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            <Link
              to="/universities"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-linear-to-r from-accent-primary to-accent-primary-strong text-white font-semibold rounded-xl text-base hover:shadow-xl hover:shadow-accent-primary/25 transition-all motion-medium transform hover:scale-[1.03]"
            >
              <span>{t('hero.ctaPrimary')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform motion-medium" />
            </Link>

            <Link
              to="/chancenkarte"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-surface-glass/5 backdrop-blur-sm border border-border/50 text-text-primary font-semibold rounded-xl text-base hover:bg-surface-glass/10 hover:border-accent-primary/50 hover:shadow-lg hover:shadow-accent-primary/10 transition-all motion-medium"
            >
              {t('hero.ctaGermanyJourney')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform motion-medium" />
            </Link>
          </m.div>

          {/* Trust Line */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: MOTION.medium }}
            className="flex items-center gap-2"
          >
            <div className="h-px w-5 bg-border/60" />
            <span className="text-xs text-text-muted font-light tracking-widest uppercase">
              {t('hero.trustLine')}
            </span>
          </m.div>
        </m.div>

        {/* Right — Globe Canvas (no floating cards) */}
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: MOTION.slow, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden lg:block"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-accent-primary/10 via-transparent to-brand-navy/10 rounded-3xl blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden border border-border/30 bg-linear-to-br from-surface-glass/5 to-transparent backdrop-blur-sm shadow-2xl shadow-accent-primary/10">
              <canvas ref={canvasRef} className="w-full h-135" />
            </div>

            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: MOTION.medium }}
              className="absolute -top-5 -left-5 px-4 py-3 rounded-2xl border border-border/60 bg-bg-surface/90 backdrop-blur shadow-lg"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Network</p>
              <p className="text-lg font-bold text-text-primary">50+ Universities</p>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: MOTION.medium }}
              className="absolute -bottom-6 -right-6 px-4 py-3 rounded-2xl border border-border/60 bg-bg-surface/90 backdrop-blur shadow-lg"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Opportunities</p>
              <p className="text-lg font-bold text-text-primary">10,000+ Programs</p>
            </m.div>
          </div>
        </m.div>
      </div>

      {/* Scroll Indicator */}
      {!shouldReduceMotion && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: MOTION.slow }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <m.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-xs text-text-muted uppercase tracking-[0.2em] font-light">{t<string>('hero.explore')}</span>
            <svg className="w-5 h-8 text-border/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </m.div>
        </m.div>
      )}
    </section>
  );
}
import { useState, useEffect } from "react";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
import { useLanguage } from "@/i18n/language-context";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <m.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-100 bg-linear-to-br from-bg-primary via-bg-secondary to-bg-tertiary flex items-center justify-center"
    >
      <div className="absolute inset-0 premium-grid opacity-45" />

      <div className="absolute inset-0 opacity-35">
        <m.div
          animate={
            shouldReduceMotion
              ? { backgroundPosition: '0% 0%' }
              : { backgroundPosition: ['0% 0%', '100% 100%'] }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(var(--accent-tech), 0.22), transparent 40%), radial-gradient(circle at 70% 75%, rgba(var(--accent-primary), 0.2), transparent 40%)',
            backgroundSize: 'cover'
          }}
        />
      </div>

      <div className="relative z-10 text-center px-6">
        <m.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="relative inline-flex flex-col items-center">
            {/* Ambient glow beneath the logo */}
            <m.div
              animate={shouldReduceMotion ? { opacity: 0.4 } : { opacity: [0.25, 0.55, 0.25] }}
              transition={shouldReduceMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-7 rounded-full blur-2xl bg-accent-primary/60"
            />
            {/* Subtle glass card — makes logo legible on any dark bg without a harsh white box */}
            <div className="relative rounded-2xl bg-white/[0.07] border border-white/[0.12] px-9 py-4 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.25)]">
              <img
                src="/img/logo-light.png"
                alt="URM ENROLL"
                className="h-11 w-auto"
                draggable={false}
                width={263}
                height={66}
              />
            </div>
          </div>
        </m.div>

        <m.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
            <div className="text-text-primary text-4xl font-bold mb-2 tracking-tight">{t<string>('preloader.title')}</div>
            <p className="text-accent-tech text-sm font-medium uppercase tracking-[0.14em]">{t<string>('preloader.subtitle')}</p>
        </m.div>

        <m.div
          initial={{ width: 0, opacity: 0 }}
            animate={{ width: '260px', opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
            className="mx-auto mt-8"
        >
            <div className="h-2 bg-background-surface/35 rounded-full overflow-hidden border border-border/45">
            <m.div
                className="h-full bg-linear-to-r from-accent-primary to-accent-tech rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
            <p className="text-text-secondary text-xs mt-3 font-semibold tracking-[0.12em]">{progress}%</p>
        </m.div>

        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
            className="text-text-secondary text-sm mt-6"
        >
          {t<string>('preloader.loading')}
        </m.p>
      </div>

        <div className="absolute top-0 left-0 w-36 h-36 border-t-2 border-l-2 border-accent-primary/35" />
        <div className="absolute bottom-0 right-0 w-36 h-36 border-b-2 border-r-2 border-accent-tech/35" />
    </m.div>
  );
}

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { m } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Instagram,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';
import { successStories as fallbackStories } from '@/data/success-stories';
import { useInstagramContent } from '@/hooks/useInstagramContent';
import { loadInstagramEmbedScript, processInstagramEmbeds } from '../utils/instagram-embed';
import { SuccessStoryCard } from './success-story-card';

type InstagramApiStory = {
  id: string | number;
  instagramUrl: string;
  caption?: string;
  mediaUrl?: string;
};

export function SuccessStoriesSection() {
  const { t, dir } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const isRtl = dir === 'rtl';

  const handleInstagramError = useCallback((_error: Error) => {
    // UI handles errors via translated fallback states.
  }, []);

  const {
    data: instagramContent,
    error: instagramError,
    isLoading: instagramLoading,
    isRefreshing,
    refetch: refetchInstagram,
  } = useInstagramContent<InstagramApiStory>({
    limit: 9,
    autoRefreshInterval: 60 * 60 * 1000,
    onError: handleInstagramError,
  });

  const hasInstagramContent = Boolean(instagramContent && instagramContent.length > 0);

  const stories = useMemo(() => {
    if (hasInstagramContent && instagramContent) {
      return instagramContent;
    }
    return fallbackStories;
  }, [hasInstagramContent, instagramContent]);

  const scrollSlider = useCallback(
    (direction: 'prev' | 'next') => {
      const slider = sliderRef.current;
      if (!slider) return;

      const delta = Math.max(280, Math.min(420, slider.clientWidth * 0.9));
      const step = direction === 'next' ? delta : -delta;
      const rtlAdjusted = isRtl ? -step : step;

      slider.scrollBy({ left: rtlAdjusted, behavior: 'smooth' });
    },
    [isRtl]
  );

  useEffect(() => {
    void loadInstagramEmbedScript().catch(() => {
      // The embed utility handles fallback-safe behavior.
    });
  }, []);

  useEffect(() => {
    if (!hasInstagramContent) {
      return;
    }

    const timer = window.setTimeout(() => {
      processInstagramEmbeds(sectionRef.current ?? undefined);
    }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, [hasInstagramContent, stories]);

  return (
    <section
      id="success-stories"
      ref={sectionRef}
      className="relative py-24 px-6 overflow-hidden bg-[var(--color-bg-primary)]"
      dir={dir}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-8 w-[28rem] h-[28rem] rounded-full bg-[rgba(var(--accent-tech),0.08)] blur-3xl" />
        <div className="absolute -bottom-28 left-8 w-[24rem] h-[24rem] rounded-full bg-[rgba(var(--success),0.08)] blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`mb-10 ${isRtl ? 'rtl-text-right' : 'text-left'}`}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full glass-card-light text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
                <Instagram className="w-3.5 h-3.5" />
                <span>@urmenroll</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] tracking-tight mb-4">
                {t('successStories.heading')}
              </h2>

              <p className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-3xl leading-relaxed mb-6">
                {t('successStories.subheading')}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                {instagramLoading && !hasInstagramContent && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-light">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent-tech)] animate-pulse" />
                    {t('successStories.statusLoading')}
                  </span>
                )}

                {isRefreshing && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-light">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    {t('successStories.statusRefreshing')}
                  </span>
                )}

                {hasInstagramContent && !isRefreshing && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-light">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent-success)]" />
                    {stories.length} {t('successStories.statusLive')}
                  </span>
                )}

                {instagramError && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                    <AlertCircle className="w-4 h-4 text-[var(--color-warning)]" />
                    <span>{t('successStories.statusFallback')}</span>
                    <button
                      type="button"
                      onClick={refetchInstagram}
                      className="inline-flex items-center gap-1 ml-2 px-2 py-1 rounded-md text-xs font-semibold border border-[var(--color-border)] hover:bg-[var(--color-bg-surface-hover)] transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {t('successStories.retry')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={`flex items-center gap-2 ${isRtl ? 'self-start lg:self-auto flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={() => scrollSlider('prev')}
                aria-label="Previous stories"
                className="w-11 h-11 rounded-xl glass-card-light border border-[var(--color-border)] text-[var(--color-text-primary)] hover:shadow-md transition-all"
              >
                <ChevronLeft className={`w-5 h-5 mx-auto ${isRtl ? 'rotate-180' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => scrollSlider('next')}
                aria-label="Next stories"
                className="w-11 h-11 rounded-xl glass-card-light border border-[var(--color-border)] text-[var(--color-text-primary)] hover:shadow-md transition-all"
              >
                <ChevronRight className={`w-5 h-5 mx-auto ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </m.div>

        {instagramLoading && !hasInstagramContent && (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="shrink-0 w-[min(86vw,380px)] md:w-[360px] lg:w-[380px] h-[520px] rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] animate-pulse"
              />
            ))}
          </div>
        )}

        {!instagramLoading && stories.length === 0 && (
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-10 text-center">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
              {t('successStories.emptyTitle')}
            </h3>
            <p className="text-[var(--color-text-secondary)]">{t('successStories.emptyDescription')}</p>
          </div>
        )}

        {!instagramLoading && stories.length > 0 && (
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-[var(--color-bg-primary)] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent z-10" />

            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {stories.map((story, index) => (
                <m.div
                  key={`story-${String(story.id)}-${index}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className="snap-start shrink-0 w-[min(86vw,380px)] md:w-[360px] lg:w-[380px]"
                >
                  <SuccessStoryCard story={story} isInstagramSource={hasInstagramContent} />
                </m.div>
              ))}
            </div>
          </div>
        )}

        <div className={`mt-8 flex flex-col sm:flex-row sm:items-center gap-4 ${isRtl ? 'sm:flex-row-reverse sm:justify-between' : 'sm:justify-between'}`}>
          <p className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Sparkles className="w-4 h-4 text-[var(--color-accent-tech)]" />
            {t('successStories.scrollHint')}
          </p>

          <a
            href="https://www.instagram.com/urmenroll/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass-card-light text-[var(--color-text-primary)] font-semibold hover:shadow-md transition-all"
          >
            <Instagram className="w-4 h-4" />
            <span>{t('successStories.followCta')}</span>
            <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </a>
        </div>
      </div>
    </section>
  );
}

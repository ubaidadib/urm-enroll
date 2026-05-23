import { ArrowLeft, ArrowRight, Instagram } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';
import { type SuccessStory } from '@/data/success-stories';
import ReelEmbed from '../components/ui/reel-embed';

type InstagramStory = {
  id: string | number;
  instagramUrl: string;
  mediaUrl?: string;
  caption?: string;
};

type StoryCardData = SuccessStory | InstagramStory;

interface SuccessStoryCardProps {
  story: StoryCardData;
  isInstagramSource: boolean;
}

function hasStudentProfile(story: StoryCardData): story is SuccessStory {
  return (
    typeof (story as SuccessStory).studentName === 'string' &&
    typeof (story as SuccessStory).originCountry === 'string' &&
    typeof (story as SuccessStory).destinationCountry === 'string'
  );
}

export function SuccessStoryCard({ story, isInstagramSource }: SuccessStoryCardProps) {
  const { t, language, dir } = useLanguage();
  const isRtl = dir === 'rtl';
  const isPlaceholder = story.instagramUrl.includes('PLACEHOLDER');
  const isProfileStory = hasStudentProfile(story);

  const quoteText = isProfileStory
    ? story.quote[language as keyof typeof story.quote]
    : ((story as InstagramStory).caption || t<string>('successStories.instagramCaptionFallback'));

  return (
    <article className="h-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-[var(--color-bg-surface)] overflow-hidden shadow-[0_2px_8px_rgba(8,21,48,0.06)] hover:shadow-[0_8px_32px_rgba(8,21,48,0.12)] transition-shadow">
      <div className="aspect-[9/12] bg-[var(--color-bg-secondary)]">
        {isPlaceholder ? (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)]">
            <div className="text-center px-6">
              <Instagram className="w-8 h-8 mx-auto mb-3 text-[var(--color-accent-tech)]" />
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">{t('successStories.viewOnInstagram')}</p>
            </div>
          </div>
        ) : (
          <ReelEmbed
            permalink={story.instagramUrl}
            thumbnail={(story as InstagramStory).mediaUrl}
            lazy
            className="w-full h-full"
            height="100%"
          />
        )}
      </div>

      <div className="p-5">
        {isProfileStory ? (
          <>
            <div className={`flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-2 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
              <span className="font-semibold text-[var(--color-text-primary)]">{story.studentName}</span>
              <span>•</span>
              {isRtl ? (
                <>
                  <span>{story.destinationCountry}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{story.originCountry}</span>
                </>
              ) : (
                <>
                  <span>{story.originCountry}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>{story.destinationCountry}</span>
                </>
              )}
            </div>

            <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{story.program}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mb-4">
              {t('successStories.studying')} {story.university}
            </p>
          </>
        ) : (
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)] mb-1">
              {t('successStories.instagramSource')}
            </p>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">@urmenroll</p>
          </div>
        )}

        <blockquote className="text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-4">
          {quoteText}
        </blockquote>

        {isInstagramSource && !isProfileStory && (
          <a
            href={story.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-accent-tech)] hover:opacity-80 transition-opacity"
          >
            <Instagram className="w-3.5 h-3.5" />
            {t('successStories.viewOnInstagram')}
          </a>
        )}
      </div>
    </article>
  );
}

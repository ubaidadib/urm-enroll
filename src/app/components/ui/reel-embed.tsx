import { useEffect, useRef, useState } from 'react';
import { loadInstagramEmbedScript, processInstagramEmbeds } from '../../utils/instagram-embed';
import { ImageWithFallback } from './image-with-fallback';

type ReelEmbedProps = {
  permalink?: string;
  thumbnail?: string;
  className?: string;
  height?: number | string;
  lazy?: boolean;
};

export function ReelEmbed({ permalink, thumbnail, className = '', height = 220, lazy = true }: ReelEmbedProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current || !permalink) {
      return;
    }

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    setFailed(false);

    const insertEmbed = () => {
      if (!ref.current || cancelled) {
        return;
      }

      ref.current.innerHTML = '';

      const block = document.createElement('blockquote');
      block.className = 'instagram-media';
      block.setAttribute('data-instgrm-permalink', `${permalink}?utm_source=ig_embed`);
      block.setAttribute('data-instgrm-version', '14');
      block.style.background = 'var(--color-bg-surface)';
      block.style.border = '0';
      block.style.borderRadius = '3px';
      block.style.margin = '0';
      block.style.maxWidth = '100%';
      block.style.minWidth = '280px';
      block.style.padding = '0';
      block.style.width = '100%';

      ref.current.appendChild(block);

      void loadInstagramEmbedScript()
        .then(() => {
          if (!cancelled) {
            processInstagramEmbeds(ref.current ?? undefined);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setFailed(true);
          }
        });

      const start = Date.now();
      const timeout = 4000;

      const check = () => {
        if (!ref.current || cancelled) {
          return;
        }

        const iframe = ref.current.querySelector('iframe');
        if (iframe) {
          return;
        }

        if (Date.now() - start > timeout) {
          setFailed(true);
          return;
        }

        retryTimer = setTimeout(check, 300);
      };

      check();
    };

    if (lazy && typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              insertEmbed();
              observer.disconnect();
            }
          });
        },
        { rootMargin: '300px' }
      );

      io.observe(ref.current);

      return () => {
        cancelled = true;
        if (retryTimer) {
          clearTimeout(retryTimer);
        }
        io.disconnect();
      };
    }

    insertEmbed();

    return () => {
      cancelled = true;
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
    };
  }, [permalink, lazy]);

  if (failed) {
    return (
      <div className={`w-full ${className}`} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
        {thumbnail ? (
          <a href={permalink ?? '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <ImageWithFallback src={thumbnail} alt="Instagram reel" className="w-full h-full object-cover rounded-md" />
          </a>
        ) : (
          <div className="w-full h-full bg-slate-100 rounded-md flex items-center justify-center">
            <a href={permalink ?? '#'} target="_blank" rel="noopener noreferrer" className="text-sm font-medium">
              View on Instagram
            </a>
          </div>
        )}
      </div>
    );
  }

  return <div ref={ref} className={className} style={{ minHeight: typeof height === 'number' ? `${height}px` : height }} />;
}

export default ReelEmbed;

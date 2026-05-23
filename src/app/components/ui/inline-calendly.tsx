import React, { useRef, useEffect } from 'react';
import { createInlineWidget, loadCalendly } from '../../utils/calendly-embed';

type InlineCalendlyProps = {
  url: string;
  height?: number | string;
  lazy?: boolean;
  useScriptInline?: boolean; // if true, prefer Calendly's inline initializer (requires widget.js)
  className?: string;
};

export function InlineCalendly({ url, height = 650, lazy = true, useScriptInline = false, className = '' }: InlineCalendlyProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    let cancelled = false;

    const mount = () => {
      if (!ref.current || cancelled) return;
      if (useScriptInline) {
        loadCalendly()
          .then(() => {
            if (!cancelled && ref.current) createInlineWidget(ref.current, url, { height });
          })
          .catch(() => {
            if (!cancelled && ref.current) createInlineWidget(ref.current, url, { height });
          });
      } else {
        createInlineWidget(ref.current, url, { height });
      }
    };

    if (lazy && typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            mount();
            obs.disconnect();
          }
        });
      }, { rootMargin: '200px' });

      io.observe(ref.current);
      return () => {
        cancelled = true;
        io.disconnect();
      };
    }

    mount();
    return () => {
      cancelled = true;
    };
  }, [url, height, lazy, useScriptInline]);

  return <div ref={ref} className={className} style={{ minWidth: '320px', height: typeof height === 'number' ? `${height}px` : height }} />;
}

export default InlineCalendly;

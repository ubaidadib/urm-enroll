// Robust Calendly loader and helpers
// - Singleton loader returns a Promise that resolves when Calendly is available
// - Safe fallbacks: iframe for inline embeds and window.open for popups

type CalendlyInitOptions = {
  url: string;
  parentElement?: HTMLElement;
  text?: string;
  color?: string;
  textColor?: string;
  height?: number | string;
  [key: string]: unknown;
};

type CalendlyGlobal = {
  initPopupWidget?: (options: CalendlyInitOptions) => void;
  showPopupWidget?: (url: string) => void;
  initBadgeWidget?: (options: CalendlyInitOptions) => void;
  initInlineWidget?: (options: CalendlyInitOptions) => void;
};

type CalendlyWindow = Window & {
  Calendly?: CalendlyGlobal;
};

export const DEFAULT_CALENDLY_URL = 'https://calendly.com/ubaidadib-enrollurm/30min';

const CSS_HREF = 'https://assets.calendly.com/assets/external/widget.css';
const JS_SRC = 'https://assets.calendly.com/assets/external/widget.js';

let loadPromise: Promise<CalendlyGlobal> | null = null;
let badgeInitialized = false;

export function getCalendlyUrl(rawUrl?: string): string {
  const candidate = rawUrl?.trim() || DEFAULT_CALENDLY_URL;

  try {
    const parsed = new URL(candidate);
    const hasEventPath = parsed.pathname.split('/').filter(Boolean).length >= 2;
    return hasEventPath ? parsed.toString() : DEFAULT_CALENDLY_URL;
  } catch {
    return DEFAULT_CALENDLY_URL;
  }
}

export function buildCalendlyUrl(
  rawUrl?: string,
  params: Record<string, string | number | boolean> = {},
): string {
  const resolved = new URL(getCalendlyUrl(rawUrl));

  Object.entries(params).forEach(([key, value]) => {
    resolved.searchParams.set(key, String(value));
  });

  return resolved.toString();
}

function getCalendly(windowRef: Window = window): CalendlyGlobal | undefined {
  return (windowRef as CalendlyWindow).Calendly;
}

function readStringOption(options: Record<string, unknown>, key: string, fallback: string): string {
  const value = options[key];
  return typeof value === 'string' ? value : fallback;
}

function readHeightOption(options: Record<string, unknown>, fallback: string): string {
  const value = options.height;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return value;
  return fallback;
}

export function loadCalendly(): Promise<CalendlyGlobal> {
  if (typeof window === 'undefined') return Promise.reject(new Error('SSR - no window'));
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<CalendlyGlobal>((resolve, reject) => {
    try {
      // Load CSS once
      if (!document.getElementById('calendly-css')) {
        const link = document.createElement('link');
        link.id = 'calendly-css';
        link.rel = 'stylesheet';
        link.href = CSS_HREF;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }

      // If Calendly already present, resolve immediately
      if (getCalendly()) {
        resolve(getCalendly() as CalendlyGlobal);
        return;
      }

      // If script tag exists, hook its load/error
      const existing = document.getElementById('calendly-script') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve(getCalendly() as CalendlyGlobal));
        existing.addEventListener('error', () => reject(new Error('Calendly script failed to load')));
        return;
      }

      const script = document.createElement('script');
      script.id = 'calendly-script';
      script.src = JS_SRC;
      script.async = true;
      script.crossOrigin = 'anonymous';

      const onLoad = () => {
        if (getCalendly()) {
          resolve(getCalendly() as CalendlyGlobal);
          return;
        }

        // Some builds expose Calendly slightly after load; poll briefly
        const interval = window.setInterval(() => {
          if (getCalendly()) {
            window.clearInterval(interval);
            resolve(getCalendly() as CalendlyGlobal);
          }
        }, 50);

        // Timeout fallback
        setTimeout(() => {
          window.clearInterval(interval);
          if (getCalendly()) {
            resolve(getCalendly() as CalendlyGlobal);
          } else {
            reject(new Error('Calendly did not initialise after script load'));
          }
        }, 8000);
      };

      const onError = () => reject(new Error('Calendly script failed to load'));

      script.addEventListener('load', onLoad);
      script.addEventListener('error', onError);
      document.body.appendChild(script);
    } catch (err) {
      reject(err);
    }
  });

  return loadPromise;
}

export async function initPopupWidget(url: string, opts: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const resolvedUrl = getCalendlyUrl(url);
  try {
    const Calendly = await loadCalendly();
    if (Calendly && typeof Calendly.initPopupWidget === 'function') {
      Calendly.initPopupWidget({ url: resolvedUrl, ...opts });
      return;
    }

    // older/newer variants
    if (Calendly && typeof Calendly.showPopupWidget === 'function') {
      Calendly.showPopupWidget(resolvedUrl);
      return;
    }

    // Fallback: open in new tab
    window.open(resolvedUrl, '_blank', 'noopener,noreferrer');
  } catch {
    window.open(resolvedUrl, '_blank', 'noopener,noreferrer');
  }
}

export async function initBadgeWidget(url: string, opts: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  if (badgeInitialized) return;
  const resolvedUrl = getCalendlyUrl(url);
  try {
    const Calendly = await loadCalendly();
    if (Calendly && typeof Calendly.initBadgeWidget === 'function') {
      Calendly.initBadgeWidget({ url: resolvedUrl, ...opts });
      badgeInitialized = true;
      return;
    }

    // Fallback: create a lightweight badge that opens popup
    if (!document.getElementById('calendly-badge-fallback')) {
      const btn = document.createElement('button');
      btn.id = 'calendly-badge-fallback';
      btn.textContent = readStringOption(opts, 'text', 'Book time');
      Object.assign(btn.style, {
        position: 'fixed',
        right: '1rem',
        bottom: '1rem',
        zIndex: '9999',
        padding: '0.6rem 0.85rem',
        borderRadius: '999px',
        background: readStringOption(opts, 'color', '#00A2FF'),
        color: readStringOption(opts, 'textColor', '#fff'),
        border: 'none',
        cursor: 'pointer',
      });
      btn.addEventListener('click', () => initPopupWidget(resolvedUrl));
      document.body.appendChild(btn);
      badgeInitialized = true;
    }
  } catch {
    // no-op
  }
}

export function createInlineWidget(container: HTMLElement, url: string, opts: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const resolvedUrl = getCalendlyUrl(url);

  const attachIframe = () => {
    try {
      const src = new URL(resolvedUrl);
      src.searchParams.set('embed_domain', window.location.hostname);
      src.searchParams.set('embed_type', 'Inline');
      const iframe = document.createElement('iframe');
      iframe.src = src.toString();
      iframe.style.border = '0';
      iframe.width = '100%';
      iframe.height = `${readHeightOption(opts, '650')}px`;
      iframe.setAttribute('title', 'Calendly scheduling');
      container.innerHTML = '';
      container.appendChild(iframe);
    } catch {
      // If URL parsing fails, fallback to simple link
      container.innerHTML = `<a href="${resolvedUrl}" target="_blank" rel="noopener noreferrer">Open Calendly</a>`;
    }
  };

  // Prefer Calendly's inline initializer if available
  const calendly = getCalendly();
  if (calendly && typeof calendly.initInlineWidget === 'function') {
    try {
      calendly.initInlineWidget({ url: resolvedUrl, parentElement: container, ...opts });
      return;
    } catch {
      attachIframe();
      return;
    }
  }

  // Otherwise attach iframe (safer and avoids needing widget.js for inline)
  attachIframe();
}

export default loadCalendly;

const INSTAGRAM_SCRIPT_ID = 'instagram-embed-script';
const INSTAGRAM_SCRIPT_SRC = 'https://www.instagram.com/embed.js';

let scriptLoadPromise: Promise<void> | null = null;
let processRafId: number | null = null;

function getInstagramEmbedsApi(): { process: () => void } | null {
  const globalWindow = window as Window & {
    instgrm?: { Embeds?: { process?: () => void } };
  };

  if (!globalWindow.instgrm?.Embeds?.process) {
    return null;
  }

  return { process: globalWindow.instgrm.Embeds.process };
}

function getOrCreateScriptElement(): HTMLScriptElement {
  const existingById = document.getElementById(INSTAGRAM_SCRIPT_ID) as HTMLScriptElement | null;
  if (existingById) {
    return existingById;
  }

  const existingBySrc = document.querySelector(`script[src="${INSTAGRAM_SCRIPT_SRC}"]`) as HTMLScriptElement | null;
  if (existingBySrc) {
    existingBySrc.id = INSTAGRAM_SCRIPT_ID;
    return existingBySrc;
  }

  const script = document.createElement('script');
  script.id = INSTAGRAM_SCRIPT_ID;
  script.src = INSTAGRAM_SCRIPT_SRC;
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
  return script;
}

function hasUnprocessedInstagramEmbeds(root: ParentNode): boolean {
  const candidates = root.querySelectorAll('blockquote.instagram-media');
  for (const candidate of candidates) {
    if (!candidate.querySelector('iframe')) {
      return true;
    }
  }
  return false;
}

export function loadInstagramEmbedScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (getInstagramEmbedsApi()) {
    return Promise.resolve();
  }

  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  const script = getOrCreateScriptElement();

  scriptLoadPromise = new Promise<void>((resolve, reject) => {
    if (getInstagramEmbedsApi()) {
      resolve();
      return;
    }

    const handleLoad = () => {
      if (getInstagramEmbedsApi()) {
        resolve();
      } else {
        reject(new Error('Instagram embed API unavailable after script load.'));
      }
    };

    const handleError = () => {
      reject(new Error('Instagram embed script failed to load.'));
    };

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
  }).catch((error) => {
    scriptLoadPromise = null;
    console.warn(
      '[InstagramEmbed] Script blocked or failed to load. Check CSP config or use fallback testimonial cards.',
      error
    );
    throw error;
  });

  return scriptLoadPromise;
}

export function processInstagramEmbeds(root?: ParentNode): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const targetRoot = root ?? document;
  if (!hasUnprocessedInstagramEmbeds(targetRoot)) {
    return;
  }

  const runProcess = () => {
    const api = getInstagramEmbedsApi();
    if (!api) {
      return;
    }

    if (processRafId !== null) {
      cancelAnimationFrame(processRafId);
    }

    processRafId = requestAnimationFrame(() => {
      processRafId = null;
      api.process();
    });
  };

  if (getInstagramEmbedsApi()) {
    runProcess();
    return;
  }

  void loadInstagramEmbedScript()
    .then(() => {
      runProcess();
    })
    .catch(() => {
      // Error already logged by loader; callers can show fallback UI.
    });
}
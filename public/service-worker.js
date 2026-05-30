/**
 * URM ENROLL — Service Worker  (cache strategy v2)
 *
 * Strategies
 * ──────────────────────────────────────────────────────────────────────────
 * /assets/*            Cache-first  (Vite content-hashed bundles — immutable)
 * /img/* + /public     Stale-while-revalidate (images, icons, manifests)
 * Google Fonts CDN     Stale-while-revalidate, long-lived separate cache
 * HTML / navigation    Network-first, falls back to shell (/index.html)
 * /api/*               Bypass entirely — always live
 *
 * Bump CACHE_VERSION to force clients to pick up a new shell on deploy.
 */

const CACHE_VERSION   = "urm-v2";
const SHELL_CACHE     = `${CACHE_VERSION}-shell`;
const ASSETS_CACHE    = `${CACHE_VERSION}-assets`;
const FONTS_CACHE     = "urm-fonts-v1"; // intentionally version-stable; fonts rarely change

// App-shell URLs to pre-cache on install
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/bootstrap-theme.js",
  "/bootstrap-lang.js",
  "/img/logo-favicon.png",
];

// External origins whose responses are worth caching
const FONT_ORIGINS = [
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
];

// ─── Install ──────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

// ─── Activate ─────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  const validCaches = new Set([SHELL_CACHE, ASSETS_CACHE, FONTS_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !validCaches.has(k))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ─── Helpers ──────────────────────────────────────────────────────────────
function isFontRequest(request) {
  return FONT_ORIGINS.some((origin) => request.url.startsWith(origin));
}

function isStaticAsset(request) {
  return ["script", "style", "image", "font"].includes(request.destination);
}

// ─── Fetch ────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return; // unparseable URL — skip
  }

  if (!url.protocol.startsWith("http")) return;

  // ── 1. API routes — always bypass cache ─────────────────────────────────
  if (url.origin === self.location.origin && url.pathname.startsWith("/api/")) {
    return;
  }

  // ── 2. Google Fonts — stale-while-revalidate ────────────────────────────
  if (isFontRequest(request)) {
    event.respondWith(
      caches.open(FONTS_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
          // Return cached immediately; update in background
          return cached || network;
        }),
      ),
    );
    return;
  }

  // Only handle same-origin from here on
  if (url.origin !== self.location.origin) return;

  // ── 3. Vite hashed bundles (/assets/*) — cache-first ───────────────────
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.open(ASSETS_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
        }),
      ),
    );
    return;
  }

  // ── 4. Other static assets (images, icons, public JS) ───────────────────
  //       Stale-while-revalidate: serve cached, refresh in background
  if (isStaticAsset(request)) {
    event.respondWith(
      caches.open(ASSETS_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
          return cached || network;
        }),
      ),
    );
    return;
  }

  // ── 5. HTML / navigation — network-first, offline fallback ──────────────
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            // Clone synchronously before the body is consumed by navigation
            const copy = response.clone();
            caches
              .open(SHELL_CACHE)
              .then((c) => c.put(request, copy))
              .catch(() => {});
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          // Last resort: serve the SPA shell so routing still works offline
          return caches.match("/index.html");
        }),
    );
    return;
  }
});

// ─── Message: force-activate new SW ──────────────────────────────────────
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

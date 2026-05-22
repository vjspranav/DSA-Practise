/*
 * coi-serviceworker — Cross-Origin Isolation via Service Worker
 * Adds COOP/COEP headers to every response so SharedArrayBuffer works
 * on hosts that don't support custom HTTP headers (e.g. GitHub Pages).
 *
 * How it works:
 *   When loaded as a <script> tag it registers itself as a service worker.
 *   When running as a service worker it intercepts fetch and rewrites headers.
 *   On first install the page reloads once so the SW takes control.
 */

(function () {
  if (typeof window === 'undefined') {
    // ── Service Worker context ──────────────────────────────────────────────
    self.addEventListener('install', () => self.skipWaiting());
    self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

    self.addEventListener('fetch', (event) => {
      // Avoid touching opaque same-origin-only cached requests
      if (
        event.request.cache === 'only-if-cached' &&
        event.request.mode !== 'same-origin'
      ) return;

      event.respondWith(
        fetch(event.request)
          .then((response) => {
            // Opaque or error responses: pass through untouched
            if (!response || response.status === 0 || response.type === 'opaque') {
              return response;
            }

            const headers = new Headers(response.headers);
            headers.set('Cross-Origin-Opener-Policy', 'same-origin');
            headers.set('Cross-Origin-Embedder-Policy', 'credentialless');

            return new Response(response.body, {
              status:     response.status,
              statusText: response.statusText,
              headers,
            });
          })
          .catch((err) => { console.error('[coi-sw] fetch failed:', err); })
      );
    });

  } else {
    // ── Main thread context ─────────────────────────────────────────────────
    if (self.crossOriginIsolated) return; // already isolated — nothing to do

    if (!window.isSecureContext) {
      console.warn('[coi-sw] Requires a secure context (HTTPS). Skipping.');
      return;
    }

    if (!('serviceWorker' in navigator)) {
      console.warn('[coi-sw] Service workers not supported. SharedArrayBuffer may be unavailable.');
      return;
    }

    // Register the service worker (this same file)
    const swUrl = '/coi-serviceworker.js';
    navigator.serviceWorker.register(swUrl).then((reg) => {
      // SW already active and controlling — nothing else to do
      if (navigator.serviceWorker.controller) return;

      // Reload once the newly-installed SW activates so it can take control
      const reload = () => window.location.reload();
      if (reg.installing) {
        reg.installing.addEventListener('statechange', (e) => {
          if (e.target.state === 'activated') reload();
        });
      } else if (reg.waiting) {
        reg.waiting.addEventListener('statechange', (e) => {
          if (e.target.state === 'activated') reload();
        });
      } else if (reg.active) {
        reload();
      }
    }).catch((err) => {
      console.error('[coi-sw] Registration failed:', err);
    });
  }
})();

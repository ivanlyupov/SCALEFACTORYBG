/* ============================================================
   META PIXEL (dataset) — consent-gated.
   ------------------------------------------------------------
   The pixel script is NOT in index.html on purpose. It is injected
   here, and only after the visitor clicks "Приемам" in the cookie
   bar. Until then nothing is loaded and no cookie is set.

   The dataset ID lives in content.ts (metaPixelId). It is public by
   design — it ships in the page source of every site that runs a
   pixel — so it is safe to keep in the repo.

   Events fired:
     PageView            every public page
     Lead                contact form submitted successfully
     CompleteRegistration onboarding questionnaire finished
     ViewContent         /plans (price-shopping)
   ============================================================ */

import { metaPixelId } from "./content";
import { getConsent, onConsent } from "./consent";

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

let loaded = false;

/* Events that happened before the visitor answered the cookie bar.
   They are held here — never sent — and only flushed if consent is
   then granted in the same visit. Without this, someone who lands on
   /plans and accepts a few seconds later would lose the ViewContent,
   because the page fired it while the pixel was still dormant.
   If they refuse, the queue is dropped and nothing is ever sent. */
type Pending = { event: string; params?: Record<string, unknown> };
let pending: Pending[] = [];

/* Injects Meta's snippet. Safe to call more than once. */
function loadPixel(): void {
  if (loaded || !metaPixelId) return;
  loaded = true;

  /* Meta's official loader, transcribed. It defines window.fbq and
     queues calls until the remote script finishes downloading, so the
     PageView below is never lost to a race. */
  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode!.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq("init", metaPixelId);
  window.fbq("track", "PageView");

  // Anything that happened while we were waiting for the answer.
  pending.forEach((p) => window.fbq("track", p.event, p.params));
  pending = [];
}

/* Fire a standard event. Queues it if the visitor hasn't answered the
   cookie bar yet, and drops it entirely if they refused — so call
   sites never have to check consent themselves. */
export function track(event: string, params?: Record<string, unknown>): void {
  if (loaded && window.fbq) {
    window.fbq("track", event, params);
    return;
  }
  if (getConsent() !== "unset") return;

  // Drop an identical event already waiting. React StrictMode runs effects
  // twice in dev, and a page-view style event queued from an effect would
  // otherwise be flushed twice and double-count the conversion.
  const key = event + JSON.stringify(params ?? {});
  if (pending.some((p) => p.event + JSON.stringify(p.params ?? {}) === key)) return;
  pending.push({ event, params });
}

/* Same as track(), but fires at most once per page load.
   Use this for events fired from a useEffect (a page view of /plans,
   say): React StrictMode runs effects twice in development, and a
   double-counted conversion would quietly inflate your reporting.
   User-action events (a form submit) should use track() instead —
   there a second call means the visitor really did it twice. */
const fired = new Set<string>();

export function trackOnce(event: string, params?: Record<string, unknown>): void {
  const key = event + JSON.stringify(params ?? {});
  if (fired.has(key)) return;
  fired.add(key);
  track(event, params);
}

/* Called once from main.tsx on public pages. Loads the pixel now if
   consent is already stored, or the moment the visitor accepts. */
export function initPixel(): void {
  onConsent((state) => {
    if (state === "granted") loadPixel();
    else if (state === "denied") pending = [];
  });
}

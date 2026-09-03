/* ============================================================
   COOKIE CONSENT — the single source of truth for tracking.
   ------------------------------------------------------------
   Nothing that sets a marketing cookie (Meta Pixel, etc.) may run
   unless getConsent() === "granted". Under GDPR the tracker must
   stay OFF until the visitor actively says yes — silence, or
   closing the banner, counts as NO.

   How to hook a tracker up to this (e.g. the Meta Pixel):

     import { onConsent } from "./consent";
     onConsent((state) => { if (state === "granted") loadPixel(); });

   onConsent fires once straight away with the stored answer, and
   again whenever the visitor changes it — so the tracker starts
   the moment they click "Приемам", with no page reload.
   ============================================================ */

export type ConsentState = "granted" | "denied" | "unset";

const KEY = "mcbg_cookie_consent";

/* Bump this when the cookie text or the list of trackers materially
   changes — every visitor is then asked again, which is what the
   regulation expects when the terms of the consent change. */
const VERSION = "1";
const VERSION_KEY = "mcbg_cookie_consent_v";

type Listener = (state: ConsentState) => void;
const listeners = new Set<Listener>();

/* localStorage throws in some privacy modes / embedded browsers.
   A visitor we cannot store an answer for is treated as "unset",
   which means: no tracking. Failing closed is the safe direction. */
function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore — the visitor just gets asked again next time */
  }
}

export function getConsent(): ConsentState {
  if (safeGet(VERSION_KEY) !== VERSION) return "unset";
  const raw = safeGet(KEY);
  return raw === "granted" || raw === "denied" ? raw : "unset";
}

export function setConsent(state: "granted" | "denied"): void {
  safeSet(KEY, state);
  safeSet(VERSION_KEY, VERSION);
  listeners.forEach((fn) => fn(state));
}

/* Re-opens the banner so the visitor can change their mind.
   Withdrawing consent has to be as easy as giving it, so this is
   wired to a "Бисквитки" link in the footer. */
export function resetConsent(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn("unset"));
}

/* Subscribe to the answer. Calls back immediately with the current
   state, then on every change. Returns an unsubscribe function. */
export function onConsent(fn: Listener): () => void {
  listeners.add(fn);
  fn(getConsent());
  return () => listeners.delete(fn);
}

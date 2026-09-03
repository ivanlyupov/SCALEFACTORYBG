/* ============================================================
   COOKIE CONSENT — the single source of truth for tracking.
   ------------------------------------------------------------
   Consent is per CATEGORY, not one yes/no. Nothing that sets a
   marketing cookie (the Meta Pixel) may run unless the visitor
   turned "marketing" on. Until they answer, everything except
   "necessary" is off — silence counts as NO.

   How a tracker hooks in (see pixel.ts):

     onConsent((c) => { if (c?.marketing) loadPixel(); });

   onConsent fires once immediately with the stored answer, then
   again on every change — so a tracker starts the moment the
   visitor allows it, with no page reload.
   ============================================================ */

export type Category = "necessary" | "analytics" | "marketing" | "functional";

export type Consent = Record<Category, boolean>;

/* "necessary" is always true — it covers the session/state the site
   needs to work at all, which is exempt from consent. */
export const ALL_ON: Consent = {
  necessary: true,
  analytics: true,
  marketing: true,
  functional: true,
};

export const ALL_OFF: Consent = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

const KEY = "mcbg_cookie_consent";

/* Bump this when the categories or the cookie text materially change —
   every visitor is then asked again, which is what the regulation
   expects when the terms of the consent change.
   v2 = moved from one yes/no to the four categories below. */
const VERSION = "2";
const VERSION_KEY = "mcbg_cookie_consent_v";

/* null = the visitor has not answered yet. */
type Listener = (consent: Consent | null) => void;
const listeners = new Set<Listener>();

/* localStorage throws in some privacy modes / embedded browsers.
   A visitor whose answer we cannot store is treated as unanswered,
   which means no tracking. Failing closed is the safe direction. */
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
    /* ignore — the visitor is simply asked again next time */
  }
}

export function getConsent(): Consent | null {
  if (safeGet(VERSION_KEY) !== VERSION) return null;
  const raw = safeGet(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Consent>;
    // Rebuild from ALL_OFF so a missing/renamed key can never read as
    // "allowed" — an unknown category defaults to off.
    return {
      necessary: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      functional: parsed.functional === true,
    };
  } catch {
    return null;
  }
}

/* True only when that category was explicitly allowed. */
export function hasConsent(category: Category): boolean {
  if (category === "necessary") return true;
  return getConsent()?.[category] === true;
}

export function setConsent(consent: Consent): void {
  const next: Consent = { ...consent, necessary: true };
  safeSet(KEY, JSON.stringify(next));
  safeSet(VERSION_KEY, VERSION);
  listeners.forEach((fn) => fn(next));
}

export const acceptAll = () => setConsent(ALL_ON);
export const rejectAll = () => setConsent(ALL_OFF);

/* Re-opens the banner so the visitor can change their mind.
   Withdrawing consent has to be as easy as giving it, so this is
   wired to a "Бисквитки" link in the footer. */
export function resetConsent(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn(null));
}

/* Subscribe to the answer. Calls back immediately with the current
   state, then on every change. Returns an unsubscribe function. */
export function onConsent(fn: Listener): () => void {
  listeners.add(fn);
  fn(getConsent());
  return () => {
    listeners.delete(fn);
  };
}

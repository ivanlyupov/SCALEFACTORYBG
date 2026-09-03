import { useEffect, useState } from "react";
import { cookies } from "../content";
import {
  ALL_OFF,
  ALL_ON,
  acceptAll,
  rejectAll,
  setConsent,
  onConsent,
  type Category,
  type Consent,
} from "../consent";

/* Two-layer cookie consent.

   Layer 1 — a slim bar: "Предпочитания" | "Приеми".
   Layer 2 — a dialog with the four categories, each with its own
             description and toggle, and three actions.

   Renders nothing once the visitor has answered. Mounted only on the
   public pages (see main.tsx) — /admin and /client are you and your
   clients, not ad traffic. */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [active, setActive] = useState<Category>(cookies.categories[0].id);
  // Working copy of the toggles while the dialog is open. Starts with
  // everything off, so the visitor has to opt in — never pre-ticked.
  const [draft, setDraft] = useState<Consent>(ALL_OFF);

  useEffect(() => {
    // Subscribing (rather than reading once) is what lets the footer
    // "Бисквитки" link re-open the bar later.
    const off = onConsent((c) => {
      setVisible(c === null);
      if (c === null) {
        setShowPrefs(false);
        setDraft(ALL_OFF);
      }
    });
    return off;
  }, []);

  // Esc closes the dialog — but only the dialog. It must never count
  // as an answer, so the bar stays up behind it.
  useEffect(() => {
    if (!showPrefs) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowPrefs(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showPrefs]);

  if (!visible) return null;

  const activeCat =
    cookies.categories.find((c) => c.id === active) ?? cookies.categories[0];

  return (
    <>
      {/* ---------- layer 1: the slim bar ---------- */}
      <div className="cookiebar" role="region" aria-label={cookies.barText}>
        <div className="cookiebar-in">
          <div className="cookiebar-copy">
            <span className="ck-line">
              <span aria-hidden="true">🍪</span> {cookies.barText}
            </span>
            {cookies.policyHref && (
              <a className="ck-policy" href={cookies.policyHref}>
                {cookies.policyLabel}
              </a>
            )}
          </div>

          <div className="cookiebar-btns">
            <button type="button" className="ck-btn" onClick={() => setShowPrefs(true)}>
              {cookies.prefs}
            </button>
            {cookies.showRejectOnBar && (
              <button type="button" className="ck-btn" onClick={rejectAll}>
                {cookies.reject}
              </button>
            )}
            <button type="button" className="ck-btn ck-btn-solid" onClick={acceptAll}>
              {cookies.accept}
            </button>
          </div>
        </div>
      </div>

      {/* ---------- layer 2: the preferences dialog ---------- */}
      {showPrefs && (
        <div className="ck-modal-wrap">
          {/* Clicking the backdrop closes the dialog only — it is not an
              answer either way, so the bar remains. */}
          <div className="ck-backdrop" onClick={() => setShowPrefs(false)} />

          <div className="ck-modal" role="dialog" aria-modal="true" aria-label={cookies.modalTitle}>
            <div className="ck-modal-head">
              <h3>{cookies.modalTitle}</h3>
              <button
                type="button"
                className="ck-close"
                aria-label={cookies.closeLabel}
                onClick={() => setShowPrefs(false)}
              >
                ✕
              </button>
            </div>

            <div className="ck-modal-body">
              {/* left: the category tabs */}
              <div className="ck-tabs" role="tablist">
                {cookies.categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={c.id === active}
                    className={"ck-tab" + (c.id === active ? " is-active" : "")}
                    onClick={() => setActive(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* right: the selected category + its switch */}
              <div className="ck-pane">
                <div className="ck-pane-head">
                  <span className="ck-pane-title">{activeCat.label}</span>

                  {activeCat.id === "necessary" ? (
                    // Always on and disabled — strictly necessary cookies
                    // genuinely cannot be switched off.
                    <span className="ck-switch is-on is-locked" aria-hidden="true">
                      <span className="ck-knob" />
                    </span>
                  ) : (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={draft[activeCat.id]}
                      aria-label={activeCat.label}
                      className={"ck-switch" + (draft[activeCat.id] ? " is-on" : "")}
                      onClick={() =>
                        setDraft((d) => ({ ...d, [activeCat.id]: !d[activeCat.id] }))
                      }
                    >
                      <span className="ck-knob" />
                    </button>
                  )}
                </div>

                <p className="ck-pane-desc">{activeCat.desc}</p>
              </div>
            </div>

            <div className="ck-modal-foot">
              <button type="button" className="ck-btn" onClick={() => setConsent(draft)}>
                {cookies.saveSelected}
              </button>
              <div className="ck-foot-right">
                <button type="button" className="ck-btn ck-btn-solid" onClick={rejectAll}>
                  {cookies.rejectAll}
                </button>
                <button
                  type="button"
                  className="ck-btn ck-btn-solid"
                  onClick={() => setConsent(ALL_ON)}
                >
                  {cookies.acceptAll}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

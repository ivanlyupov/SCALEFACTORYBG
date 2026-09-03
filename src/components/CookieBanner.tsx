import { useEffect, useState } from "react";
import { cookies } from "../content";
import { setConsent, onConsent } from "../consent";

/* The cookie bar. Renders nothing once the visitor has answered.
   Mounted only on the public pages (see main.tsx) — /admin and
   /client are you and your clients, not ad traffic. */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Subscribe first, so the footer "Бисквитки" link can re-open the
    // bar later by resetting the stored answer back to "unset".
    const off = onConsent((state) => setVisible(state === "unset"));
    return off;
  }, []);

  if (!visible) return null;

  return (
    <div className="cookiebar" role="dialog" aria-label={cookies.title}>
      <div className="cookiebar-in">
        <div className="cookiebar-copy">
          <b>{cookies.title}</b>
          <span className="muted">{cookies.text}</span>
        </div>
        <div className="cookiebar-btns">
          {/* Both buttons share one class on purpose — equal prominence. */}
          <button type="button" className="ck-btn" onClick={() => setConsent("denied")}>
            {cookies.reject}
          </button>
          <button type="button" className="ck-btn" onClick={() => setConsent("granted")}>
            {cookies.accept}
          </button>
        </div>
      </div>
    </div>
  );
}

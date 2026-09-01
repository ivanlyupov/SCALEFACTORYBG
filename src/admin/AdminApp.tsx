import { useEffect, useState } from "react";
import { site } from "../content";
import LeadsPanel from "./LeadsPanel";
import ClientsPanel from "./ClientsPanel";
import OnboardingPanel from "./OnboardingPanel";

/* Control panel at /admin. One password (ADMIN_PASSWORD) unlocks three tabs:
   - Заявки: leads from the website contact form
   - Клиенти: manage each client's portal (/client)
   - Онбординг: questionnaire submissions from /onboarding */

const STORAGE_KEY = "sfbg_admin_key";
type Tab = "leads" | "clients" | "onboarding";

export default function AdminApp() {
  const [key, setKey] = useState(() => sessionStorage.getItem(STORAGE_KEY) || "");
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [tab, setTab] = useState<Tab>("leads");

  // Verify a password by calling the leads endpoint once.
  async function verify(pw: string) {
    setChecking(true);
    setError("");
    try {
      const res = await fetch("/api/leads", { headers: { "x-admin-key": pw } });
      if (res.status === 401) {
        setError("Грешна парола.");
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b?.error || "Грешка.");
      }
      setKey(pw);
      setAuthed(true);
      sessionStorage.setItem(STORAGE_KEY, pw);
    } catch (e: any) {
      setError(e?.message || "Грешка.");
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    if (key) verify(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setKey("");
    setAuthed(false);
    setInput("");
  }

  if (!authed) {
    return (
      <div className="admin">
        <form
          className="admin-login"
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) verify(input.trim());
          }}
        >
          <div className="logo" style={{ justifyContent: "center", marginBottom: 6 }}>
            <span className="mark">{site.logoMark}</span>
            {site.logoLead}
            <b>{site.logoAccent}</b>
          </div>
          <div className="admin-login-sub">Админ панел</div>
          <input
            type="password"
            placeholder="Админ парола"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          {error && <div className="admin-err">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={checking}>
            {checking ? "Проверка…" : "Влез"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="admin-wrap">
        <div className="admin-head">
          <div className="logo">
            <span className="mark">{site.logoMark}</span>
            {site.logoLead}
            <b>{site.logoAccent}</b>
          </div>
          <div className="admin-actions">
            <button className="btn btn-ghost" onClick={logout}>
              Изход
            </button>
          </div>
        </div>

        <div className="ap-tabs">
          <button className={tab === "leads" ? "on" : ""} onClick={() => setTab("leads")}>
            Заявки
          </button>
          <button className={tab === "clients" ? "on" : ""} onClick={() => setTab("clients")}>
            Клиенти
          </button>
          <button className={tab === "onboarding" ? "on" : ""} onClick={() => setTab("onboarding")}>
            Онбординг
          </button>
        </div>

        {tab === "leads" ? (
          <LeadsPanel adminKey={key} />
        ) : tab === "clients" ? (
          <ClientsPanel adminKey={key} />
        ) : (
          <OnboardingPanel adminKey={key} />
        )}
      </div>
    </div>
  );
}

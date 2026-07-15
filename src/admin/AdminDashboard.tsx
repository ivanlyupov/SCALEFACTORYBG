import { useEffect, useState } from "react";

/* Private leads dashboard, served at /admin.
   It never holds the Supabase secret key — it only sends the admin
   password to /api/leads, which does the privileged read on the server. */

interface Lead {
  id: string;
  created_at: string;
  name: string;
  brand: string;
  email: string;
  message: string | null;
  source: string | null;
}

const STORAGE_KEY = "sfbg_admin_key"; // remembers the password for the session only

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("bg-BG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AdminDashboard() {
  const [key, setKey] = useState(() => sessionStorage.getItem(STORAGE_KEY) || "");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");

  async function load(pw: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", { headers: { "x-admin-key": pw } });
      if (res.status === 401) {
        setError("Грешна парола.");
        setAuthed(false);
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Грешка при зареждане.");
      }
      const body = await res.json();
      setLeads(body.leads || []);
      setAuthed(true);
      setKey(pw);
      sessionStorage.setItem(STORAGE_KEY, pw);
    } catch (e: any) {
      setError(e?.message || "Грешка при зареждане.");
    } finally {
      setLoading(false);
    }
  }

  // Try a remembered password on first load
  useEffect(() => {
    if (key) load(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) load(input.trim());
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setKey("");
    setAuthed(false);
    setLeads([]);
    setInput("");
    setError("");
  }

  /* ---------- LOGIN SCREEN ---------- */
  if (!authed) {
    return (
      <div className="admin">
        <form className="admin-login" onSubmit={handleLogin}>
          <div className="logo" style={{ justifyContent: "center", marginBottom: 6 }}>
            <span className="mark">SF</span>ScaleFactory<b>BG</b>
          </div>
          <div className="admin-login-sub">Админ панел · заявки</div>
          <input
            type="password"
            placeholder="Админ парола"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          {error && <div className="admin-err">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Проверка…" : "Влез"}
          </button>
        </form>
      </div>
    );
  }

  /* ---------- DASHBOARD ---------- */
  return (
    <div className="admin">
      <div className="admin-wrap">
        <div className="admin-head">
          <div>
            <div className="logo">
              <span className="mark">SF</span>ScaleFactory<b>BG</b>
            </div>
            <div className="admin-count">
              {leads.length} {leads.length === 1 ? "заявка" : "заявки"}
            </div>
          </div>
          <div className="admin-actions">
            <button
              className="btn btn-ghost"
              onClick={() => load(key)}
              disabled={loading}
            >
              {loading ? "Зареждане…" : "↻ Обнови"}
            </button>
            <button className="btn btn-ghost" onClick={logout}>
              Изход
            </button>
          </div>
        </div>

        {error && <div className="admin-err">{error}</div>}

        {leads.length === 0 && !loading ? (
          <div className="admin-empty">
            Все още няма заявки. Новите ще се появят тук автоматично при обновяване.
          </div>
        ) : (
          <div className="lead-list">
            {leads.map((l) => (
              <div className="lead-card" key={l.id}>
                <div className="lead-top">
                  <div className="lead-name">{l.name}</div>
                  <div className="lead-date mono">{formatDate(l.created_at)}</div>
                </div>
                <div className="lead-grid">
                  <div className="lead-field">
                    <span className="lead-label">Бранд / сайт</span>
                    <span className="lead-value">{l.brand}</span>
                  </div>
                  <div className="lead-field">
                    <span className="lead-label">Имейл</span>
                    <a className="lead-value lead-link" href={`mailto:${l.email}`}>
                      {l.email}
                    </a>
                  </div>
                  <div className="lead-field">
                    <span className="lead-label">Източник</span>
                    <span className="lead-value">{l.source || "—"}</span>
                  </div>
                </div>
                {l.message && (
                  <div className="lead-field lead-message">
                    <span className="lead-label">Съобщение</span>
                    <span className="lead-value">{l.message}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

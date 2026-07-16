import { useEffect, useState } from "react";

/* Leads tab — the website contact-form submissions. */

interface Lead {
  id: string;
  created_at: string;
  name: string;
  brand: string;
  email: string;
  message: string | null;
  source: string | null;
}

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

export default function LeadsPanel({ adminKey }: { adminKey: string }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", { headers: { "x-admin-key": adminKey } });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b?.error || "Грешка при зареждане.");
      }
      const b = await res.json();
      setLeads(b.leads || []);
    } catch (e: any) {
      setError(e?.message || "Грешка при зареждане.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="ap-bar">
        <div className="admin-count">
          {leads.length} {leads.length === 1 ? "заявка" : "заявки"}
        </div>
        <button className="btn btn-ghost" onClick={load} disabled={loading}>
          {loading ? "Зареждане…" : "↻ Обнови"}
        </button>
      </div>

      {error && <div className="admin-err">{error}</div>}

      {leads.length === 0 && !loading ? (
        <div className="admin-empty">Все още няма заявки.</div>
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
  );
}

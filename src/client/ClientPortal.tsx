import { useEffect, useState } from "react";
import { site } from "../content";

/* Private client portal, served at /client.
   The client enters their access code (or opens /client?code=XXX).
   It reads only their own board via /api/client — the browser never
   touches the database directly. */

const STAGES = [
  { key: "research", label: "Проучване" },
  { key: "scripts", label: "Скриптове" },
  { key: "production", label: "Продукция" },
  { key: "review", label: "Ревю" },
  { key: "delivered", label: "Доставено" },
];

const STATUS_LABEL: Record<string, string> = {
  in_progress: "в изработка",
  review: "за одобрение",
  delivered: "доставено",
};

interface Client {
  name: string;
  brand: string;
  role: string | null;
  plan: string;
  assets_used: number;
  assets_total: number;
  pipeline_stage: string;
  last_updated_at: string | null;
}
interface Deliverable {
  id: string;
  section: string;
  title: string;
  kind: string | null;
  status: string;
  due_date: string | null;
  preview_url: string | null;
}
interface Metric {
  id: string;
  label: string;
  from_value: string | null;
  to_value: string | null;
}

const CODE_KEY = "sfbg_client_code";

function fmtDate(iso: string | null) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("bg-BG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
function fmtDay(iso: string | null) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("bg-BG", { day: "2-digit", month: "2-digit" });
  } catch {
    return iso;
  }
}
function isToday(iso: string | null) {
  if (!iso) return false;
  const d = new Date(iso);
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
}

export default function ClientPortal() {
  const initialCode =
    new URLSearchParams(window.location.search).get("code") ||
    localStorage.getItem(CODE_KEY) ||
    "";

  const [code, setCode] = useState(initialCode);
  const [input, setInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // request box
  const [reqText, setReqText] = useState("");
  const [reqState, setReqState] = useState<"idle" | "sending" | "ok">("idle");

  async function load(c: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/client", { headers: { "x-client-code": c } });
      if (res.status === 401) {
        setError("Невалиден код за достъп.");
        setAuthed(false);
        localStorage.removeItem(CODE_KEY);
        return;
      }
      if (!res.ok) throw new Error("Грешка при зареждане.");
      const body = await res.json();
      setClient(body.client);
      setDeliverables(body.deliverables || []);
      setMetrics(body.metrics || []);
      setAuthed(true);
      setCode(c);
      localStorage.setItem(CODE_KEY, c);
      // tidy the URL (remove ?code=) so the link isn't left in the address bar
      if (window.location.search) {
        window.history.replaceState({}, "", "/client");
      }
    } catch (e: any) {
      setError(e?.message || "Грешка при зареждане.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialCode) load(initialCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!reqText.trim()) return;
    setReqState("sending");
    try {
      const res = await fetch("/api/client", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-client-code": code },
        body: JSON.stringify({ message: reqText.trim() }),
      });
      if (!res.ok) throw new Error();
      setReqState("ok");
      setReqText("");
    } catch {
      setReqState("idle");
      setError("Заявката не се изпрати. Опитайте пак.");
    }
  }

  /* ---------- CODE ENTRY ---------- */
  if (!authed) {
    return (
      <div className="admin">
        <form
          className="admin-login"
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) load(input.trim());
          }}
        >
          <div className="logo" style={{ justifyContent: "center", marginBottom: 6 }}>
            <span className="mark">{site.logoMark}</span>
            {site.logoLead}
            <b>{site.logoAccent}</b>
          </div>
          <div className="admin-login-sub">Клиентски портал</div>
          <input
            type="text"
            placeholder="Вашият код за достъп"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          {error && <div className="admin-err">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Проверка…" : "Влез"}
          </button>
          <div className="form-note">// кодът получавате от екипа на {site.brandName}</div>
        </form>
      </div>
    );
  }

  if (!client) return null;

  const stageIdx = STAGES.findIndex((s) => s.key === client.pipeline_stage);
  const thisWeek = deliverables.filter((d) => d.section === "this_week");
  const upcoming = deliverables.filter((d) => d.section === "upcoming");
  const freshToday = isToday(client.last_updated_at);

  return (
    <div className="cp">
      <div className="cp-wrap">
        {/* header */}
        <div className="cp-head">
          <div className="cp-id">
            <div className="cp-av">{(client.brand || "?").slice(0, 2).toUpperCase()}</div>
            <div>
              <div className="cp-brand">{client.brand}</div>
              {client.role && <div className="cp-role">{client.role}</div>}
            </div>
          </div>
          <div className="cp-tags">
            <span className="cp-pill cp-pill-plan">{client.plan}</span>
            <span className="cp-pill">
              {client.assets_used}/{client.assets_total} asset
            </span>
          </div>
        </div>

        {/* CREATIVE: daily freshness banner */}
        <div className={`cp-fresh${freshToday ? " today" : ""}`}>
          <span className="cp-dot" />
          <span className="cp-fresh-main">
            {freshToday
              ? `Обновено днес · ${fmtDate(client.last_updated_at)}`
              : `Последно обновено: ${fmtDate(client.last_updated_at)}`}
          </span>
          <span className="cp-fresh-sub">
            Екипът обновява таблото веднъж на ден, всеки работен ден.
          </span>
        </div>

        {/* pipeline */}
        <div className="cp-label">В момента работим по</div>
        <div className="cp-pipe">
          {STAGES.map((s, i) => {
            const state = i < stageIdx ? "done" : i === stageIdx ? "on" : "todo";
            return (
              <div className={`cp-stage ${state}`} key={s.key}>
                <div className="cp-stage-ic">{i < stageIdx ? "✓" : i === stageIdx ? "●" : "○"}</div>
                {s.label}
              </div>
            );
          })}
        </div>

        {/* this week */}
        <div className="cp-label">Тази седмица</div>
        {thisWeek.length === 0 ? (
          <div className="cp-empty">Няма активни доставки в момента.</div>
        ) : (
          <div className="cp-list">
            {thisWeek.map((d) => (
              <div className="cp-card" key={d.id}>
                <div className={`cp-card-ic st-${d.status}`}>
                  {d.status === "delivered" ? "✓" : d.status === "review" ? "◐" : "▶"}
                </div>
                <div className="cp-card-body">
                  <div className="cp-card-title">{d.title}</div>
                  <div className="cp-card-meta">
                    {d.kind ? d.kind + " · " : ""}
                    {STATUS_LABEL[d.status] || d.status}
                    {d.due_date ? ` · до ${fmtDay(d.due_date)}` : ""}
                  </div>
                </div>
                {d.preview_url && (
                  <a
                    className="btn btn-ghost cp-btn"
                    href={d.preview_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Виж
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* upcoming */}
        {upcoming.length > 0 && (
          <>
            <div className="cp-label">Предстои</div>
            <div className="cp-timeline">
              {upcoming.map((d) => (
                <div className="cp-tl-row" key={d.id}>
                  <span className="cp-tl-date mono">{d.due_date ? fmtDay(d.due_date) : "—"}</span>
                  <span className="cp-tl-title">{d.title}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* metrics */}
        {metrics.length > 0 && (
          <>
            <div className="cp-label">Вашите резултати</div>
            <div className="cp-metrics">
              {metrics.map((m) => (
                <div className="cp-metric" key={m.id}>
                  <div className="cp-metric-label">{m.label}</div>
                  <div className="cp-metric-val">
                    {m.from_value && <span className="cp-from">{m.from_value} → </span>}
                    <span className="cp-to">{m.to_value}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* request box */}
        <div className="cp-req">
          <div className="cp-req-title">Заявка за ревизия или нов ъгъл</div>
          {reqState === "ok" ? (
            <div className="cp-ok">✓ Получихме заявката ви. Ще я обработим при следващото обновяване.</div>
          ) : (
            <form className="cp-req-form" onSubmit={sendRequest}>
              <textarea
                placeholder="Напишете какво искате да пробваме…"
                value={reqText}
                onChange={(e) => setReqText(e.target.value)}
              />
              <button className="btn btn-primary" type="submit" disabled={reqState === "sending"}>
                {reqState === "sending" ? "Изпращане…" : "Изпрати"}
              </button>
            </form>
          )}
        </div>

        <div className="cp-foot mono">{site.brandName} · клиентски портал</div>
      </div>
    </div>
  );
}

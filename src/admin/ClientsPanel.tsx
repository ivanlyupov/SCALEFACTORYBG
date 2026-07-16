import { useEffect, useState } from "react";

/* Клиенти tab — manage each client's portal (/client).
   Everything here writes through /api/admin/data (server + secret key). */

const STAGES = [
  { key: "research", label: "Проучване" },
  { key: "scripts", label: "Скриптове" },
  { key: "production", label: "Продукция" },
  { key: "review", label: "Ревю" },
  { key: "delivered", label: "Доставено" },
];

interface Client {
  id: string;
  name: string;
  brand: string;
  role: string | null;
  plan: string;
  assets_used: number;
  assets_total: number;
  pipeline_stage: string;
  access_code: string;
  last_updated_at: string | null;
}
interface Deliverable {
  id: string;
  client_id: string;
  section: string;
  title: string;
  kind: string | null;
  status: string;
  due_date: string | null;
  preview_url: string | null;
}
interface Metric {
  id: string;
  client_id: string;
  label: string;
  from_value: string | null;
  to_value: string | null;
}
interface Req {
  id: string;
  client_id: string;
  message: string;
  created_at: string;
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("bg-BG", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function ClientsPanel({ adminKey }: { adminKey: string }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [requests, setRequests] = useState<Req[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  // new-client form
  const [showNew, setShowNew] = useState(false);
  const [nc, setNc] = useState({ name: "", brand: "", role: "", assets_total: 20 });

  // new deliverable / metric forms (for the selected client)
  const [nd, setNd] = useState({ section: "this_week", title: "", kind: "", status: "in_progress", due_date: "", preview_url: "" });
  const [nm, setNm] = useState({ label: "", from_value: "", to_value: "" });

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/data", { headers: { "x-admin-key": adminKey } });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b?.error || "Грешка при зареждане.");
      }
      const b = await res.json();
      setClients(b.clients || []);
      setDeliverables(b.deliverables || []);
      setMetrics(b.metrics || []);
      setRequests(b.requests || []);
      if (!selectedId && b.clients?.length) setSelectedId(b.clients[0].id);
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

  async function act(body: any) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b?.error || "Грешка.");
      }
      return await res.json();
    } catch (e: any) {
      setError(e?.message || "Грешка.");
      throw e;
    } finally {
      setBusy(false);
    }
  }

  async function createClient(e: React.FormEvent) {
    e.preventDefault();
    if (!nc.name.trim() || !nc.brand.trim()) return;
    const r = await act({ action: "create_client", payload: nc });
    setShowNew(false);
    setNc({ name: "", brand: "", role: "", assets_total: 20 });
    await load();
    if (r?.client?.id) setSelectedId(r.client.id);
  }

  async function patchClient(id: string, patch: any) {
    await act({ action: "update_client", id, patch });
    await load();
  }
  async function setStage(id: string, stage: string) {
    await act({ action: "update_client", id, patch: { pipeline_stage: stage } });
    await load();
  }
  async function touch(id: string) {
    await act({ action: "touch_client", id });
    await load();
  }
  async function archive(id: string) {
    if (!confirm("Да архивирам ли този клиент?")) return;
    await act({ action: "archive_client", id });
    setSelectedId(null);
    await load();
  }

  async function addDeliverable(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !nd.title.trim()) return;
    await act({ action: "upsert_deliverable", payload: { ...nd, client_id: selectedId } });
    setNd({ section: "this_week", title: "", kind: "", status: "in_progress", due_date: "", preview_url: "" });
    await load();
  }
  async function delDeliverable(id: string) {
    await act({ action: "delete_deliverable", id });
    await load();
  }
  async function addMetric(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !nm.label.trim()) return;
    await act({ action: "upsert_metric", payload: { ...nm, client_id: selectedId } });
    setNm({ label: "", from_value: "", to_value: "" });
    await load();
  }
  async function delMetric(id: string) {
    await act({ action: "delete_metric", id });
    await load();
  }
  async function resolveReq(id: string) {
    await act({ action: "resolve_request", id });
    await load();
  }

  const selected = clients.find((c) => c.id === selectedId) || null;
  const selDeliverables = deliverables.filter((d) => d.client_id === selectedId);
  const selMetrics = metrics.filter((m) => m.client_id === selectedId);
  const selRequests = requests.filter((r) => r.client_id === selectedId);
  const shareLink = selected ? `${window.location.origin}/client?code=${selected.access_code}` : "";

  return (
    <div>
      <div className="ap-bar">
        <div className="admin-count">
          {clients.length} {clients.length === 1 ? "клиент" : "клиенти"}
        </div>
        <div className="admin-actions">
          <button className="btn btn-ghost" onClick={load} disabled={loading}>
            {loading ? "Зареждане…" : "↻ Обнови"}
          </button>
          <button className="btn btn-primary" onClick={() => setShowNew((v) => !v)}>
            + Нов клиент
          </button>
        </div>
      </div>

      {error && <div className="admin-err">{error}</div>}

      {showNew && (
        <form className="ap-new" onSubmit={createClient}>
          <div className="ap-row">
            <input placeholder="Име / контакт" value={nc.name} onChange={(e) => setNc({ ...nc, name: e.target.value })} />
            <input placeholder="Бранд" value={nc.brand} onChange={(e) => setNc({ ...nc, brand: e.target.value })} />
          </div>
          <div className="ap-row">
            <input placeholder="Описание (напр. Наколенник · DTC)" value={nc.role} onChange={(e) => setNc({ ...nc, role: e.target.value })} />
            <input type="number" placeholder="Assets / мес" value={nc.assets_total} onChange={(e) => setNc({ ...nc, assets_total: Number(e.target.value) })} style={{ maxWidth: 130 }} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            Създай клиент
          </button>
        </form>
      )}

      {clients.length === 0 && !loading ? (
        <div className="admin-empty">Още няма клиенти. Натиснете „+ Нов клиент“, за да добавите първия.</div>
      ) : (
        <div className="ap-grid">
          {/* client list */}
          <div className="ap-list">
            {clients.map((c) => {
              const openReq = requests.filter((r) => r.client_id === c.id).length;
              return (
                <button
                  key={c.id}
                  className={`ap-item${c.id === selectedId ? " on" : ""}`}
                  onClick={() => setSelectedId(c.id)}
                >
                  <div className="ap-item-brand">{c.brand}</div>
                  <div className="ap-item-sub mono">обновено {fmtDate(c.last_updated_at)}</div>
                  {openReq > 0 && <span className="ap-badge">{openReq}</span>}
                </button>
              );
            })}
          </div>

          {/* editor */}
          {selected && (
            <div className="ap-editor">
              <div className="ap-sec-head">
                <h3>{selected.brand}</h3>
                <button className="ap-link-danger" onClick={() => archive(selected.id)}>
                  архивирай
                </button>
              </div>

              {/* shareable link + mark-updated */}
              <div className="ap-share">
                <div className="ap-share-label">Линк за клиента</div>
                <div className="ap-share-row">
                  <input readOnly value={shareLink} onFocus={(e) => e.currentTarget.select()} />
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      navigator.clipboard?.writeText(shareLink);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                  >
                    {copied ? "Копирано ✓" : "Копирай"}
                  </button>
                </div>
              </div>

              <button className="btn btn-primary ap-touch" onClick={() => touch(selected.id)} disabled={busy}>
                ✓ Маркирай като обновено днес
              </button>
              <div className="ap-hint">
                Последно обновено: {fmtDate(selected.last_updated_at)} — клиентът вижда тази дата.
              </div>

              {/* pipeline stage */}
              <div className="ap-field-label">Етап на пайплайна</div>
              <div className="ap-stages">
                {STAGES.map((s) => (
                  <button
                    key={s.key}
                    className={selected.pipeline_stage === s.key ? "on" : ""}
                    onClick={() => setStage(selected.id, s.key)}
                    disabled={busy}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* profile quick edit */}
              <div className="ap-field-label">Профил</div>
              <div className="ap-row">
                <input
                  defaultValue={selected.role || ""}
                  placeholder="Описание"
                  onBlur={(e) => e.target.value !== (selected.role || "") && patchClient(selected.id, { role: e.target.value })}
                />
                <input
                  defaultValue={selected.plan}
                  placeholder="План"
                  onBlur={(e) => e.target.value !== selected.plan && patchClient(selected.id, { plan: e.target.value })}
                />
              </div>
              <div className="ap-row">
                <input
                  type="number"
                  defaultValue={selected.assets_used}
                  placeholder="Assets използвани"
                  onBlur={(e) => Number(e.target.value) !== selected.assets_used && patchClient(selected.id, { assets_used: Number(e.target.value) })}
                />
                <input
                  type="number"
                  defaultValue={selected.assets_total}
                  placeholder="Assets общо"
                  onBlur={(e) => Number(e.target.value) !== selected.assets_total && patchClient(selected.id, { assets_total: Number(e.target.value) })}
                />
              </div>

              {/* deliverables */}
              <div className="ap-field-label">Доставки</div>
              {selDeliverables.length === 0 && <div className="ap-muted">Няма добавени доставки.</div>}
              {selDeliverables.map((d) => (
                <div className="ap-row-item" key={d.id}>
                  <span className={`ap-tag ap-tag-${d.section === "upcoming" ? "up" : "now"}`}>
                    {d.section === "upcoming" ? "предстои" : "седмица"}
                  </span>
                  <span className="ap-row-title">{d.title}</span>
                  <span className="ap-row-meta mono">{d.kind || ""} · {d.status}{d.due_date ? " · " + d.due_date : ""}</span>
                  <button className="ap-del" onClick={() => delDeliverable(d.id)} aria-label="Изтрий">✕</button>
                </div>
              ))}
              <form className="ap-add" onSubmit={addDeliverable}>
                <div className="ap-row">
                  <select value={nd.section} onChange={(e) => setNd({ ...nd, section: e.target.value })}>
                    <option value="this_week">Тази седмица</option>
                    <option value="upcoming">Предстои</option>
                  </select>
                  <input placeholder="Заглавие" value={nd.title} onChange={(e) => setNd({ ...nd, title: e.target.value })} />
                </div>
                <div className="ap-row">
                  <input placeholder="Етикет (VSL · 1:40)" value={nd.kind} onChange={(e) => setNd({ ...nd, kind: e.target.value })} />
                  <select value={nd.status} onChange={(e) => setNd({ ...nd, status: e.target.value })}>
                    <option value="in_progress">в изработка</option>
                    <option value="review">за одобрение</option>
                    <option value="delivered">доставено</option>
                  </select>
                </div>
                <div className="ap-row">
                  <input type="date" value={nd.due_date} onChange={(e) => setNd({ ...nd, due_date: e.target.value })} />
                  <input placeholder="Линк за преглед (по избор)" value={nd.preview_url} onChange={(e) => setNd({ ...nd, preview_url: e.target.value })} />
                </div>
                <button className="btn btn-ghost" type="submit" disabled={busy}>+ Добави доставка</button>
              </form>

              {/* metrics */}
              <div className="ap-field-label">Резултати (метрики)</div>
              {selMetrics.length === 0 && <div className="ap-muted">Няма добавени метрики.</div>}
              {selMetrics.map((m) => (
                <div className="ap-row-item" key={m.id}>
                  <span className="ap-row-title">{m.label}</span>
                  <span className="ap-row-meta mono">{m.from_value} → {m.to_value}</span>
                  <button className="ap-del" onClick={() => delMetric(m.id)} aria-label="Изтрий">✕</button>
                </div>
              ))}
              <form className="ap-add" onSubmit={addMetric}>
                <div className="ap-row">
                  <input placeholder="Етикет (ROAS · 30 дни)" value={nm.label} onChange={(e) => setNm({ ...nm, label: e.target.value })} />
                  <input placeholder="От (1.4)" value={nm.from_value} onChange={(e) => setNm({ ...nm, from_value: e.target.value })} style={{ maxWidth: 110 }} />
                  <input placeholder="До (3.2)" value={nm.to_value} onChange={(e) => setNm({ ...nm, to_value: e.target.value })} style={{ maxWidth: 110 }} />
                </div>
                <button className="btn btn-ghost" type="submit" disabled={busy}>+ Добави метрика</button>
              </form>

              {/* requests */}
              <div className="ap-field-label">Заявки от клиента {selRequests.length > 0 && `(${selRequests.length})`}</div>
              {selRequests.length === 0 ? (
                <div className="ap-muted">Няма нови заявки.</div>
              ) : (
                selRequests.map((r) => (
                  <div className="ap-req" key={r.id}>
                    <div className="ap-req-msg">{r.message}</div>
                    <div className="ap-req-foot">
                      <span className="mono">{fmtDate(r.created_at)}</span>
                      <button className="ap-link" onClick={() => resolveReq(r.id)}>маркирай като решена</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

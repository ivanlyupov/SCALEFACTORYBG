import { useEffect, useState } from "react";
import { onboarding } from "../content";

/* Онбординг tab — questionnaire submissions from /onboarding.
   Each one can be copied out as a ready brand_identity.md file. */

interface Submission {
  id: string;
  created_at: string;
  brand: string;
  contact_name: string;
  email: string;
  website: string | null;
  answers: Record<string, string>;
  reviewed: boolean;
}

function fmtDate(iso: string) {
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

/* Turns a submission into the team's brand_identity.md format.
   Unanswered questions become "not yet provided" — never invented. */
function toBrandIdentityMd(s: Submission): string {
  const a = s.answers || {};
  const v = (id: string) => {
    const val = (a[id] || "").trim();
    if (!val) return "not yet provided";
    return val.includes("\n") ? "\n  " + val.split("\n").join("\n  ") : val;
  };
  // combines several answers into labelled bullet lines (skips empty ones)
  const combo = (parts: [string, string][]) => {
    const lines = parts
      .filter(([, id]) => (a[id] || "").trim())
      .map(([label, id]) => `- **${label}:** ${v(id)}`);
    return lines.length ? lines.join("\n") : "- not yet provided";
  };
  return `# Brand Identity: ${s.brand}

> Single source of truth for this client. Every agent reads this before doing any work. Generated from the onboarding questionnaire submitted on ${fmtDate(s.created_at)} by ${s.contact_name} (${s.email}).

## 1. Brand DNA

- **Brand name:** ${s.brand}
- **Product(s):** ${v("products")}
- **Category:** ${v("category")}
- **Spokesperson/founder (if any):** not yet provided
- **Core offer (standard):** ${v("core_offer")}
- **Guarantee (exact terms):** ${v("guarantee")}
- **Certifications:** not yet provided
- **Media mentions:** not yet provided
- **Website:** ${v("website")}

## 2. Visual identity

- **Primary color(s) (hex):** ${v("colors_primary")}
- **Secondary/accent color(s) (hex):** not yet provided
- **Fonts:** not yet provided
- **Packaging/product physical description:** see reference images
- **Reference images available:** ${v("reference_images")}

## 3. Voice & tone

- **5 tone adjectives:** ${v("tone_adjectives")}
- **Positioning statement (one sentence):** not yet provided
- **Competitive differentiation:** not yet provided

## 4. Audience

### Primary persona
- Who they are (demographics, life stage): ${v("persona_who")}
- What they've already tried: ${v("persona_tried")}
- What they're afraid of: ${v("persona_fears")}
- What they secretly want: ${v("persona_wants")}
- Where they spend attention: ${v("persona_attention")}

### Secondary persona (if applicable)
- ${v("persona_secondary")}

## 5. Pain points (in the audience's own words, from real reviews/comments/research — not invented)

${combo([
  ["Real customer reviews (raw)", "reviews_raw"],
  ["Most common post-purchase complaints", "complaints"],
])}

## 6. Desired outcomes

${combo([
  ["What customers say after success", "outcomes_quotes"],
  ["Success in the customer's words", "success_definition"],
])}

## 7. Angle matrix (to be filled in by the team from the answers above)

| Axis | This client's specific values |
|---|---|
| Pains |  |
| Emotions |  |
| Product angles |  |
| Proof types |  |
| Audience segments |  |

## 8. Proof points on file (only what's actually verified/supplied — nothing invented)

- **Testimonials:** ${v("reviews_raw")}
- **Aggregate stats (customer count, rating, etc.):** ${v("stats")}
- **Clinical/scientific backing (if any, and only if genuinely available):** ${v("clinical")}
- **Authority/expert backing:** ${v("authority")}

## 9. Current offers

- ${v("core_offer")}

## 10. Brand guardrails

- **Forbidden words/phrases:** ${v("forbidden_words")}
- **Required disclaimers:** ${v("disclaimers")}
- **Claims that must never be made:** ${v("banned_claims")}
- **Tone rules (things this brand would never say):** ${v("tone_rules")}

## 11. Winning creative history (living section — update as results come in)

### Winning hooks
${combo([
  ["Hooks/angles/messages known to work", "winning_hooks"],
  ["Best-performing formats", "winning_formats"],
  ["Links + metrics for top ads", "winning_format_links"],
  ["Other past winners", "past_winning_ads"],
])}

### Winning angles
- not yet provided

### What hasn't worked
- not yet provided

## 12. Onboarding notes

- **Contact:** ${s.contact_name} · ${s.email}
- **Problem the product solves (client's wording):** ${v("problem_solved")}
`;
}

export default function OnboardingPanel({ adminKey }: { adminKey: string }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setSubmissions(b.onboarding || []);
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

  const onChanged = load;

  async function markReviewed(id: string, reviewed: boolean) {
    setBusy(true);
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ action: "review_onboarding", id, reviewed }),
      });
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  function copyMd(s: Submission) {
    navigator.clipboard?.writeText(toBrandIdentityMd(s));
    setCopiedId(s.id);
    setTimeout(() => setCopiedId(null), 1800);
  }

  if (submissions.length === 0 && !loading) {
    return (
      <div>
        {error && <div className="admin-err">{error}</div>}
        <div className="admin-empty">
          Още няма попълнени въпросници. Изпратете на нов клиент линка{" "}
          <b>{window.location.origin}/onboarding</b>.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="ap-bar">
        <div className="admin-count">
          {submissions.length}{" "}
          {submissions.length === 1 ? "въпросник" : "въпросника"} ·{" "}
          {submissions.filter((s) => !s.reviewed).length} нови
        </div>
        <button className="btn btn-ghost" onClick={onChanged} disabled={loading}>
          {loading ? "Зареждане…" : "↻ Обнови"}
        </button>
      </div>

      {error && <div className="admin-err">{error}</div>}

      <div className="lead-list">
        {submissions.map((s) => {
          const open = openId === s.id;
          return (
            <div className="lead-card" key={s.id}>
              <div
                className="lead-top ob-sub-top"
                onClick={() => setOpenId(open ? null : s.id)}
              >
                <div className="lead-name">
                  {s.brand}
                  {!s.reviewed && <span className="ap-badge ob-new">ново</span>}
                </div>
                <div className="lead-date mono">{fmtDate(s.created_at)}</div>
              </div>

              <div className="lead-grid">
                <div className="lead-field">
                  <span className="lead-label">Контакт</span>
                  <span className="lead-value">{s.contact_name}</span>
                </div>
                <div className="lead-field">
                  <span className="lead-label">Имейл</span>
                  <a className="lead-value lead-link" href={`mailto:${s.email}`}>
                    {s.email}
                  </a>
                </div>
                <div className="lead-field">
                  <span className="lead-label">Сайт</span>
                  <span className="lead-value">{s.website || "—"}</span>
                </div>
              </div>

              <div className="ob-sub-actions">
                <button className="btn btn-primary ob-md-btn" onClick={() => copyMd(s)}>
                  {copiedId === s.id ? "Копирано ✓" : "⧉ Копирай като brand_identity.md"}
                </button>
                <button
                  className="btn btn-ghost ob-md-btn"
                  onClick={() => setOpenId(open ? null : s.id)}
                >
                  {open ? "Скрий отговорите" : "Виж отговорите"}
                </button>
                <button
                  className="ap-link"
                  onClick={() => markReviewed(s.id, !s.reviewed)}
                  disabled={busy}
                >
                  {s.reviewed ? "върни като ново" : "маркирай като прегледано"}
                </button>
              </div>

              {open && (
                <div className="ob-sub-answers">
                  {onboarding.steps.map((st) => {
                    const answered = st.fields.filter((f) => (s.answers?.[f.id] || "").trim());
                    if (!answered.length) return null;
                    return (
                      <div key={st.title} className="ob-sub-section">
                        <div className="ap-field-label">{st.title}</div>
                        {answered.map((f) => (
                          <div className="ob-qa" key={f.id}>
                            <div className="ob-q">{f.label}</div>
                            <div className="ob-a">{s.answers[f.id]}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

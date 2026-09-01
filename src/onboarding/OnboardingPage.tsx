import { useEffect, useRef, useState } from "react";
import { onboarding, site } from "../content";

/* Client onboarding questionnaire at /onboarding.
   Multi-step wizard driven entirely by the `onboarding` config in
   src/content.ts. Answers auto-save to the browser (localStorage) so
   the client can close the tab and continue later; on submit they go
   to /api/onboarding → Supabase. */

const DRAFT_KEY = "sfbg_onboarding_draft";

export default function OnboardingPage() {
  const steps = onboarding.steps;
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
    } catch {
      return {};
    }
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [missing, setMissing] = useState<string[]>([]);
  const topRef = useRef<HTMLDivElement>(null);

  // auto-save the draft as the client types
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
  }, [answers]);

  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;
  const progress = Math.round(((stepIdx + 1) / steps.length) * 100);

  function set(id: string, value: string) {
    setAnswers((a) => ({ ...a, [id]: value }));
    if (missing.includes(id) && value.trim()) {
      setMissing((m) => m.filter((x) => x !== id));
    }
  }

  function validateStep(): boolean {
    const bad = step.fields
      .filter((f) => f.required && !(answers[f.id] || "").trim())
      .map((f) => f.id);
    setMissing(bad);
    return bad.length === 0;
  }

  function goNext() {
    if (!validateStep()) return;
    setStepIdx((i) => Math.min(i + 1, steps.length - 1));
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  function goBack() {
    setMissing([]);
    setStepIdx((i) => Math.max(i - 1, 0));
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function submit() {
    if (!validateStep()) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b?.error || "Нещо се обърка. Опитайте пак.");
      }
      localStorage.removeItem(DRAFT_KEY);
      setStatus("ok");
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e?.message || "Нещо се обърка. Опитайте пак.");
    }
  }

  if (status === "ok") {
    return (
      <div className="ob" ref={topRef}>
        <div className="ob-wrap">
          <div className="logo" style={{ justifyContent: "center", marginBottom: 26 }}>
            <span className="mark">{site.logoMark}</span>
            {site.logoLead}
            <b>{site.logoAccent}</b>
          </div>
          <div className="ob-done">
            <div className="ob-done-ic">✓</div>
            <h2>{onboarding.successTitle}</h2>
            <p>{onboarding.successText}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ob" ref={topRef}>
      <div className="ob-wrap">
        <div className="logo" style={{ justifyContent: "center", marginBottom: 20 }}>
          <span className="mark">SF</span>ScaleFactory<b>BG</b>
        </div>

        {stepIdx === 0 && (
          <div className="ob-intro">
            <h1>{onboarding.title}</h1>
            <p>{onboarding.intro}</p>
          </div>
        )}

        {/* progress */}
        <div className="ob-progress">
          <div className="ob-progress-top">
            <span className="mono">
              стъпка {stepIdx + 1} / {steps.length}
            </span>
            <span className="mono">{progress}%</span>
          </div>
          <div className="ob-bar">
            <i style={{ width: `${progress}%` }} />
          </div>
          <div className="ob-chips">
            {steps.map((s, i) => (
              <button
                key={s.title}
                className={i === stepIdx ? "on" : i < stepIdx ? "done" : ""}
                onClick={() => {
                  if (i < stepIdx) {
                    setMissing([]);
                    setStepIdx(i);
                  }
                }}
                type="button"
              >
                {i < stepIdx ? "✓ " : ""}
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* current step */}
        <div className="ob-step">
          <h2>{step.title}</h2>
          <p className="ob-step-desc">{step.desc}</p>

          {step.fields.map((f) => (
            <div className={`ob-field${missing.includes(f.id) ? " miss" : ""}`} key={f.id}>
              <label htmlFor={`ob-${f.id}`}>
                {f.label}
                {f.required && <span className="ob-req"> *</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  id={`ob-${f.id}`}
                  placeholder={f.hint}
                  value={answers[f.id] || ""}
                  onChange={(e) => set(f.id, e.target.value)}
                />
              ) : (
                <input
                  id={`ob-${f.id}`}
                  type="text"
                  placeholder={f.hint}
                  value={answers[f.id] || ""}
                  onChange={(e) => set(f.id, e.target.value)}
                />
              )}
              {missing.includes(f.id) && (
                <div className="ob-field-err">Това поле е задължително.</div>
              )}
            </div>
          ))}

          {/* honeypot — invisible to humans */}
          <div className="hp" aria-hidden="true">
            <label>
              Website
              <input
                tabIndex={-1}
                autoComplete="off"
                value={answers.__hp || ""}
                onChange={(e) => set("__hp", e.target.value)}
              />
            </label>
          </div>

          {status === "error" && <div className="admin-err">{errorMsg}</div>}

          <div className="ob-nav">
            {stepIdx > 0 ? (
              <button className="btn btn-ghost" type="button" onClick={goBack}>
                ← Назад
              </button>
            ) : (
              <span />
            )}
            {isLast ? (
              <button
                className="btn btn-primary"
                type="button"
                onClick={submit}
                disabled={status === "sending"}
              >
                {status === "sending" ? "Изпращане…" : onboarding.submitLabel}
              </button>
            ) : (
              <button className="btn btn-primary" type="button" onClick={goNext}>
                Напред →
              </button>
            )}
          </div>
          <div className="ob-savenote mono">
            // отговорите се запазват автоматично в този браузър — може да продължите по-късно
          </div>
        </div>
      </div>
    </div>
  );
}

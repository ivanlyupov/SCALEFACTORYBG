import { useEffect, useState } from "react";
import { hero } from "../content";
import { ArrowRight } from "./icons";

/* Splits the headline so the `highlight` phrase gets the gradient. */
function Headline() {
  const { title, highlight } = hero;
  const i = title.indexOf(highlight);
  if (i === -1) return <>{title}</>;
  return (
    <>
      {title.slice(0, i)}
      <span className="hl">{highlight}</span>
      {title.slice(i + highlight.length)}
    </>
  );
}

export default function Hero() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  // -1 acts as the "инициализиране…" state before the first tick.
  const [cur, setCur] = useState(reduced ? hero.pipeline.length - 1 : -1);

  useEffect(() => {
    if (reduced) return;
    let i = 0;
    setCur(0);
    const id = setInterval(() => {
      i = (i + 1) % hero.pipeline.length;
      setCur(i);
    }, 1400);
    return () => clearInterval(id);
  }, [reduced]);

  const barWidth = reduced ? 100 : cur < 0 ? 20 : (cur + 1) * 25;
  const footLabel = reduced
    ? "процес готов"
    : cur < 0
    ? "инициализиране…"
    : hero.pipelineLabels[cur];

  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>
            <Headline />
          </h1>
          <p className="lead">{hero.lead}</p>
          <div className="hero-cta">
            <a href="#contact" className="btn btn-primary">
              {hero.primaryCta}
              <ArrowRight />
            </a>
            <a href="#work" className="btn btn-ghost">
              {hero.secondaryCta}
            </a>
          </div>
          <div className="hero-trust">
            {hero.trust.map((t, k) => (
              <span key={k} dangerouslySetInnerHTML={{ __html: t }} />
            ))}
          </div>
        </div>

        {/* SIGNATURE: creative pipeline */}
        <div className="pipeline rv">
          <div className="pl-head">
            <div className="pl-dots">
              <i></i>
              <i></i>
              <i></i>
            </div>
            <div className="pl-title">animation_pipeline.run</div>
          </div>
          <div className="pl-stages">
            {hero.pipeline.map((s, idx) => {
              const done = !reduced && cur >= 0 && idx < cur;
              const on = reduced || idx === cur;
              const status = reduced
                ? "done"
                : on
                ? "running"
                : done
                ? "done"
                : "queued";
              return (
                <div
                  key={idx}
                  className={`stage${on ? " on" : ""}${done ? " done" : ""}`}
                >
                  <div className="ic">{s.icon}</div>
                  <div>
                    <div className="t">{s.title}</div>
                    <div className="s">{s.sub}</div>
                  </div>
                  <div className="status">{status}</div>
                </div>
              );
            })}
          </div>
          <div className="pl-foot">
            <span>{footLabel}</span>
            <span className="mono">{hero.pipelineBadge}</span>
          </div>
          <div className="pl-bar">
            <i style={{ width: `${barWidth}%` }}></i>
          </div>
        </div>
      </div>
    </section>
  );
}

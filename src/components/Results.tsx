import { results } from "../content";

/* "Реални резултати" — Meta Ads screenshots in browser-style frames.
   Each shot shows the client's real Ads Manager screenshot (img URL in
   content.ts); until one is pasted, a placeholder gradient is shown. */

const PLACEHOLDERS = [
  "linear-gradient(160deg,#1f4038,#0e201c)",
  "linear-gradient(160deg,#3a2b6b,#1a1430)",
  "linear-gradient(160deg,#25506b,#101f2a)",
  "linear-gradient(160deg,#6b4a1f,#2a1e10)",
];

export default function Results() {
  return (
    <section className="pad" id="results" style={{ paddingTop: 10 }}>
      <div className="wrap">
        <div className="shead rv">
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            {results.eyebrow}
          </span>
          <h2>{results.title}</h2>
          <p>{results.text}</p>
        </div>

        <div className="res-grid">
          {results.shots.map((shot, i) => (
            <div className="res-card rv" key={shot.id}>
              {/* browser-style top bar, matching the hero pipeline panel */}
              <div className="res-bar">
                <div className="pl-dots">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <span className="res-bar-label">Meta Ads Manager</span>
              </div>
              <div className="res-shot">
                {shot.img ? (
                  <img src={shot.img} alt={shot.metric + " — " + shot.caption} loading="lazy" />
                ) : (
                  <div
                    className="res-placeholder"
                    style={{ background: PLACEHOLDERS[i % PLACEHOLDERS.length] }}
                  >
                    <span className="mono">скрийншот · Ads Manager</span>
                  </div>
                )}
              </div>
              <div className="res-meta">
                <span className="res-metric">{shot.metric}</span>
                <span className="res-caption">{shot.caption}</span>
              </div>
            </div>
          ))}
        </div>

        {results.tagline && <div className="tagline">{results.tagline}</div>}
      </div>
    </section>
  );
}

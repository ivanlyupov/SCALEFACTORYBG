import { useEffect, useRef, useState } from "react";
import { proof, proofTagline } from "../content";
import { ChevronLeft, ChevronRight } from "./icons";

/* Fallback before/after gradient pairs (used when a proof item has no
   beforeImg/afterImg), kept from the approved design. */
const BA_GRADIENTS: [string, string][] = [
  ["linear-gradient(160deg,#2a2540,#15121f)", "linear-gradient(160deg,#3a2b6b,#1c1533)"],
  ["linear-gradient(160deg,#402a25,#1f1512)", "linear-gradient(160deg,#6b4a1f,#2a1e10)"],
  ["linear-gradient(160deg,#1f4038,#0e201c)", "linear-gradient(160deg,#1f5b52,#0e2420)"],
];

const AUTOPLAY_MS = 5000;

export default function Proof() {
  const slides = proof.length;
  const [idx, setIdx] = useState(0);
  const timer = useRef<number | null>(null);
  const touchX = useRef(0);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  const go = (k: number) => setIdx(((k % slides) + slides) % slides);

  const startAuto = () => {
    if (reduced) return;
    stopAuto();
    timer.current = window.setInterval(
      () => setIdx((i) => (i + 1) % slides),
      AUTOPLAY_MS
    );
  };
  const stopAuto = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => {
    startAuto();
    return stopAuto;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    stopAuto();
    startAuto();
  };

  return (
    <section className="pad" id="proof" style={{ paddingTop: 10 }}>
      <div className="wrap">
        <div className="shead rv">
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            Резултати
          </span>
          <h2>Творчество, което движи числата</h2>
        </div>

        <div
          className="proof rv"
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
        >
          <div
            className="track"
            style={{ transform: `translateX(-${idx * 100}%)` }}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) {
                go(idx + (dx < 0 ? 1 : -1));
                reset();
              }
            }}
          >
            {proof.map((p, i) => {
              const [beforeBg, afterBg] = BA_GRADIENTS[i % BA_GRADIENTS.length];
              return (
                <div className="slide" key={p.brand}>
                  <div>
                    <div className="metric">{p.metricLabel}</div>
                    <div className="big">
                      <span className="from">{p.from}</span> →{" "}
                      <span className="to">{p.to}</span>
                    </div>
                    <blockquote>„{p.quote}“</blockquote>
                    <div className="who">
                      <div className="av">{p.avatar}</div>
                      <div>
                        <div className="nm">{p.brand}</div>
                        <div className="rl">{p.role}</div>
                      </div>
                    </div>
                  </div>
                  <div className="ba">
                    <div
                      className="card before"
                      style={{
                        background: p.beforeImg
                          ? `center / cover no-repeat url(${p.beforeImg})`
                          : beforeBg,
                      }}
                    >
                      <span className="lab">преди</span>
                    </div>
                    <div
                      className="card after"
                      style={{
                        background: p.afterImg
                          ? `center / cover no-repeat url(${p.afterImg})`
                          : afterBg,
                      }}
                    >
                      <span className="lab">след</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-nav">
            <div className="dots">
              {proof.map((_, k) => (
                <button
                  key={k}
                  className={k === idx ? "on" : ""}
                  aria-label={`Слайд ${k + 1}`}
                  onClick={() => {
                    go(k);
                    reset();
                  }}
                />
              ))}
            </div>
            <div className="arrows">
              <button
                aria-label="Предишен"
                onClick={() => {
                  go(idx - 1);
                  reset();
                }}
              >
                <ChevronLeft />
              </button>
              <button
                aria-label="Следващ"
                onClick={() => {
                  go(idx + 1);
                  reset();
                }}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>

        {proofTagline && <div className="tagline">{proofTagline}</div>}
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { reel, reelTagline, type VideoItem } from "../content";
import { Play } from "./icons";

/* Fallback gradient posters (used when a reel item has no `poster` image),
   kept from the approved design so empty tiles still look right. */
const GRADIENTS = [
  "linear-gradient(160deg,#3a2b6b,#1a1430)",
  "linear-gradient(160deg,#6b4a1f,#2a1e10)",
  "linear-gradient(160deg,#1f5b52,#0e2420)",
  "linear-gradient(160deg,#5b1f43,#26101c)",
  "linear-gradient(160deg,#293a6b,#131a30)",
  "linear-gradient(160deg,#25506b,#101f2a)",
];

const isPlaceholder = (url: string) => !url || url.includes("PASTE_R2");
const isEmbed = (url: string) =>
  /youtube\.com|youtu\.be|vimeo\.com|\/embed\//i.test(url);

export default function VideoReel() {
  const [active, setActive] = useState<VideoItem | null>(null);

  // Close lightbox on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll while the lightbox is open
  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  const vertical = active?.format === "vertical";

  return (
    <section className="pad" id="work" style={{ paddingTop: 10 }}>
      <div className="wrap">
        <div className="shead rv">
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            Нашата работа
          </span>
          <h2>Реклами, които са генерирали над 300000€</h2>
          <p>Смесица от реално UGC, AI UGC и Mini VSL за eCommerce брандове.</p>
        </div>

        <div className="reel">
          {reel.map((clip, idx) => (
            <div
              key={clip.id}
              className={`clip rv${clip.format === "wide" ? " wide" : ""}`}
              onClick={() => setActive(clip)}
              role="button"
              tabIndex={0}
              aria-label={`Пусни: ${clip.title || clip.kind}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(clip);
                }
              }}
            >
              <div
                className="poster"
                style={{
                  background: clip.poster
                    ? `center / cover no-repeat url(${clip.poster})`
                    : GRADIENTS[idx % GRADIENTS.length],
                }}
              ></div>
              <div className="grad"></div>
              <div className="play">
                <Play />
              </div>
              <div className="cap">
                <div className="k">{clip.kind}</div>
                {clip.title && <div className="n">{clip.title}</div>}
              </div>
            </div>
          ))}
        </div>

        {reelTagline && <div className="tagline">{reelTagline}</div>}
      </div>

      {/* ---------- LIGHTBOX ---------- */}
      <div
        className={`lb${active ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setActive(null);
        }}
      >
        <div className={`lb-inner${vertical ? " vert" : ""}`}>
          <button
            className="lb-close"
            onClick={() => setActive(null)}
            aria-label="Затвори"
          >
            ✕
          </button>
          {active &&
            (isPlaceholder(active.videoUrl) ? (
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  height: "100%",
                  padding: 24,
                  textAlign: "center",
                  color: "var(--muted)",
                  fontFamily: "'JetBrains Mono'",
                  fontSize: 13,
                }}
              >
                Добавете видео линк в <b>&nbsp;src/content.ts&nbsp;</b> (videoUrl)
              </div>
            ) : isEmbed(active.videoUrl) ? (
              <iframe
                src={
                  active.videoUrl +
                  (active.videoUrl.includes("?") ? "&" : "?") +
                  "autoplay=1"
                }
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={active.title}
              />
            ) : (
              <video
                src={active.videoUrl}
                poster={active.poster}
                controls
                autoPlay
                playsInline
              />
            ))}
        </div>
      </div>
    </section>
  );
}

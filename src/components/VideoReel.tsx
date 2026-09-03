import { useEffect, useRef, useState } from "react";
import { reel, reelHeading, reelTagline, type VideoItem } from "../content";
import { Play } from "./icons";

/* Thumbnail for one tile.
   The tiles show the video's own first frame, which means a <video> per tile.
   Loading them all at once makes the browser open a connection for every clip
   the moment the page renders — on a phone that stalls everything else,
   including the clip the visitor actually taps. So the src is only attached
   once the tile is near the viewport, and only metadata is fetched. */
function ClipThumb({ src, index }: { src: string; index: number }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (very old browsers) → just load it.
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }

    // IntersectionObserver only delivers while the page is producing frames.
    // If it never reports at all, the tiles would sit blank forever — so
    // watch for that and load anyway, staggered so the six clips still
    // don't all hit the network at once.
    let heard = false;
    const io = new IntersectionObserver(
      (entries) => {
        heard = true;
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect(); // once loaded, stop watching
        }
      },
      { rootMargin: "300px" } // start just before it scrolls into view
    );
    io.observe(el);

    // A healthy browser always sends an initial report, so `heard` is true
    // well before this fires and the fallback stays dormant.
    const fallback = window.setTimeout(() => {
      if (!heard) setShow(true);
    }, 1200 + index * 300);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [index]);

  return (
    <video
      ref={ref}
      className="poster poster-vid"
      /* #t=0.1 tells the browser to render a frame rather than a black box */
      src={show ? src + "#t=0.1" : undefined}
      muted
      playsInline
      preload={show ? "metadata" : "none"}
      tabIndex={-1}
    />
  );
}

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
            {reelHeading.eyebrow}
          </span>
          <h2>{reelHeading.title}</h2>
          <p>{reelHeading.text}</p>
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
              {clip.poster ? (
                // explicit poster image, if one was provided
                <div
                  className="poster"
                  style={{ background: `center / cover no-repeat url(${clip.poster})` }}
                ></div>
              ) : isPlaceholder(clip.videoUrl) ? (
                // no real video yet → gradient placeholder
                <div
                  className="poster"
                  style={{ background: GRADIENTS[idx % GRADIENTS.length] }}
                ></div>
              ) : (
                // real video → its own first frame, loaded lazily (see above)
                <ClipThumb src={clip.videoUrl} index={idx} />
              )}
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

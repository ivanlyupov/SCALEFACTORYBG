import { useRef, useState } from "react";
import { vsl } from "../content";
import { ArrowRight, Play } from "./icons";

/* Top section: headline + the mini VSL.
   The video shows its first frame with a big play button; clicking plays it
   with sound and reveals the normal controls. The frame adapts to whatever
   aspect ratio the video actually has (16:9 or 9:16). */

function Title() {
  const { title, highlight } = vsl;
  const i = highlight ? title.indexOf(highlight) : -1;
  if (i === -1) return <>{title}</>;
  return (
    <>
      {title.slice(0, i)}
      <span className="hl">{highlight}</span>
      {title.slice(i + highlight.length)}
    </>
  );
}

export default function VslHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ratio, setRatio] = useState<number | null>(null);

  function start() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play();
    setPlaying(true);
  }

  return (
    <section className="vsl">
      <div className="wrap">
        <div className="vsl-head">
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            {vsl.eyebrow}
          </span>
          <h1>
            <Title />
          </h1>
          <p>{vsl.subtitle}</p>
        </div>

        <div className="vsl-stage">
        <div
          className={`vsl-frame${playing ? " playing" : ""}${
            ratio !== null && ratio < 1 ? " vertical" : ""
          }`}
          style={ratio ? { aspectRatio: String(ratio) } : undefined}
        >
          <video
            ref={videoRef}
            // #t=0.1 makes the browser paint the opening frame as the poster
            src={vsl.videoUrl + "#t=0.1"}
            preload="metadata"
            playsInline
            controls={playing}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              if (v.videoWidth && v.videoHeight) setRatio(v.videoWidth / v.videoHeight);
            }}
            onPlay={() => setPlaying(true)}
            onEnded={() => setPlaying(false)}
          />
          {!playing && (
            <button className="vsl-play" onClick={start} aria-label="Пусни видеото">
              <Play />
            </button>
          )}
        </div>
        </div>

        <div className="vsl-cta">
          <a href="#contact" className="btn btn-primary">
            {vsl.cta}
            <ArrowRight />
          </a>
          {vsl.note && <div className="vsl-note mono">{vsl.note}</div>}
        </div>
      </div>
    </section>
  );
}

import { services } from "../content";

export default function Services() {
  return (
    <section className="pad" id="services">
      <div className="wrap">
        <div className="shead rv">
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            {services.eyebrow}
          </span>
          <h2>{services.title}</h2>
          <p>{services.text}</p>
        </div>

        <div className="svc-grid">
          {services.items.map((s) => (
            <div className="svc-card rv" key={s.title}>
              <div className="svc-ic">{s.icon}</div>
              <div className="svc-title">{s.title}</div>
              <div className="svc-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

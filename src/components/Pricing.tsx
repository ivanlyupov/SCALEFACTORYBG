import { plans, trial, plansPage } from "../content";
import { Check } from "./icons";

export default function Pricing() {
  return (
    <section className="pad" id="pricing">
      <div className="wrap">
        <div className="shead rv">
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            {plansPage.eyebrow}
          </span>
          <h2>{plansPage.title}</h2>
          <p>{plansPage.text}</p>
        </div>

        <div className="tiers">
          {plans.map((p) => (
            <div key={p.name} className={`tier rv${p.featured ? " feature" : ""}`}>
              {p.featured && "badge" in p && p.badge && (
                <span className="badge">{p.badge}</span>
              )}
              <h3>{p.name}</h3>
              <div className="desc">{p.desc}</div>
              <div className="price">
                <span className="num" style={{ color: "var(--amber)" }}>
                  {p.price}
                </span>
                <span className="per">{p.per}</span>
              </div>

              {/* Trial ribbon — only on the featured plan */}
              {p.featured && (
                <div className="trial">
                  <span className="tag">{trial.tag}</span>
                  <span className="txt">
                    {trial.text} <s>{trial.strikethrough}</s>
                  </span>
                </div>
              )}

              <div className="meta">
                {p.meta.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>

              <a href="#contact" className="btn btn-ghost">
                {p.cta}
              </a>

              <ul className="flist">
                {p.features.map((f) => (
                  <li key={f}>
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

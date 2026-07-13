import { costTable } from "../content";

export default function CostTable() {
  return (
    <section className="pad" id="calc" style={{ paddingTop: 10 }}>
      <div className="wrap">
        <div className="shead rv">
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            Реална сметка
          </span>
          <h2>Колко би ви струвало сами?</h2>
          <p>
            Какво плащате, когато поръчвате всяка услуга отделно, при различни
            изпълнители.
          </p>
        </div>

        <div className="calc">
          <div className="tbl rv">
            <div className="row h">
              <span>{costTable.colService}</span>
              <span className="c2">{costTable.colMarket}</span>
              <span className="c3">{costTable.colOurs}</span>
            </div>
            {costTable.rows.map(([service, marketPrice]) => (
              <div className="row" key={service}>
                <span>{service}</span>
                <span className="c2">{marketPrice}</span>
                <span className="c3 inc">{costTable.includedLabel}</span>
              </div>
            ))}
          </div>

          <div className="calc-side rv">
            <div className="lbl">{costTable.separateLabel}</div>
            <div className="strike">{costTable.separateTotal}</div>
            <div className="lbl" style={{ marginTop: 16 }}>
              {costTable.ourLabel}
            </div>
            <div className="big" style={{ color: "var(--amber)" }}>
              {costTable.ourPrice}{" "}
              <span
                style={{
                  fontSize: 14,
                  color: "var(--faint)",
                  fontFamily: "'JetBrains Mono'",
                }}
              >
                {costTable.ourPer}
              </span>
            </div>
            <div className="save">{costTable.saveNote}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

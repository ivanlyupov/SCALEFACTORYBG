import { withWithout } from "../content";
import { Check, Cross } from "./icons";

export default function WithWithout() {
  return (
    <section className="pad" style={{ paddingTop: 10 }}>
      <div className="wrap">
        <div className="shead rv">
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            Какво всъщност купувате
          </span>
          <h2>Един бриф вместо десет задачи</h2>
        </div>

        <div className="vs">
          <div className="col bad rv">
            <h4>
              <span className="dot"></span>
              {withWithout.withoutTitle}
            </h4>
            <ul>
              {withWithout.without.map((item) => (
                <li key={item}>
                  <Cross />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="col good rv">
            <h4>
              <span className="dot"></span>
              {withWithout.withTitle}
            </h4>
            <ul>
              {withWithout.with.map((item) => (
                <li key={item}>
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

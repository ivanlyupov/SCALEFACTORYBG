import { useEffect } from "react";
import { site, plansPage } from "./content";
import { trackOnce } from "./pixel";
import { useReveal } from "./useReveal";
import Pricing from "./components/Pricing";
import CostTable from "./components/CostTable";
import Footer from "./components/Footer";
import { ArrowRight } from "./components/icons";

/* The money page (/plans): pricing tiers + cost table live here,
   separate from the main landing funnel. The landing page links to it
   only from the footer; the sales meeting is where the offer is
   presented — this page backs it up for people who want the numbers. */

export default function PlansPage() {
  useReveal();

  useEffect(() => {
    document.title = "Планове и цени · " + site.brandName;
    // Someone reading the prices — a warmer signal than a landing visit,
    // and a useful retargeting audience.
    trackOnce("ViewContent", { content_name: "plans" });
  }, []);

  return (
    <>
      <header>
        <div className="wrap nav">
          <a href="/" className="logo">
            <span className="mark">{site.logoMark}</span>
            {site.logoLead}
            <b>{site.logoAccent}</b>
          </a>
          <nav className="nav-links" style={{ display: "flex" }}>
            <a href="/">← Начало</a>
            <a href="/#contact" className="btn btn-primary">
              {site.navCta}
            </a>
          </nav>
        </div>
      </header>

      <main>
        <Pricing />
        <CostTable />

        {/* CTA back to the meeting funnel */}
        <section className="pad" style={{ paddingTop: 10 }}>
          <div className="wrap">
            <div className="plans-cta rv">
              <h2>{plansPage.ctaTitle}</h2>
              <p>{plansPage.ctaText}</p>
              <a href="/#contact" className="btn btn-primary">
                {plansPage.ctaButton}
                <ArrowRight />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

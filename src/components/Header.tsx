import { useState } from "react";
import { site, showProof } from "../content";

export default function Header() {
  const [open, setOpen] = useState(false);

  // Hide the "Отзиви" (#proof) nav link when the proof section is hidden,
  // so it doesn't scroll to a missing section.
  const navLinks = site.nav.filter((l) => showProof || l.href !== "#proof");

  return (
    <header>
      <div className="wrap nav">
        <div className="logo">
          <span className="mark">{site.logoMark}</span>
          {site.logoLead}
          <b>{site.logoAccent}</b>
        </div>
        <nav className={`nav-links${open ? " open" : ""}`}>
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn btn-primary" onClick={() => setOpen(false)}>
            {site.navCta}
          </a>
        </nav>
        <button
          className="burger"
          aria-label="Меню"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

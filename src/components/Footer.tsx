import { site } from "../content";

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot">
        <div className="logo">
          <span className="mark">{site.logoMark}</span>
          {site.logoLead}
          <b>{site.logoAccent}</b>
        </div>
        <div className="fl">
          {site.footerLinks.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="muted">{site.footerCopyright}</div>
      </div>
    </footer>
  );
}

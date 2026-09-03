import { site, cookies } from "../content";
import { resetConsent } from "../consent";

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
          {/* Re-opens the cookie bar — withdrawing consent has to be as
              easy as giving it. */}
          <a href="#" onClick={(e) => { e.preventDefault(); resetConsent(); }}>
            {cookies.manageLink}
          </a>
        </div>
        <div className="muted">{site.footerCopyright}</div>
      </div>
    </footer>
  );
}

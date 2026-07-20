import { useState } from "react";
import { contact } from "../content";
import { Check } from "./icons";

type Status = "idle" | "sending" | "ok" | "error";

/* Splits the title so the `highlight` phrase gets the gradient. */
function Title() {
  const { title, highlight } = contact;
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

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState(contact.errorMsg);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("ok");
        form.reset();
      } else {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body?.error || contact.errorMsg);
        setStatus("error");
      }
    } catch {
      setErrorMsg(contact.errorMsg);
      setStatus("error");
    }
  }

  return (
    <section className="pad" id="contact" style={{ paddingTop: 10 }}>
      <div className="wrap">
        <div className="final rv">
          <div>
            <h2>
              <Title />
            </h2>
            <p>{contact.text}</p>
            {contact.bullets && contact.bullets.length > 0 && (
              <ul className="final-bullets">
                {contact.bullets.map((b) => (
                  <li key={b}>
                    <Check />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            {status === "ok" ? (
              <div className="ok">{contact.successMsg}</div>
            ) : (
              <form className="form" onSubmit={handleSubmit} noValidate>
                <div className="fr">
                  <input name="name" placeholder={contact.namePlaceholder} required />
                  <input name="brand" placeholder={contact.brandPlaceholder} required />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder={contact.emailPlaceholder}
                  required
                />
                <textarea name="message" placeholder={contact.messagePlaceholder} />

                {/* Honeypot: hidden from humans; bots that fill it are dropped server-side. */}
                <div className="hp" aria-hidden="true">
                  <label>
                    Website
                    <input name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                {status === "error" && <div className="err">{errorMsg}</div>}

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? contact.sending : contact.submit}
                </button>
                <div className="form-note">{contact.formNote}</div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

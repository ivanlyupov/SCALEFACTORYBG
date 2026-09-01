// =============================================================
// SCALEFACTORYBG — /api/lead   (Vercel serverless function)
// The contact form POSTs here. This runs on the SERVER, so it can
// safely use the Supabase SERVICE ROLE key (never exposed to browsers).
// File location in the project: /api/lead.ts
// =============================================================
import { createClient } from "@supabase/supabase-js";

// These come from environment variables (set in .env and in Vercel).
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string // SERVER-ONLY secret
);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, brand, email, phone, message, website } = req.body || {};

    // Honeypot: real users leave "website" empty; bots fill every field.
    if (website) return res.status(200).json({ ok: true }); // silently drop

    // Basic validation
    if (!name || !brand || !email) {
      return res.status(400).json({ error: "Липсват задължителни полета." });
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
    if (!emailOk) return res.status(400).json({ error: "Невалиден имейл." });

    const base = {
      name: String(name).slice(0, 200),
      brand: String(brand).slice(0, 200),
      email: String(email).slice(0, 200),
      message: message ? String(message).slice(0, 2000) : null,
      source: "website",
    };
    const withPhone = {
      ...base,
      phone: phone ? String(phone).slice(0, 60) : null,
    };

    // Try saving with the phone number. If the `phone` column hasn't been added
    // to the table yet, Supabase rejects the row — in that case save without it
    // rather than losing the lead. (Run db/add_phone_column.sql to enable it.)
    let { error } = await supabase.from("leads").insert(withPhone);
    if (error && /phone/i.test(error.message || "")) {
      console.warn("leads.phone column missing — saving without phone:", error.message);
      ({ error } = await supabase.from("leads").insert(base));
    }

    if (error) throw error;
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("lead insert failed:", e);
    return res.status(500).json({ error: "Server error" });
  }
}

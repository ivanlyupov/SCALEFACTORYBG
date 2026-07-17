// =============================================================
// SCALEFACTORYBG — /api/onboarding   (Vercel serverless function)
// The /onboarding questionnaire POSTs here. Runs on the SERVER with
// the Supabase secret key; the browser never touches the database.
// =============================================================
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string // SERVER-ONLY secret
);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { answers } = req.body || {};

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "Липсват данни." });
    }

    // Honeypot: real users leave the hidden "__hp" field empty.
    if (answers.__hp) return res.status(200).json({ ok: true }); // silently drop
    delete answers.__hp;

    // Keep only string answers, capped in size (defense against junk).
    const clean: Record<string, string> = {};
    let total = 0;
    for (const [k, v] of Object.entries(answers)) {
      if (typeof v !== "string" || !v.trim()) continue;
      const val = v.slice(0, 4000);
      total += val.length;
      if (total > 60000) break; // hard cap on overall payload
      clean[k.slice(0, 60)] = val;
    }

    const brand = (clean.brand || "").trim();
    const contactName = (clean.contact_name || "").trim();
    const email = (clean.email || "").trim();

    if (!brand || !contactName || !email) {
      return res.status(400).json({ error: "Липсват задължителни полета." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Невалиден имейл." });
    }

    const { error } = await supabase.from("onboarding_submissions").insert({
      brand: brand.slice(0, 200),
      contact_name: contactName.slice(0, 200),
      email: email.slice(0, 200),
      website: clean.website ? clean.website.slice(0, 300) : null,
      answers: clean,
    });

    if (error) throw error;
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("onboarding insert failed:", e);
    return res.status(500).json({ error: "Server error" });
  }
}

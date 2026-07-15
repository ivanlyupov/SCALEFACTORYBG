// =============================================================
// SCALEFACTORYBG — /api/leads   (Vercel serverless function)
// Powers the private /admin dashboard. Runs on the SERVER, so it can
// use the Supabase SECRET key to READ the locked-down leads table.
// Access is gated by an admin password (env var ADMIN_PASSWORD) that
// the dashboard sends in the "x-admin-key" header. The secret key and
// the password are never exposed to the browser.
// =============================================================
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string // SERVER-ONLY secret
);

// Constant-time compare so the password can't be guessed by timing.
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) {
    return res
      .status(500)
      .json({ error: "ADMIN_PASSWORD не е зададен в настройките на Vercel." });
  }

  const provided = (req.headers["x-admin-key"] as string) || "";
  if (!provided || !safeEqual(provided, configured)) {
    return res.status(401).json({ error: "Грешна парола." });
  }

  try {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return res.status(200).json({ leads: data ?? [] });
  } catch (e) {
    console.error("leads fetch failed:", e);
    return res.status(500).json({ error: "Server error" });
  }
}

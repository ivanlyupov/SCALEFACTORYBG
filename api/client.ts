// =============================================================
// SCALEFACTORYBG — /api/client   (Vercel serverless function)
// Powers the private client portal at /client.
// GET  → returns ONE client's board (looked up by their access code).
// POST → saves a request/message the client sends from their portal.
// Runs on the SERVER with the Supabase secret key; the browser only
// ever sends the client's access code, never touches the database.
// =============================================================
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string // SERVER-ONLY secret
);

// The client's code can arrive in the header (preferred) or ?code= query.
function getCode(req: any): string {
  const header = (req.headers["x-client-code"] as string) || "";
  if (header) return header.trim();
  try {
    const url = new URL(req.url, "http://localhost");
    return (url.searchParams.get("code") || "").trim();
  } catch {
    return "";
  }
}

export default async function handler(req: any, res: any) {
  const code = getCode(req);
  if (!code) return res.status(401).json({ error: "Липсва код за достъп." });

  // Find the client this code belongs to (and only that client).
  const { data: client, error: cErr } = await supabase
    .from("clients")
    .select(
      "id, name, brand, role, plan, assets_used, assets_total, pipeline_stage, last_updated_at"
    )
    .eq("access_code", code)
    .eq("archived", false)
    .maybeSingle();

  if (cErr) {
    console.error("client lookup failed:", cErr);
    return res.status(500).json({ error: "Server error" });
  }
  if (!client) return res.status(401).json({ error: "Невалиден код за достъп." });

  // ---- POST: client sends a request/message ----
  if (req.method === "POST") {
    const { message } = req.body || {};
    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: "Съобщението е празно." });
    }
    const { error } = await supabase.from("client_requests").insert({
      client_id: client.id,
      message: String(message).slice(0, 2000),
    });
    if (error) {
      console.error("client request insert failed:", error);
      return res.status(500).json({ error: "Server error" });
    }
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ---- GET: return this client's full board ----
  const [{ data: deliverables }, { data: metrics }] = await Promise.all([
    supabase
      .from("deliverables")
      .select("id, section, title, kind, status, due_date, preview_url, sort")
      .eq("client_id", client.id)
      .order("sort", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("metrics")
      .select("id, label, from_value, to_value, sort")
      .eq("client_id", client.id)
      .order("sort", { ascending: true }),
  ]);

  return res.status(200).json({
    client,
    deliverables: deliverables ?? [],
    metrics: metrics ?? [],
  });
}

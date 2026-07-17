// =============================================================
// SCALEFACTORYBG — /api/admin/data   (Vercel serverless function)
// Backend for the "Клиенти" tab in your /admin control panel.
// Protected by ADMIN_PASSWORD (sent in the x-admin-key header).
// GET  → all clients with their deliverables, metrics and open requests.
// POST → { action, ... } to create/update/delete things.
// Uses the Supabase secret key on the server only.
// =============================================================
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

// A short, unguessable, URL-safe access code for a new client.
function newAccessCode() {
  return crypto.randomBytes(12).toString("base64url"); // ~16 chars
}

export default async function handler(req: any, res: any) {
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
    // ---------- GET: everything for the control panel ----------
    if (req.method === "GET") {
      const { data: clients, error } = await supabase
        .from("clients")
        .select("*")
        .eq("archived", false)
        .order("created_at", { ascending: true });
      if (error) throw error;

      const ids = (clients ?? []).map((c) => c.id);
      const [{ data: deliverables }, { data: metrics }, { data: requests }, { data: onboarding }] =
        await Promise.all([
          supabase.from("deliverables").select("*").in("client_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]),
          supabase.from("metrics").select("*").in("client_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]),
          supabase.from("client_requests").select("*").eq("resolved", false).in("client_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]).order("created_at", { ascending: false }),
          supabase.from("onboarding_submissions").select("*").order("created_at", { ascending: false }).limit(100),
        ]);

      return res.status(200).json({
        clients: clients ?? [],
        deliverables: deliverables ?? [],
        metrics: metrics ?? [],
        requests: requests ?? [],
        onboarding: onboarding ?? [],
      });
    }

    // ---------- POST: mutations ----------
    if (req.method === "POST") {
      const body = req.body || {};
      const action = body.action as string;

      switch (action) {
        case "create_client": {
          const p = body.payload || {};
          const { data, error } = await supabase
            .from("clients")
            .insert({
              name: p.name,
              brand: p.brand,
              role: p.role || null,
              plan: p.plan || "CreativeOS™",
              assets_used: p.assets_used ?? 0,
              assets_total: p.assets_total ?? 20,
              pipeline_stage: p.pipeline_stage || "research",
              access_code: newAccessCode(),
            })
            .select()
            .single();
          if (error) throw error;
          return res.status(200).json({ client: data });
        }

        case "update_client": {
          const { id, patch } = body;
          const { error } = await supabase.from("clients").update(patch).eq("id", id);
          if (error) throw error;
          return res.status(200).json({ ok: true });
        }

        case "touch_client": {
          // stamps "last updated" = now, so the client sees today's date
          const { id } = body;
          const { error } = await supabase
            .from("clients")
            .update({ last_updated_at: new Date().toISOString() })
            .eq("id", id);
          if (error) throw error;
          return res.status(200).json({ ok: true });
        }

        case "archive_client": {
          const { id } = body;
          const { error } = await supabase
            .from("clients")
            .update({ archived: true })
            .eq("id", id);
          if (error) throw error;
          return res.status(200).json({ ok: true });
        }

        case "upsert_deliverable": {
          const d = body.payload || {};
          const row = {
            client_id: d.client_id,
            section: d.section || "this_week",
            title: d.title,
            kind: d.kind || null,
            status: d.status || "in_progress",
            due_date: d.due_date || null,
            preview_url: d.preview_url || null,
            sort: d.sort ?? 0,
          };
          const query = d.id
            ? supabase.from("deliverables").update(row).eq("id", d.id)
            : supabase.from("deliverables").insert(row);
          const { error } = await query;
          if (error) throw error;
          return res.status(200).json({ ok: true });
        }

        case "delete_deliverable": {
          const { error } = await supabase.from("deliverables").delete().eq("id", body.id);
          if (error) throw error;
          return res.status(200).json({ ok: true });
        }

        case "upsert_metric": {
          const m = body.payload || {};
          const row = {
            client_id: m.client_id,
            label: m.label,
            from_value: m.from_value || null,
            to_value: m.to_value || null,
            sort: m.sort ?? 0,
          };
          const query = m.id
            ? supabase.from("metrics").update(row).eq("id", m.id)
            : supabase.from("metrics").insert(row);
          const { error } = await query;
          if (error) throw error;
          return res.status(200).json({ ok: true });
        }

        case "delete_metric": {
          const { error } = await supabase.from("metrics").delete().eq("id", body.id);
          if (error) throw error;
          return res.status(200).json({ ok: true });
        }

        case "review_onboarding": {
          const { error } = await supabase
            .from("onboarding_submissions")
            .update({ reviewed: body.reviewed !== false })
            .eq("id", body.id);
          if (error) throw error;
          return res.status(200).json({ ok: true });
        }

        case "resolve_request": {
          const { error } = await supabase
            .from("client_requests")
            .update({ resolved: true })
            .eq("id", body.id);
          if (error) throw error;
          return res.status(200).json({ ok: true });
        }

        default:
          return res.status(400).json({ error: "Непозната операция." });
      }
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.error("admin/data failed:", e);
    return res.status(500).json({ error: "Server error" });
  }
}

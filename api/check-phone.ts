import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./_lib/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: "Phone is required" });
  }

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("leads")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();

      if (error) {
        console.error("Supabase check-phone error:", error);
        return res.status(500).json({ error: error.message });
      }
      return res.json({ exists: !!data });
    } else {
      // Supabase not configured - allow everyone (stateless fallback)
      return res.json({ exists: false });
    }
  } catch (e: any) {
    console.error("check-phone error:", e);
    return res.status(500).json({ error: e.message });
  }
}

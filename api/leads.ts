import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./_lib/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) return res.status(500).json({ error: error.message });
      return res.json(data || []);
    } else {
      return res.json([]);
    }
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

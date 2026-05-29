import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./_lib/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (supabase) {
      await supabase.from("leads").delete().neq("id", 0);
      await supabase.from("game_state").update({
        tag_count: 100,
        notebook_count: 10,
        queue_index: 0,
      }).eq("id", 1);
    }
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

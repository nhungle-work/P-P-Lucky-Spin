import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./_lib/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("game_state")
        .select("tag_count, notebook_count")
        .eq("id", 1)
        .maybeSingle();

      if (error) return res.json({ tag: 100, notebook: 10 });
      if (!data) return res.json({ tag: 100, notebook: 10 });
      return res.json({ tag: data.tag_count, notebook: data.notebook_count });
    } else {
      return res.json({ tag: 100, notebook: 10 });
    }
  } catch (e: any) {
    return res.json({ tag: 100, notebook: 10 });
  }
}

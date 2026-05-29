import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase, prizes } from "./_lib/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, email, company } = req.body;
  if (!name || !phone || !email || !company) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    if (supabase) {
      // Check duplicate
      const { data: dupCheck, error: dupError } = await supabase
        .from("leads")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();

      if (dupError) return res.status(500).json({ error: dupError.message });
      if (dupCheck) return res.status(400).json({ error: "Số điện thoại đã tham gia" });

      // Fetch or create game state
      let { data: state, error: stateError } = await supabase
        .from("game_state")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (stateError) return res.status(500).json({ error: stateError.message });

      if (!state) {
        const { data: inserted, error: insertError } = await supabase
          .from("game_state")
          .insert([{ id: 1, tag_count: 100, notebook_count: 10, queue_index: 0 }])
          .select()
          .single();
        if (insertError) return res.status(500).json({ error: insertError.message });
        state = inserted;
      }

      const currentQueueIndex = state.queue_index;
      let currentInventory = { tag: state.tag_count, notebook: state.notebook_count };

      let prizeObj = prizes[currentQueueIndex % prizes.length];
      if (prizeObj.id !== "combo" && currentInventory[prizeObj.id as keyof typeof currentInventory] <= 0) {
        prizeObj = { id: "combo", name: "Combo nhân sự", icon: "folder_shared" };
      } else if (prizeObj.id !== "combo") {
        currentInventory[prizeObj.id as keyof typeof currentInventory]--;
      }

      // Update game state
      await supabase.from("game_state").update({
        tag_count: currentInventory.tag,
        notebook_count: currentInventory.notebook,
        queue_index: (currentQueueIndex + 1) % prizes.length,
      }).eq("id", 1);

      // Insert lead
      const timestamp = new Date().toISOString();
      await supabase.from("leads").insert([{ name, phone, email, company, prize: prizeObj.name, created_at: timestamp }]);

      // Google Sheets (async, fire and forget)
      const sheetUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
      if (sheetUrl) {
        fetch(sheetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, email, company, prize: prizeObj.name, timestamp }),
        }).catch(console.error);
      }

      return res.json({ prize: prizeObj, inventory: currentInventory });
    } else {
      // Fallback: just pick first prize
      const prizeObj = prizes[0];
      return res.json({ prize: prizeObj, inventory: { tag: 100, notebook: 10 } });
    }
  } catch (e: any) {
    console.error("spin error:", e);
    return res.status(500).json({ error: e.message });
  }
}

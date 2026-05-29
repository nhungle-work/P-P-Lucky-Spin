// Self-contained spin handler - no shared module imports
const prizes = [
  { id: "combo", name: "Combo nhân sự", icon: "folder_shared" },
  { id: "tag", name: "Tag hành lý", icon: "tag" },
  { id: "notebook", name: "Sổ tay Phuoc & Partners", icon: "menu_book" },
  { id: "tag", name: "Tag hành lý", icon: "tag" },
  { id: "combo", name: "Combo nhân sự", icon: "folder_shared" },
  { id: "tag", name: "Tag hành lý", icon: "tag" },
  { id: "notebook", name: "Sổ tay Phuoc & Partners", icon: "menu_book" },
  { id: "tag", name: "Tag hành lý", icon: "tag" },
];

async function saveToGoogleSheets(payload: object) {
  const sheetUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
  if (!sheetUrl) return;
  try {
    await fetch(sheetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("Google Sheets save error:", e);
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, email, company } = req.body || {};
  if (!name || !phone || !email || !company) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const timestamp = new Date().toISOString();

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Check duplicate
      const { data: dupCheck, error: dupError } = await supabase
        .from("leads")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();

      if (dupError) {
        console.error("Duplicate check error:", dupError);
        return res.status(500).json({ error: "Database error: " + dupError.message });
      }
      if (dupCheck) {
        return res.status(400).json({ error: "Số điện thoại đã tham gia" });
      }

      // Fetch or create game state
      let { data: state, error: stateError } = await supabase
        .from("game_state")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (stateError) {
        console.error("Game state error:", stateError);
        return res.status(500).json({ error: "Game state error: " + stateError.message });
      }

      if (!state) {
        const { data: inserted, error: insertError } = await supabase
          .from("game_state")
          .insert([{ id: 1, tag_count: 100, notebook_count: 10, queue_index: 0 }])
          .select()
          .single();
        if (insertError) {
          console.error("Insert game state error:", insertError);
          return res.status(500).json({ error: "Game state init error: " + insertError.message });
        }
        state = inserted;
      }

      const currentQueueIndex = state.queue_index;
      const currentInventory = { tag: state.tag_count as number, notebook: state.notebook_count as number };

      let prizeObj = prizes[currentQueueIndex % prizes.length];
      if (prizeObj.id !== "combo" && currentInventory[prizeObj.id as keyof typeof currentInventory] <= 0) {
        prizeObj = { id: "combo", name: "Combo nhân sự", icon: "folder_shared" };
      } else if (prizeObj.id !== "combo") {
        currentInventory[prizeObj.id as keyof typeof currentInventory]--;
      }

      // Update game state (best effort)
      await supabase.from("game_state").update({
        tag_count: currentInventory.tag,
        notebook_count: currentInventory.notebook,
        queue_index: (currentQueueIndex + 1) % prizes.length,
      }).eq("id", 1);

      // Insert lead (best effort)
      await supabase.from("leads").insert([{
        name, phone, email, company,
        prize: prizeObj.name,
        created_at: timestamp,
      }]);

      // Save to Google Sheets
      await saveToGoogleSheets({ name, phone, email, company, prize: prizeObj.name, timestamp });

      return res.json({ prize: prizeObj, inventory: currentInventory });

    } else {
      // No Supabase — fallback mode, still save to Google Sheets
      console.log("No Supabase configured, using fallback");
      const prizeObj = prizes[0];
      await saveToGoogleSheets({ name, phone, email, company, prize: prizeObj.name, timestamp });
      return res.json({ prize: prizeObj, inventory: { tag: 100, notebook: 10 } });
    }

  } catch (e: any) {
    console.error("Spin handler unhandled error:", e);
    return res.status(500).json({ error: e?.message || "Unknown server error" });
  }
}

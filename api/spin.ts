// Prize rotation sequence (must match frontend prizesLookup and PRD exactly)
const prizes = [
  { id: "tag", name: "Tag hành lý", icon: "tag" },
  { id: "combo", name: "Combo nhân sự", icon: "folder_shared" },
  { id: "notebook", name: "Sổ tay Phuoc & Partners", icon: "menu_book" },
  { id: "combo", name: "Combo nhân sự", icon: "folder_shared" },
  { id: "combo", name: "Combo nhân sự", icon: "folder_shared" },
  { id: "tag", name: "Tag hành lý", icon: "tag" },
  { id: "combo", name: "Combo nhân sự", icon: "folder_shared" },
  { id: "tag", name: "Tag hành lý", icon: "tag" },
  { id: "combo", name: "Combo nhân sự", icon: "folder_shared" },
  { id: "combo", name: "Combo nhân sự", icon: "folder_shared" },
];

const TAG_TOTAL = 100;
const NOTEBOOK_TOTAL = 10;

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

      // 1. Check duplicate phone
      const { data: dupCheck, error: dupError } = await supabase
        .from("leads")
        .select("id")
        .eq("phone", phone)
        .limit(1);

      if (dupError) return res.status(500).json({ error: "Database error: " + dupError.message });
      if (dupCheck && dupCheck.length > 0) return res.status(400).json({ error: "Số điện thoại đã tham gia" });

      // 2. Insert lead first to claim an atomic slot
      const { data: lead, error: insertError } = await supabase.from("leads").insert([{
        name, phone, email, company,
        prize: "Pending", // temporary placeholder
        created_at: timestamp,
      }]).select().single();

      if (insertError) {
        console.error("Insert lead error:", insertError);
        return res.status(500).json({ error: "Failed to create lead slot" });
      }

      // 3. Count leads that were inserted before this one based on id
      const { count: priorSpins, error: countError } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .lt("id", lead.id);

      if (countError) {
        console.error("Count error:", countError);
        // Fallback to 0 if count fails
      }

      const queueIndex = (priorSpins || 0) % prizes.length;

      // 4. Get remaining inventory from actual leads (excluding the Pending ones if they matter, but they don't match names)
      const { count: tagUsed } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("prize", "Tag hành lý");

      const { count: notebookUsed } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("prize", "Sổ tay Phuoc & Partners");

      const remainingTag = Math.max(0, TAG_TOTAL - (tagUsed || 0));
      const remainingNotebook = Math.max(0, NOTEBOOK_TOTAL - (notebookUsed || 0));

      // 5. Determine prize based on queue
      let prizeObj = prizes[queueIndex];
      if (prizeObj.id === "tag" && remainingTag <= 0) {
        prizeObj = { id: "combo", name: "Combo nhân sự", icon: "folder_shared" };
      } else if (prizeObj.id === "notebook" && remainingNotebook <= 0) {
        prizeObj = { id: "combo", name: "Combo nhân sự", icon: "folder_shared" };
      }

      // 6. Update lead with actual prize
      await supabase.from("leads").update({
        prize: prizeObj.name,
      }).eq("id", lead.id);

      // 7. Recalculate inventory after final decision
      const newRemainingTag = prizeObj.id === "tag" ? remainingTag - 1 : remainingTag;
      const newRemainingNotebook = prizeObj.id === "notebook" ? remainingNotebook - 1 : remainingNotebook;

      // 8. Save to Google Sheets
      await saveToGoogleSheets({ name, phone, email, company, prize: prizeObj.name, timestamp });

      return res.json({
        prize: prizeObj,
        inventory: {
          tag: Math.max(0, newRemainingTag),
          notebook: Math.max(0, newRemainingNotebook),
        },
      });

    } else {
      // No Supabase fallback
      console.log("No Supabase configured, using fallback");
      const prizeObj = prizes[0];
      await saveToGoogleSheets({ name, phone, email, company, prize: prizeObj.name, timestamp });
      return res.json({ prize: prizeObj, inventory: { tag: TAG_TOTAL, notebook: NOTEBOOK_TOTAL } });
    }

  } catch (e: any) {
    console.error("Spin handler error:", e);
    return res.status(500).json({ error: e?.message || "Unknown server error" });
  }
}

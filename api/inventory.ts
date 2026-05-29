// Self-contained inventory handler
const TAG_TOTAL = 100;
const NOTEBOOK_TOTAL = 10;

export default async function handler(req: any, res: any) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

      return res.json({ tag: remainingTag, notebook: remainingNotebook });
    } else {
      return res.json({ tag: TAG_TOTAL, notebook: NOTEBOOK_TOTAL });
    }
  } catch (e: any) {
    console.error("Inventory handler error:", e);
    return res.json({ tag: TAG_TOTAL, notebook: NOTEBOOK_TOTAL });
  }
}

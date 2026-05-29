// Self-contained inventory handler - no shared module imports
export default async function handler(req: any, res: any) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const { data, error } = await supabase
        .from("game_state")
        .select("tag_count, notebook_count")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        console.error("Inventory fetch error:", error);
        return res.json({ tag: 100, notebook: 10 });
      }
      if (!data) {
        return res.json({ tag: 100, notebook: 10 });
      }
      return res.json({ tag: data.tag_count, notebook: data.notebook_count });
    } else {
      return res.json({ tag: 100, notebook: 10 });
    }
  } catch (e: any) {
    console.error("Inventory handler error:", e);
    return res.json({ tag: 100, notebook: 10 });
  }
}

// Self-contained leads handler - no shared module imports
export default async function handler(req: any, res: any) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

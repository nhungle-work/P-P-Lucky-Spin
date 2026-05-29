// Simplified version for debugging - no Supabase dependency
export default async function handler(req: any, res: any) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { phone } = req.body || {};
    if (!phone) {
      return res.status(400).json({ error: "Phone is required" });
    }

    // Try Supabase if available
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const { data, error } = await supabase
        .from("leads")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();

      if (error) {
        console.error("Supabase error:", error);
        return res.json({ exists: false, warning: error.message });
      }
      return res.json({ exists: !!data });
    }

    // No Supabase - allow everyone
    return res.json({ exists: false });
  } catch (e: any) {
    console.error("Handler error:", e);
    return res.status(500).json({ error: e.message || "Unknown error" });
  }
}

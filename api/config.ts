// api/config.ts
const DEFAULT_SEQUENCE = [
  { id: "tag", name: "Tag hành lý", icon: "tag" },
  { id: "combo", name: "Combo 30 biểu mẫu nhân sự", icon: "folder_shared" },
  { id: "notebook", name: "Sổ tay Phuoc & Partners", icon: "menu_book" },
  { id: "combo", name: "Combo 30 biểu mẫu nhân sự", icon: "folder_shared" },
  { id: "combo", name: "Combo 30 biểu mẫu nhân sự", icon: "folder_shared" },
  { id: "tag", name: "Tag hành lý", icon: "tag" },
  { id: "combo", name: "Combo 30 biểu mẫu nhân sự", icon: "folder_shared" },
  { id: "tag", name: "Tag hành lý", icon: "tag" },
  { id: "combo", name: "Combo 30 biểu mẫu nhân sự", icon: "folder_shared" },
  { id: "combo", name: "Combo 30 biểu mẫu nhân sự", icon: "folder_shared" },
];

const PRIZE_MAP: Record<string, { id: string; name: string; icon: string }> = {
  tag: { id: "tag", name: "Tag hành lý", icon: "tag" },
  combo: { id: "combo", name: "Combo 30 biểu mẫu nhân sự", icon: "folder_shared" },
  notebook: { id: "notebook", name: "Sổ tay Phuoc & Partners", icon: "menu_book" },
};

export default async function handler(req: any, res: any) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const { data, error } = await supabase
        .from("game_state")
        .select("prize_sequence")
        .eq("id", 1)
        .maybeSingle();

      if (error || !data || !data.prize_sequence) {
        return res.json({ sequence: DEFAULT_SEQUENCE });
      }

      // Parse the sequence string e.g. "tag,combo,notebook"
      const keys = data.prize_sequence.split(",").map((k: string) => k.trim().toLowerCase());
      
      // Fallback if sequence is empty or too short
      if (keys.length < 2) {
         return res.json({ sequence: DEFAULT_SEQUENCE });
      }

      const parsedSequence = keys.map((key: string) => {
        // Fallback to combo if the key is invalid
        return PRIZE_MAP[key] || PRIZE_MAP["combo"];
      });

      return res.json({ sequence: parsedSequence });
    } else {
      return res.json({ sequence: DEFAULT_SEQUENCE });
    }
  } catch (e: any) {
    console.error("Config handler error:", e);
    return res.json({ sequence: DEFAULT_SEQUENCE });
  }
}

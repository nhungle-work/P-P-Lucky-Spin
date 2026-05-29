import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const prizes = [
  { id: "combo", name: "Combo nhân sự", icon: "folder_shared" },
  { id: "tag", name: "Tag hành lý", icon: "tag" },
  { id: "notebook", name: "Sổ tay Phuoc & Partners", icon: "menu_book" },
  { id: "tag", name: "Tag hành lý", icon: "tag" },
  { id: "combo", name: "Combo nhân sự", icon: "folder_shared" },
  { id: "tag", name: "Tag hành lý", icon: "tag" },
  { id: "notebook", name: "Sổ tay Phuoc & Partners", icon: "menu_book" },
  { id: "tag", name: "Tag hành lý", icon: "tag" },
];

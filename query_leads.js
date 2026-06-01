import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

async function run() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase env vars");
    return;
  }
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase.from("leads").select("*").order("id", { ascending: true });
  if (error) {
    console.error("Error fetching leads:", error);
  } else {
    console.log("Leads in Supabase:", JSON.stringify(data, null, 2));
  }
}

run();

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

if (supabase) {
  console.log("Supabase client initialized successfully!");
} else {
  console.log("Supabase credentials not configured. Falling back to local in-memory store.");
}

// Local Mock data store (fallback)
let leads: any[] = [];
let queueIndex = 0;
let inventory = {
  tag: 100,
  notebook: 10
};

const prizes = [
  { id: 'tag', name: "Tag hành lý", icon: "tag" },
  { id: 'combo', name: "Combo 30 biểu mẫu nhân sự độc quyền của Phuoc & Partners", icon: "folder_shared" },
  { id: 'notebook', name: "Sổ tay Phuoc & Partners", icon: "menu_book" },
  { id: 'combo', name: "Combo 30 biểu mẫu nhân sự độc quyền của Phuoc & Partners", icon: "folder_shared" },
  { id: 'combo', name: "Combo 30 biểu mẫu nhân sự độc quyền của Phuoc & Partners", icon: "folder_shared" },
  { id: 'tag', name: "Tag hành lý", icon: "tag" },
  { id: 'combo', name: "Combo 30 biểu mẫu nhân sự độc quyền của Phuoc & Partners", icon: "folder_shared" },
  { id: 'tag', name: "Tag hành lý", icon: "tag" },
  { id: 'combo', name: "Combo 30 biểu mẫu nhân sự độc quyền của Phuoc & Partners", icon: "folder_shared" },
  { id: 'combo', name: "Combo 30 biểu mẫu nhân sự độc quyền của Phuoc & Partners", icon: "folder_shared" }
];

const app = express();
app.use(express.json());

// API constraints: Delay simulation
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

app.post("/api/check-phone", async (req, res) => {
  await delay(300);
  const { phone } = req.body;
  
  if (supabase) {
    const { data, error } = await supabase
      .from("leads")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();
    if (error) {
      console.error("Supabase check-phone error:", error);
      const exists = leads.some(l => l.phone === phone);
      return res.json({ exists });
    }
    return res.json({ exists: !!data });
  } else {
    const exists = leads.some(l => l.phone === phone);
    res.json({ exists });
  }
});

app.post("/api/spin", async (req, res) => {
  const { name, phone, email, company } = req.body;

  let currentQueueIndex = queueIndex;
  let currentInventory = { ...inventory };

  if (supabase) {
    try {
      // 1. Check duplicate
      const { data: dupCheck, error: dupError } = await supabase
        .from("leads")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();
      if (dupError) {
        console.error("Duplicate check error:", dupError);
        return res.status(500).json({ error: "Lỗi kết nối cơ sở dữ liệu" });
      }
      if (dupCheck) {
        return res.status(400).json({ error: "Số điện thoại đã tham gia" });
      }

      // 2. Fetch game state
      let { data: state, error: stateError } = await supabase
        .from("game_state")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      
      if (stateError) {
        console.error("Fetch game state error:", stateError);
        return res.status(500).json({ error: "Lỗi cấu hình vòng quay" });
      }

      if (!state) {
        console.log("Game state row missing. Seeding ID 1...");
        const { data: inserted, error: insertError } = await supabase
          .from("game_state")
          .insert([{ id: 1, tag_count: 100, notebook_count: 10, queue_index: 0 }])
          .select()
          .single();
        if (insertError) {
          console.error("Self-healing seed game state error:", insertError);
          return res.status(500).json({ error: "Lỗi cấu hình vòng quay" });
        }
        state = inserted;
      }

      currentQueueIndex = state.queue_index;
      currentInventory = {
        tag: state.tag_count,
        notebook: state.notebook_count
      };

      // Determine prize
      let prizeObj = prizes[currentQueueIndex % prizes.length];
      let prizeId = prizeObj.id;

      // Check inventory
      if (prizeId !== 'combo' && currentInventory[prizeId as keyof typeof currentInventory] <= 0) {
        prizeObj = { id: 'combo', name: "Combo 30 biểu mẫu nhân sự độc quyền của Phuoc & Partners", icon: "folder_shared" };
      } else if (prizeId !== 'combo') {
        currentInventory[prizeId as keyof typeof currentInventory]--;
      }

      // Update game state in DB
      const { error: updateError } = await supabase
        .from("game_state")
        .update({
          tag_count: currentInventory.tag,
          notebook_count: currentInventory.notebook,
          queue_index: (currentQueueIndex + 1) % prizes.length
        })
        .eq("id", 1);
      if (updateError) {
        console.error("Update game state error:", updateError);
        return res.status(500).json({ error: "Lỗi cập nhật vòng quay" });
      }

      // Insert new lead in DB
      const newLead = { name, phone, email, company, prize: prizeObj.name, timestamp: new Date().toISOString() };
      const { error: insertError } = await supabase
        .from("leads")
        .insert([{
          name,
          phone,
          email,
          company,
          prize: prizeObj.name,
          created_at: newLead.timestamp
        }]);
      if (insertError) {
        console.error("Insert lead error:", insertError);
      }

      // Save to Google Sheets asynchronously in the background
      const sheetUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
      if (sheetUrl) {
        fetch(sheetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newLead)
        }).catch(err => {
          console.error("Failed to save to Google Sheets:", err);
        });
      }

      return res.json({
        prize: prizeObj,
        inventory: currentInventory
      });
    } catch (e: any) {
      console.error("Spin handler error:", e);
      return res.status(500).json({ error: e.message || "Lỗi xử lý lượt quay" });
    }
  } else {
    // Fallback local memory logic
    if (leads.some(l => l.phone === phone)) {
      return res.status(400).json({ error: "Số điện thoại đã tham gia" });
    }

    let prizeObj = prizes[queueIndex];
    let prizeId = prizeObj.id;
    
    if (prizeId !== 'combo' && inventory[prizeId as keyof typeof inventory] <= 0) {
      prizeObj = { id: 'combo', name: "Combo 30 biểu mẫu nhân sự độc quyền của Phuoc & Partners", icon: "folder_shared" };
    } else if (prizeId !== 'combo') {
      inventory[prizeId as keyof typeof inventory]--;
    }

    const newLead = { name, phone, email, company, prize: prizeObj.name, timestamp: new Date().toISOString() };
    leads.push(newLead);

    const sheetUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
    if (sheetUrl) {
      fetch(sheetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead)
      }).catch(err => {
        console.error("Failed to save to Google Sheets:", err);
      });
    }
    
    queueIndex = (queueIndex + 1) % prizes.length;

    res.json({ 
      prize: prizeObj,
      inventory 
    });
  }
});

app.get("/api/inventory", async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase
      .from("game_state")
      .select("tag_count, notebook_count")
      .eq("id", 1)
      .maybeSingle();
    if (error) {
      console.error("Get inventory error:", error);
      return res.json(inventory);
    }
    if (!data) {
      return res.json({
        tag: 100,
        notebook: 10
      });
    }
    return res.json({
      tag: data.tag_count,
      notebook: data.notebook_count
    });
  } else {
    res.json(inventory);
  }
});

app.get("/api/config", async (req, res) => {
  const PRIZE_MAP: Record<string, { id: string; name: string; icon: string }> = {
    tag: { id: "tag", name: "Tag hành lý", icon: "tag" },
    combo: { id: "combo", name: "Combo 30 biểu mẫu nhân sự độc quyền của Phuoc & Partners", icon: "folder_shared" },
    notebook: { id: "notebook", name: "Sổ tay Phuoc & Partners", icon: "menu_book" },
  };

  const DEFAULT_SEQUENCE = [
    PRIZE_MAP.tag, PRIZE_MAP.combo, PRIZE_MAP.notebook, PRIZE_MAP.combo, PRIZE_MAP.combo,
    PRIZE_MAP.tag, PRIZE_MAP.combo, PRIZE_MAP.tag, PRIZE_MAP.combo, PRIZE_MAP.combo
  ];

  if (supabase) {
    const { data, error } = await supabase
      .from("game_state")
      .select("prize_sequence")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data || !data.prize_sequence) {
      return res.json({ sequence: DEFAULT_SEQUENCE });
    }

    const keys = data.prize_sequence.split(",").map((k: string) => k.trim().toLowerCase());
    if (keys.length < 2) {
       return res.json({ sequence: DEFAULT_SEQUENCE });
    }

    const parsedSequence = keys.map((key: string) => PRIZE_MAP[key] || PRIZE_MAP.combo);
    return res.json({ sequence: parsedSequence });
  } else {
    res.json({ sequence: DEFAULT_SEQUENCE });
  }
});

app.get("/api/leads", async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Get leads error:", error);
      return res.json(leads);
    }
    const mapped = data.map(l => ({
      name: l.name,
      phone: l.phone,
      email: l.email,
      company: l.company,
      prize: l.prize,
      timestamp: l.created_at
    }));
    res.json(mapped);
  } else {
    res.json(leads);
  }
});

app.post("/api/reset", async (req, res) => {
  if (supabase) {
    const { error: clearError } = await supabase
      .from("leads")
      .delete()
      .neq("id", 0);
    if (clearError) {
      console.error("Clear leads error:", clearError);
    }

    const { error: resetError } = await supabase
      .from("game_state")
      .update({
        tag_count: 100,
        notebook_count: 10,
        queue_index: 0
      })
      .eq("id", 1);
    if (resetError) {
      console.error("Reset game state error:", resetError);
    }

    return res.json({ success: true });
  } else {
    leads = [];
    queueIndex = 0;
    inventory = {
      tag: 100,
      notebook: 10
    };
    res.json({ success: true });
  }
});

// Vite middleware for development (Only locally)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  import("vite").then(({ createServer }) => {
    createServer({
      server: { middlewareMode: true },
      appType: "spa",
    }).then((vite) => {
      app.use(vite.middlewares);
    });
  });
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Only listen locally (Vercel will wrap this app in a serverless function)
if (!process.env.VERCEL) {
  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;

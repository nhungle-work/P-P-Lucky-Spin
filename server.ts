import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Mock data store
let leads: any[] = [];
let queueIndex = 0;
let inventory = {
  tag: 100,
  notebook: 10
};

const prizes = [
  { id: 'tag', name: "Tag hành lý", icon: "tag" },
  { id: 'notebook', name: "Sổ tay P&P", icon: "menu_book" },
  { id: 'combo', name: "Combo nhân sự", icon: "folder_shared" },
  { id: 'combo', name: "Combo nhân sự", icon: "folder_shared" },
  { id: 'tag', name: "Tag hành lý", icon: "tag" },
  { id: 'tag', name: "Tag hành lý", icon: "tag" },
  { id: 'combo', name: "Combo nhân sự", icon: "folder_shared" },
  { id: 'tag', name: "Tag hành lý", icon: "tag" },
  { id: 'combo', name: "Combo nhân sự", icon: "folder_shared" },
  { id: 'combo', name: "Combo nhân sự", icon: "folder_shared" }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API constraints: Delay simulation
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  app.post("/api/check-phone", async (req, res) => {
    await delay(300);
    const { phone } = req.body;
    const exists = leads.some(l => l.phone === phone);
    res.json({ exists });
  });

  app.post("/api/spin", async (req, res) => {
    await delay(500);
    const { name, phone, email, company } = req.body;

    // Check duplicate again just in case
    if (leads.some(l => l.phone === phone)) {
      return res.status(400).json({ error: "Số điện thoại đã tham gia" });
    }

    // Determine prize
    let prizeObj = prizes[queueIndex];
    let prizeId = prizeObj.id;
    
    // Check inventory
    if (prizeId !== 'combo' && inventory[prizeId as keyof typeof inventory] <= 0) {
      // Fallback to combo
      prizeObj = { id: 'combo', name: "Combo nhân sự", icon: "folder_shared" };
    } else if (prizeId !== 'combo') {
      inventory[prizeId as keyof typeof inventory]--;
    }

    const newLead = { name, phone, email, company, prize: prizeObj.name, timestamp: new Date().toISOString() };
    leads.push(newLead);
    
    // Increment queue
    queueIndex = (queueIndex + 1) % prizes.length;

    res.json({ 
      prize: prizeObj,
      inventory 
    });
  });

  app.get("/api/inventory", async (req, res) => {
    res.json(inventory);
  });

  // Export leads logic for debug/verification
  app.get("/api/leads", (req, res) => {
    res.json(leads);
  });

  app.post("/api/reset", (req, res) => {
    leads = [];
    queueIndex = 0;
    inventory = {
      tag: 100,
      notebook: 10
    };
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

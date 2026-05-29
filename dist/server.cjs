var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var leads = [];
var queueIndex = 0;
var inventory = {
  tag: 100,
  notebook: 10
};
var prizes = [
  { id: "tag", name: "Tag h\xE0nh l\xFD", icon: "tag" },
  { id: "notebook", name: "S\u1ED5 tay Phuoc & Partners", icon: "menu_book" },
  { id: "combo", name: "Combo nh\xE2n s\u1EF1", icon: "folder_shared" },
  { id: "combo", name: "Combo nh\xE2n s\u1EF1", icon: "folder_shared" },
  { id: "tag", name: "Tag h\xE0nh l\xFD", icon: "tag" },
  { id: "tag", name: "Tag h\xE0nh l\xFD", icon: "tag" },
  { id: "combo", name: "Combo nh\xE2n s\u1EF1", icon: "folder_shared" },
  { id: "tag", name: "Tag h\xE0nh l\xFD", icon: "tag" },
  { id: "combo", name: "Combo nh\xE2n s\u1EF1", icon: "folder_shared" },
  { id: "combo", name: "Combo nh\xE2n s\u1EF1", icon: "folder_shared" }
];
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  app.post("/api/check-phone", async (req, res) => {
    await delay(300);
    const { phone } = req.body;
    const exists = leads.some((l) => l.phone === phone);
    res.json({ exists });
  });
  app.post("/api/spin", async (req, res) => {
    await delay(500);
    const { name, phone, email, company } = req.body;
    if (leads.some((l) => l.phone === phone)) {
      return res.status(400).json({ error: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i \u0111\xE3 tham gia" });
    }
    let prizeObj = prizes[queueIndex];
    let prizeId = prizeObj.id;
    if (prizeId !== "combo" && inventory[prizeId] <= 0) {
      prizeObj = { id: "combo", name: "Combo nh\xE2n s\u1EF1", icon: "folder_shared" };
    } else if (prizeId !== "combo") {
      inventory[prizeId]--;
    }
    const newLead = { name, phone, email, company, prize: prizeObj.name, timestamp: (/* @__PURE__ */ new Date()).toISOString() };
    leads.push(newLead);
    queueIndex = (queueIndex + 1) % prizes.length;
    res.json({
      prize: prizeObj,
      inventory
    });
  });
  app.get("/api/inventory", async (req, res) => {
    res.json(inventory);
  });
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
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map

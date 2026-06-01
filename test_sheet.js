import dotenv from "dotenv";
dotenv.config();

async function test() {
  const sheetUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
  console.log("Sheet URL:", sheetUrl);
  if (!sheetUrl) return;

  const payload = {
    name: "Test Agent",
    phone: "0999999999",
    email: "agent@test.com",
    company: "Test Co",
    prize: "Combo 30 biểu mẫu nhân sự",
    timestamp: new Date().toISOString()
  };

  const res = await fetch(sheetUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  console.log("Response:", text);
}

test();

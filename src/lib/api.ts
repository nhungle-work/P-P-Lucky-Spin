import { LeadData, Prize, Inventory } from '../types';

export async function checkPhone(phone: string): Promise<boolean> {
  const res = await fetch('/api/check-phone', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.substring(0, 100)}`);
  }
  const data = await res.json();
  return data.exists;
}

export async function submitLead(lead: LeadData): Promise<{ prize: Prize, inventory: Inventory }> {
  const res = await fetch('/api/spin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead)
  });
  if (!res.ok) {
    const text = await res.text();
    let errorMsg = `Server error (${res.status})`;
    try {
      const err = JSON.parse(text);
      errorMsg = err.error || errorMsg;
    } catch {
      // Response was not JSON (e.g. Vercel HTML error page)
      errorMsg = text.substring(0, 120) || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const getConfig = async (): Promise<Prize[]> => {
  const res = await fetch('/api/config');
  if (!res.ok) {
    throw new Error('Không thể tải cấu hình vòng quay');
  }
  const data = await res.json();
  return data.sequence;
};

export const getInventory = async (): Promise<Inventory> => {
  const res = await fetch('/api/inventory');
  return res.json();
}

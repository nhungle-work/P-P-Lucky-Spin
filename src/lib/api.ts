import { LeadData, Prize, Inventory } from '../types';

export async function checkPhone(phone: string): Promise<boolean> {
  const res = await fetch('/api/check-phone', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
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
    const err = await res.json();
    throw new Error(err.error || 'Đã xảy ra lỗi');
  }
  return res.json();
}

export async function getInventory(): Promise<Inventory> {
  const res = await fetch('/api/inventory');
  return res.json();
}

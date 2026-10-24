// All Google Sheets communication lives here. When you build your own backend,
// replace the functions in this file and nothing else needs to change.
import { normalize } from '../utils.js';

async function post(url, payload) {
  // text/plain avoids a CORS preflight, which Apps Script does not answer
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'Sheet error');
  return json;
}

export async function fetchItems(url) {
  const res = await fetch(url);
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'Sheet error');
  return json.items.map(normalize);
}

export const saveItem = (url, item) => post(url, { action: 'upsert', item });
export const deleteItem = (url, id) => post(url, { action: 'delete', id });
export const replaceAll = (url, items) => post(url, { action: 'replaceAll', items });

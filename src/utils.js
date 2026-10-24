export const stockStatus = (i) => (i.qty <= 0 ? 'out' : i.qty <= i.reorder ? 'low' : 'ok');

export const STATUS_LABEL = { ok: 'In stock', low: 'Running low', out: 'Out of stock' };

export const makeMoney = (cur) => (n) =>
  cur + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

export const normalize = (r) => ({
  id: String(r.id),
  name: r.name || '',
  category: r.category || '',
  sku: r.sku || '',
  qty: Number(r.qty) || 0,
  unit: r.unit || 'pcs',
  cost: Number(r.cost) || 0,
  price: Number(r.price) || 0,
  reorder: Number(r.reorder) || 0,
});

export const newId = () => 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

export const DEMO_ITEMS = [
  { id: 'd1', name: 'Basmati rice', category: 'Grocery', sku: 'GR-001', qty: 42, unit: 'kg', cost: 78, price: 95, reorder: 15 },
  { id: 'd2', name: 'Sunflower oil 1L', category: 'Grocery', sku: 'GR-014', qty: 6, unit: 'pcs', cost: 128, price: 145, reorder: 10 },
  { id: 'd3', name: 'USB-C cable', category: 'Electronics', sku: 'EL-220', qty: 0, unit: 'pcs', cost: 90, price: 199, reorder: 5 },
  { id: 'd4', name: 'Notebook A5', category: 'Stationery', sku: 'ST-032', qty: 60, unit: 'pcs', cost: 22, price: 35, reorder: 20 },
];

export function exportCsv(items) {
  const cols = ['name', 'category', 'sku', 'qty', 'unit', 'cost', 'price', 'reorder'];
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [cols.join(',')].concat(items.map((i) => cols.map((c) => esc(i[c])).join(','))).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'inventory.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

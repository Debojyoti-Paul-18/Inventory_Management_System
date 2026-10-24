import { useState } from 'react';

const UNITS = ['pcs', 'kg', 'g', 'litre', 'ml', 'box', 'pack', 'dozen', 'metre'];
const BLANK = { name: '', category: '', sku: '', qty: 0, unit: 'pcs', cost: 0, price: 0, reorder: 5 };

export default function ItemDialog({ item, categories, onSave, onClose }) {
  const [form, setForm] = useState(item || BLANK);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, name: form.name.trim(), category: form.category.trim(), sku: form.sku.trim() });
    onClose();
  };

  return (
    <form onSubmit={submit}>
      <h2>{item ? 'Edit item' : 'Add item'}</h2>
      <div className="grid">
        <label className="field full">Item name
          <input required maxLength={80} value={form.name} onChange={set('name')} />
        </label>
        <label className="field">Category
          <input list="cat-list" placeholder="e.g. Grocery" value={form.category} onChange={set('category')} />
          <datalist id="cat-list">{categories.map((c) => <option key={c} value={c} />)}</datalist>
        </label>
        <label className="field">SKU / barcode
          <input value={form.sku} onChange={set('sku')} />
        </label>
        <label className="field">Quantity
          <input type="number" min="0" step="any" required value={form.qty} onChange={set('qty')} />
        </label>
        <label className="field">Unit
          <select value={form.unit} onChange={set('unit')}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select>
        </label>
        <label className="field">Cost price
          <input type="number" min="0" step="any" value={form.cost} onChange={set('cost')} />
        </label>
        <label className="field">Selling price
          <input type="number" min="0" step="any" value={form.price} onChange={set('price')} />
        </label>
        <label className="field full">Alert me when stock falls to
          <input type="number" min="0" step="any" value={form.reorder} onChange={set('reorder')} />
        </label>
      </div>
      <div className="actions">
        <button type="button" className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary">Save item</button>
      </div>
    </form>
  );
}

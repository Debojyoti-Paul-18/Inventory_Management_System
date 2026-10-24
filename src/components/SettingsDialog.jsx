import { useState } from 'react';

export default function SettingsDialog({ config, onSave, onClose }) {
  const [form, setForm] = useState(config);
  const submit = (e) => {
    e.preventDefault();
    onSave({ url: form.url.trim(), cur: form.cur.trim() || '₹' });
    onClose();
  };
  return (
    <form onSubmit={submit}>
      <h2>Connect Google Sheet</h2>
      <p className="hint">
        Paste the Web app URL from your Google Apps Script deployment (steps are in the README).
        Leave it empty to keep data only on this device.
      </p>
      <div className="grid">
        <label className="field full">Web app URL
          <input type="url" placeholder="https://script.google.com/macros/s/…/exec" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        </label>
        <label className="field">Currency symbol
          <input maxLength={3} value={form.cur} onChange={(e) => setForm({ ...form, cur: e.target.value })} />
        </label>
      </div>
      <div className="actions">
        <button type="button" className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary">Save and sync</button>
      </div>
    </form>
  );
}

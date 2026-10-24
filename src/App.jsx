import { useMemo, useState } from 'react';
import { useInventory } from './hooks/useInventory.js';
import { exportCsv, makeMoney, stockStatus } from './utils.js';
import Stats from './components/Stats.jsx';
import Toolbar from './components/Toolbar.jsx';
import ItemTable from './components/ItemTable.jsx';
import ItemDialog from './components/ItemDialog.jsx';
import SettingsDialog from './components/SettingsDialog.jsx';
import Modal from './components/Modal.jsx';

export default function App() {
  const { items, config, setConfig, sync, saveItem, adjustQty, removeItem } = useInventory();
  const [filters, setFilters] = useState({ q: '', category: '', status: '' });
  const [dialog, setDialog] = useState(null); // null | { type: 'item', item } | { type: 'settings' }
  const money = useMemo(() => makeMoney(config.cur), [config.cur]);
  const categories = useMemo(() => [...new Set(items.map((i) => i.category).filter(Boolean))].sort(), [items]);

  const visible = items.filter((i) => {
    const q = filters.q.toLowerCase();
    return (
      (!q || [i.name, i.sku, i.category].join(' ').toLowerCase().includes(q)) &&
      (!filters.category || i.category === filters.category) &&
      (!filters.status || stockStatus(i) === filters.status)
    );
  });

  const close = () => setDialog(null);
  const confirmDelete = (i) => {
    if (window.confirm(`Delete "${i.name}" from your stock list?`)) removeItem(i.id);
  };

  return (
    <div className="wrap">
      <header>
        <div>
          <h1>Stockroom</h1>
          <div className="sync"><span className={`dot ${sync.state}`} /><span>{sync.text}</span></div>
        </div>
        <div className="head-actions">
          <button className="btn" onClick={() => setDialog({ type: 'settings' })}>Google Sheet</button>
          <button className="btn" onClick={() => exportCsv(items)}>Export CSV</button>
          <button className="btn primary" onClick={() => setDialog({ type: 'item', item: null })}>Add item</button>
        </div>
      </header>

      <Stats items={items} money={money} />
      <Toolbar filters={filters} setFilters={setFilters} categories={categories} />
      <ItemTable
        items={visible}
        money={money}
        onAdjust={adjustQty}
        onEdit={(item) => setDialog({ type: 'item', item })}
        onDelete={confirmDelete}
      />

      <Modal open={dialog?.type === 'item'} onClose={close}>
        <ItemDialog item={dialog?.item} categories={categories} onSave={saveItem} onClose={close} />
      </Modal>
      <Modal open={dialog?.type === 'settings'} onClose={close}>
        <SettingsDialog config={config} onSave={setConfig} onClose={close} />
      </Modal>
    </div>
  );
}

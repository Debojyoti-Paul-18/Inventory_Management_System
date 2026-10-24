import { useCallback, useEffect, useRef, useState } from 'react';
import { DEMO_ITEMS, newId, normalize } from '../utils.js';
import * as sheets from '../services/sheets.js';

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function store(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

const LOCAL = { state: 'local', text: 'Saved on this device only' };

export function useInventory() {
  const [items, setItems] = useState(() => load('sr_items', DEMO_ITEMS));
  const [config, setConfig] = useState(() => load('sr_cfg', { url: '', cur: '₹' }));
  const [sync, setSync] = useState(LOCAL);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
    store('sr_items', items);
  }, [items]);

  useEffect(() => store('sr_cfg', config), [config]);

  // Load from the sheet on start and whenever the URL changes
  useEffect(() => {
    if (!config.url) return setSync(LOCAL);
    let cancelled = false;
    (async () => {
      setSync({ state: 'busy', text: 'Loading from Google Sheet…' });
      try {
        const remote = await sheets.fetchItems(config.url);
        if (cancelled) return;
        if (remote.length === 0 && itemsRef.current.length) {
          await sheets.replaceAll(config.url, itemsRef.current); // first connection: upload what you have
        } else {
          setItems(remote);
        }
        setSync({ state: 'on', text: 'Synced with Google Sheet' });
      } catch {
        if (!cancelled) setSync({ state: 'err', text: 'Sheet not reachable – changes kept on this device' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [config.url]);

  const pushToSheet = useCallback(
    async (fn) => {
      if (!config.url) return;
      setSync({ state: 'busy', text: 'Saving to Google Sheet…' });
      try {
        await fn(config.url);
        setSync({ state: 'on', text: 'Synced with Google Sheet' });
      } catch {
        setSync({ state: 'err', text: 'Could not save to sheet – kept on this device' });
      }
    },
    [config.url]
  );

  const saveItem = (data) => {
    const item = normalize({ ...data, id: data.id || newId() });
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev.map((i) => (i.id === item.id ? item : i)) : [item, ...prev]));
    pushToSheet((url) => sheets.saveItem(url, item));
  };

  const adjustQty = (id, delta) => {
    const cur = items.find((i) => i.id === id);
    if (!cur) return;
    const item = { ...cur, qty: Math.max(0, +(cur.qty + delta).toFixed(3)) };
    setItems((prev) => prev.map((i) => (i.id === id ? item : i)));
    pushToSheet((url) => sheets.saveItem(url, item));
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    pushToSheet((url) => sheets.deleteItem(url, id));
  };

  return { items, config, setConfig, sync, saveItem, adjustQty, removeItem };
}

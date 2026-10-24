import { stockStatus } from '../utils.js';

export default function Stats({ items, money }) {
  const value = items.reduce((a, i) => a + i.qty * i.cost, 0);
  const low = items.filter((i) => stockStatus(i) === 'low').length;
  const out = items.filter((i) => stockStatus(i) === 'out').length;
  return (
    <section className="stats" aria-label="Summary">
      <div className="stat"><div className="num">{items.length}</div><span>Items in stock list</span></div>
      <div className="stat"><div className="num">{money(value)}</div><span>Stock value (at cost)</span></div>
      <div className={'stat' + (low > 0 ? ' alert' : '')}><div className="num">{low}</div><span>Running low</span></div>
      <div className="stat"><div className="num">{out}</div><span>Out of stock</span></div>
    </section>
  );
}

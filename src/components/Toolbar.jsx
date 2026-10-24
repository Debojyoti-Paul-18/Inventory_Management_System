export default function Toolbar({ filters, setFilters, categories }) {
  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });
  return (
    <div className="tools">
      <input className="grow" type="search" placeholder="Search by name, SKU or category" aria-label="Search items" value={filters.q} onChange={set('q')} />
      <select className="sel" aria-label="Filter by category" value={filters.category} onChange={set('category')}>
        <option value="">All categories</option>
        {categories.map((c) => <option key={c}>{c}</option>)}
      </select>
      <select className="sel" aria-label="Filter by stock level" value={filters.status} onChange={set('status')}>
        <option value="">All stock levels</option>
        <option value="low">Running low</option>
        <option value="out">Out of stock</option>
      </select>
    </div>
  );
}

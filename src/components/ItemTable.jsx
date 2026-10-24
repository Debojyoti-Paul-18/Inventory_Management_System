import { STATUS_LABEL, stockStatus } from '../utils.js';

export default function ItemTable({ items, money, onAdjust, onEdit, onDelete }) {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Item</th><th>Category</th><th>Quantity</th><th>Status</th>
            <th className="r">Cost</th><th className="r">Selling price</th><th />
          </tr>
        </thead>
        <tbody>
          {items.map((i) => {
            const st = stockStatus(i);
            return (
              <tr key={i.id}>
                <td><div className="name">{i.name}</div><div className="sub">{i.sku}</div></td>
                <td>{i.category}</td>
                <td>
                  <span className="qty">
                    <button aria-label={`Remove one ${i.name}`} onClick={() => onAdjust(i.id, -1)}>−</button>
                    <b>{i.qty}</b>
                    <button aria-label={`Add one ${i.name}`} onClick={() => onAdjust(i.id, 1)}>+</button>
                    <span className="sub">{i.unit}</span>
                  </span>
                </td>
                <td><span className={`tag ${st}`}>{STATUS_LABEL[st]}</span></td>
                <td className="r">{money(i.cost)}</td>
                <td className="r">{money(i.price)}</td>
                <td className="r">
                  <button className="link" onClick={() => onEdit(i)}>Edit</button>
                  <button className="link bad" onClick={() => onDelete(i)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {items.length === 0 && <div className="empty">No items match. Add your first item to start tracking stock.</div>}
    </div>
  );
}

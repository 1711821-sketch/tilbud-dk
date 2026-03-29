import { useState } from 'react';
import ClearanceItem from './ClearanceItem';

function FlatClearanceList({ items }) {
  const [showAll, setShowAll] = useState(false);
  const display = showAll ? items : items.slice(0, 20);

  return (
    <div className="flat-clearance-list">
      {display.map((item, i) => (
        <div key={`${item.storeName}-${item.offer?.ean || i}`} className="flat-item">
          <ClearanceItem item={item} />
          <div className="flat-item-store">{item.storeBrand} — {item.storeName}</div>
        </div>
      ))}
      {!showAll && items.length > 20 && (
        <button className="btn-load-more" onClick={() => setShowAll(true)}>
          Vis alle {items.length} varer
        </button>
      )}
    </div>
  );
}

export default FlatClearanceList;

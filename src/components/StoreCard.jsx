import { useState } from 'react';
import ClearanceItem from './ClearanceItem';

const brandColors = {
  netto: '#ffe600',
  'føtex': '#003da5',
  bilka: '#e4002b',
};

const brandNames = {
  netto: 'Netto',
  'føtex': 'Føtex',
  bilka: 'Bilka',
};

function StoreCard({ data }) {
  const [expanded, setExpanded] = useState(false);
  const { store, clearances } = data;
  const brand = store?.brand?.toLowerCase() || '';
  const brandColor = brandColors[brand] || '#4a90d9';
  const brandName = brandNames[brand] || store?.brand || 'Butik';

  const displayItems = expanded ? clearances : clearances?.slice(0, 4);

  return (
    <div className="store-card">
      <div className="store-header" style={{ borderLeftColor: brandColor }}>
        <div className="store-brand" style={{ color: brandColor === '#ffe600' ? '#333' : brandColor }}>
          {brandName}
        </div>
        <h3 className="store-name">{store?.name || 'Ukendt butik'}</h3>
        <p className="store-address">
          {store?.address?.street}, {store?.address?.zip} {store?.address?.city}
        </p>
        <span className="clearance-count">{clearances?.length || 0} varer</span>
      </div>

      <div className="clearance-list">
        {displayItems?.map((item, i) => (
          <ClearanceItem key={item.offer?.ean || i} item={item} />
        ))}
      </div>

      {clearances?.length > 4 && (
        <button className="btn-expand" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Vis færre' : `Vis alle ${clearances.length} varer`}
        </button>
      )}
    </div>
  );
}

export default StoreCard;

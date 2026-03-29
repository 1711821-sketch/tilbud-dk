import { useState } from 'react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('da-DK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function ClearanceItem({ item }) {
  const [showLightbox, setShowLightbox] = useState(false);
  const { offer, product } = item;
  const discount = Math.round(offer?.percentDiscount || 0);
  const category = product?.categories?.da?.split('>')?.pop()?.trim() || '';

  return (
    <>
      <div className="clearance-item">
        {product?.image ? (
          <div className="item-image-wrap" onClick={() => setShowLightbox(true)} style={{ cursor: 'pointer' }}>
            <img src={product.image} alt={product.description || ''} className="item-image" loading="lazy" />
            <div className="item-discount-badge">-{discount}%</div>
          </div>
        ) : (
          <div className="item-image-wrap item-no-image">
            <div className="item-discount-badge">-{discount}%</div>
          </div>
        )}
        <div className="item-details">
          <div className="item-name">{product?.description || product?.ean || 'Ukendt vare'}</div>
          {category && (
            <div className="item-category">{category}</div>
          )}
          <div className="item-prices">
            <span className="price-original">{offer?.originalPrice} kr</span>
            <span className="price-new">{offer?.newPrice} kr</span>
            <span className="price-saved">Spar {offer?.discount} kr</span>
          </div>
          <div className="item-meta">
            {offer?.startTime && (
              <span className="item-time">Nedsat: {formatDate(offer.startTime)}</span>
            )}
            {offer?.endTime && (
              <span className="item-time">Udløber: {formatDate(offer.endTime)}</span>
            )}
          </div>
          {offer?.stock > 0 && (
            <div className="item-stock">{offer.stock} {offer.stockUnit === 'each' ? 'stk' : offer.stockUnit} på lager</div>
          )}
        </div>
      </div>

      {showLightbox && product?.image && (
        <div className="lightbox" onClick={() => setShowLightbox(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setShowLightbox(false)}>×</button>
            <img src={product.image.replace('w_400,h_400', 'w_800,h_800')} alt={product.description || ''} />
            <div className="lightbox-info">
              <h3>{product.description}</h3>
              <div className="lightbox-prices">
                <span className="price-original">{offer?.originalPrice} kr</span>
                <span className="price-new">{offer?.newPrice} kr</span>
                <span className="item-discount-badge" style={{ position: 'static', fontSize: '1rem', padding: '4px 12px' }}>-{discount}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ClearanceItem;

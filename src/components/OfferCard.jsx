import { useState } from 'react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('da-DK', { day: 'numeric', month: 'short' });
}

function OfferCard({ offer }) {
  const [showLightbox, setShowLightbox] = useState(false);
  const price = offer.pricing?.price;
  const prePrice = offer.pricing?.pre_price;
  const discount = prePrice && price ? Math.round((1 - price / prePrice) * 100) : null;
  const brandColor = offer.branding?.color ? `#${offer.branding.color}` : '#4a90d9';
  const brandName = offer.branding?.name || 'Ukendt';
  const logo = offer.branding?.logo;

  return (
    <>
      <div className="offer-card">
        <div className="offer-image-area" onClick={() => offer.images?.view && setShowLightbox(true)} style={{ cursor: offer.images?.view ? 'pointer' : 'default' }}>
          {offer.images?.thumb ? (
            <img src={offer.images.thumb} alt={offer.heading || ''} className="offer-image" loading="lazy" />
          ) : (
            <div className="offer-no-image">Intet billede</div>
          )}
          {discount > 0 && <div className="offer-discount-badge">-{discount}%</div>}
        </div>
        <div className="offer-info">
          <div className="offer-brand" style={{ color: brandColor }}>
            {logo && <img src={logo} alt="" className="offer-brand-logo" />}
            {brandName}
          </div>
          <h4 className="offer-heading">{offer.heading}</h4>
          {offer.description && <p className="offer-description">{offer.description}</p>}
          <div className="offer-prices">
            {prePrice && <span className="price-original">{prePrice} kr</span>}
            {price && <span className="price-new">{price} kr</span>}
            {discount > 0 && <span className="price-saved">Spar {Math.round(prePrice - price)} kr</span>}
          </div>
          <div className="offer-dates">
            {offer.run_from && <span className="item-time">Fra: {formatDate(offer.run_from)}</span>}
            {offer.run_till && <span className="item-time">Til: {formatDate(offer.run_till)}</span>}
          </div>
        </div>
      </div>

      {showLightbox && offer.images?.zoom && (
        <div className="lightbox" onClick={() => setShowLightbox(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setShowLightbox(false)}>×</button>
            <img src={offer.images.zoom} alt={offer.heading || ''} />
            <div className="lightbox-info">
              <h3>{offer.heading}</h3>
              {offer.description && <p className="offer-description">{offer.description}</p>}
              <div className="lightbox-prices">
                {prePrice && <span className="price-original">{prePrice} kr</span>}
                {price && <span className="price-new">{price} kr</span>}
                {discount > 0 && <span className="item-discount-badge" style={{ position: 'static', fontSize: '1rem', padding: '4px 12px' }}>-{discount}%</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OfferCard;

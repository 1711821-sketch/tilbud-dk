import { useState } from 'react';
import { useMemo } from 'react';
import SearchBar from './components/SearchBar';
import StoreList from './components/StoreList';
import FlatClearanceList from './components/FlatClearanceList';
import OfferCard from './components/OfferCard';
import './App.css';

function App() {
  const [tab, setTab] = useState('food-waste');
  const [stores, setStores] = useState([]);
  const [foodSort, setFoodSort] = useState('store');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [offersQuery, setOffersQuery] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [offersOffset, setOffersOffset] = useState(0);
  const [userCoords, setUserCoords] = useState(null);

  // Food Waste search
  const fetchFoodWaste = async (params) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const res = await fetch(`/api/food-waste?${params}`);
      if (!res.ok) throw new Error('Kunne ikke hente data fra API');
      const data = await res.json();
      setStores(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchFoodByZip = (zip) => fetchFoodWaste(`zip=${zip}`);

  const searchFoodByLocation = async () => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const geo = `${pos.coords.latitude},${pos.coords.longitude}`;
      setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      await fetchFoodWaste(`geo=${geo}&radius=10`);
    } catch (err) {
      if (err.code === 1) setError('Tillad venligst lokation i din browser');
      else setError(err.message);
      setLoading(false);
    }
  };

  // Tjek offers search
  const fetchOffers = async (query, lat, lng, offset = 0, append = false) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const params = new URLSearchParams({ offset, limit: 24 });
      if (query) params.set('query', query);
      if (lat && lng) {
        params.set('lat', lat);
        params.set('lng', lng);
      }
      const res = await fetch(`/api/offers?${params}`);
      if (!res.ok) throw new Error('Kunne ikke hente tilbud');
      const data = await res.json();
      setOffers(prev => append ? [...prev, ...data] : data);
      setHasMore(data.length === 24);
      setOffersOffset(offset + data.length);
      setOffersQuery(query || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchOffersByQuery = (query) => {
    const lat = userCoords?.lat;
    const lng = userCoords?.lng;
    fetchOffers(query, lat, lng, 0, false);
  };

  const searchOffersByLocation = async () => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      await fetchOffers('', pos.coords.latitude, pos.coords.longitude, 0, false);
    } catch (err) {
      if (err.code === 1) setError('Tillad venligst lokation i din browser');
      else setError(err.message);
      setLoading(false);
    }
  };

  const loadMore = () => {
    const lat = userCoords?.lat;
    const lng = userCoords?.lng;
    fetchOffers(offersQuery, lat, lng, offersOffset, true);
  };

  const totalItems = stores.reduce((sum, s) => sum + (s.clearances?.length || 0), 0);

  const sortedFlatItems = useMemo(() => {
    if (foodSort === 'store' || stores.length === 0) return [];
    const flat = stores.flatMap(s =>
      (s.clearances || []).map(c => ({
        ...c,
        storeName: s.store?.name || 'Ukendt',
        storeBrand: s.store?.brand || '',
      }))
    );
    if (foodSort === 'newest') {
      flat.sort((a, b) => new Date(b.offer?.startTime || 0) - new Date(a.offer?.startTime || 0));
    } else if (foodSort === 'discount') {
      flat.sort((a, b) => (b.offer?.percentDiscount || 0) - (a.offer?.percentDiscount || 0));
    }
    return flat;
  }, [stores, foodSort]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Tilbud DK</h1>
          <p className="subtitle">Find tilbud og nedsatte varer i butikker nær dig</p>
        </div>
      </header>

      <main className="main">
        <div className="tabs">
          <button className={`tab ${tab === 'food-waste' ? 'tab-active' : ''}`} onClick={() => setTab('food-waste')}>
            Madspild
          </button>
          <button className={`tab ${tab === 'offers' ? 'tab-active' : ''}`} onClick={() => setTab('offers')}>
            Alle Tilbud
          </button>
        </div>

        {tab === 'food-waste' && (
          <>
            <SearchBar
              onSearchZip={searchFoodByZip}
              onSearchLocation={searchFoodByLocation}
              loading={loading}
              placeholder="Indtast postnummer (f.eks. 8000)"
              useZip
            />

            {loading && (
              <div className="loading"><div className="spinner"></div><p>Søger efter madspild-tilbud...</p></div>
            )}
            {error && <div className="error-msg">{error}</div>}
            {searched && !loading && !error && stores.length > 0 && (
              <>
                <div className="results-summary">
                  <span className="results-count">{totalItems}</span> tilbud i <span className="results-count">{stores.length}</span> butikker
                </div>
                <div className="sort-bar">
                  <span className="sort-label">Sorter:</span>
                  <button className={`sort-btn ${foodSort === 'store' ? 'sort-active' : ''}`} onClick={() => setFoodSort('store')}>Butik</button>
                  <button className={`sort-btn ${foodSort === 'newest' ? 'sort-active' : ''}`} onClick={() => setFoodSort('newest')}>Seneste nedsat</button>
                  <button className={`sort-btn ${foodSort === 'discount' ? 'sort-active' : ''}`} onClick={() => setFoodSort('discount')}>Største rabat</button>
                </div>
              </>
            )}
            {searched && !loading && !error && stores.length === 0 && (
              <div className="no-results">Ingen madspild-tilbud fundet</div>
            )}
            {!loading && !error && foodSort === 'store' && <StoreList stores={stores} />}
            {!loading && !error && foodSort !== 'store' && <FlatClearanceList items={sortedFlatItems} />}
          </>
        )}

        {tab === 'offers' && (
          <>
            <SearchBar
              onSearchZip={searchOffersByQuery}
              onSearchLocation={searchOffersByLocation}
              loading={loading}
              placeholder="Søg efter varer (f.eks. TV, sofa, cykel...)"
              useZip={false}
            />

            {loading && offers.length === 0 && (
              <div className="loading"><div className="spinner"></div><p>Søger efter tilbud...</p></div>
            )}
            {error && <div className="error-msg">{error}</div>}
            {searched && !loading && !error && offers.length > 0 && (
              <div className="results-summary">
                <span className="results-count">{offers.length}</span> tilbud fundet
              </div>
            )}
            {searched && !loading && !error && offers.length === 0 && (
              <div className="no-results">Ingen tilbud fundet. Prøv et andet søgeord eller brug din lokation.</div>
            )}
            <div className="offers-grid">
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
            {hasMore && !loading && (
              <button className="btn-load-more" onClick={loadMore}>Vis flere tilbud</button>
            )}
            {loading && offers.length > 0 && (
              <div className="loading"><div className="spinner"></div></div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;

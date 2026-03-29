import StoreCard from './StoreCard';

function StoreList({ stores }) {
  if (!stores.length) return null;

  return (
    <div className="store-list">
      {stores.map((store, i) => (
        <StoreCard key={store.store?.id || i} data={store} />
      ))}
    </div>
  );
}

export default StoreList;

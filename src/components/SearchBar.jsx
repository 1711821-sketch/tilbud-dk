import { useState } from 'react';

function SearchBar({ onSearchZip, onSearchLocation, loading, placeholder, useZip }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearchZip(value.trim());
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder={placeholder || 'Søg...'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          pattern={useZip ? '[0-9]{4}' : undefined}
          maxLength={useZip ? 4 : undefined}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !value.trim()} className="btn btn-primary">
          Søg
        </button>
      </form>
      <button onClick={onSearchLocation} disabled={loading} className="btn btn-secondary">
        Brug min lokation
      </button>
    </div>
  );
}

export default SearchBar;

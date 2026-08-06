import Layout from '../src/components/Layout';
import { useState } from 'react';
import { fakeProducts } from '../src/data/products';
import ProductCard from '../src/components/ProductCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const filtered = fakeProducts.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    setResults(filtered);
  };

  return (
    <div style={{ padding: '2rem', background: '#f5f5f5', minHeight: '60vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>🔍 جستجوی محصولات</h1>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="نام یا توضیحات محصول..." style={{ flex: 1, padding: '0.8rem', border: '2px solid #d1d5db', borderRadius: '12px', fontSize: '1rem' }} />
        <button type="submit" style={{ padding: '0.8rem 1.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>جستجو</button>
      </form>
      {results.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {results.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
      {query && results.length === 0 && <p style={{ textAlign: 'center', color: '#6b7280' }}>نتیجه‌ای یافت نشد.</p>}
    </div>
  );
}

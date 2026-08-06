import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../src/components/Layout';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/wishlist')
      .then(r => r.json())
      .then(ids => {
        setItems(ids);
        // گرفتن جزئیات محصولات (شبیه‌سازی)
        return fetch('/api/compare');
      })
      .then(r => r.json())
      .then(all => {
        const filtered = all.filter(p => items.includes(p.id));
        setProducts(filtered);
      })
      .catch(() => {});
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ textAlign: 'center', color: '#059669' }}>❤️ علاقه‌مندی‌ها</h1>
        {products.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: 50 }}>هنوز محصولی به علاقه‌مندی‌ها اضافه نشده است.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginTop: 30 }}>
            {products.map(p => (
              <div key={p.id} style={{ background: 'white', borderRadius: 12, padding: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8 }} />
                <h3>{p.name}</h3>
                <p style={{ color: '#059669', fontWeight: 'bold' }}>{p.price.toLocaleString()} تومان</p>
                <Link href={`/product/${p.id}`} style={{ color: '#2563eb' }}>مشاهده</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

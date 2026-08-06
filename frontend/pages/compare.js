import { useState } from 'react';
import Layout from '../src/components/Layout';

export default function Compare() {
  const [selected, setSelected] = useState([]);
  const [products, setProducts] = useState([]);
  const [all, setAll] = useState([]);

  const addProduct = async (id) => {
    if (selected.length >= 3) return;
    if (selected.includes(id)) return;
    const newSelected = [...selected, id];
    setSelected(newSelected);
    const res = await fetch(`/api/compare?ids=${newSelected.join(',')}`);
    const data = await res.json();
    setProducts(data);
  };

  const removeProduct = (id) => {
    const newSelected = selected.filter(i => i !== id);
    setSelected(newSelected);
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
  };

  // بارگذاری اولیه همه محصولات
  useState(() => {
    fetch('/api/compare').then(r => r.json()).then(setAll).catch(() => {});
  }, []);

  return (
    <Layout>
      <div style={{ maxWidth: 1000, margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ textAlign: 'center', color: '#059669' }}>🔍 مقایسه محصولات</h1>

        <div style={{ display: 'flex', gap: 10, marginBottom: 30, flexWrap: 'wrap', justifyContent: 'center' }}>
          {all.map(p => (
            <button key={p.id} onClick={() => addProduct(p.id)} disabled={selected.includes(p.id)}
              style={{ padding: '8px 16px', background: selected.includes(p.id) ? '#9ca3af' : '#2563eb', color: 'white', border: 'none', borderRadius: 20, cursor: 'pointer' }}>
              {p.name}
            </button>
          ))}
        </div>

        {products.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${products.length}, 1fr)`, gap: 10, background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'auto' }}>
            <div style={{ padding: 10, fontWeight: 'bold', background: '#f9fafb' }}>تصویر</div>
            {products.map(p => <div key={p.id} style={{ padding: 10, textAlign: 'center' }}><img src={p.image} alt={p.name} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} /></div>)}
            <div style={{ padding: 10, fontWeight: 'bold', background: '#f9fafb' }}>نام</div>
            {products.map(p => <div key={p.id} style={{ padding: 10 }}>{p.name}</div>)}
            <div style={{ padding: 10, fontWeight: 'bold', background: '#f9fafb' }}>قیمت</div>
            {products.map(p => <div key={p.id} style={{ padding: 10 }}>{p.price.toLocaleString()} تومان</div>)}
            {/* نمایش مشخصات فنی */}
            {products.length > 0 && Object.keys(products[0].specs || {}).map(spec => (
              <>
                <div key={spec} style={{ padding: 10, fontWeight: 'bold', background: '#f9fafb' }}>{spec}</div>
                {products.map(p => <div key={p.id} style={{ padding: 10 }}>{p.specs?.[spec] || '-'}</div>)}
              </>
            ))}
            <div style={{ padding: 10, fontWeight: 'bold', background: '#f9fafb' }}>حذف</div>
            {products.map(p => <div key={p.id} style={{ padding: 10, textAlign: 'center' }}><button onClick={() => removeProduct(p.id)} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>✕</button></div>)}
          </div>
        )}
      </div>
    </Layout>
  );
}

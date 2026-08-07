import { useState, useEffect } from 'react';
import Layout from '../src/components/Layout';

export default function DigitalProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/admin/digital-products')
      .then(r => r.json())
      .then(setProducts)
      .catch(() => {});
  }, []);

  const handleBuy = (product, plan) => {
    // هدایت به checkout با پارامترهای محصول دیجیتال
    window.location.href = `/checkout?type=digital&productId=${product.id}&planName=${plan.name}&price=${plan.price}`;
  };

  return (
    <Layout>
      <div style={{ maxWidth: 1100, margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ textAlign: 'center', color: '#059669' }}>🛍️ محصولات دیجیتال</h1>
        {products.map(product => (
          <div key={product.id} style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 30, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <img src={product.image} alt={product.name} style={{ width: 200, height: 150, objectFit: 'cover', borderRadius: 12 }} />
              <div style={{ flex: 1 }}>
                <h2>{product.name}</h2>
                <p style={{ color: '#6b7280' }}>{product.description}</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                  {product.features.map((f, i) => (
                    <span key={i} style={{ background: '#d1fae5', color: '#059669', padding: '4px 10px', borderRadius: 12, fontSize: 13 }}>{f}</span>
                  ))}
                </div>
                <a href={product.demoUrl} target="_blank" style={{ color: '#2563eb', marginTop: 10, display: 'inline-block' }}>🎮 پیش‌نمایش</a>
              </div>
            </div>
            {/* پلن‌ها */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginTop: 20 }}>
              {product.plans.map(plan => (
                <div key={plan.name} style={{ border: '2px solid #e5e7eb', borderRadius: 12, padding: 16, textAlign: 'center', background: plan.name === 'حرفه‌ای' || plan.name === 'پریمیوم' ? '#fef3c7' : 'white' }}>
                  <h3 style={{ margin: 0 }}>{plan.name}</h3>
                  <p style={{ fontSize: 20, fontWeight: 'bold', color: '#059669', margin: '8px 0' }}>
                    {plan.price === 0 ? 'رایگان' : plan.price.toLocaleString() + ' تومان'}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: 13 }}>{plan.duration}</p>
                  <ul style={{ textAlign: 'right', paddingRight: 20, fontSize: 13 }}>
                    {plan.features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                  <button onClick={() => handleBuy(product, plan)} style={{ width: '100%', padding: 8, background: plan.price === 0 ? '#6b7280' : '#059669', color: 'white', border: 'none', borderRadius: 8, marginTop: 10, cursor: 'pointer' }}>
                    {plan.price === 0 ? 'شروع رایگان' : 'خرید'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <Head>
        <title>Tetrashop100 - فروشگاه آنلاین</title>
      </Head>

      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2563eb' }}>🚀 Tetrashop100</h1>
        <p>فروشگاه آنلاین مدرن و کارآمد</p>
      </header>

      <main>
        <h2>محصولات ما</h2>
        
        {loading ? (
          <p>در حال بارگذاری محصولات...</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px',
            marginTop: '20px'
          }}>
            {products.map(product => (
              <div key={product.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
                <p style={{ color: '#6b7280', margin: '0 0 10px 0' }}>{product.category}</p>
                <p style={{ 
                  fontWeight: 'bold', 
                  color: '#059669',
                  fontSize: '18px'
                }}>
                  {product.price.toLocaleString()} تومان
                </p>
                <button style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%'
                }}>
                  افزودن به سبد خرید
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ 
        marginTop: '40px', 
        textAlign: 'center', 
        color: '#6b7280',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '20px'
      }}>
        <p>© 2024 Tetrashop100 - تمام حقوق محفوظ است</p>
      </footer>
    </div>
  );
}

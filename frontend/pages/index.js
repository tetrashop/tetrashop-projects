export default function Home() {
  return (
    <div style={{ fontFamily: 'Tahoma', textAlign: 'center', padding: '10vh 20px' }}>
      <h1 style={{ color: '#059669', fontSize: '3rem' }}>🛍️ TetraShop</h1>
      <p style={{ fontSize: '1.2rem', color: '#555' }}>فروشگاه محصولات فیزیکی و دیجیتال</p>
      <a href="/digital-products" style={{ color: '#2563eb', marginRight: 20 }}>محصولات دیجیتال</a>
      <a href="/status.html" style={{ color: '#2563eb', marginRight: 20 }}>📊 لاگ زنده</a>
      <a href="/dashboard.html" style={{ color: '#2563eb' }}>پنل مدیریت</a>
    </div>
  );
}

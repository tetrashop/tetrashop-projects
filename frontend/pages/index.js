import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif', textAlign: 'center', padding: 60 }}>
      <h1 style={{ color: '#059669', fontSize: 48 }}>🛍️ TetraShop</h1>
      <p style={{ fontSize: 18, color: '#555' }}>فروشگاه محصولات فیزیکی و دیجیتال</p>
      <div style={{ marginTop: 40 }}>
        <Link href="/digital-products" style={{ color: '#2563eb', fontSize: 18, marginRight: 30 }}>محصولات دیجیتال</Link>
        <a href="/dashboard.html" style={{ color: '#2563eb', fontSize: 18 }}>پنل مدیریت</a>
      </div>
    </div>
  );
}

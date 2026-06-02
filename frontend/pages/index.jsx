import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif', textAlign: 'center', padding: 60 }}>
      <h1 style={{ color: '#059669', fontSize: 40 }}>🛍️ TetraShop</h1>
      <p>فروشگاه محصولات فیزیکی و دیجیتال</p>
      <div style={{ marginTop: 30 }}>
        <Link href="/digital-products" style={{ color: '#2563eb', marginRight: 20 }}>محصولات دیجیتال</Link>
        <a href="/dashboard.html" style={{ color: '#2563eb' }}>پنل مدیریت</a>
      </div>
    </div>
  );
}

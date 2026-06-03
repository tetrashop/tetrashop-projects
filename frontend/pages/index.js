import Head from 'next/head';
import Link from 'next/link';

const featuredProducts = [
  { id: 1, name: 'هدفون بی‌سیم', price: 3500000, image: 'https://picsum.photos/seed/headphone/300/200' },
  { id: 2, name: 'کوله‌پشتی لپ‌تاپ', price: 1250000, image: 'https://picsum.photos/seed/backpack/300/200' },
  { id: 3, name: 'ماگ سرامیکی', price: 280000, image: 'https://picsum.photos/seed/mug/300/200' },
];

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Head>
        <title>فروشگاه TetraShop</title>
        <meta name="description" content="فروشگاه محصولات فیزیکی و دیجیتال" />
      </Head>

      {/* هدر */}
      <header style={{ background: '#059669', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>🛍️ TetraShop</Link>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <Link href="/digital-products" style={{ color: 'white', textDecoration: 'none' }}>محصولات دیجیتال</Link>
          <a href="/status.html" style={{ color: '#fbbf24', textDecoration: 'none' }}>📊 لاگ زنده</a>
          <a href="/dashboard.html" style={{ color: 'white', textDecoration: 'none' }}>پنل مدیریت</a>
        </nav>
      </header>

      {/* بنر اصلی */}
      <section style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>به فروشگاه TetraShop خوش آمدید</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>انواع محصولات فیزیکی و دیجیتال با بهترین کیفیت</p>
        <Link href="/digital-products" style={{ background: '#fbbf24', color: '#1f2937', padding: '0.8rem 2rem', borderRadius: '2rem', textDecoration: 'none', fontWeight: 'bold' }}>مشاهده محصولات دیجیتال</Link>
      </section>

      {/* محصولات ویژه */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>محصولات پرفروش</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {featuredProducts.map(product => (
            <div key={product.id} style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{product.name}</h3>
                <p style={{ color: '#059669', fontWeight: 'bold', margin: '0' }}>{product.price.toLocaleString()} تومان</p>
                <button style={{ marginTop: '0.5rem', background: '#059669', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', width: '100%' }}>افزودن به سبد خرید</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* فوتر */}
      <footer style={{ background: '#1f2937', color: 'white', textAlign: 'center', padding: '1rem' }}>
        <p>تمامی حقوق محفوظ است © ۱۴۰۵ TetraShop | توسعه‌دهنده: رامین اجلال</p>
        <div style={{ marginTop: '0.5rem' }}>
          <a href="/status.html" style={{ color: '#fbbf24', margin: '0 1rem' }}>وضعیت سرور</a>
          <a href="/dashboard.html" style={{ color: '#fbbf24', margin: '0 1rem' }}>داشبورد</a>
        </div>
      </footer>
    </div>
  );
}

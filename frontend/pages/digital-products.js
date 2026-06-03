import Head from 'next/head';
import Link from 'next/link';

const digitalItems = [
  { id: 'bot', name: 'ربات بله', price: 99000, demo: '/demos/bot.html', image: 'https://picsum.photos/seed/bot/300/200' },
  { id: 'chess', name: 'موتور شطرنج', price: 129000, demo: '/demos/chess.html', image: 'https://picsum.photos/seed/chess/300/200' },
  { id: 'ai', name: 'تحلیل احساسات', price: 89000, demo: '/demos/ai.html', image: 'https://picsum.photos/seed/ai/300/200' },
  { id: 'finance', name: 'داشبورد مالی', price: 149000, demo: '/demos/finance.html', image: 'https://picsum.photos/seed/finance/300/200' },
  { id: 'platform', name: 'پنل مدیریت', price: 199000, demo: '/demos/platform.html', image: 'https://picsum.photos/seed/platform/300/200' },
];

export default function DigitalProducts() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Head><title>محصولات دیجیتال – TetraShop</title></Head>

      <header style={{ background: '#059669', color: 'white', padding: '1rem 2rem' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}>🛍️ بازگشت به فروشگاه</Link>
      </header>

      <main style={{ flex: 1, padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>محصولات دیجیتال</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {digitalItems.map(item => (
            <div key={item.id} style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer' }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.name}</h3>
                <p style={{ color: '#059669', fontWeight: 'bold' }}>{item.price.toLocaleString()} تومان</p>
                <a href={item.demo} style={{ display: 'block', marginTop: '0.5rem', background: '#2563eb', color: 'white', textAlign: 'center', padding: '0.5rem', borderRadius: '8px', textDecoration: 'none' }}>مشاهده دمو</a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ background: '#1f2937', color: 'white', textAlign: 'center', padding: '1rem' }}>
        <p>© ۱۴۰۵ TetraShop</p>
      </footer>
    </div>
  );
}

export default function DigitalProducts() {
  const items = [
    { id: 'bot', name: 'ربات بله', price: 99000, demo: '/demos/bot.html' },
    { id: 'chess', name: 'شطرنج', price: 129000, demo: '/demos/chess.html' },
    { id: 'ai', name: 'تحلیل احساسات', price: 89000, demo: '/demos/ai.html' },
    { id: 'finance', name: 'داشبورد مالی', price: 149000, demo: '/demos/finance.html' },
    { id: 'error', name: 'سیستم خطا', price: 99000, demo: '/demos/error-system.html' },
    { id: 'olympic', name: 'المپیک', price: 199000, demo: '/demos/olympic.html' },
  ];
  return (
    <div style={{ fontFamily: 'Tahoma', maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>محصولات دیجیتال</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, marginTop: 30 }}>
        {items.map(i => (
          <div key={i.id} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: 20, textAlign: 'center' }}>
            <h3>{i.name}</h3>
            <p style={{ color: '#059669', fontWeight: 'bold' }}>{i.price.toLocaleString()} تومان</p>
            <a href={i.demo} style={{ color: '#2563eb' }}>مشاهده دمو</a>
          </div>
        ))}
      </div>
    </div>
  );
}

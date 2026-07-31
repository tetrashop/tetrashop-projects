import { useState } from 'react';

const games = [
  { name: '🏃 دو سرعت', players: 8, status: 'live' },
  { name: '🏊 شنا', players: 6, status: 'upcoming' },
  { name: '🤼 کشتی', players: 4, status: 'finished' },
  { name: '⚽ فوتبال', players: 22, status: 'live' },
  { name: '🏋️ وزنه‌برداری', players: 3, status: 'upcoming' },
];

export default function OlympicDashboard() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif', maxWidth: 700, margin: '0 auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center', color: '#1e40af' }}>🏅 TetraShop Olympic Games</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>بازی‌های تعاملی و مسابقات</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginTop: 24 }}>
        {games.map(game => (
          <div key={game.name} onClick={() => setSelected(game.name)}
            style={{ padding: 20, background: selected === game.name ? '#eff6ff' : 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', border: selected === game.name ? '2px solid #3b82f6' : '2px solid transparent' }}>
            <h3 style={{ fontSize: 24, margin: 0 }}>{game.name}</h3>
            <p style={{ color: '#666', marginTop: 8 }}>شرکت‌کنندگان: {game.players}</p>
            <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, background: game.status === 'live' ? '#dcfce7' : game.status === 'upcoming' ? '#fef9c3' : '#f3f4f6', color: game.status === 'live' ? '#16a34a' : game.status === 'upcoming' ? '#ca8a04' : '#6b7280' }}>
              {game.status === 'live' ? 'در حال اجرا' : game.status === 'upcoming' ? 'پیش‌رو' : 'پایان‌یافته'}
            </span>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: 30, padding: 24, background: '#f9fafb', borderRadius: 16, textAlign: 'center' }}>
          <h2>🎯 {selected} – شروع بازی!</h2>
          <p>این بخش در نسخه کامل قابل بازی خواهد بود.</p>
          <button onClick={() => setSelected(null)} style={{ marginTop: 12, padding: '10px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer' }}>بستن</button>
        </div>
      )}

      <div style={{ marginTop: 30, textAlign: 'center', color: '#999', fontSize: 14 }}>
        متصل به فروشگاه اصلی | <a href="https://tetrashop-projects-seven.vercel.app" style={{ color: '#2563eb' }}>TetraShop</a>
      </div>
    </div>
  );
}

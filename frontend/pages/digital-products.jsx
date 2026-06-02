import Link from 'next/link';

const products = [
  { id: '1', name: 'ربات بله', price: 99000, image: 'https://picsum.photos/400/300' },
  { id: '2', name: 'موتور شطرنج', price: 129000, image: 'https://picsum.photos/400/301' },
  { id: '3', name: 'تحلیل احساسات', price: 89000, image: 'https://picsum.photos/400/302' },
];

export default function DigitalProducts() {
  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif', maxWidth: 700, margin: '0 auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>محصولات دیجیتال</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 20, marginTop: 30 }}>
        {products.map(p => (
          <div key={p.id} style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: 16, textAlign: 'center' }}>
            <img src={p.image} alt={p.name} style={{ width: '100%', borderRadius: 12, marginBottom: 12 }} />
            <h3>{p.name}</h3>
            <p style={{ fontWeight: 'bold', color: '#059669' }}>{p.price.toLocaleString()} تومان</p>
            <Link href={`/digital/${p.id}`} style={{ color: '#2563eb' }}>مشاهده</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

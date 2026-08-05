import Link from 'next/link';
import { useCartStore } from '../store/cartStore';

function formatPrice(price) {
  return new Intl.NumberFormat('fa-IR').format(price);
}

export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem);
  return (
    <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', overflow: 'hidden', transition: 'transform 0.2s' }}>
      <Link href={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer' }} />
      </Link>
      <div style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{product.name}</h3>
        <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>{product.description}</p>
        <p style={{ color: '#059669', fontWeight: 'bold', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>{formatPrice(product.price)} تومان</p>
        <button onClick={() => addItem(product)} style={{ width: '100%', padding: '0.6rem', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          افزودن به سبد خرید
        </button>
      </div>
    </div>
  );
}

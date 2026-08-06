import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '../store/cartStore';

function formatPrice(price) { return new Intl.NumberFormat('fa-IR').format(price); }

export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem);
  const [liked, setLiked] = useState(false);

  const toggleWishlist = async () => {
    const method = liked ? 'DELETE' : 'POST';
    await fetch('/api/wishlist', {
      method,
      headers: { 'Content-Type': 'application/json', 'x-user-id': 'guest' },
      body: JSON.stringify({ productId: product.id }),
    });
    setLiked(!liked);
  };

  return (
    <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', overflow: 'hidden', position: 'relative' }}>
      <button onClick={toggleWishlist} style={{ position: 'absolute', top: 10, right: 10, background: liked ? '#fecaca' : '#f3f4f6', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: '1.2rem' }}>
        {liked ? '❤️' : '🤍'}
      </button>
      <Link href={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: 200, objectFit: 'cover', cursor: 'pointer' }} />
      </Link>
      <div style={{ padding: '1rem' }}>
        <h3 style={{ margin: 0 }}>{product.name}</h3>
        <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>{product.description}</p>
        <p style={{ color: '#059669', fontWeight: 'bold', fontSize: '1.1rem' }}>{formatPrice(product.price)} تومان</p>
        <button onClick={() => addItem(product)} style={{ width: '100%', padding: '0.6rem', background: '#059669', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', marginTop: 0 }}>
          افزودن به سبد خرید
        </button>
      </div>
    </div>
  );
}

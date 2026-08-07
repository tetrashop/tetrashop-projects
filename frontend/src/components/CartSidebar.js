import Link from 'next/link';
import { useCartStore } from '../store/cartStore';

function formatPrice(price) { return new Intl.NumberFormat('fa-IR').format(price); }

export default function CartSidebar({ onClose }) {
  const items = useCartStore(s => s.items);
  const totalPrice = useCartStore(s => s.totalPrice());
  const removeItem = useCartStore(s => s.removeItem);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: 'white', width: '100%', maxWidth: 420, padding: 20, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2>🛒 سبد خرید</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>✕</button>
        </div>
        {items.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>سبد خرید خالی است</p>
        ) : (
          <>
            {items.map(item => (
              <div key={item.product.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                <img src={item.product.image} alt={item.product.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0 }}>{item.product.name}</h4>
                  <p style={{ margin: 0, color: '#059669' }}>{formatPrice(item.product.price * item.quantity)} تومان</p>
                  <small style={{ color: '#6b7280' }}>تعداد: {item.quantity}</small>
                </div>
                <button onClick={() => removeItem(item.product.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}>حذف</button>
              </div>
            ))}
            <div style={{ marginTop: 15, textAlign: 'center' }}>
              <p style={{ fontSize: 20, fontWeight: 'bold', color: '#059669' }}>جمع: {formatPrice(totalPrice)} تومان</p>
              <Link href="/checkout" style={{ display: 'block', marginTop: 10, padding: 12, background: '#059669', color: 'white', textDecoration: 'none', borderRadius: 8, fontWeight: 'bold' }}>
                🛍️ تکمیل خرید
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

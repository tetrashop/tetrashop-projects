import { useRouter } from 'next/router';
import { fakeProducts } from '../../src/data/products';
import { useCartStore } from '../../src/store/cartStore';
function formatPrice(price) { return new Intl.NumberFormat('fa-IR').format(price); }
export default function ProductDetail() {
  const router = useRouter(); const { id } = router.query;
  const product = fakeProducts.find(p => p.id === Number(id));
  const addItem = useCartStore(s => s.addItem);
  if (!product) return <div style={{ textAlign: 'center', padding: 60 }}>محصول یافت نشد</div>;
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <img src={product.image} alt={product.name} style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 16, marginBottom: '2rem' }} />
      <h1>{product.name}</h1>
      <p style={{ color: '#6b7280' }}>{product.description}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{formatPrice(product.price)} تومان</p>
      <button onClick={() => addItem(product)} style={{ padding: '0.8rem 2rem', background: '#059669', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: '1rem' }}>افزودن به سبد خرید</button>
    </div>
  );
}

import Layout from '../src/components/Layout';
import { fakeProducts } from '../src/data/products';
import ProductCard from '../src/components/ProductCard';

export default function Products() {
  return (
    <div style={{ padding: '2rem', background: '#f5f5f5', minHeight: '60vh' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '2rem' }}>محصولات فیزیکی</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {fakeProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

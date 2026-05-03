import { fakeProducts } from '../src/data/products';
import ProductCard from '../src/components/ProductCard';
import Navbar from '../src/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">فروشگاه تتــــرا</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {fakeProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </>
  );
}

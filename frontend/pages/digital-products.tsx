import Navbar from '../src/components/Navbar';
import digitalProducts from '../src/data/digitalProducts.json';
import { formatPrice } from '../src/utils/formatPrice';
import Link from 'next/link';

export default function DigitalProducts() {
  const products = digitalProducts as Array<{ id: string; name: string; description: string; type: string; price: number; image: string }>;
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">محصولات دیجیتال</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {products.map(prod => (
            <div key={prod.id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
              <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover rounded-xl mb-4" />
              <h2 className="text-xl font-bold mb-2">{prod.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{prod.description}</p>
              <span className="text-sm text-gray-500 mb-3">نوع: {prod.type}</span>
              <span className="text-2xl font-bold text-emerald-600 mb-4">{formatPrice(prod.price)} تومان</span>
              <Link href={`/digital/${prod.id}`} className="mt-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-center">مشاهده و دمو</Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

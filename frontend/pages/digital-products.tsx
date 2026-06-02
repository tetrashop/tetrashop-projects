import Link from 'next/link';

const products = [
  { id: '1', name: 'ربات بله', type: 'Bot', price: 99000, image: 'https://picsum.photos/400/300' },
  { id: '2', name: 'موتور شطرنج', type: 'Game', price: 129000, image: 'https://picsum.photos/400/301' },
  { id: '3', name: 'تحلیل احساسات', type: 'AI', price: 89000, image: 'https://picsum.photos/400/302' },
];

export default function DigitalProducts() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" dir="rtl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">محصولات دیجیتال</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded-xl mb-4" />
            <h2 className="text-xl font-bold mb-2">{p.name}</h2>
            <p className="text-gray-600 text-sm mb-2">{p.type}</p>
            <span className="text-2xl font-bold text-emerald-600 mb-4">{p.price.toLocaleString()} تومان</span>
            <Link href={`/digital/${p.id}`} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-center w-full transition-colors">
              مشاهده و دمو
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

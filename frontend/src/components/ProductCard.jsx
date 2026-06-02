import Link from 'next/link';
import { formatPrice } from '../utils/formatPrice';
import { useCartStore } from '../store/cartStore';

export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem);
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl p-4 flex flex-col items-center text-center">
      <Link href={`/product/${product.id}`}><img src={product.image} alt={product.name} className="w-40 h-40 object-cover rounded-xl mb-4 cursor-pointer" /></Link>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{product.description}</p>
      <span className="text-xl font-bold text-emerald-600 mb-3">{formatPrice(product.price)} تومان</span>
      <button onClick={() => addItem(product)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg w-full">افزودن به سبد خرید</button>
    </div>
  );
}

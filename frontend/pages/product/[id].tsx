import { useRouter } from 'next/router';
import { fakeProducts } from '../../src/data/products';
import { formatPrice } from '../../src/utils/formatPrice';
import Navbar from '../../src/components/Navbar';
import { useCartStore } from '../../src/store/cartStore';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const product = fakeProducts.find(p => p.id === Number(id));
  const addItem = useCartStore(s => s.addItem);

  if (!product) return <div className="p-8 text-center text-red-500">محصول پیدا نشد</div>;
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <img src={product.image} alt={product.name} className="w-full h-80 object-cover rounded-2xl mb-6" />
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <span className="text-2xl font-bold text-emerald-600 block mb-6">{formatPrice(product.price)} تومان</span>
        <button onClick={() => addItem(product)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg text-lg w-full md:w-auto">افزودن به سبد خرید</button>
      </div>
    </>
  );
}

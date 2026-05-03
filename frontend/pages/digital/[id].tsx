import { useRouter } from 'next/router';
import Navbar from '../../src/components/Navbar';
import digitalProducts from '../../src/data/digitalProducts.json';
import { formatPrice } from '../../src/utils/formatPrice';
import { useCartStore } from '../../src/store/cartStore';
import dynamic from 'next/dynamic';

const DemoComponent = dynamic(() => import('../../src/demos/DemoComponents'), { ssr: false });

export default function DigitalProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const product = (digitalProducts as Array<any>).find(p => p.id === id);
  const addItem = useCartStore(s => s.addItem);

  if (!product) return <div className="p-8 text-center text-red-500">محصول یافت نشد</div>;
  return (
    <div className="min-h-screen overflow-y-auto">
      <Navbar />
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        {product.image && (
          <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-2xl mb-6" />
        )}
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <span className="text-2xl font-bold text-emerald-600 block mb-6">{formatPrice(product.price)} تومان</span>
        <button
          onClick={() => addItem({ id: parseInt(product.id, 36), name: product.name, description: product.description, price: product.price, image: product.image, category: 'digital' })}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg text-lg mb-8"
        >
          افزودن به سبد خرید
        </button>
        <div className="border-t pt-8 mt-8">
          <h2 className="text-2xl font-bold mb-4">پیش‌نمایش تعاملی</h2>
          {id && <DemoComponent productId={id as string} />}
        </div>
      </div>
    </div>
  );
}

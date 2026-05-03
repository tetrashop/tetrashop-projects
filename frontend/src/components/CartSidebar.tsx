import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils/formatPrice';

export default function CartSidebar({ onClose }: { onClose: () => void }) {
  const items = useCartStore(s => s.items);
  const totalPrice = useCartStore(s => s.totalPrice());
  const removeItem = useCartStore(s => s.removeItem);
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const clearCart = useCartStore(s => s.clearCart);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md h-full shadow-xl p-6 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">سبد خرید</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        {items.length === 0 ? (
          <p className="text-gray-500 text-center">سبد خرید خالی است</p>
        ) : (
          <>
            <ul className="flex-1 divide-y">
              {items.map(item => (
                <li key={item.product.id} className="py-4 flex gap-4 items-center">
                  <img src={item.product.image} alt="" className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">{formatPrice(item.product.price)} تومان</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="px-2 py-1 bg-gray-200 rounded">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.product.id)} className="text-red-500 hover:text-red-700">حذف</button>
                </li>
              ))}
            </ul>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-xl font-bold"><span>جمع:</span><span>{formatPrice(totalPrice)} تومان</span></div>
              <button onClick={clearCart} className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg">خالی کردن سبد</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { useRouter } from 'next/router';

export default function DigitalProduct() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-lg">
        <h1 className="text-3xl font-bold text-emerald-600 mb-4">محصول دیجیتال #{id}</h1>
        <p className="text-gray-600 mb-6">جزئیات و دموی محصول به‌زودی اضافه خواهد شد.</p>
        <a href="/" className="text-blue-500 hover:underline">بازگشت به فروشگاه</a>
      </div>
    </div>
  );
}

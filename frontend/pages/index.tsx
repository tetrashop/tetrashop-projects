import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8" dir="rtl">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-emerald-600 mb-4">🛍️ TetraShop</h1>
        <p className="text-gray-600 text-lg mb-8">فروشگاه محصولات فیزیکی و دیجیتال</p>
        <div className="space-x-4 space-x-reverse">
          <Link href="/digital-products" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-lg transition-colors">
            محصولات دیجیتال
          </Link>
          <a href="/dashboard.html" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-lg transition-colors inline-block">
            پنل مدیریت
          </a>
        </div>
      </div>
    </div>
  );
}

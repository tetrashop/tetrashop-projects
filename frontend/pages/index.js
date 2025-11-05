import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { apiService } from '../services/apiService';
import Header from '../components/layout/Header';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // بررسی سلامت سرویس
        const healthResponse = await apiService.health.check();
        setHealthStatus(healthResponse.data);

        // دریافت محصولات
        const productsResponse = await apiService.products.getAll();
        setProducts(productsResponse.data.products || []);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('خطا در بارگذاری داده‌ها');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const featuredProducts = products.slice(0, 8); // نمایش 8 محصول اول

  return (
    <>
      <Head>
        <title>Tetrashop100 - فروشگاه اینترنتی پیشرو</title>
        <meta name="description" content="بهترین تجربه خرید آنلاین با Tetrashop100" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                تجربه خرید 
                <span className="block text-yellow-300">متفاوت و مدرن</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-95 leading-relaxed">
                با تنوع بی‌نظیر محصولات، قیمت‌های استثنایی و پشتیبانی 24 ساعته
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg">
                  🛍️ شروع خرید آنلاین
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all">
                  📦 مشاهده محصولات
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Status Bar */}
        {healthStatus && (
          <section className="bg-green-50 border-b border-green-200">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-center gap-3 text-green-800">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">سرویس فعال</span>
                <span className="text-sm opacity-75">• نسخه {healthStatus.version}</span>
                <span className="text-sm opacity-75">• آخرین بروزرسانی: همین حالا</span>
              </div>
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <LoadingSpinner size="large" />
              <p className="text-gray-600 mt-4 text-lg">در حال بارگذاری محصولات...</p>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && (
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                <h3 className="text-red-800 font-bold text-lg mb-2">خطا در بارگذاری</h3>
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  تلاش مجدد
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Products Section */}
        {!loading && !error && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  محصولات منتخب
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  منتخبی از بهترین محصولات با گارانتی اصالت و کیفیت
                </p>
              </div>

              {featuredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📦</div>
                  <h3 className="text-gray-600 text-xl mb-2">محصولی یافت نشد</h3>
                  <p className="text-gray-500">به زودی محصولات جدید اضافه خواهند شد</p>
                </div>
              )}

              {/* CTA Section */}
              <div className="text-center mt-16">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    آماده شروع خرید هستید؟
                  </h3>
                  <p className="text-gray-600 mb-6">
                    به جامعه بیش از ۱۰,۰۰۰ خریدار راضی Tetrashop100 بپیوندید
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                      مشاهده تمام محصولات
                    </button>
                    <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                      راهنمای خرید
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-16 bg-white border-t">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-bold mb-3">ارسال اکسپرس</h3>
                <p className="text-gray-600 leading-relaxed">
                  تحویل در کمترین زمان ممکن در سراسر کشور با پشتیبانی لجستیک پیشرفته
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold mb-3">پرداخت امن</h3>
                <p className="text-gray-600 leading-relaxed">
                  پرداخت آنلاین مطمئن با درگاه‌های شاپرک و SSL پیشرفته
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-bold mb-3">ضمانت کیفیت</h3>
                <p className="text-gray-600 leading-relaxed">
                  گارانتی بازگشت ۷ روزه وجه و پشتیبانی فنی ۲۴ ساعته
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="text-xl font-bold mb-3">تخفیف‌های ویژه</h3>
                <p className="text-gray-600 leading-relaxed">
                  بهترین قیمت‌ها همراه با تخفیف‌های دوره‌ای و جشنواره‌های فروش
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🚀 Tetrashop100</h3>
              <p className="text-gray-300 leading-relaxed">
                پیشرو در تجارت الکترونیک با بیش از ۳ سال سابقه درخشان
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">دسترسی سریع</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/products" className="hover:text-white transition-colors">محصولات</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">درباره ما</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">تماس با ما</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">خدمات مشتریان</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/shipping" className="hover:text-white transition-colors">شرایط ارسال</a></li>
                <li><a href="/return" className="hover:text-white transition-colors">مرجوعی کالا</a></li>
                <li><a href="/faq" className="hover:text-white transition-colors">سوالات متداول</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">تماس با ما</h4>
              <div className="text-gray-300 space-y-2">
                <p>📞 ۰۲۱-۱۲۳۴۵۶۷۸</p>
                <p>📧 support@tetrashop100.com</p>
                <p>🕒 ۲۴ ساعته، ۷ روز هفته</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© ۲۰۲۴ Tetrashop100 - تمام حقوق محفوظ است</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;

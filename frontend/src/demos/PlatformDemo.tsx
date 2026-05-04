import { useState } from 'react';

const activities = [
  'ثبت‌نام کاربر جدید (علی رضایی)',
  'سفارش #۲۳۴۲ ثبت شد',
  'پرداخت موفق به مبلغ ۴۵۰,۰۰۰ تومان',
  'بروزرسانی محصول «کتاب React»',
  'تیکت پشتیبانی #۸۹۲۱ ایجاد شد',
  'کاربر سارا احمدی وارد شد',
];

export default function PlatformDemo() {
  const [search, setSearch] = useState('');

  const filtered = activities.filter(a => a.includes(search));

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">⚙️ پنل مدیریت</h3>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-xl text-center">
          <p className="text-xs text-gray-600">کاربران</p>
          <p className="text-2xl font-bold">۱۲۰</p>
        </div>
        <div className="bg-green-100 p-3 rounded-xl text-center">
          <p className="text-xs text-gray-600">سفارش‌ها</p>
          <p className="text-2xl font-bold">۴۳</p>
        </div>
        <div className="bg-yellow-100 p-3 rounded-xl text-center">
          <p className="text-xs text-gray-600">درآمد</p>
          <p className="text-2xl font-bold">۱۲M</p>
        </div>
      </div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="جستجو در فعالیت‌ها..."
        className="w-full border rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="border rounded-xl divide-y max-h-40 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="p-3 text-center text-gray-400 text-sm">نتیجه‌ای یافت نشد.</p>
        ) : (
          filtered.map((a, i) => (
            <div key={i} className="p-3 text-sm hover:bg-gray-50 cursor-default">• {a}</div>
          ))
        )}
      </div>
    </div>
  );
}

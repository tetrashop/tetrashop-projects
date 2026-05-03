export default function PlatformDemo() {
  return (
    <div className="p-4 bg-white rounded-2xl shadow overflow-y-auto">
      <h3 className="text-xl font-bold mb-4">⚙️ پنل مدیریت</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-xl text-center"><p className="text-sm">کاربران</p><p className="text-2xl font-bold">۱۲۰</p></div>
        <div className="bg-green-100 p-4 rounded-xl text-center"><p className="text-sm">سفارش‌ها</p><p className="text-2xl font-bold">۴۳</p></div>
        <div className="bg-yellow-100 p-4 rounded-xl text-center"><p className="text-sm">درآمد</p><p className="text-2xl font-bold">۱۲ میلیون</p></div>
      </div>
      <div className="border rounded-xl p-4">
        <h4 className="font-semibold mb-2">فعالیت‌های اخیر</h4>
        <ul className="text-sm space-y-1">
          <li>• ثبت‌نام کاربر جدید (علی رضایی)</li>
          <li>• سفارش #۲۳۴۲ ثبت شد</li>
          <li>• پرداخت موفق به مبلغ ۴۵۰,۰۰۰ تومان</li>
          <li>• بروزرسانی محصول «کتاب React»</li>
        </ul>
      </div>
    </div>
  );
}

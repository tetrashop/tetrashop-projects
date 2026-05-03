export default function FinanceDemo({ productId }: { productId: string }) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <h3 className="text-xl font-bold mb-4">📈 داشبورد مالی</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl"><p className="text-sm text-gray-600">موجودی</p><p className="text-2xl font-bold">۲٬۵۰۰٬۰۰۰ ریال</p></div>
        <div className="bg-green-50 p-4 rounded-xl"><p className="text-sm text-gray-600">معاملات امروز</p><p className="text-2xl font-bold">۱۲</p></div>
      </div>
      <div className="mt-6 flex items-end gap-2 h-32">
        {[40,70,45,90,65,80,50].map((h, i) => (
          <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
      <p className="text-center text-sm text-gray-500 mt-2">نمودار قیمت هفتگی</p>
    </div>
  );
}
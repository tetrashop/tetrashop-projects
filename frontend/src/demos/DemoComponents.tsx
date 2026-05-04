import BotDemo from './BotDemo';
import ChessDemo from './ChessDemo';
import AiDemo from './AiDemo';
import FinanceDemo from './FinanceDemo';
import PlatformDemo from './PlatformDemo';
import digitalProducts from '../data/digitalProducts.json';

const categoryMap: Record<string, React.FC> = {
  bot: BotDemo,
  game: ChessDemo,
  ai: AiDemo,
  finance: FinanceDemo,
  platform: PlatformDemo,
  management: PlatformDemo,
};

export default function DemoComponent({ productId }: { productId: string }) {
  const product = (digitalProducts as Array<{ id: string; category: string; name: string }>).find(p => p.id === productId);

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">⚠️ محصول یافت نشد.</p>
        <p className="text-gray-400 text-sm mt-2">شناسه محصول: {productId}</p>
      </div>
    );
  }

  const Demo = categoryMap[product.category] || null;

  return (
    <div className="mt-4">
      {Demo ? (
        <>
          <div className="mb-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              پیش‌نمایش زنده: <span className="text-emerald-600">{product.name}</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">این یک نسخه آزمایشی تعاملی است. برای استفاده کامل، محصول را خریداری نمایید.</p>
          </div>
          <Demo />
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">نسخه نمایشی برای این دسته آماده نیست.</p>
        </div>
      )}
    </div>
  );
}

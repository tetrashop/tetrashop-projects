import BotDemo from './BotDemo';
import ChessDemo from './ChessDemo';
import AiDemo from './AiDemo';
import FinanceDemo from './FinanceDemo';
import PlatformDemo from './PlatformDemo';
import digitalProducts from '../data/digitalProducts.json';

export default function DemoComponent({ productId }: { productId: string }) {
  const product = (digitalProducts as Array<{ id: string; category: string }>).find(p => p.id === productId);
  if (!product) return <p className="text-red-500 text-center mt-4">محصول یافت نشد.</p>;
  const cat = product.category;

  if (cat === 'bot') return <BotDemo />;
  if (cat === 'game') return <ChessDemo />;
  if (cat === 'ai') return <AiDemo />;
  if (cat === 'finance') return <FinanceDemo />;
  if (cat === 'platform' || cat === 'management') return <PlatformDemo />;
  return <p className="text-center mt-8 text-gray-500">نسخه نمایشی برای این محصول آماده نیست.</p>;
}

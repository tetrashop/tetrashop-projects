import { useState } from 'react';

const positiveWords = ['خوب', 'عالی', 'فوق‌العاده', 'دوست', 'شاد', 'ممنون', 'متشکر'];
const negativeWords = ['بد', 'ضعیف', 'ناراحت', 'عصبانی', 'متنفر', 'خسته'];

function analyze(text: string) {
  const words = text.split(/\s+/);
  let score = 0;
  words.forEach(w => {
    if (positiveWords.includes(w)) score++;
    if (negativeWords.includes(w)) score--;
  });
  const sentiment = score > 0 ? 'مثبت 😊' : score < 0 ? 'منفی 😞' : 'خنثی 😐';
  const keywords = words.filter(w => w.length > 2).slice(0, 5).join('، ') || 'بدون کلمه کلیدی';
  return { sentiment, keywords };
}

export default function AiDemo() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ sentiment: string; keywords: string } | null>(null);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h3 className="text-center font-bold text-lg mb-4">🧠 تحلیل احساسات فارسی</h3>
      <textarea
        rows={4}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="متن خود را اینجا بنویسید..."
        className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
      />
      <button
        onClick={() => setResult(analyze(text))}
        disabled={!text.trim()}
        className="mt-3 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white py-2 rounded-xl font-medium transition"
      >
        تحلیل کن
      </button>
      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-2">
          <p className="font-semibold">نتیجه:</p>
          <p className="text-lg">{result.sentiment}</p>
          <p className="text-sm text-gray-500">کلمات کلیدی: {result.keywords}</p>
        </div>
      )}
    </div>
  );
}

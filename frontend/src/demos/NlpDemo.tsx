import { useState } from 'react';

function analyze(text: string) {
  const sentiment = Math.random() > 0.4 ? 'مثبت' : 'منفی';
  const keywords = text.split(/\s+/).filter(w => w.length > 2).slice(0, 3).join('، ') || '(بدون کلمه)';
  return `احساس: ${sentiment} – کلمات کلیدی: ${keywords}`;
}

export default function NlpDemo() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-2xl shadow">
      <textarea rows={4} value={text} onChange={e => setText(e.target.value)}
        placeholder="متن فارسی برای تحلیل احساسات..." className="w-full border rounded-xl p-3" />
      <button onClick={() => setResult(analyze(text))}
        className="mt-3 bg-purple-600 text-white px-6 py-2 rounded-xl">تحلیل</button>
      {result && <p className="mt-4 p-3 bg-gray-100 rounded-xl">{result}</p>}
    </div>
  );
}

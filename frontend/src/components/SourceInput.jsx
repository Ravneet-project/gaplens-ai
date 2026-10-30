
import { useState } from 'react';

export default function SourceInput({ onAnalyze }) {
  const [question, setQuestion] = useState('');
  const [urls, setUrls] = useState(['', '']);

  const updateUrl = (index, value) => {
    setUrls(prev => prev.map((url, i) => i === index ? value : url));
  };

  const addUrl = () => {
    if (urls.length < 5) setUrls(prev => [...prev, '']);
  };

  const removeUrl = index => {
    setUrls(prev => prev.filter((_, i) => i !== index));
  };

  const submit = e => {
    e.preventDefault();

    const validUrls = urls.map(u => u.trim()).filter(Boolean);

    if (!question.trim() || validUrls.length === 0) {
      alert('Please enter a research question and at least one URL.');
      return;
    }

    onAnalyze({
      question: question.trim(),
      urls: validUrls
    });
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-[28px] p-6 md:p-8 border border-purple-100 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-xl font-extrabold mb-2">
          Start a new investigation 🔎
        </h3>
        <p className="text-sm text-gray-400">
          Ask a question and add the sources you want to investigate.
        </p>
      </div>

      <label className="block text-sm font-bold mb-2">
        Your research question
      </label>

      <textarea
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="What are the eligibility requirements for international scholarships?"
        className="w-full h-28 p-4 border border-gray-200 rounded-2xl resize-none outline-none focus:border-[#7765e3] focus:ring-4 focus:ring-purple-50 text-sm"
      />

      <div className="flex items-center justify-between mt-5 mb-3">
        <label className="text-sm font-bold">
          Research sources
        </label>
        <span className="text-xs text-gray-400">
          Maximum 5 URLs
        </span>
      </div>

      <div className="space-y-3">
        {urls.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 focus-within:border-[#7765e3]">
              <i className="bi bi-link-45deg text-gray-400 text-xl"></i>

              <input
                type="url"
                value={url}
                onChange={e => updateUrl(index, e.target.value)}
                placeholder="https://example.com/article"
                className="w-full min-w-0 py-3.5 text-sm outline-none"
              />
            </div>

            {urls.length > 1 && (
              <button
                type="button"
                onClick={() => removeUrl(index)}
                className="text-gray-400 hover:text-red-500 p-2"
                aria-label="Remove source"
              >
                <i className="bi bi-trash3 text-lg"></i>
              </button>
            )}
          </div>
        ))}
      </div>

      {urls.length < 5 && (
        <button
          type="button"
          onClick={addUrl}
          className="flex items-center gap-2 text-[#7765e3] text-sm font-bold mt-4"
        >
          <i className="bi bi-plus-lg"></i>
          Add another source
        </button>
      )}

      <button
        type="submit"
        className="w-full mt-7 bg-[#7765e3] hover:bg-[#6352d1] text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-purple-200"
      >
        Analyze Information Gaps
        <i className="bi bi-arrow-right"></i>
      </button>
    </form>
  );
}

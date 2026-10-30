
import { useEffect, useState } from 'react';

import {
  getResearchHistory,
  deleteResearchHistory,
  clearResearchHistory
} from '../utils/researchHistory';

// ========================================
// Research History Page
// ========================================

export default function History({
  onViewResult,
  onNewResearch
}) {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');

  const loadHistory = () => {
    setHistory(getResearchHistory());
  };

  useEffect(() => {
    loadHistory();

    window.addEventListener(
      'gaplens:history-updated',
      loadHistory
    );

    window.addEventListener(
      'storage',
      loadHistory
    );

    return () => {
      window.removeEventListener(
        'gaplens:history-updated',
        loadHistory
      );

      window.removeEventListener(
        'storage',
        loadHistory
      );
    };
  }, []);

  // ========================================
  // Filter Research
  // ========================================

  const filteredHistory = history.filter(item =>
    String(item.question || '')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ========================================
  // Delete Single Research
  // ========================================

  const handleDelete = id => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this investigation?'
    );

    if (!confirmed) return;

    deleteResearchHistory(id);
    loadHistory();
  };

  // ========================================
  // Clear All Research
  // ========================================

  const handleClearAll = () => {
    const confirmed = window.confirm(
      'Delete all saved investigations? This cannot be undone.'
    );

    if (!confirmed) return;

    clearResearchHistory();
    loadHistory();
  };

  return (
    <div className="max-w-[1450px] mx-auto space-y-6 pb-10">

      {/* ====================================
          HEADER
      ==================================== */}

      <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[#eee9ff] via-[#f3eeff] to-[#e1f8ef] p-6 sm:p-9">

        <div className="relative z-10">

          <span className="inline-flex items-center gap-2 bg-white/80 text-[#7765e3] px-4 py-2 rounded-full text-xs font-bold">
            <i className="bi bi-clock-history" />
            Your Investigation Library
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold mt-5">
            Research History 📚
          </h1>

          <p className="text-gray-600 text-sm leading-7 mt-3 max-w-2xl">
            Revisit your completed investigations, explore
            discovered information gaps and review your
            source-backed findings.
          </p>

          <button
            type="button"
            onClick={onNewResearch}
            className="mt-6 bg-[#7765e3] hover:bg-[#6553d5] text-white px-6 py-3 rounded-2xl text-sm font-bold transition-colors"
          >
            <i className="bi bi-plus-circle mr-2" />
            New Investigation
          </button>

        </div>

        <div className="absolute -right-8 -bottom-12 text-[150px] opacity-10 pointer-events-none">
          🔎
        </div>

      </section>

      {/* ====================================
          HISTORY TOOLBAR
      ==================================== */}

      <section className="bg-white border border-purple-100 rounded-[26px] p-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>
            <h2 className="font-extrabold text-lg">
              Saved Investigations
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              {history.length} completed investigation(s)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            <div className="relative">

              <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search investigations..."
                className="w-full sm:w-64 bg-[#f8f7ff] border border-purple-100 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-[#7765e3]"
              />

            </div>

            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="bg-red-50 text-red-500 hover:bg-red-100 px-4 py-3 rounded-xl text-xs font-bold"
              >
                <i className="bi bi-trash3 mr-2" />
                Clear All
              </button>
            )}

          </div>

        </div>

      </section>

      {/* ====================================
          EMPTY STATE
      ==================================== */}

      {history.length === 0 ? (

        <section className="bg-white border border-purple-100 rounded-[28px] p-10 sm:p-16 text-center">

          <div className="w-20 h-20 bg-[#eee9ff] rounded-[25px] flex items-center justify-center mx-auto mb-6">
            <i className="bi bi-clock-history text-4xl text-[#7765e3]" />
          </div>

          <h2 className="text-2xl font-extrabold">
            No investigations yet
          </h2>

          <p className="text-gray-400 text-sm leading-7 mt-3 max-w-md mx-auto">
            Your completed research analyses will appear
            here automatically after successful AI analysis.
          </p>

          <button
            type="button"
            onClick={onNewResearch}
            className="mt-7 bg-[#7765e3] text-white px-7 py-4 rounded-2xl font-bold"
          >
            <i className="bi bi-search mr-2" />
            Start an Investigation
          </button>

        </section>

      ) : filteredHistory.length === 0 ? (

        <section className="bg-white border border-purple-100 rounded-[28px] p-10 text-center">

          <i className="bi bi-search text-4xl text-[#7765e3]" />

          <h3 className="font-extrabold mt-4">
            No matching investigations
          </h3>

          <p className="text-gray-400 text-sm mt-2">
            Try searching with a different keyword.
          </p>

        </section>

      ) : (

        <section className="grid md:grid-cols-2 gap-5">

          {filteredHistory.map((item, index) => {

            const sources = Array.isArray(item.sources)
              ? item.sources
              : [];

            const gaps = Array.isArray(item.analysis?.gaps)
              ? item.analysis.gaps
              : [];

            const conflicts = Array.isArray(
              item.analysis?.conflicts
            )
              ? item.analysis.conflicts
              : [];

            return (

              <article
                key={item.id || index}
                className="bg-white border border-purple-100 rounded-[28px] p-5 sm:p-6 hover:shadow-lg transition-shadow flex flex-col"
              >

                <div className="flex items-start justify-between gap-3 mb-5">

                  <div className="w-12 h-12 bg-[#eee9ff] rounded-2xl flex items-center justify-center">
                    <i className="bi bi-search text-xl text-[#7765e3]" />
                  </div>

                  <span className="bg-[#e1f8ef] text-[#319b75] rounded-full px-3 py-2 text-xs font-bold">
                    <i className="bi bi-check-circle-fill mr-1" />
                    Completed
                  </span>

                </div>

                <h3 className="font-extrabold text-base leading-7 break-words">
                  {item.question}
                </h3>

                <p className="text-sm text-gray-500 leading-6 mt-3 line-clamp-3">
                  {item.analysis?.summary ||
                    'Research analysis completed.'}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-6">

                  <div className="bg-[#f8f7ff] rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold text-[#7765e3]">
                      {sources.filter(
                        source => source.status === 'success'
                      ).length}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Sources
                    </p>
                  </div>

                  <div className="bg-[#fff8e9] rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold text-[#d49a29]">
                      {gaps.length}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Gaps
                    </p>
                  </div>

                  <div className="bg-[#fff0f3] rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold text-[#e66b88]">
                      {conflicts.length}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Conflicts
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-2 mt-5 text-xs text-gray-400">
                  <i className="bi bi-calendar3" />

                  {new Date(
                    item.savedAt || item.analyzedAt || Date.now()
                  ).toLocaleString()}
                </div>

                <div className="flex items-center gap-3 mt-auto pt-6">

                  <button
                    type="button"
                    onClick={() => onViewResult(item)}
                    className="flex-1 bg-[#7765e3] hover:bg-[#6553d5] text-white px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors"
                  >
                    <i className="bi bi-eye mr-2" />
                    View Results
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="w-12 h-12 shrink-0 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl flex items-center justify-center"
                    title="Delete investigation"
                    aria-label="Delete investigation"
                  >
                    <i className="bi bi-trash3" />
                  </button>

                </div>

              </article>

            );
          })}

        </section>

      )}

    </div>
  );
}

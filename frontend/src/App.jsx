
import { useState } from 'react';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import Research from './pages/Research';
import History from './pages/History';

import { saveResearchHistory } from './utils/researchHistory';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://gaplens-ai-backend.onrender.com';

// Reusable heading
function SectionHeading({ icon, title, count, color = '#eee9ff' }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className="w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <i className={`bi ${icon} text-xl text-[#7765e3]`} />
      </div>

      <h3 className="text-lg font-extrabold flex-1">
        {title}
      </h3>

      {typeof count === 'number' && (
        <span className="bg-[#eee9ff] text-[#7765e3] px-3 py-1 rounded-full text-xs font-bold">
          {count}
        </span>
      )}
    </div>
  );
}

// Priority badge
function PriorityBadge({ priority }) {
  const value = String(priority || 'review').toLowerCase();

  const styles = {
    high: 'bg-red-100 text-red-600',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-green-100 text-green-700'
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-bold capitalize ${
        styles[value] || 'bg-gray-100 text-gray-600'
      }`}
    >
      {value} priority
    </span>
  );
}

// Evidence references
function SourceReferences({ ids, sources }) {
  if (!Array.isArray(ids) || !ids.length) {
    return (
      <p className="text-xs text-amber-600 mt-3">
        <i className="bi bi-exclamation-circle mr-1" />
        No source reference provided.
      </p>
    );
  }

  const references = [...new Set(ids.map(Number))]
    .map(id => {
      const source = sources.find(
        item =>
          Number(item.sourceId) === id &&
          item.status === 'success'
      );

      return source
        ? {
            id,
            url: source.url,
            title: source.title
          }
        : null;
    })
    .filter(Boolean);

  if (!references.length) {
    return (
      <p className="text-xs text-amber-600 mt-3">
        Source reference could not be matched.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {references.map(source => (
        <a
          key={source.id}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          title={source.title}
          className="inline-flex items-center gap-2 bg-[#eee9ff] text-[#7765e3] px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#ded5ff] transition-colors"
        >
          <i className="bi bi-link-45deg" />
          Source {source.id}
          <i className="bi bi-box-arrow-up-right" />
        </a>
      ))}
    </div>
  );
}

// Reusable result card
function FindingCard({ item, sources, variant = 'gap' }) {
  const variants = {
    gap: 'bg-[#fffbf1] border-[#f8e8bd]',
    conflict: 'bg-[#fff5f7] border-[#ffdde5]',
    fact: 'bg-[#f4fcf8] border-[#dcefe4]',
    warning: 'bg-[#fffaf0] border-[#f8e8bd]'
  };

  return (
    <article
      className={`rounded-2xl border p-5 ${
        variants[variant] || variants.gap
      }`}
    >
      {item.priority && (
        <div className="mb-3">
          <PriorityBadge priority={item.priority} />
        </div>
      )}

      {item.title && (
        <h4 className="font-extrabold text-[#20243a] mb-2">
          {item.title}
        </h4>
      )}

      <p className="text-sm text-gray-600 leading-7 break-words">
        {item.description || item.claim || 'No description available.'}
      </p>

      <SourceReferences
        ids={item.sourceIds}
        sources={sources}
      />
    </article>
  );
}

// Complete Results UI
function ResultsDashboard({ result, onNewResearch }) {
  const analysis = result?.analysis || {};
  const sources = Array.isArray(result?.sources)
    ? result.sources
    : [];

  const facts = Array.isArray(analysis.keyFacts)
    ? analysis.keyFacts
    : [];

  const gaps = Array.isArray(analysis.gaps)
    ? analysis.gaps
    : [];

  const conflicts = Array.isArray(analysis.conflicts)
    ? analysis.conflicts
    : [];

  const warnings = Array.isArray(analysis.outdatedWarnings)
    ? analysis.outdatedWarnings
    : [];

  const checklist = Array.isArray(analysis.checklist)
    ? analysis.checklist
    : [];

  const reviewedSources = sources.filter(
    source => source.status === 'success'
  );

  const stats = [
    {
      title: 'Sources Reviewed',
      value: reviewedSources.length,
      icon: 'bi-files',
      bg: '#e1f8ef',
      color: '#319b75'
    },
    {
      title: 'Potential Gaps',
      value: gaps.length,
      icon: 'bi-puzzle-fill',
      bg: '#fff2d5',
      color: '#c58c24'
    },
    {
      title: 'Possible Conflicts',
      value: conflicts.length,
      icon: 'bi-intersect',
      bg: '#ffe4eb',
      color: '#e66b88'
    },
    {
      title: 'Key Findings',
      value: facts.length,
      icon: 'bi-check-circle',
      bg: '#eee9ff',
      color: '#7765e3'
    }
  ];

  return (
    <div
      id="analysis-results"
      className="max-w-[1450px] mx-auto space-y-6 pb-10"
    >
      {/* Results Hero */}
      <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[#eee9ff] via-[#f4efff] to-[#e1f8ef] p-6 sm:p-9">

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/90 text-[#319b75] px-4 py-2 rounded-full text-xs font-bold">
            <i className="bi bi-check-circle-fill" />
            Investigation Completed
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold mt-5">
            Investigation Results 🔎
          </h2>

          <p className="font-bold text-[#7765e3] mt-3 break-words">
            {result.question}
          </p>

          <p className="text-gray-600 text-sm leading-7 mt-4 max-w-3xl">
            {analysis.summary ||
              'Analysis completed. Review the findings below.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <button
              type="button"
              onClick={onNewResearch}
              className="bg-[#7765e3] text-white px-5 py-3 rounded-2xl text-sm font-bold hover:bg-[#6553d5] transition-colors"
            >
              <i className="bi bi-plus-circle mr-2" />
              New Investigation
            </button>

            {result.analyzedAt && (
              <span className="text-xs text-gray-500">
                <i className="bi bi-calendar-check mr-2" />
                {new Date(result.analyzedAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {stats.map(stat => (
          <div
            key={stat.title}
            className="bg-white border border-purple-100 rounded-[25px] p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: stat.bg }}
            >
              <i
                className={`bi ${stat.icon} text-xl`}
                style={{ color: stat.color }}
              />
            </div>

            <p className="text-xs sm:text-sm text-gray-500">
              {stat.title}
            </p>

            <p className="text-3xl font-extrabold mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* Information Gaps */}
      <section className="bg-white border border-purple-100 rounded-[28px] p-5 sm:p-7">
        <SectionHeading
          icon="bi-puzzle-fill"
          title="Potential Information Gaps"
          count={gaps.length}
          color="#fff2d5"
        />

        {gaps.length ? (
          <div className="grid md:grid-cols-2 gap-4">
            {gaps.map((gap, index) => (
              <FindingCard
                key={index}
                item={gap}
                sources={sources}
                variant="gap"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No potential information gaps identified in the reviewed sources.
          </p>
        )}
      </section>

      {/* Conflicts */}
      <section className="bg-white border border-purple-100 rounded-[28px] p-5 sm:p-7">
        <SectionHeading
          icon="bi-intersect"
          title="Possible Conflicting Claims"
          count={conflicts.length}
          color="#ffe4eb"
        />

        {conflicts.length ? (
          <div className="space-y-4">
            {conflicts.map((item, index) => (
              <FindingCard
                key={index}
                item={item}
                sources={sources}
                variant="conflict"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No possible contradictions were identified.
          </p>
        )}
      </section>

      {/* Facts */}
      <section className="bg-white border border-purple-100 rounded-[28px] p-5 sm:p-7">
        <SectionHeading
          icon="bi-shield-check"
          title="Source-Backed Findings"
          count={facts.length}
          color="#e1f8ef"
        />

        {facts.length ? (
          <div className="space-y-4">
            {facts.map((fact, index) => (
              <FindingCard
                key={index}
                item={fact}
                sources={sources}
                variant="fact"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No source-backed findings were returned.
          </p>
        )}
      </section>

      {/* Outdated Information */}
      {warnings.length > 0 && (
        <section className="bg-white border border-purple-100 rounded-[28px] p-5 sm:p-7">
          <SectionHeading
            icon="bi-calendar-x"
            title="Potentially Outdated Information"
            count={warnings.length}
            color="#fff2d5"
          />

          <div className="space-y-4">
            {warnings.map((warning, index) => (
              <FindingCard
                key={index}
                item={warning}
                sources={sources}
                variant="warning"
              />
            ))}
          </div>
        </section>
      )}

      {/* Verification Checklist */}
      <section className="bg-white border border-purple-100 rounded-[28px] p-5 sm:p-7">
        <SectionHeading
          icon="bi-list-check"
          title="What Should You Verify Next?"
          count={checklist.length}
        />

        {checklist.length ? (
          <div className="space-y-3">
            {checklist.map((item, index) => (
              <label
                key={index}
                className="flex items-start gap-3 bg-[#f8f7ff] rounded-2xl p-4 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 accent-[#7765e3]"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm break-words">
                    {item.task}
                  </p>

                  <p className="text-xs text-gray-500 leading-6 mt-2">
                    {item.reason}
                  </p>

                  <div className="mt-3">
                    <PriorityBadge priority={item.priority} />
                  </div>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No verification tasks were generated.
          </p>
        )}
      </section>

      {/* Source List */}
      <section className="bg-white border border-purple-100 rounded-[28px] p-5 sm:p-7">
        <SectionHeading
          icon="bi-link-45deg"
          title="Research Sources"
          count={sources.length}
          color="#e1f8ef"
        />

        <div className="space-y-3">
          {sources.map((source, index) => (
            <div
              key={source.sourceId || index}
              className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#f8f7ff] rounded-2xl p-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm break-words">
                  Source {source.sourceId || index + 1}: {source.title}
                </p>

                <p className="text-xs text-gray-400 mt-2 break-all">
                  {source.url}
                </p>

                <span
                  className={`inline-block mt-3 text-xs font-bold ${
                    source.status === 'success'
                      ? 'text-green-600'
                      : 'text-red-500'
                  }`}
                >
                  <i
                    className={`bi ${
                      source.status === 'success'
                        ? 'bi-check-circle'
                        : 'bi-exclamation-circle'
                    } mr-1`}
                  />

                  {source.status === 'success'
                    ? 'Reviewed'
                    : 'Unavailable'}
                </span>

                {source.error && (
                  <p className="text-xs text-red-500 mt-2">
                    {source.error}
                  </p>
                )}
              </div>

              {source.status === 'success' && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7765e3] font-bold text-xs shrink-0"
                >
                  Open Source
                  <i className="bi bi-box-arrow-up-right ml-2" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Uncertainty */}
      <section className="bg-[#20243a] text-white rounded-[28px] p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <i className="bi bi-info-circle text-[#ffd779] text-2xl" />

          <h3 className="font-extrabold text-lg">
            AI Analysis & Uncertainty
          </h3>
        </div>

        <p className="text-sm text-white/70 leading-7">
          {analysis.uncertainty ||
            'AI findings may be incomplete. Verify important information against original sources.'}
        </p>

        <p className="text-xs text-white/50 mt-5">
          GapLens AI identifies potential gaps and contradictions.
          Source-backed findings are not independently fact-checked.
        </p>
      </section>
    </div>
  );
}

// Main Application
export default function App() {
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [researchData, setResearchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState('');

  // Navigation
  const handleNavigation = page => {
    setActive(page);
    setSidebarOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Real backend integration
  const handleAnalyze = async data => {
    if (loading) return;

    setResearchData(data);
    setLoading(true);
    setAnalysisError('');
    setAnalysisResult(null);

    try {
      const response = await fetch(
        `${API_URL}/api/research/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Research analysis failed.'
        );
      }

      setAnalysisResult(result);

      // Save completed investigation
      saveResearchHistory(result);

      // Scroll to analysis results
      setTimeout(() => {
        document
          .getElementById('analysis-results')
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
      }, 150);

    } catch (error) {
      console.error('GapLens AI error:', error);

      setAnalysisError(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to the backend. Please start the Node.js server on port 5000.'
          : error.message
      );

    } finally {
      setLoading(false);
    }
  };

  // Open previous research
  const handleViewHistory = item => {
    setResearchData({
      question: item.question,
      urls: item.sources?.map(source => source.url) || []
    });

    setAnalysisResult(item);
    setAnalysisError('');
    setLoading(false);

    handleNavigation('research');

    setTimeout(() => {
      document
        .getElementById('analysis-results')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
    }, 150);
  };

  // Start fresh research
  const handleNewResearch = () => {
    setResearchData(null);
    setAnalysisResult(null);
    setAnalysisError('');
    setLoading(false);

    handleNavigation('research');
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff] text-[#20243a]">

      {/* Sidebar */}
      <Sidebar
        active={active}
        setActive={handleNavigation}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="lg:ml-[280px] min-h-screen">

        <Navbar
          active={active}
          setOpen={setSidebarOpen}
        />

        <main className="px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10 xl:py-9">

          {/* Dashboard */}
          {active === 'dashboard' && (
            <Dashboard setActive={handleNavigation} />
          )}

          {/* Research Lab */}
          {active === 'research' && (
            <div className="space-y-6">

              <Research
                onAnalyze={handleAnalyze}
                loading={loading}
              />

              {/* API Error */}
              {analysisError && (
                <div
                  role="alert"
                  className="max-w-[1450px] mx-auto bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5"
                >
                  <i className="bi bi-exclamation-triangle mr-2" />
                  {analysisError}
                </div>
              )}

              {/* Loading Status */}
              {loading && (
                <div className="max-w-[1450px] mx-auto text-center text-sm text-[#7765e3] font-semibold">
                  <i className="bi bi-arrow-repeat animate-spin inline-block mr-2" />
                  Analyzing {researchData?.urls?.length || 0} research sources...
                </div>
              )}

              {/* Completed Analysis */}
              {analysisResult && (
                <ResultsDashboard
                  result={analysisResult}
                  onNewResearch={handleNewResearch}
                />
              )}
            </div>
          )}

          {/* Research History */}
          {active === 'history' && (
            <History
              onViewResult={handleViewHistory}
              onNewResearch={handleNewResearch}
            />
          )}

        </main>
      </div>
    </div>
  );
}

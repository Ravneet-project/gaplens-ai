
import { useEffect, useState } from 'react';

import DetectiveMascot from '../components/DetectiveMascot';
import StatCard from '../components/StatCard';
import FeatureCard from '../components/FeatureCard';

import { getResearchHistory } from '../utils/researchHistory';

// ========================================
// Dashboard Features
// ========================================

const features = [
  {
    title: 'Spot Information Gaps',
    description:
      'Find important missing details and unanswered questions.',
    icon: 'bi-puzzle-fill',
    background: '#fff2d5',
    iconColor: '#d49a29'
  },
  {
    title: 'Compare Claims',
    description:
      'Reveal conflicting information across different sources.',
    icon: 'bi-intersect',
    background: '#ffe4eb',
    iconColor: '#e66b88'
  },
  {
    title: 'Verify the Evidence',
    description:
      'Explore source references and create an action checklist.',
    icon: 'bi-shield-check',
    background: '#dff7ed',
    iconColor: '#2eaa80'
  }
];

// ========================================
// Calculate Real Statistics
// ========================================

function calculateStats(history) {
  const records = Array.isArray(history)
    ? history.filter(item => item?.success === true)
    : [];

  return {
    investigations: records.length,

    sources: records.reduce((total, item) => {
      const sources = Array.isArray(item.sources)
        ? item.sources
        : [];

      return total + sources.filter(
        source => source.status === 'success'
      ).length;
    }, 0),

    gaps: records.reduce((total, item) => {
      return total + (
        Array.isArray(item.analysis?.gaps)
          ? item.analysis.gaps.length
          : 0
      );
    }, 0),

    conflicts: records.reduce((total, item) => {
      return total + (
        Array.isArray(item.analysis?.conflicts)
          ? item.analysis.conflicts.length
          : 0
      );
    }, 0)
  };
}

// ========================================
// Dashboard Component
// ========================================

export default function Dashboard({ setActive }) {
  const [stats, setStats] = useState({
    investigations: 0,
    sources: 0,
    gaps: 0,
    conflicts: 0
  });

  const [recentResearch, setRecentResearch] = useState([]);

  useEffect(() => {
    const refreshDashboard = () => {
      const history = getResearchHistory();

      setStats(calculateStats(history));
      setRecentResearch(history.slice(0, 3));
    };

    refreshDashboard();

    window.addEventListener('focus', refreshDashboard);
    window.addEventListener('storage', refreshDashboard);
    window.addEventListener(
      'gaplens:history-updated',
      refreshDashboard
    );

    return () => {
      window.removeEventListener('focus', refreshDashboard);
      window.removeEventListener('storage', refreshDashboard);
      window.removeEventListener(
        'gaplens:history-updated',
        refreshDashboard
      );
    };
  }, []);

  return (
    <div className="max-w-[1450px] mx-auto space-y-7 pb-8">

      {/* ====================================
          HERO SECTION
      ==================================== */}

      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#f0ebff] via-[#eee8ff] to-[#ddd3ff]">

        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/30 rounded-full blur-3xl" />

        <div className="absolute -bottom-20 right-0 w-80 h-80 bg-[#c7b9ff]/40 rounded-full blur-3xl" />

        <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] items-center">

          <div className="p-7 sm:p-10 xl:p-14">

            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-[#7765e3] text-xs font-bold mb-6">
              <i className="bi bi-stars" />
              Your friendly AI research detective
            </span>

            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold leading-[1.2] tracking-tight">
              Uncover what
              <span className="block text-[#7765e3]">
                others overlook.
              </span>
            </h1>

            <p className="text-gray-600 text-sm sm:text-base leading-7 mt-5 max-w-lg">
              Research smarter with GapLens AI. Discover missing
              information, compare conflicting claims and find
              exactly what to verify next.
            </p>

            <div className="flex flex-wrap gap-3 mt-7">

              <button
                type="button"
                onClick={() => setActive('research')}
                className="bg-[#7765e3] hover:bg-[#6553d5] text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-purple-200 transition-all hover:-translate-y-1"
              >
                Start investigating
                <i className="bi bi-arrow-right ml-3" />
              </button>

              <button
                type="button"
                onClick={() => setActive('history')}
                className="bg-white/90 text-[#20243a] px-6 py-4 rounded-2xl font-bold hover:bg-white transition-all"
              >
                <i className="bi bi-clock-history mr-2" />
                My research
              </button>

            </div>

          </div>

          <div className="relative min-h-[280px] lg:min-h-[390px] flex items-center justify-center">
            <span className="absolute top-10 left-8 text-3xl animate-pulse">✨</span>
            <span className="absolute top-14 right-10 text-3xl">⭐</span>
            <span className="absolute bottom-14 left-10 text-3xl">🧩</span>

            <DetectiveMascot />
          </div>

        </div>
      </section>

      {/* ====================================
          REAL STATISTICS
      ==================================== */}

      <section>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">

          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Research overview
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Your completed investigations at a glance.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 text-xs bg-[#e0f7ed] text-[#319b75] px-3 py-2 rounded-full font-bold">
            <i className="bi bi-check-circle-fill" />
            Live statistics
          </span>

        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">

          <StatCard
            title="Investigations"
            value={stats.investigations}
            icon="bi-search"
            subtitle="Completed research"
          />

          <StatCard
            title="Sources reviewed"
            value={stats.sources}
            icon="bi-files"
            background="#e0f7ed"
            color="#319b75"
            subtitle="Successfully analyzed"
          />

          <StatCard
            title="Gaps discovered"
            value={stats.gaps}
            icon="bi-puzzle-fill"
            background="#fff2d5"
            color="#d49a29"
            subtitle="Potential gaps found"
          />

          <StatCard
            title="Conflicts detected"
            value={stats.conflicts}
            icon="bi-exclamation-triangle"
            background="#ffe4eb"
            color="#e66b88"
            subtitle="Possible contradictions"
          />

        </div>
      </section>

      {/* ====================================
          DETECTIVE TOOLKIT
      ==================================== */}

      <section>

        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-extrabold">
            Your detective toolkit 🧩
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Powerful tools to discover the missing pieces.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">

          {features.map(feature => (
            <FeatureCard
              key={feature.title}
              {...feature}
              onClick={() => setActive('research')}
            />
          ))}

        </div>

      </section>

      {/* ====================================
          RECENT INVESTIGATIONS
      ==================================== */}

      <section className="bg-white border border-purple-100 rounded-[28px] p-5 sm:p-7">

        <div className="flex items-center justify-between gap-3 mb-6">

          <div>
            <h2 className="text-lg sm:text-xl font-extrabold">
              Recent investigations 🔎
            </h2>

            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Your latest completed research.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActive('history')}
            className="text-[#7765e3] text-xs sm:text-sm font-bold shrink-0"
          >
            View all
            <i className="bi bi-arrow-right ml-2" />
          </button>

        </div>

        {recentResearch.length === 0 ? (

          <div className="text-center py-10 bg-[#f8f7ff] rounded-2xl">

            <div className="w-16 h-16 bg-[#eee9ff] rounded-2xl mx-auto flex items-center justify-center mb-4">
              <i className="bi bi-search text-3xl text-[#7765e3]" />
            </div>

            <h3 className="font-extrabold">
              No investigations yet
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              Start your first research to see results here.
            </p>

            <button
              type="button"
              onClick={() => setActive('research')}
              className="mt-5 bg-[#7765e3] text-white px-5 py-3 rounded-xl text-sm font-bold"
            >
              Start researching
            </button>

          </div>

        ) : (

          <div className="space-y-3">

            {recentResearch.map((item, index) => (

              <div
                key={item.id || index}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f8f7ff] rounded-2xl p-4 sm:p-5"
              >

                <div className="min-w-0 flex-1">

                  <p className="font-bold text-sm break-words">
                    {item.question}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-3">

                    <span>
                      <i className="bi bi-link-45deg mr-1" />
                      {(item.sources || []).filter(
                        source => source.status === 'success'
                      ).length} sources
                    </span>

                    <span>
                      <i className="bi bi-puzzle mr-1" />
                      {item.analysis?.gaps?.length || 0} gaps
                    </span>

                    <span>
                      <i className="bi bi-calendar3 mr-1" />
                      {new Date(
                        item.savedAt || item.analyzedAt || Date.now()
                      ).toLocaleDateString()}
                    </span>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => setActive('history')}
                  className="shrink-0 text-[#7765e3] text-xs font-bold bg-white border border-purple-100 px-4 py-3 rounded-xl"
                >
                  View research
                  <i className="bi bi-arrow-right ml-2" />
                </button>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* ====================================
          HOW IT WORKS
      ==================================== */}

      <section className="grid lg:grid-cols-[1.3fr_0.7fr] gap-5">

        <div className="bg-white rounded-[28px] border border-purple-100 p-6 sm:p-8">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-12 h-12 bg-[#eee9ff] rounded-2xl flex items-center justify-center">
              <i className="bi bi-lightbulb text-2xl text-[#7765e3]" />
            </div>

            <div>
              <h3 className="font-extrabold text-lg">
                How it works
              </h3>
              <p className="text-xs text-gray-400">
                Three simple steps
              </p>
            </div>

          </div>

          <div className="space-y-5">

            {[
              ['01', 'Ask your question', 'Enter a topic or research goal.'],
              ['02', 'Add your sources', 'Provide relevant websites to investigate.'],
              ['03', 'Discover the gaps', 'Review evidence, conflicts and next steps.']
            ].map(([number, title, description]) => (

              <div key={number} className="flex gap-4 items-start">

                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#f0ebff] text-[#7765e3] flex items-center justify-center font-extrabold text-sm">
                  {number}
                </div>

                <div>
                  <h4 className="font-bold text-sm">
                    {title}
                  </h4>

                  <p className="text-gray-400 text-sm mt-1">
                    {description}
                  </p>
                </div>

              </div>

            ))}

          </div>

        </div>

        <div className="relative overflow-hidden bg-[#20243a] rounded-[28px] p-7 sm:p-8 text-white flex flex-col justify-between">

          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-[#7765e3]/30 blur-2xl" />

          <div className="relative">

            <span className="text-4xl">💡</span>

            <h3 className="text-2xl font-extrabold mt-5 mb-3">
              Stay curious.
              <br />
              Think deeper.
            </h3>

            <p className="text-sm text-white/60 leading-7">
              The most valuable insight might be the question
              nobody thought to ask.
            </p>

          </div>

          <button
            type="button"
            onClick={() => setActive('research')}
            className="relative mt-8 bg-white text-[#20243a] rounded-2xl px-5 py-3 font-bold text-sm w-fit"
          >
            Explore Research Lab
            <i className="bi bi-arrow-up-right ml-2" />
          </button>

        </div>

      </section>

    </div>
  );
}

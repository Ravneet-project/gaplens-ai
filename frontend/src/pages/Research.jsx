
import { useState } from 'react';
import ResearchHero from '../components/ResearchHero';
import SourceInput from '../components/SourceInput';
import AnalysisLoader from '../components/AnalysisLoader';

export default function Research({ onAnalyze, loading = false }) {
  const [showTips, setShowTips] = useState(true);

  return (
    <div className="max-w-[1450px] mx-auto space-y-6 pb-10">
      <ResearchHero />

      <div className="grid xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.7fr)] gap-5 items-start">

        <div className="min-w-0 space-y-5">
          <SourceInput onAnalyze={onAnalyze} />

          {loading && <AnalysisLoader />}
        </div>

        <aside className="space-y-5">

          <div className="bg-white border border-purple-100 rounded-[28px] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-[#fff2d5] rounded-2xl flex items-center justify-center">
                <i className="bi bi-lightbulb-fill text-[#d49a29] text-xl" />
              </div>
              <div>
                <h3 className="font-extrabold">Research tips</h3>
                <p className="text-xs text-gray-400">Make your analysis better</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className="text-xs font-bold text-[#7765e3] mb-3"
            >
              {showTips ? 'Hide tips' : 'Show tips'}
              <i className={`bi bi-chevron-${showTips ? 'up' : 'down'} ml-2`} />
            </button>

            {showTips && (
              <div className="space-y-4">
                {[
                  'Ask one clear research question.',
                  'Include official and independent sources.',
                  'Compare at least two relevant pages.',
                  'Check source publication dates.'
                ].map((tip, index) => (
                  <div key={tip} className="flex gap-3">
                    <span className="w-7 h-7 shrink-0 rounded-lg bg-[#eee9ff] text-[#7765e3] flex items-center justify-center text-xs font-extrabold">
                      {index + 1}
                    </span>
                    <p className="text-sm text-gray-500 leading-6">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative overflow-hidden rounded-[28px] bg-[#20243a] text-white p-6">
            <div className="absolute -right-10 -bottom-12 w-40 h-40 rounded-full bg-[#7765e3]/40 blur-2xl" />

            <div className="relative">
              <span className="text-3xl">🧠</span>

              <h3 className="font-extrabold text-lg mt-4 mb-3">
                Detective's advice
              </h3>

              <p className="text-sm text-white/65 leading-7">
                Missing information is not always false information.
                Every finding should be checked against its original source.
              </p>
            </div>
          </div>

          <div className="bg-[#e5f7ee] border border-[#d2eddf] rounded-[28px] p-6">
            <div className="flex items-center gap-3 mb-3">
              <i className="bi bi-shield-check text-[#319b75] text-2xl" />
              <h3 className="font-extrabold">Evidence first</h3>
            </div>

            <p className="text-sm text-gray-600 leading-6">
              GapLens separates source-backed findings from AI-generated
              suggestions, so you know what is verified and what needs checking.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

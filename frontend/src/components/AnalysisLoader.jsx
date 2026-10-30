
const steps = [
  ['bi-globe2', 'Reading research sources'],
  ['bi-file-earmark-text', 'Extracting important information'],
  ['bi-intersect', 'Comparing claims and evidence'],
  ['bi-puzzle-fill', 'Finding missing information'],
  ['bi-list-check', 'Preparing verification checklist']
];

export default function AnalysisLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-white rounded-[28px] border border-purple-100 p-6 sm:p-8 shadow-sm"
    >
      <div className="flex items-center gap-4 mb-7">
        <div className="w-14 h-14 rounded-2xl bg-[#eee9ff] flex items-center justify-center">
          <i className="bi bi-stars text-2xl text-[#7765e3] animate-pulse" />
        </div>

        <div>
          <h3 className="text-lg font-extrabold">
            Your detective is investigating...
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Please wait while we analyze your sources.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map(([icon, label], index) => (
          <div
            key={label}
            className="flex items-center gap-3 bg-[#f8f7ff] rounded-2xl p-4"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#7765e3]">
              <i className={`bi ${icon} text-lg`} />
            </div>

            <span className="flex-1 text-sm font-semibold">
              {label}
            </span>

            <div
              className="w-4 h-4 border-2 border-[#dcd5ff] border-t-[#7765e3] rounded-full animate-spin"
              style={{ animationDelay: `${index * 120}ms` }}
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        Analysis time depends on source availability and AI response.
      </p>
    </div>
  );
}

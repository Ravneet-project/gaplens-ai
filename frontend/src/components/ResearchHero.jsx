
import queryMascot from '../assets/images/query.png';

export default function ResearchHero() {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#e7fff4] via-[#f0ecff] to-[#ded5ff] border border-purple-100">

      <div className="absolute -top-20 -right-16 w-72 h-72 bg-[#a9e8d3]/50 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl" />

      <div className="relative grid md:grid-cols-2 items-center gap-4">

        <div className="p-7 sm:p-10 lg:p-12">
          <span className="inline-flex items-center gap-2 bg-white/80 text-[#7765e3] text-xs font-bold px-4 py-2 rounded-full mb-5">
            <i className="bi bi-stars" />
            AI Investigation Studio
          </span>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold leading-tight text-[#20243a]">
            Discover the
            <span className="block text-[#7765e3]">
              missing pieces!
            </span>
          </h1>

          <p className="mt-5 text-gray-600 text-sm sm:text-base leading-7 max-w-lg">
            Ask a research question, compare multiple sources,
            and uncover missing details, conflicting claims,
            and important facts that need verification.
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            {[
              ['bi-search', 'Explore'],
              ['bi-puzzle-fill', 'Detect'],
              ['bi-shield-check', 'Verify']
            ].map(([icon, label]) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 text-xs font-semibold"
              >
                <i className={`bi ${icon} text-[#7765e3]`} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[260px] sm:min-h-[340px] flex items-center justify-center">
          <div className="absolute w-56 h-56 bg-white/40 rounded-full" />

          <span className="absolute top-8 left-10 text-3xl animate-pulse">✨</span>
          <span className="absolute top-10 right-12 text-3xl">🧩</span>

          <img
            src={queryMascot}
            alt="GapLens AI Research Mascot"
            className="relative z-10 w-[210px] sm:w-[260px] lg:w-[290px] h-auto object-contain drop-shadow-2xl mascot-floating"
          />

          <div className="absolute bottom-5 right-5 bg-white px-4 py-2 rounded-full shadow-md text-xs font-bold text-[#7765e3]">
            Let's investigate! ✨
          </div>
        </div>
      </div>
    </section>
  );
}

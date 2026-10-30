
const menu = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
  { id: 'research', label: 'Research Lab', icon: 'bi-search' },
  { id: 'history', label: 'History', icon: 'bi-clock-history' },
];

export default function Sidebar({ active, setActive, open, setOpen }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-screen w-[260px] bg-white
        border-r border-purple-100 z-50 flex flex-col
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#7765e3] text-white flex items-center justify-center shadow-lg shadow-purple-200">
              <i className="bi bi-puzzle-fill text-2xl"></i>
            </div>

            <div>
              <h2 className="font-extrabold text-xl tracking-tight">
                GapLens<span className="text-[#7765e3]">AI</span>
              </h2>
              <p className="text-[10px] text-gray-400 font-semibold tracking-widest">
                RESEARCH DETECTIVE
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <i className="bi bi-x-lg text-xl"></i>
          </button>
        </div>

        <div className="px-4 mt-6">
          <p className="text-xs font-bold text-gray-400 px-4 mb-3">
            WORKSPACE
          </p>

          <nav className="space-y-2">
            {menu.map(item => {
              const selected = active === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActive(item.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all ${
                    selected
                      ? 'bg-[#eee9ff] text-[#7765e3]'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <i className={`bi ${item.icon} text-lg`}></i>
                  {item.label}

                  {selected && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-[#7765e3]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-5">
          <div className="rounded-3xl bg-[#eee9ff] p-5">
            <i className="bi bi-stars text-[#7765e3] text-2xl"></i>

            <h3 className="font-bold text-sm mt-3 mb-2">
              Think beyond answers!
            </h3>

            <p className="text-xs text-gray-500 leading-relaxed">
              Find what's missing, not just what's written.
            </p>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs text-gray-400 mt-5 justify-center"
          >
            <i className="bi bi-github text-base"></i>
            Hackathon Project
          </a>
        </div>
      </aside>
    </>
  );
}

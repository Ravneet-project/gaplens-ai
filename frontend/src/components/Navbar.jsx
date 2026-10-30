
export default function Navbar({ setOpen, active }) {
  const titles = {
    dashboard: 'Dashboard',
    research: 'Research Lab',
    history: 'Research History'
  };

  return (
    <header className="h-[84px] bg-white/80 backdrop-blur-xl border-b border-purple-100 flex items-center justify-between px-5 md:px-9 sticky top-0 z-30">

      <div className="flex items-center gap-4">
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden text-gray-600"
          aria-label="Open sidebar"
        >
          <i className="bi bi-list text-2xl"></i>
        </button>

        <div>
          <p className="text-xs text-gray-400">Your workspace</p>
          <h2 className="font-extrabold text-xl">
            {titles[active]}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-[#e8f8f1] text-[#26946a] rounded-full px-4 py-2 text-xs font-bold">
          <i className="bi bi-stars"></i>
          AI Research Mode
        </div>

        <div className="w-11 h-11 bg-[#ffd779] rounded-2xl flex items-center justify-center font-extrabold">
          G
        </div>
      </div>
    </header>
  );
}

export default function Navbar({setOpen,active}) {
  const labels={dashboard:'My Dashboard',research:'My Research Lab',history:'My Research History'};
  return <header className="reference-navbar sticky top-0 z-30 flex items-center justify-between gap-3 px-4 sm:px-8">
    <div className="flex items-center gap-3"><button type="button" className="lg:hidden text-xl" onClick={()=>setOpen(true)} aria-label="Open navigation"><i className="bi bi-list" /></button><div className="reference-nav-pill"><i className="bi bi-journal-text" /> {labels[active]||labels.dashboard} <i className="bi bi-chevron-right" /></div></div>
    <div className="reference-profile"><span className="reference-cloud" aria-hidden="true">☁️</span><div className="reference-avatar">🔎</div><div className="hidden sm:block"><strong>GapLens AI</strong><small>Little Detective Club</small></div><i className="bi bi-chevron-down" /></div>
  </header>;
}

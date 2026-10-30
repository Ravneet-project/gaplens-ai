const menu = [
  {id:'dashboard',label:'Dashboard',icon:'bi-house-door'},
  {id:'research',label:'Research Lab',icon:'bi-flask'},
  {id:'history',label:'History',icon:'bi-journal-text'},
];
export default function Sidebar({active,setActive,open,setOpen}) {
  return <>
    {open && <button type="button" aria-label="Close navigation" className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={()=>setOpen(false)} />}
    <aside className={`reference-sidebar fixed top-0 left-0 h-screen w-[280px] z-50 flex flex-col transition-transform duration-300 ${open?'translate-x-0':'-translate-x-full'} lg:translate-x-0`}>
      <div className="reference-brand"><span className="reference-logo">🔎</span><div><div className="reference-brand-title">GapLens <b>AI</b></div><div className="reference-brand-subtitle">Find What Others Miss</div></div><button type="button" className="lg:hidden ml-auto" onClick={()=>setOpen(false)} aria-label="Close"><i className="bi bi-x-lg" /></button></div>
      <nav className="reference-menu" aria-label="Main navigation">{menu.map(item=><button type="button" key={item.id} className={`reference-menu-item ${active===item.id?'reference-menu-active':''}`} onClick={()=>{setActive(item.id);setOpen(false);}}><i className={`bi ${item.icon}`} /><span>{item.label}</span></button>)}</nav>
      <div className="reference-sidebar-footer"><div className="reference-quote">Good Research Finds Better Answers! <span>♡</span></div><img src="/images/history-sidebar.webp" alt="Cartoon detective holding a magnifying glass with a puppy" /></div>
    </aside>
  </>;
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { getResearchHistory, deleteResearchHistory, clearResearchHistory } from '../utils/researchHistory';
import './History.css';

export default function History({ onViewResult, onNewResearch }) {
  const [history, setHistory] = useState(() => getResearchHistory());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const calendarRef = useRef(null);

  useEffect(() => {
    const onOutside = event => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) setCalendarOpen(false);
    };
    const onEscape = event => { if (event.key === 'Escape') setCalendarOpen(false); };
    document.addEventListener('pointerdown', onOutside);
    document.addEventListener('keydown', onEscape);
    return () => { document.removeEventListener('pointerdown', onOutside); document.removeEventListener('keydown', onEscape); };
  }, []);

  const toLocalDate = date => {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const monthOffset = monthStart.getDay();
  const monthDays = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const calendarCells = Array.from({ length: Math.ceil((monthOffset + monthDays) / 7) * 7 }, (_, index) => {
    const day = index - monthOffset + 1;
    return day > 0 && day <= monthDays ? day : null;
  });
  const selectCalendarDay = day => {
    setSelectedDate(toLocalDate(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)));
    setCalendarOpen(false);
  };

  useEffect(() => {
    const refresh = () => setHistory(getResearchHistory());
    window.addEventListener('gaplens:history-updated', refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('gaplens:history-updated', refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  const entries = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const list = history.filter(item => {
      const matches = !normalized || [item.question, item.analysis?.summary].some(value => String(value || '').toLowerCase().includes(normalized));
      const gaps = Array.isArray(item.analysis?.gaps) ? item.analysis.gaps.length : 0;
      const conflicts = Array.isArray(item.analysis?.conflicts) ? item.analysis.conflicts.length : 0;
      const matchesDate = !selectedDate || toLocalDate(item.savedAt || item.analyzedAt) === selectedDate;
      return matches && matchesDate && (filter === 'all' || (filter === 'gaps' && gaps > 0) || (filter === 'conflicts' && conflicts > 0));
    });
    return list.sort((a, b) => {
      const x = new Date(a.savedAt || a.analyzedAt || 0).getTime() || 0;
      const y = new Date(b.savedAt || b.analyzedAt || 0).getTime() || 0;
      return sort === 'newest' ? y - x : x - y;
    });
  }, [history, search, filter, sort, selectedDate]);

  const removeOne = id => {
    if (!window.confirm('Delete this investigation?')) return;
    deleteResearchHistory(id);
    setHistory(getResearchHistory());
  };
  const removeAll = () => {
    if (!window.confirm('Delete all saved investigations? This cannot be undone.')) return;
    clearResearchHistory();
    setHistory([]);
  };

  return (
    <div className="history-cartoon">
      <section className="history-hero" aria-label="Research History — Your Investigation Diary">
        <img className="history-hero-image" src="/images/history-banner.webp" alt="Research History, your investigation diary, with a cartoon detective and notebooks" />
        <div className="history-hero-mobile">
          <span className="history-eyebrow">MY CASE DIARY</span>
          <h1>Research <span>History</span></h1>
          <p>Your Investigation Diary</p>
          <img src="/images/history-detective.webp" alt="Cartoon detective reading a case diary" />
        </div>
      </section>

      <section className="history-toolbar" aria-label="Search and filter saved research">
        <label className="history-search">
          <i className="bi bi-search" aria-hidden="true" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your past research topics..." aria-label="Search your past research topics" />
        </label>
        <select className="history-filter" value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter research">
          <option value="all">All Research</option>
          <option value="gaps">With Gaps</option>
          <option value="conflicts">With Conflicts</option>
        </select>
        <div className="history-calendar-wrap" ref={calendarRef}>
          <button className={`history-sort ${calendarOpen || selectedDate ? 'history-sort-active' : ''}`} type="button" onClick={() => setCalendarOpen(v => !v)} title="Filter by date" aria-label="Open research calendar" aria-expanded={calendarOpen} aria-haspopup="dialog">
            <i className="bi bi-calendar3" />
          </button>
          {calendarOpen && <div className="history-calendar" role="dialog" aria-label="Choose a research date">
            <div className="history-calendar-top"><span>MY CASE CALENDAR</span><button type="button" onClick={() => setCalendarOpen(false)} aria-label="Close calendar"><i className="bi bi-x-lg" /></button></div>
            <div className="history-calendar-month">
              <button type="button" aria-label="Previous month" onClick={() => setCalendarMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}><i className="bi bi-chevron-left" /></button>
              <strong>{calendarMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</strong>
              <button type="button" aria-label="Next month" onClick={() => setCalendarMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}><i className="bi bi-chevron-right" /></button>
            </div>
            <div className="history-calendar-grid">
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(day => <span className="history-calendar-weekday" key={day}>{day}</span>)}
              {calendarCells.map((day, index) => day ? <button key={index} type="button" className={`${toLocalDate(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)) === selectedDate ? 'is-selected' : ''} ${toLocalDate(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)) === toLocalDate(new Date()) ? 'is-today' : ''}`} onClick={() => selectCalendarDay(day)}>{day}</button> : <span key={index} />)}
            </div>
            <div className="history-calendar-footer"><button type="button" onClick={() => { setSelectedDate(''); setCalendarOpen(false); }}>Clear date</button><button type="button" onClick={() => { setCalendarMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); setSelectedDate(toLocalDate(new Date())); setCalendarOpen(false); }}>Today</button></div>
          </div>}
        </div>
      </section>

      {selectedDate && <div className="history-active-filters"><span><i className="bi bi-calendar-heart" /> {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(undefined, { dateStyle: 'long' })}</span><button type="button" onClick={() => setSelectedDate('')}>Clear date <i className="bi bi-x" /></button></div>}

      {history.length === 0 ? (
        <section className="history-empty">
          <span className="history-deco deco-a">✧</span><span className="history-deco deco-b">✦</span><span className="history-deco deco-c">✳</span><span className="history-deco deco-d">☆</span>
          <img className="history-empty-gif" src="/images/history-empty.gif" alt="Cartoon detective checking an empty case diary" />
          <h2><span>No</span> Research History Yet!</h2>
          <p>Start your first investigation to see it here.</p>
          <button type="button" onClick={onNewResearch} className="history-primary"><i className="bi bi-flask" /> Go to Research Lab</button>
          <span className="history-books" aria-hidden="true">📚</span>
        </section>
      ) : entries.length === 0 ? (
        <section className="history-empty history-no-match">
          <i className="bi bi-search history-no-match-icon" />
          <h2>No matching investigations</h2>
          <p>Try a different keyword or filter.</p>
          <button type="button" className="history-primary" onClick={() => {setSearch('');setFilter('all');setSelectedDate('');}}>Show all research</button>
        </section>
      ) : null}

      <section className="history-investigations">
        <div className="history-section-heading">
          <h2><i className="bi bi-journal-text" /> Your Past Investigations <span className="history-count">{history.length}</span></h2>
          {history.length > 0 && <button type="button" onClick={removeAll} className="history-clear"><i className="bi bi-trash3" /> Clear all</button>}
        </div>
        {entries.length > 0 && (
          <div className="history-grid">
            {entries.map((item, index) => {
              const sources = Array.isArray(item.sources) ? item.sources.filter(s => s.status === 'success').length : 0;
              const gaps = Array.isArray(item.analysis?.gaps) ? item.analysis.gaps.length : 0;
              const conflicts = Array.isArray(item.analysis?.conflicts) ? item.analysis.conflicts.length : 0;
              const date = item.savedAt || item.analyzedAt;
              return (
                <article className={`history-case history-case-${index % 3}`} key={item.id || index}>
                  <div className="history-case-meta"><i className="bi bi-calendar3" /> {date && !Number.isNaN(new Date(date).getTime()) ? new Date(date).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'}) : 'Saved investigation'}</div>
                  <h3>{item.question || 'Untitled investigation'}</h3>
                  <p>{typeof item.analysis?.summary === 'string' ? item.analysis.summary : 'Explore the findings and supporting evidence from this investigation.'}</p>
                  <div className="history-case-stats"><span><i className="bi bi-link-45deg" /> {sources} sources</span><span><i className="bi bi-puzzle" /> {gaps} gaps</span><span><i className="bi bi-exclamation-circle" /> {conflicts} conflicts</span></div>
                  <div className="history-case-actions"><button type="button" className="history-open" onClick={() => onViewResult(item)}>Open Case <i className="bi bi-arrow-right" /></button><button type="button" className="history-delete" onClick={() => removeOne(item.id)} aria-label={`Delete ${item.question || 'investigation'}`} title="Delete investigation"><i className="bi bi-trash3" /></button></div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

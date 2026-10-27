import React from 'react';
import { useApp, TABS } from '../store/AppContext.jsx';
import { SCREENS, TAB_SCREENS } from './screens.jsx';

export default function Layout() {
  const { db, nav, goTab, setMode } = useApp();
  const { session } = db;
  const isSitter = session.mode === 'sitter';
  const tabs = TABS[session.mode] || TABS.guardian;
  const mySitterId = (db.sitters.find((s) => s.userId === session.userId) || {}).id;

  // 알림 점: 시터 모드 요청함에 받은 요청이 있으면
  const inboxCount = isSitter
    ? db.requests.filter((r) => r.status === 'asking_neighbors' && mySitterId && r.requestedSitterIds.includes(mySitterId)).length
    : 0;

  const modeKey = isSitter ? 'sitter' : 'guardian';
  const current = nav.stack.length
    ? nav.stack[nav.stack.length - 1]
    : { name: TAB_SCREENS[modeKey][nav.tab] || 'home', params: {} };
  const Screen = SCREENS[current.name];

  return (
    <div className="app-shell">
      <header className="global-header">
        <div className="brand"><span className="paw">🐾</span>모두돌봄</div>
        {session.role === 'both' && (
          <button className="mode-chip" onClick={() => setMode(isSitter ? 'guardian' : 'sitter')}>
            {isSitter ? '🐶 보호자 모드로' : '🤝 시터 모드로'}
          </button>
        )}
      </header>

      <main className="screen-scroll">
        {Screen ? <Screen params={current.params} /> : null}
      </main>

      <nav className="bottom-nav">
        {tabs.map((t) => (
          <button key={t.id} className={`nav-item ${nav.tab === t.id && !nav.stack.length ? 'active' : ''}`} onClick={() => goTab(t.id)}>
            <span className={`ico ${t.id === 'inbox' && inboxCount > 0 ? 'nav-dot' : ''}`}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

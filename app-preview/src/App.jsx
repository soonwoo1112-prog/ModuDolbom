import React from 'react';
import { AppProvider, useApp } from './store.jsx';
import { BottomNav, Btn, Icon } from './ui.jsx';
import { Splash, Login, Neighborhood, RolePick } from './screens/entry.jsx';
import { BookHome, Matching, Sent, Live, Log, GuardianCalendar } from './screens/guardian.jsx';
import { SitterToday, Walking, WalkLogWrite, SitterSchedule } from './screens/sitter.jsx';
import { ChatList, ChatRoom, Social, More, CheckSheet } from './screens/shared.jsx';

const ROOTS = {
  guardian: { book: BookHome, chat: ChatList, social: Social, calendar: GuardianCalendar, more: More },
  sitter: { today: SitterToday, chat: ChatList, social: Social, calendar: SitterSchedule, more: More },
};
const PUSHED = { matching: Matching, sent: Sent, chat: ChatRoom, live: Live, log: Log, walking: Walking, walklog: WalkLogWrite };

function Main() {
  const { role, nav, flow, setSheetOpen } = useApp();
  const top = nav.stack[nav.stack.length - 1];
  const Screen = top ? PUSHED[top.name] : ROOTS[role][nav.tab];
  const key = top ? top.key : `${role}-${nav.tab}`;
  const anim = nav.dir === 'push' ? 'app-screen--push' : nav.dir === 'pop' ? 'app-screen--pop' : '';
  const badges = role === 'guardian' ? { chat: flow.requested && !flow.confirmed ? 1 : 0 } : { chat: 1 };
  return (
    <>
      <div className="app-stage">
        <div key={key} className={`app-screen ${anim}`}>
          {Screen ? <Screen params={top ? top.params : {}} /> : null}
        </div>
      </div>
      {top ? null : <BottomNav badges={badges} />}
      {top ? null : <button type="button" className="app-checkfab" aria-label="화면 점검 메뉴 열기" onClick={() => setSheetOpen(true)}><Icon name="Settings2" size={12} /></button>}
    </>
  );
}

function Overlays() {
  const { snack, hideSnack, dialog, setDialog, sheetOpen, nav, phase } = useApp();
  const high = phase !== 'main' || nav.stack.length > 0;
  return (
    <>
      {snack ? (
        <div key={snack.key} className={`app-snack ${high ? 'app-snack--high' : ''}`}>
          <div className="md-snackbar" role="status">
            <span>{snack.text}</span>
            {snack.action ? <button type="button" onClick={() => { snack.action.run(); hideSnack(); }}>{snack.action.label}</button> : null}
          </div>
        </div>
      ) : null}
      {dialog ? (
        <div className="app-overlay" onClick={() => setDialog(null)}>
          <div className="app-dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlg-title" onClick={(e) => e.stopPropagation()}>
            <h2 id="dlg-title" className="md-section-title">{dialog.title}</h2>
            <p>{dialog.body}</p>
            <div className="app-dialog__actions">
              <Btn onClick={() => setDialog(null)}>닫기</Btn>
              <Btn variant="critical" onClick={() => { dialog.onConfirm(); setDialog(null); }}>{dialog.confirmLabel}</Btn>
            </div>
          </div>
        </div>
      ) : null}
      {sheetOpen ? <CheckSheet /> : null}
    </>
  );
}

function Shell() {
  const { phase } = useApp();
  return (
    <div className="app-shell">
      {phase === 'splash' ? <Splash /> : null}
      {phase === 'login' ? <Login /> : null}
      {phase === 'neighborhood' ? <Neighborhood /> : null}
      {phase === 'role' ? <RolePick /> : null}
      {phase === 'main' ? <Main /> : null}
      <Overlays />
    </div>
  );
}

export default function App() {
  return <AppProvider><Shell /></AppProvider>;
}

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export const TABS = {
  guardian: [
    { id: 'book', label: '예약', icon: 'PawPrint' },
    { id: 'chat', label: '채팅', icon: 'MessageCircle' },
    { id: 'social', label: '소셜', icon: 'Users' },
    { id: 'calendar', label: '캘린더', icon: 'Calendar' },
    { id: 'more', label: '더보기', icon: 'Menu' },
  ],
  sitter: [
    { id: 'today', label: '오늘', icon: 'House' },
    { id: 'chat', label: '채팅', icon: 'MessageCircle' },
    { id: 'social', label: '소셜', icon: 'Users' },
    { id: 'calendar', label: '캘린더', icon: 'Calendar' },
    { id: 'more', label: '더보기', icon: 'Menu' },
  ],
};

const FIRST_TAB = { guardian: 'book', sitter: 'today' };

export function AppProvider({ children }) {
  // Where the person is in the app: splash → login → onboarding → main.
  const [phase, setPhase] = useState('splash');
  const [role, setRoleState] = useState('guardian');
  const [nav, setNav] = useState({ tab: 'book', stack: [], dir: 'none' });

  // The preview's check menu: data state, network speed and theme.
  const [debug, setDebug] = useState({ data: 'normal', network: 'fast', theme: 'system' });

  // What the person has done so far in this run of the preview.
  const [flow, setFlow] = useState({
    dog: '보리', day: '내일', length: '30분', time: '오후 12:30', place: '101동 1층 현관',
    picked: { haneul: true, doyun: true },
    requested: false, confirmed: false, declinedRequest: false,
    walkDone: false, logSent: false, pinned: false, liked: {},
    availability: { 월: true, 화: true, 수: false, 목: true, 금: true, 토: true, 일: false },
  });
  const update = useCallback((patch) => setFlow((f) => ({ ...f, ...(typeof patch === 'function' ? patch(f) : patch) })), []);

  // Snackbar: one at a time, optional action, disappears after 4 seconds.
  const [snack, setSnack] = useState(null);
  const snackTimer = useRef(null);
  const showSnack = useCallback((text, action) => {
    clearTimeout(snackTimer.current);
    setSnack({ text, action, key: Date.now() });
    snackTimer.current = setTimeout(() => setSnack(null), 4000);
  }, []);
  const hideSnack = useCallback(() => { clearTimeout(snackTimer.current); setSnack(null); }, []);

  // Alert dialog: only for actions that cannot be undone.
  const [dialog, setDialog] = useState(null);

  const [sheetOpen, setSheetOpen] = useState(false);

  const push = useCallback((name, params = {}) => setNav((n) => ({ ...n, stack: [...n.stack, { name, params, key: Date.now() }], dir: 'push' })), []);
  const pop = useCallback(() => setNav((n) => ({ ...n, stack: n.stack.slice(0, -1), dir: 'pop' })), []);
  const goTab = useCallback((tab) => setNav({ tab, stack: [], dir: 'none' }), []);
  const resetTo = useCallback((tab, name, params = {}) => setNav({ tab, stack: name ? [{ name, params, key: Date.now() }] : [], dir: 'push' }), []);

  const setRole = useCallback((r) => {
    setRoleState(r);
    setNav({ tab: FIRST_TAB[r], stack: [], dir: 'none' });
  }, []);

  const restart = useCallback(() => {
    setPhase('splash');
    setNav({ tab: FIRST_TAB[role], stack: [], dir: 'none' });
    setFlow((f) => ({ ...f, requested: false, confirmed: false, declinedRequest: false, walkDone: false, logSent: false, pinned: false, liked: {} }));
    hideSnack();
  }, [role, hideSnack]);

  // Theme from the check menu; "system" leaves the viewer's own setting alone.
  useEffect(() => {
    const el = document.documentElement;
    if (debug.theme === 'system') el.removeAttribute('data-theme');
    else el.setAttribute('data-theme', debug.theme);
  }, [debug.theme]);

  const value = {
    phase, setPhase, role, setRole, nav, push, pop, goTab, resetTo,
    debug, setDebug, flow, update, snack, showSnack, hideSnack,
    dialog, setDialog, sheetOpen, setSheetOpen, restart,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Pretend to fetch data, honouring the check menu: loading, then empty, error or full.
export function useLoad(getData, deps = []) {
  const { debug } = useApp();
  const [state, setState] = useState({ status: 'loading', data: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    setState({ status: 'loading', data: null });
    const delay = debug.network === 'slow' ? 2600 : 650;
    const t = setTimeout(() => {
      if (debug.data === 'error') setState({ status: 'error', data: null });
      else if (debug.data === 'empty') setState({ status: 'empty', data: null });
      else setState({ status: 'ready', data: getData() });
    }, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debug.data, debug.network, attempt, ...deps]);
  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  return { ...state, retry };
}

// Pretend to send something: resolves after a short wait (longer on a slow network).
export function useSend() {
  const { debug } = useApp();
  const [busy, setBusy] = useState(false);
  const send = useCallback((done) => {
    setBusy(true);
    setTimeout(() => { setBusy(false); done(); }, debug.network === 'slow' ? 2200 : 700);
  }, [debug.network]);
  return [busy, send];
}

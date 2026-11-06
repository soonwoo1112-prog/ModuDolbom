import React, { useEffect, useState } from 'react';
import { useApp, useSend } from '../store.jsx';
import { Btn, Icon, Callout, TopNav, Avatar } from '../ui.jsx';
import { NEIGHBORHOOD } from '../data.js';

export function Splash() {
  const { setPhase, debug } = useApp();
  const [showProgress, setShowProgress] = useState(false);
  useEffect(() => {
    // The progress circle appears only when loading takes longer than a moment.
    const p = setTimeout(() => setShowProgress(true), 500);
    const t = setTimeout(() => setPhase('login'), debug.network === 'slow' ? 3000 : 1300);
    return () => { clearTimeout(p); clearTimeout(t); };
  }, [setPhase, debug.network]);
  return (
    <div className="app-splash" aria-busy="true" aria-label="모두돌봄을 여는 중">
      <span className="md-thumb" style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--bg-brand-solid)', color: 'var(--fg-on-brand-solid)' }}><Icon name="PawPrint" size={36} /></span>
      <h1 className="app-wordmark">모두돌봄</h1>
      <p className="md-detail" style={{ margin: 0 }}>우리 동네 이웃이 내 강아지를 산책시켜 주는 앱</p>
      <span className="app-progress" style={{ visibility: showProgress ? 'visible' : 'hidden' }} aria-hidden="true" />
    </div>
  );
}

export function Login() {
  const { setPhase } = useApp();
  return (
    <div className="app-screen">
      <div className="app-entry">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
          <span className="md-thumb" style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--bg-brand-solid)', color: 'var(--fg-on-brand-solid)' }}><Icon name="PawPrint" size={28} /></span>
          <h1 className="md-screen-title" style={{ fontSize: 26, lineHeight: '35px' }}>같은 동네 이웃에게<br />산책을 부탁해 보세요</h1>
          <p className="md-item__muted" style={{ margin: 0 }}>같은 아파트, 같은 동네에 사는 시터가 내 강아지와 산책해요.</p>
        </div>
        <Btn variant="brand" size="large" onClick={() => setPhase('neighborhood')}>휴대폰 번호로 시작하기</Btn>
        <Btn variant="ghost" onClick={() => setPhase('neighborhood')}>이미 계정이 있어요</Btn>
      </div>
    </div>
  );
}

export function Neighborhood() {
  const { setPhase } = useApp();
  const [busy, send] = useSend();
  const [found, setFound] = useState(false);
  return (
    <div className="app-screen">
      <TopNav title="동네 인증" onBack={() => setPhase('login')} />
      <div className="app-scroll">
        <div className="app-pad">
          <h2 className="md-screen-title">지금 계신 동네를 확인할게요</h2>
          <div className="md-card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="md-thumb" style={{ width: 48, height: 48 }}><Icon name="MapPin" /></span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span className="md-list-title">{found ? NEIGHBORHOOD : '위치를 확인하고 있어요'}</span>
              <span className="md-detail">{found ? '서울 강남구 역삼동이 맞나요?' : '현재 위치로 동네를 찾아요'}</span>
            </span>
          </div>
          <Callout title="같은 아파트 인증은 나중에 할 수 있어요">거주지 인증을 마치면 같은 단지 이웃을 먼저 볼 수 있어요.</Callout>
        </div>
      </div>
      <div className="app-footer">
        {found
          ? <Btn variant="brand" size="large" onClick={() => setPhase('role')}>{NEIGHBORHOOD}이 맞아요</Btn>
          : <Btn variant="brand" size="large" busy={busy} busyLabel="동네를 찾는 중" onClick={() => send(() => setFound(true))}>현재 위치로 동네 찾기</Btn>}
      </div>
    </div>
  );
}

export function RolePick() {
  const { setPhase, setRole } = useApp();
  const [pick, setPick] = useState('guardian');
  const options = [
    { id: 'guardian', title: '산책을 부탁하고 싶어요', sub: '보호자', icon: 'PawPrint' },
    { id: 'sitter', title: '이웃 강아지와 산책하고 싶어요', sub: '시터', icon: 'Footprints' },
  ];
  return (
    <div className="app-screen">
      <TopNav title="시작하기" onBack={() => setPhase('neighborhood')} />
      <div className="app-scroll">
        <div className="app-pad">
          <h2 className="md-screen-title">모두돌봄을 어떻게 쓰실 건가요</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} role="radiogroup" aria-label="역할">
            {options.map((o) => (
              <button key={o.id} type="button" role="radio" aria-checked={pick === o.id} onClick={() => setPick(o.id)} className="md-pressable"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 'var(--r4)', border: 0, cursor: 'pointer', textAlign: 'left', background: pick === o.id ? 'var(--bg-brand-weak)' : 'var(--bg-layer-default)', boxShadow: pick === o.id ? 'inset 0 0 0 2px var(--stroke-brand-solid)' : 'inset 0 0 0 1px var(--stroke-neutral-weak)', color: 'var(--fg-neutral)' }}>
                <Avatar icon={o.icon} />
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span className="md-list-title">{o.title}</span><span className="md-detail">{o.sub}</span></span>
              </button>
            ))}
          </div>
          <p className="md-detail" style={{ margin: 0 }}>보호자와 시터는 더보기에서 언제든 바꿀 수 있어요.</p>
        </div>
      </div>
      <div className="app-footer">
        <Btn variant="brand" size="large" onClick={() => { setRole(pick); setPhase('main'); }}>시작하기</Btn>
      </div>
    </div>
  );
}

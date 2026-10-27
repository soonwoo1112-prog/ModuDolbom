import React, { useState } from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Btn, Field, Banner } from '../../components/ui.jsx';

// 첫 진입: 지역 선택 → (오픈 전 지역이면 대기자 등록) → 역할 선택
export default function Onboarding() {
  const { onboard, onboardWaitlist } = useApp();
  const [step, setStep] = useState('region');
  const [region, setRegion] = useState(null);
  const [wl, setWl] = useState({ name: '', email: '', region: '', role: '보호자' });
  const [role, setRole] = useState('guardian');

  if (step === 'region') {
    return (
      <div className="app-shell">
        <div className="onboard">
          <div className="hero">
            <div className="logo">🐾</div>
            <h1>모두돌봄</h1>
            <p>동네가 함께 돌봐요 — 가까운 이웃이 같은 강아지를<br />반복해서 돌봐주는 동네 돌봄 앱</p>
          </div>

          <div className="section-title"><h3>어느 동네에 사세요?</h3></div>
          <button className={`region-opt ${region === '망원동' ? 'selected' : ''}`} onClick={() => setRegion('망원동')}>
            <span>📍 서울 마포구 망원동</span>
            {region === '망원동' && <span>✓</span>}
          </button>
          <button className={`region-opt ${region === '성산동' ? 'selected' : ''}`} onClick={() => setRegion('성산동')}>
            <span>📍 서울 마포구 성산동</span>
            {region === '성산동' && <span>✓</span>}
          </button>
          <button className="region-opt disabled" onClick={() => setStep('waitlist')}>
            <span>🔎 다른 동네예요</span>
            <span className="muted">오픈 알림 받기</span>
          </button>

          <Banner tone="info" emoji="🌱">지금은 <b>마포구 망원동·성산동</b>에서 시작하고 있어요. 다른 동네는 곧 순서대로 열어갈게요.</Banner>

          <Btn full big disabled={!region} onClick={() => setStep('role')}>
            다음으로
          </Btn>
        </div>
      </div>
    );
  }

  if (step === 'waitlist') {
    return (
      <div className="app-shell">
        <div className="onboard">
          <div className="hero"><div className="logo">✉️</div><h1>우리 동네 오픈 알림 받기</h1></div>
          <p className="muted" style={{ marginBottom: 20 }}>아직 그 동네는 준비 중이에요. 등록해주시면 오픈되면 제일 먼저 알려드릴게요.</p>

          <Field label="이름"><input className="input" value={wl.name} onChange={(e) => setWl({ ...wl, name: e.target.value })} placeholder="홍길동" /></Field>
          <Field label="이메일"><input className="input" type="email" value={wl.email} onChange={(e) => setWl({ ...wl, email: e.target.value })} placeholder="example@email.com" /></Field>
          <Field label="지역 (시 / 구 / 동)"><input className="input" value={wl.region} onChange={(e) => setWl({ ...wl, region: e.target.value })} placeholder="예) 서울시 강남구 역삼동" /></Field>
          <Field label="역할">
            <div className="chips">
              {['보호자', '이웃 시터'].map((r) => (
                <span key={r} className={`chip selectable ${wl.role === r ? 'selected' : ''}`} onClick={() => setWl({ ...wl, role: r })}>{r}</span>
              ))}
            </div>
          </Field>
          <Btn
            full
            big
            disabled={!wl.name || !wl.email || !wl.region}
            onClick={() => onboardWaitlist(wl)}
          >
            알림 등록하고 앱 둘러보기
          </Btn>
        </div>
      </div>
    );
  }

  // step === 'role'
  const roles = [
    { id: 'guardian', emoji: '🐶', title: '보호자', desc: '이웃 시터에게 산책·방문 돌봄을 부탁해요' },
    { id: 'sitter', emoji: '🤝', title: '이웃 시터', desc: '동네 강아지를 돌봐주며 수입을 만들어요' },
    { id: 'both', emoji: '✨', title: '둘 다 할게요', desc: '보호자이면서 이웃 시터로도 활동해요' },
  ];
  return (
    <div className="app-shell">
      <div className="onboard">
        <div className="hero">
          <div className="logo">🌳</div>
          <h1>{region}에서 어떻게 함께할까요?</h1>
          <p>언제든 마이페이지에서 바꿀 수 있어요</p>
        </div>
        {roles.map((r) => (
          <button key={r.id} className={`region-opt ${role === r.id ? 'selected' : ''}`} onClick={() => setRole(r.id)}>
            <span className="role-opt">
              <b>{r.emoji} {r.title}</b>
              <span className="muted">{r.desc}</span>
            </span>
            {role === r.id && <span>✓</span>}
          </button>
        ))}
        <Btn full big onClick={() => onboard(region, role)}>시작할게요!</Btn>
      </div>
    </div>
  );
}

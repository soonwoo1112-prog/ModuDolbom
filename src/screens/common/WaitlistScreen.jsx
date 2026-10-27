import React, { useState } from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Btn, Field, TopBar, Banner } from '../../components/ui.jsx';

// 우리 동네 오픈 알림 대기자 등록 (마이페이지에서도 진입 가능)
export default function WaitlistScreen() {
  const { db, showToast } = useApp();
  const [wl, setWl] = useState({ name: '', email: '', region: '', role: '보호자' });
  // 데모: 등록하면 목록에 쌓이고 완료 문구를 보여줘요 (실제 저장은 백엔드 연동 후)
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div>
        <TopBar title="오픈 알림 등록" />
        <div className="empty">
          <div className="e">✉️</div>
          <div className="bold">등록됐어요!</div>
          <div className="muted">{wl.region}이 열리면 {wl.email}으로 제일 먼저 알려드릴게요.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title="우리 동네 오픈 알림 받기" />
      <Banner tone="info" emoji="🌱">
        지금은 <b>마포구 망원동·성산동</b>에서 운영 중이에요. 다른 동네는 알림 등록자가 많은 순서대로 열어요.
      </Banner>
      <Field label="이름"><input className="input" value={wl.name} onChange={(e) => setWl({ ...wl, name: e.target.value })} placeholder="홍길동" /></Field>
      <Field label="이메일"><input className="input" type="email" value={wl.email} onChange={(e) => setWl({ ...wl, email: e.target.value })} placeholder="example@email.com" /></Field>
      <Field label="지역 (시 / 구 / 동)"><input className="input" value={wl.region} onChange={(e) => setWl({ ...wl, region: e.target.value })} placeholder="예) 서울시 성동구 금호동" /></Field>
      <Field label="역할">
        <div className="chips">
          {['보호자', '이웃 시터'].map((r) => (
            <span key={r} className={`chip selectable ${wl.role === r ? 'selected' : ''}`} onClick={() => setWl({ ...wl, role: r })}>{r}</span>
          ))}
        </div>
      </Field>
      <Btn
        full
        disabled={!wl.name || !wl.email || !wl.region}
        onClick={() => { db.waitlist.push(wl); setDone(true); showToast('오픈 알림 등록이 완료됐어요 💚'); }}
      >
        알림 등록하기
      </Btn>
    </div>
  );
}

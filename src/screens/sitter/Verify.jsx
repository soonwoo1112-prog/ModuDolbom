import React from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Btn, TopBar, Chip, Stars, SectionTitle, Banner } from '../../components/ui.jsx';
import { won } from '../../utils.js';

// 시터 '내 프로필/인증' — 신원·동네·계좌 인증 상태 표시(연동 없이 UI만)
export default function Verify() {
  const { db, setMySitterVerification, push } = useApp();
  const me = db.sitters.find((s) => s.userId === db.session.userId);
  if (!me) return <div className="empty">시터 프로필을 먼저 만들어주세요</div>;

  const steps = [
    {
      key: 'identity', emoji: '🪪', title: '신원 인증',
      desc: '이름과 생년월일로 본인을 확인해요.',
      done: me.verified.identity,
      action: () => setMySitterVerification('identity', true),
    },
    {
      key: 'neighborhood', emoji: '📍', title: '거주지 · 동네 인증',
      desc: '현재 위치로 시터 활동 동네를 인증해요.',
      done: me.verified.neighborhood,
      action: () => setMySitterVerification('neighborhood', true),
    },
    {
      key: 'account', emoji: '🏦', title: '계좌 인증',
      desc: '돌봄 수입을 받을 계좌를 등록해요.',
      done: me.verified.account,
      action: () => setMySitterVerification('account', true),
    },
  ];

  const verifyCount = steps.filter((s) => s.done).length;

  return (
    <div>
      <TopBar title="내 프로필 · 인증" />
      <Card>
        <div className="row">
          <div className="avatar lg">{me.emoji}</div>
          <div className="grow" style={{ paddingLeft: 6 }}>
            <div className="bold" style={{ fontSize: 17 }}>{me.name}님</div>
            <div className="muted">📍 {me.neighborhood} · <Stars value={me.rating} small /> {me.rating ?? '—'} ({me.reviewCount})</div>
            <div className="chips" style={{ marginTop: 6 }}>
              {me.eduBadge && <Chip tone="green">🎓 교육 배지</Chip>}
              {me.plan && <Chip tone="peach">멤버십: {me.plan}</Chip>}
            </div>
          </div>
        </div>
        <div className="divider" />
        <div className="small">
          <div style={{ marginBottom: 4 }}>{me.intro}</div>
          <div className="muted">가능 요일: {me.days.join(', ')} · {me.hours} · 30분 {won(me.ratePer30)}</div>
        </div>
      </Card>

      <SectionTitle>인증 단계 {verifyCount}/3</SectionTitle>
      {steps.map((s) => (
        <Card key={s.key} className="row between">
          <div className="row">
            <div className="avatar">{s.emoji}</div>
            <div>
              <div className="bold">{s.title}</div>
              <div className="muted small">{s.desc}</div>
            </div>
          </div>
          {s.done ? (
            <Chip tone="green">✓ 완료</Chip>
          ) : (
            <Btn small variant="soft" onClick={s.action}>인증하기</Btn>
          )}
        </Card>
      ))}
      <Banner tone="info" emoji="ℹ️">
        데모 화면이에요 — 실제 인증 연동은 준비 중이에요. 인증이 완료되면 프로필에 배지가 붙어요.
      </Banner>

      <SectionTitle>보호자 신뢰 높이기 (선택)</SectionTitle>
      <Card>
        <div className="small" style={{ lineHeight: 1.9 }}>
          📍 <b>산책 GPS 공유</b> — {me.gpsShare ? '사용 중이에요' : '끄셨어요'}<br />
          <span className="muted">산책 경로를 실시간으로 보호자님과 공유해요.</span><br />
          📹 <b>액션캠 사용</b> — {me.actionCam ? '사용 중이에요' : '끄셨어요'}<br />
          <span className="muted">돌봄 장면을 짧게 기록해요.</span>
        </div>
        <div className="divider" />
        <div className="muted small">의무가 아니에요. 켜두면 보호자님의 신뢰가 올라가요 🌿</div>
        <Btn full variant="ghost" onClick={() => push('membership')} style={{ marginTop: 10 }}>멤버십 자세히 보기</Btn>
      </Card>
    </div>
  );
}

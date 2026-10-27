import React from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Btn, TopBar, Chip, SectionTitle } from '../../components/ui.jsx';
import { SERVICE, fmtDate } from '../../utils.js';

// 마이페이지 — 역할 전환, 멤버십·인증·오픈 알림 등
export default function MyPage() {
  const { db, setMode, push } = useApp();
  const user = db.users.find((u) => u.id === db.session.userId);
  const me = db.sitters.find((s) => s.userId === db.session.userId);
  const isSitter = db.session.mode === 'sitter';

  return (
    <div>
      <TopBar title="마이페이지" />
      <Card>
        <div className="row">
          <div className="avatar lg">{user.name[0]}</div>
          <div className="grow" style={{ paddingLeft: 6 }}>
            <div className="bold" style={{ fontSize: 17 }}>{user.name}님</div>
            <div className="muted">📍 {db.session.region || user.neighborhood} · {db.session.role === 'both' ? '보호자 · 이웃 시터' : db.session.role === 'sitter' ? '이웃 시터' : '보호자'}</div>
            <div className="chips" style={{ marginTop: 6 }}>
              {db.dogs.filter((d) => d.guardianId === user.id).map((d) => <Chip key={d.id}>{d.emoji} {d.name}</Chip>)}
              {me && <Chip tone="peach">🤝 시터 활동 중</Chip>}
            </div>
          </div>
        </div>
      </Card>

      <SectionTitle>역할 전환</SectionTitle>
      <Card>
        <div className="muted small" style={{ marginBottom: 10 }}>
          상단 칩이나 여기에서 언제든 바꿔요. 두 역할 모두 활동할 수 있어요.
        </div>
        <div className="btn-row">
          <Btn variant={!isSitter ? 'primary' : 'ghost'} onClick={() => setMode('guardian')}>🐶 보호자 모드</Btn>
          {me && <Btn variant={isSitter ? 'primary' : 'ghost'} onClick={() => setMode('sitter')}>🤝 시터 모드</Btn>}
        </div>
      </Card>

      <SectionTitle>시터 활동</SectionTitle>
      <Card onClick={() => push('verify')} className="row between">
        <span className="bold">🪪 내 프로필 · 인증</span><span className="muted">›</span>
      </Card>
      <Card onClick={() => push('membership')} className="row between">
        <span className="bold">🌱 멤버십 (월 구독료)</span><span className="muted">›</span>
      </Card>
      {me && (
        <Card>
          <div className="small">
            ⭐ 평점 {me.rating ?? '—'} · 리뷰 {me.reviewCount}개 · 플랜 {me.plan ?? '없음'}
            {me.eduBadge && <> · 🎓 교육 배지</>}
          </div>
        </Card>
      )}

      <SectionTitle>우리 동네</SectionTitle>
      <Card onClick={() => push('waitlist')} className="row between">
        <div>
          <div className="bold">✉️ 다른 동네 오픈 알림 받기</div>
          <div className="muted small">지금은 마포구 망원동·성산동에서 운영해요</div>
        </div>
        <span className="muted">›</span>
      </Card>

      <SectionTitle>약관·안내</SectionTitle>
      <Card>
        <div className="small muted" style={{ lineHeight: 1.9 }}>
          · 개인정보: 상세 주소는 어디에도 표시되지 않아요 (동 단위만 노출)<br />
          · 결제: 플랫폼을 통해 안전하게 결제돼요 (연동 준비 중)<br />
          · 문의: help@modudolbom.example
        </div>
      </Card>
    </div>
  );
}

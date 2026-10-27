import React from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Btn, TopBar, Banner, Pill } from '../../components/ui.jsx';
import { SERVICE, BK_STATUS, fmtDate, fmtClock, won, ONBOARD_STAGES } from '../../utils.js';

// 예약 상세 — 시터·일시·금액, 온보딩 단계 진행바, 노쇼 배너, 다이어리·리뷰·채팅
export default function BookingDetail({ params }) {
  const { db, push } = useApp();
  const b = db.bookings.find((x) => x.id === params.bookingId);
  if (!b) return <div className="empty">예약을 찾을 수 없어요</div>;
  const sitter = db.sitters.find((s) => s.id === b.sitterId);
  const dog = db.dogs.find((d) => d.id === b.dogId);
  const diary = db.diaries.find((p) => p.bookingId === b.id);
  const hasReview = db.reviews.some((rv) => rv.bookingId === b.id);
  const st = BK_STATUS[b.status];

  return (
    <div>
      <TopBar title={`${dog.name} ${SERVICE[b.service].label}`} />
      <div style={{ marginBottom: 12 }}><Pill tone={st.pill}>{st.label}</Pill></div>

      {b.status === 'noshow' && (
        <Banner tone="danger" emoji="🚨">
          <b>시터님이 노쇼·취소했어요.</b><br />백업 이웃 시터를 자동으로 찾고 있어요 — 놀라지 마세요, 금방 연결해드릴게요.
        </Banner>
      )}

      <Card onClick={() => push('sitterProfile', { sitterId: sitter.id, dogId: dog.id })}>
        <div className="row">
          <div className="avatar">{sitter.emoji}</div>
          <div className="grow">
            <div className="bold">{sitter.name}님 · {sitter.neighborhood}</div>
            <div className="muted">전체 {sitter.reviewCount}개 리뷰 · ⭐ {sitter.rating ?? '—'}</div>
          </div>
          <span className="muted">›</span>
        </div>
      </Card>

      <Card>
        <div className="small" style={{ lineHeight: 2 }}>
          📅 <b>{fmtDate(b.date)}</b> · {fmtClock(b.startTime)}부터 {b.duration}분<br />
          🐶 {dog.name} ({dog.breed}, {dog.weight}kg) 와 <b>{b.meetingNumber}번째 만남</b><br />
          💰 <span className="amount">{won(b.amount)}</span> <span className="muted">— 플랫폼을 통해 안전하게 결제돼요</span>
        </div>
      </Card>

      <Card>
        <div className="bold" style={{ marginBottom: 8 }}>온보딩 단계</div>
        <div className="progress-track" style={{ marginBottom: 10 }}>
          {[1, 2, 3].map((i) => <div key={i} className={`seg ${i <= b.stage ? 'on' : ''}`} />)}
        </div>
        <div className="small bold">{b.stage}단계 · {ONBOARD_STAGES[b.stage - 1].title}</div>
        <div className="muted small">{ONBOARD_STAGES[b.stage - 1].desc}</div>
        <div className="divider" />
        <div className="muted small">첫 만남은 보호자님과 함께 → 점점 혼자서도 편하게</div>
      </Card>

      <div className="btn-row">
        {b.status !== 'noshow' && (
          <Btn onClick={() => push('chat', { bookingId: b.id })}>💬 시터님과 채팅</Btn>
        )}
        {b.status === 'completed' && diary && (
          <Btn variant="peach" onClick={() => push('diaryDetail', { diaryId: diary.id })}>📖 다이어리 보기</Btn>
        )}
      </div>
      {b.status === 'completed' && !hasReview && (
        <Banner tone="info" emoji="✨">돌봄이 어땠는지 시터님에게 리뷰를 남겨주시면 이웃들에게 큰 도움이 돼요.</Banner>
      )}
    </div>
  );
}

import React from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, TopBar, Pill, Empty } from '../../components/ui.jsx';
import { SERVICE, BK_STATUS, fmtDate, fmtClock, won, meetCountText } from '../../utils.js';

// 보호자 '예약' 탭 — 예정/지난 예약 목록
export default function Bookings() {
  const { db, push } = useApp();
  const my = db.bookings
    .filter((b) => b.guardianId === db.session.userId)
    .sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime));
  const upcoming = my.filter((b) => b.status === 'upcoming' || b.status === 'progress');
  const past = my.filter((b) => b.status === 'completed' || b.status === 'noshow');

  const renderItem = (b) => {
    const sitter = db.sitters.find((s) => s.id === b.sitterId);
    const dog = db.dogs.find((d) => d.id === b.dogId);
    const st = BK_STATUS[b.status];
    return (
      <Card key={b.id} onClick={() => push('bookingDetail', { bookingId: b.id })}>
        <div className="row between">
          <div className="row">
            <div className="avatar sm">{sitter.emoji}</div>
            <div>
              <div className="bold">{SERVICE[b.service].label} · {dog.name}</div>
              <div className="muted">{fmtDate(b.date)} {fmtClock(b.startTime)} · {b.duration}분 · {won(b.amount)}</div>
            </div>
          </div>
          <Pill tone={st.pill}>{st.label}</Pill>
        </div>
        <div className="muted small" style={{ marginTop: 6 }}>{sitter.name}님과 {meetCountText(b.meetingNumber)}</div>
      </Card>
    );
  };

  return (
    <div>
      <TopBar title="예약" />
      <div className="section-title" style={{ marginTop: 0 }}><h3>예정된 돌봄 {upcoming.length > 0 && `(${upcoming.length})`}</h3></div>
      {upcoming.length === 0 ? <Empty emoji="🌱" text="예정된 돌봄이 없어요" /> : upcoming.map(renderItem)}

      <div className="section-title"><h3>지난 돌봄</h3></div>
      {past.length === 0 ? <div className="muted">아직 기록이 없어요</div> : past.map(renderItem)}
    </div>
  );
}

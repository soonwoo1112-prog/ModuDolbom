import React, { useState } from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Btn, TopBar, Pill, Empty, SectionTitle } from '../../components/ui.jsx';
import MonthCalendar from '../../components/MonthCalendar.jsx';
import { SERVICE, REQ_STATUS, BK_STATUS, fmtDate, fmtClock, won, meetCountText } from '../../utils.js';

// 보호자 '예약' 탭 — 월간 캘린더 중심 + 요청 중 / 다가오는 예약 / 지난 돌봄
export default function Bookings() {
  const { db, push } = useApp();
  const [selDate, setSelDate] = useState(null);
  const my = db.bookings
    .filter((b) => b.guardianId === db.session.userId)
    .sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime));
  const upcoming = my.filter((b) => b.status === 'upcoming' || b.status === 'progress');
  const past = my.filter((b) => b.status === 'completed' || b.status === 'noshow');
  const pendingRequests = db.requests.filter(
    (r) => r.guardianId === db.session.userId && r.status !== 'confirmed' && r.status !== 'cancelled'
  );

  // 달성 marks: 예약 있는 날에 강아지 얼굴 (연속 일정은 MonthCalendar가 막대로 이어줘요)
  const marks = {};
  my.forEach((b) => {
    if (!marks[b.date]) {
      const dog = db.dogs.find((d) => d.id === b.dogId);
      marks[b.date] = dog?.emoji;
    }
  });
  const selBookings = selDate ? my.filter((b) => b.date === selDate) : [];

  const renderItem = (b, { showDiary = false } = {}) => {
    const sitter = db.sitters.find((s) => s.id === b.sitterId);
    const dog = db.dogs.find((d) => d.id === b.dogId);
    const diary = db.diaries.find((p) => p.bookingId === b.id);
    const st = BK_STATUS[b.status];
    return (
      <Card key={b.id} onClick={() => push('bookingDetail', { bookingId: b.id })}>
        <div className="row between">
          <div className="row">
            <div className="avatar sm">{sitter.emoji}</div>
            <div>
              <div className="bold">{SERVICE[b.service].label} · {dog.name}</div>
              <div className="muted">{fmtDate(b.date)} {fmtClock(b.startTime)} · {b.duration}분 · {won(b.amount)}</div>
              <div className="muted small" style={{ marginTop: 2 }}>{sitter.name}님과 {meetCountText(b.meetingNumber)}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Pill tone={st.pill}>{st.label}</Pill>
            {showDiary && diary && <div className="muted small" style={{ marginTop: 4 }}>📖 다이어리 ›</div>}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div>
      <TopBar
        title="예약"
        right={<Btn small onClick={() => push('requestFlow')}>+ 새 요청</Btn>}
      />
      <MonthCalendar marks={marks} onPick={setSelDate} />

      {selDate && (
        <>
          <SectionTitle>{fmtDate(selDate)} 돌봄</SectionTitle>
          {selBookings.length === 0 && <Card><div className="muted small">이 날 예약이 없어요</div></Card>}
          {selBookings.map((b) => renderItem(b))}
          <button className="more" style={{ border: 'none', background: 'none', color: 'var(--muted)', fontSize: 12.5, cursor: 'pointer', padding: 0 }}
            onClick={() => setSelDate(null)}>
            날짜 선택 닫기 ✕
          </button>
        </>
      )}

      <SectionTitle>요청 중</SectionTitle>
      {pendingRequests.length === 0 && <Card><div className="muted small">진행 중인 요청이 없어요</div></Card>}
      {pendingRequests.map((r) => {
        const dog = db.dogs.find((d) => d.id === r.dogId);
        const st = REQ_STATUS[r.status];
        return (
          <Card key={r.id} onClick={() => push('matching', { requestId: r.id })}>
            <div className="row between">
              <div className="row">
                <div className="dog-face sm">{dog.emoji}</div>
                <div>
                  <div className="bold">{SERVICE[r.service].emoji} {SERVICE[r.service].label} · {dog.name}</div>
                  <div className="muted">{fmtDate(r.date)} {fmtClock(r.startTime)} · {r.duration}분</div>
                  <div className="muted small" style={{ marginTop: 2 }}>
                    {r.status === 'awaiting_dedicated'
                      ? '⏳ 전담 시터에게 묻는 중'
                      : `📣 이웃 ${r.requestedSitterIds.length}명에게 묻는 중`} · 매칭 상태 보기 ›
                  </div>
                </div>
              </div>
              <Pill tone={st.pill}>{st.label}</Pill>
            </div>
          </Card>
        );
      })}

      <SectionTitle>다가오는 예약</SectionTitle>
      {upcoming.length === 0 && <Empty emoji="🌱" text="예정된 돌봄이 없어요" />}
      {upcoming.map((b) => renderItem(b))}

      <SectionTitle>지난 돌봄</SectionTitle>
      {past.length === 0 && <div className="muted">아직 기록이 없어요</div>}
      {past.map((b) => renderItem(b, { showDiary: true }))}
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Btn, TopBar, Pill, Empty, SectionTitle } from '../../components/ui.jsx';
import MonthCalendar from '../../components/MonthCalendar.jsx';
import RequestCard from '../../components/RequestCard.jsx';
import { SERVICE, BK_STATUS, fmtDate, fmtClock, won, meetCountText } from '../../utils.js';

// 시터 '일정' 탭 — 새 요청함 + 월간 캘린더 중심 + 다가오는/지난 돌봄
export default function Schedule() {
  const { db, push } = useApp();
  const me = db.sitters.find((s) => s.userId === db.session.userId);
  const [selDate, setSelDate] = useState(null);
  if (!me) return <Empty emoji="🙋" text="시터 프로필을 먼저 만들어주세요" />;

  const my = db.bookings
    .filter((b) => b.sitterId === me.id)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  const upcoming = my.filter((b) => b.status === 'upcoming' || b.status === 'progress');
  const past = my.filter((b) => b.status === 'completed' || b.status === 'noshow');

  const received = db.requests.filter(
    (r) => r.requestedSitterIds.includes(me.id) && (r.status === 'awaiting_dedicated' || r.status === 'asking_neighbors')
  );

  const marks = {};
  my.forEach((b) => {
    if (!marks[b.date]) {
      const dog = db.dogs.find((d) => d.id === b.dogId);
      marks[b.date] = dog?.emoji;
    }
  });
  const selBookings = selDate ? my.filter((b) => b.date === selDate) : [];

  const renderGroup = (b, { showDiaryWrite = false } = {}) => {
    const dog = db.dogs.find((d) => d.id === b.dogId);
    const st = BK_STATUS[b.status];
    const hasDiary = db.diaries.some((p) => p.bookingId === b.id);
    return (
      <Card key={b.id} onClick={() => push('bookingDetail', { bookingId: b.id })}>
        <div className="row between">
          <div className="row">
            <div className="dog-face sm">{dog.emoji}</div>
            <div>
              <div className="bold">{SERVICE[b.service].label} · {dog.name}</div>
              <div className="muted">{fmtClock(b.startTime)} · {b.duration}분 · {won(b.amount)}</div>
              <div className="muted small" style={{ marginTop: 2 }}>{dog.name}와 {meetCountText(b.meetingNumber)} · 온보딩 {b.stage}단계</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Pill tone={st.pill}>{st.label}</Pill>
            {showDiaryWrite && !hasDiary && (
              <div
                className="muted small"
                style={{ marginTop: 4, color: 'var(--green)', fontWeight: 600 }}
                onClick={(e) => { e.stopPropagation(); push('diary', { bookingId: b.id }); }}
              >
                ✍️ 다이어리 쓰기
              </div>
            )}
            {showDiaryWrite && hasDiary && <div className="muted small" style={{ marginTop: 4 }}>📖 다이어리 있어요</div>}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div>
      <TopBar title="내 일정" />

      {received.length > 0 && (
        <>
          <SectionTitle action={<span className="muted small">{received.length}건</span>}>새 요청함</SectionTitle>
          {received.map((r) => <RequestCard key={r.id} r={r} compact />)}
        </>
      )}

      <SectionTitle>돌봄 캘린더</SectionTitle>
      <MonthCalendar marks={marks} onPick={setSelDate} />

      {selDate && (
        <>
          <SectionTitle>{fmtDate(selDate)} 돌봄</SectionTitle>
          {selBookings.length === 0 && <Card><div className="muted small">이 날 예약이 없어요</div></Card>}
          {selBookings.map((b) => renderGroup(b))}
          <button className="more" style={{ border: 'none', background: 'none', color: 'var(--muted)', fontSize: 12.5, cursor: 'pointer', padding: 0 }}
            onClick={() => setSelDate(null)}>
            날짜 선택 닫기 ✕
          </button>
        </>
      )}

      <SectionTitle>다가오는 돌봄</SectionTitle>
      {upcoming.length === 0 && <Empty emoji="🗓️" text="예정된 돌봄이 없어요" />}
      {upcoming.map((b) => renderGroup(b))}

      <SectionTitle>지난 돌봄</SectionTitle>
      {past.length === 0 && <div className="muted">아직 기록이 없어요</div>}
      {past.map((b) => renderGroup(b, { showDiaryWrite: true }))}
    </div>
  );
}

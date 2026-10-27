import React from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, TopBar, Pill, Empty, SectionTitle } from '../../components/ui.jsx';
import { SERVICE, BK_STATUS, fmtDate, fmtClock, won, meetCountText } from '../../utils.js';

// 시터 '일정' — 확정된 예약 목록(날짜별) + 지난 돌봄
export default function Schedule() {
  const { db, push } = useApp();
  const me = db.sitters.find((s) => s.userId === db.session.userId);
  if (!me) return <Empty emoji="🙋" text="시터 프로필을 먼저 만들어주세요" />;
  const my = db.bookings
    .filter((b) => b.sitterId === me.id)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  const upcoming = my.filter((b) => b.status === 'upcoming');
  const past = my.filter((b) => b.status === 'completed' || b.status === 'noshow');

  const groupByDate = (list) => {
    const g = {};
    list.forEach((b) => { (g[b.date] = g[b.date] || []).push(b); });
    return g;
  };

  const renderGroup = (b) => {
    const dog = db.dogs.find((d) => d.id === b.dogId);
    const st = BK_STATUS[b.status];
    return (
      <Card key={b.id} onClick={() => push('bookingDetail', { bookingId: b.id })}>
        <div className="row between">
          <div className="row">
            <div className="dog-face sm">{dog.emoji}</div>
            <div>
              <div className="bold">{SERVICE[b.service].label} · {dog.name}</div>
              <div className="muted">{fmtClock(b.startTime)} · {b.duration}분 · {won(b.amount)}</div>
            </div>
          </div>
          <Pill tone={st.pill}>{st.label}</Pill>
        </div>
        <div className="muted small" style={{ marginTop: 6 }}>{dog.name}와 {meetCountText(b.meetingNumber)} · 온보딩 {b.stage}단계</div>
      </Card>
    );
  };

  const groups = groupByDate(upcoming);

  return (
    <div>
      <TopBar title="내 일정" />
      <SectionTitle>예정된 돌봄</SectionTitle>
      {upcoming.length === 0 && <Empty emoji="🗓️" text="예정된 돌봄이 없어요" />}
      {Object.keys(groups).sort().map((date) => (
        <div key={date}>
          <div className="bold small" style={{ margin: '6px 2px' }}>📅 {fmtDate(date)}</div>
          {groups[date].map(renderGroup)}
        </div>
      ))}
      <SectionTitle>지난 돌봄</SectionTitle>
      {past.length === 0 && <div className="muted">아직 기록이 없어요</div>}
      {past.map(renderGroup)}
    </div>
  );
}

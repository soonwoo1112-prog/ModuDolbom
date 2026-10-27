import React from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Chip, SectionTitle, Empty } from '../../components/ui.jsx';
import CalendarStrip from '../../components/CalendarStrip.jsx';
import RequestCard from '../../components/RequestCard.jsx';
import { SERVICE, fmtClock, won, isoOf } from '../../utils.js';

// 시터 홈 — 앱 열자마자 필요한 것: 오늘 일정, 새 요청, 이번 달 정산, 이번 주 캘린더
export default function SitterHome() {
  const { db, push, goTab } = useApp();
  const me = db.sitters.find((s) => s.userId === db.session.userId);
  if (!me) return <Empty emoji="🙋" text="시터 프로필을 먼저 만들어주세요" />;
  const user = db.users.find((u) => u.id === db.session.userId);

  const myBookings = db.bookings.filter((b) => b.sitterId === me.id);
  const todayISO = isoOf(new Date());
  const todays = myBookings
    .filter((b) => b.date === todayISO && b.status !== 'noshow')
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const received = db.requests.filter(
    (r) => r.requestedSitterIds.includes(me.id) && (r.status === 'awaiting_dedicated' || r.status === 'asking_neighbors')
  );

  // 이번 달 정산 예정 금액 (지난 + 예정 돌봄 합계)
  const monthPrefix = todayISO.slice(0, 7);
  const monthAmount = myBookings
    .filter((b) => b.date.startsWith(monthPrefix) && b.status !== 'noshow')
    .reduce((sum, b) => sum + b.amount, 0);

  // 이번 주 스트립: 예약 있는 날에 맡을 강아지 얼굴
  const marks = {};
  myBookings.forEach((b) => {
    if (!marks[b.date]) {
      const dog = db.dogs.find((d) => d.id === b.dogId);
      marks[b.date] = dog?.emoji;
    }
  });

  return (
    <div>
      <div style={{ marginTop: 4 }}>
        <div style={{ fontSize: 21, fontWeight: 800 }}>{user.name}님, 오늘도 고생 많으셔요! 🌿</div>
        <div className="muted">{db.session.region || me.neighborhood} 이웃 시터 · ⭐ {me.rating ?? '—'} ({me.reviewCount})</div>
      </div>

      <SectionTitle>오늘 일정</SectionTitle>
      {todays.length === 0 && <Card><div className="muted small">오늘은 맡을 강아지가 없어요 — 푹 쉬세요! 🌱</div></Card>}
      {todays.map((b) => {
        const dog = db.dogs.find((d) => d.id === b.dogId);
        return (
          <Card key={b.id} onClick={() => push('bookingDetail', { bookingId: b.id })}>
            <div className="row">
              <div className="dog-face">{dog.emoji}</div>
              <div className="grow">
                <div className="bold">{dog.name} · {SERVICE[b.service].label} {fmtClock(b.startTime)}~</div>
                <div className="muted small" style={{
                  overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
                }}>
                  ⚠️ {dog.cautions || '특별한 주의사항은 없어요'}
                </div>
              </div>
              <Chip tone={b.status === 'upcoming' ? 'green' : 'peach'}>{b.status === 'upcoming' ? '예정' : '완료'}</Chip>
            </div>
          </Card>
        );
      })}

      {received.length > 0 && (
        <>
          <SectionTitle action={<span className="muted small">{received.length}건</span>}>새로 들어온 요청</SectionTitle>
          {received.map((r) => <RequestCard key={r.id} r={r} compact />)}
        </>
      )}

      <SectionTitle>이번 달 정산 예정</SectionTitle>
      <Card className="settle-card">
        <div className="row between">
          <div>
            <div className="muted small">이번 달 돌봄 수입</div>
            <div className="amount" style={{ fontSize: 24 }}>{won(monthAmount)}</div>
          </div>
          <div className="muted small" style={{ textAlign: 'right' }}>
            지금까지 <b>{myBookings.filter((b) => b.status === 'completed').length}번</b>의 돌봄<br />
            수수료 없이 그대로 받아요 🌿
          </div>
        </div>
      </Card>

      <SectionTitle action={<button className="more" onClick={() => goTab('schedule')}>전체 일정 보기</button>}>
        이번 주 일정
      </SectionTitle>
      <Card><CalendarStrip marks={marks} onPick={() => goTab('schedule')} /></Card>

      <SectionTitle>동네일기 최근 소식</SectionTitle>
      <Card onClick={() => goTab('feed')}>
        <div className="row between">
          <span className="bold small">📸 내가 쓴 일기 · 동네 강아지 소식 보러가기</span>
          <span className="muted">›</span>
        </div>
      </Card>
    </div>
  );
}

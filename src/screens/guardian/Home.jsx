import React, { useState } from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Btn, Chip, SectionTitle, Pill, Banner } from '../../components/ui.jsx';
import CalendarStrip from '../../components/CalendarStrip.jsx';
import { SERVICE, fmtDate, fmtRange, meetCountText, REQ_STATUS, D } from '../../utils.js';

// 보호자 홈 — 예약 대시보드
// 인사 + 내 강아지 프로필 사진들, 산책 부탁하기 큰 카드, 다음 돌봄,
// 이번 주 미니 캘린더, 내 전담 시터, 동네일기 미리보기
export default function Home() {
  const { db, push, goTab } = useApp();
  const user = db.users.find((u) => u.id === db.session.userId);
  const myDogs = db.dogs.filter((d) => d.guardianId === user.id);
  const myBookings = db.bookings.filter((b) => b.guardianId === user.id);

  // ── 산책 부탁하기 큰 카드 상태 ──
  const [pickDog, setPickDog] = useState(myDogs[0]?.id || null);
  const [pickDate, setPickDate] = useState('today');
  const dateValue = pickDate === 'today' ? D(0) : pickDate === 'tomorrow' ? D(1) : null;

  // ── 다음 돌봄 ──
  const upcoming = myBookings
    .filter((b) => b.status === 'upcoming' || b.status === 'progress')
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  const next = upcoming[0];
  const pending = db.requests
    .filter((r) => r.guardianId === user.id && r.status !== 'confirmed' && r.status !== 'cancelled')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  // ── 이번 주 캘린더 marks ──
  const marks = {};
  myBookings.forEach((b) => {
    if (!marks[b.date]) {
      const dog = db.dogs.find((d) => d.id === b.dogId);
      marks[b.date] = dog?.emoji;
    }
  });

  // ── 전담 시터 ──
  const favs = db.favorites.filter((f) => f.guardianId === user.id);
  // ── 동네일기 미리보기 ──
  const recentPosts = db.diaries.filter((p) => p.isPublic)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);

  const startRequest = (service) => {
    if (!pickDog) { push('requestFlow', { service }); return; }
    push('requestFlow', { service, dogId: pickDog, date: dateValue || undefined });
  };

  return (
    <div>
      <div style={{ marginTop: 4 }}>
        <div style={{ fontSize: 21, fontWeight: 800 }}>{user.name}님, 안녕하세요! 🌿</div>
        <div className="muted">
          {db.session.regionLocked
            ? '미리보기 중이에요 — 예약은 오픈 동네에서만 가능해요'
            : `오늘도 ${myDogs.map((d) => d.name).join(', ')}가 산책을 기다려요`}
        </div>
        {/* 내 강아지 동그란 프로필 사진 바로가기 */}
        <div className="row" style={{ gap: 10, marginTop: 12 }}>
          {myDogs.map((d) => (
            <button key={d.id} className="my-dog-avatar" onClick={() => push('dogProfile', { dogId: d.id })}>
              <span className="circle">
                {d.photo ? <img src={d.photo} alt="" /> : <span>{d.emoji}</span>}
              </span>
              <span className="nm">{d.name}</span>
            </button>
          ))}
          {myDogs.length === 0 && (
            <button className="my-dog-avatar" onClick={() => push('dogEdit', { dogId: 'new' })}>
              <span className="circle plus">+</span>
              <span className="nm">강아지 추가</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 핵심 카드: 산책 부탁하기 ── */}
      <div className="request-hero">
        <div className="bold" style={{ fontSize: 17, marginBottom: 10 }}>🚶 산책 부탁하기</div>
        <div className="chips" style={{ marginBottom: 10 }}>
          {myDogs.map((d) => (
            <Chip key={d.id} selectable selected={pickDog === d.id} onClick={() => setPickDog(d.id)}>
              {d.emoji} {d.name}
            </Chip>
          ))}
        </div>
        <div className="chips" style={{ marginBottom: 12 }}>
          <Chip selectable selected={pickDate === 'today'} onClick={() => setPickDate('today')}>오늘</Chip>
          <Chip selectable selected={pickDate === 'tomorrow'} onClick={() => setPickDate('tomorrow')}>내일</Chip>
          <Chip selectable selected={pickDate === 'pick'} onClick={() => setPickDate('pick')}>📅 날짜 고르기</Chip>
        </div>
        <Btn full big onClick={() => startRequest('walk')}>산책 시터님 찾기 시작</Btn>
        <Btn full variant="soft" style={{ marginTop: 8 }} onClick={() => push('requestFlow', { service: 'visit' })}>
          🏠 방문 돌봄 부탁하기
        </Btn>
      </div>

      {/* ── 다음 돌봄 ── */}
      <SectionTitle>다음 돌봄</SectionTitle>
      {next ? (
        <Card onClick={() => push('bookingDetail', { bookingId: next.id })}>
          <div className="row">
            <div className="dog-face">{db.dogs.find((d) => d.id === next.dogId).emoji}</div>
            <div className="grow">
              <div className="bold">{SERVICE[next.service].label} · {db.dogs.find((d) => d.id === next.dogId).name}</div>
              <div className="muted">{fmtDate(next.date)} {fmtRange(next.date, next.startTime, next.duration)}</div>
              <div className="row" style={{ gap: 6, marginTop: 6 }}>
                <div className="avatar sm">{db.sitters.find((s) => s.id === next.sitterId).emoji}</div>
                <span className="muted small">{db.sitters.find((s) => s.id === next.sitterId).name}님과 {meetCountText(next.meetingNumber)}</span>
              </div>
            </div>
            <Pill tone="ok">예정</Pill>
          </div>
        </Card>
      ) : (
        <Card><div className="muted small">예정된 돌봄이 아직 없어요 — 위에서 산책을 부탁해보세요!</div></Card>
      )}
      {pending && (
        <Card onClick={() => push('matching', { requestId: pending.id })}>
          <div className="row between">
            <div className="row">
              <div className="dog-face sm">{db.dogs.find((d) => d.id === pending.dogId).emoji}</div>
              <div>
                <div className="bold small">
                  {pending.status === 'awaiting_dedicated' ? '⏳ 전담 시터에게 묻는 중' : `📣 이웃 ${pending.requestedSitterIds.length}명에게 묻는 중`}
                </div>
                <div className="muted small">
                  {SERVICE[pending.service].label} · {fmtDate(pending.date)} · 매칭 상태 보기 ›
                </div>
              </div>
            </div>
            <Pill tone={REQ_STATUS[pending.status].pill}>{REQ_STATUS[pending.status].label}</Pill>
          </div>
        </Card>
      )}

      {/* ── 이번 주 미니 캘린더 ── */}
      <SectionTitle action={<button className="more" onClick={() => goTab('bookings')}>달력 보기</button>}>
        이번 주 돌봄 일정
      </SectionTitle>
      <Card><CalendarStrip marks={marks} onPick={() => goTab('bookings')} /></Card>

      {/* ── 내 전담 시터 ── */}
      {favs.length > 0 && (
        <>
          <SectionTitle>내 전담 시터</SectionTitle>
          {favs.map((f) => {
            const sitter = db.sitters.find((s) => s.id === f.sitterId);
            const dog = db.dogs.find((d) => d.id === f.dogId);
            const nextFav = db.bookings
              .filter((b) => b.sitterId === f.sitterId && b.dogId === f.dogId && b.status === 'upcoming')
              .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))[0];
            return (
              <Card key={`${f.dogId}-${f.sitterId}`} className="row between" onClick={() => push('sitterProfile', { sitterId: sitter.id, dogId: dog.id })}>
                <div className="row">
                  <div className="avatar">{sitter.emoji}</div>
                  <div className="grow">
                    <div className="bold">{sitter.name}님 · ⭐ {sitter.rating ?? '—'}</div>
                    <div className="muted">
                      {nextFav ? `${dog.name}와 ${fmtDate(nextFav.date)} ${meetCountText(nextFav.meetingNumber)} 예정` : `${dog.name}의 전담 시터예요`}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: 20 }}>›</span>
              </Card>
            );
          })}
        </>
      )}

      {/* ── 동네일기 최근 소식 (미리보기만) ── */}
      <SectionTitle action={<button className="more" onClick={() => goTab('feed')}>동네일기 보러가기</button>}>
        동네일기 최근 소식
      </SectionTitle>
      <div className="photo-tiles">
        {recentPosts.map((p) => {
          const dog = db.dogs.find((d) => d.id === p.dogId);
          return (
            <div key={p.id} className="photo-tile" onClick={() => goTab('feed')} title={`${dog.name} 다이어리`}>
              {p.photos[0] || '📷'}
            </div>
          );
        })}
      </div>
      <div className="muted small" style={{ marginTop: 6, marginBottom: 8 }}>
        {recentPosts.map((p) => db.dogs.find((d) => d.id === p.dogId)?.name).join(' · ')} 이야기가 올라왔어요
      </div>

      <Banner tone="info" emoji="🔒">
        다이어리와 카드에는 <b>동네(동 단위)</b>까지만 표시돼요. 상세 주소는 그 누구에게도 보이지 않아요.
      </Banner>
    </div>
  );
}

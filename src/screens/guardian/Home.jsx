import React from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Btn, Chip, SectionTitle, Banner, Pill } from '../../components/ui.jsx';
import { SERVICE, fmtDate, fmtRange, withLang, meetCountText } from '../../utils.js';

export default function Home() {
  const { db, push } = useApp();
  const user = db.users.find((u) => u.id === db.session.userId);
  const myDogs = db.dogs.filter((d) => d.guardianId === user.id);
  const myBookings = db.bookings.filter((b) => b.guardianId === user.id);
  const upcoming = myBookings
    .filter((b) => b.status === 'upcoming')
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));

  // 전담 시터 카드: 전담 시터 + 그 시터와의 다음 예약
  const fav = db.favorites[0] && myDogs.length ? db.favorites.find((f) => f.guardianId === user.id) : null;
  let favCard = null;
  if (fav) {
    const sitter = db.sitters.find((s) => s.id === fav.sitterId);
    const dog = db.dogs.find((d) => d.id === fav.dogId);
    const next = db.bookings
      .filter((b) => b.sitterId === fav.sitterId && b.dogId === fav.dogId && b.status === 'upcoming')
      .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))[0];
    favCard = (
      <Card className="row between" onClick={() => push('sitterProfile', { sitterId: sitter.id, dogId: dog.id })}>
        <div className="row">
          <div className="avatar">{sitter.emoji}</div>
          <div className="grow">
            <div className="bold">{sitter.name}님 · 전담 시터</div>
            <div className="muted">
              {next ? `${dog.name}와 ${meetCountText(next.meetingNumber)} ${SERVICE[next.service].label} 예정` : `${dog.name}의 전담 시터예요`}
            </div>
          </div>
        </div>
        <span style={{ fontSize: 20 }}>›</span>
      </Card>
    );
  }

  // 우리 동네 강아지 다이어리 (공개 글만, 동 단위 표시)
  const feed = db.diaries.filter((p) => p.isPublic);

  return (
    <div>
      <div style={{ marginTop: 4 }}>
        <div style={{ fontSize: 21, fontWeight: 800 }}>
          {user.name}님, 안녕하세요! 🌿
        </div>
        <div className="muted">
          {db.session.regionLocked
            ? '미리보기 중이에요 — 예약은 오픈 동네에서만 가능해요'
            : `오늘도 ${myDogs.map((d) => d.name).join(', ')}가 산책을 기다려요`}
        </div>
        <div className="chips" style={{ marginTop: 10 }}>
          <Chip tone="green">📍 {db.session.region || user.neighborhood}</Chip>
          {myDogs.map((d) => <Chip key={d.id}>{d.emoji} {d.name}</Chip>)}
        </div>
      </div>

      <div style={{ margin: '18px 0 6px' }}>
        <Btn full big variant="primary" onClick={() => push('requestFlow')}>
          🚶 산책 부탁하기
        </Btn>
      </div>

      {fav && <SectionTitle>내 전담 시터</SectionTitle>}
      {favCard}

      <SectionTitle>다가오는 예약</SectionTitle>
      {upcoming.length === 0 && <div className="muted" style={{ padding: '4px 2px 10px' }}>예정된 돌봄이 아직 없어요</div>}
      {upcoming.slice(0, 2).map((b) => {
        const sitter = db.sitters.find((s) => s.id === b.sitterId);
        const dog = db.dogs.find((d) => d.id === b.dogId);
        return (
          <Card key={b.id} onClick={() => push('bookingDetail', { bookingId: b.id })}>
            <div className="row between">
              <div className="row">
                <div className="avatar sm">{sitter.emoji}</div>
                <div>
                  <div className="bold">{SERVICE[b.service].label} · {dog.name}</div>
                  <div className="muted">{fmtDate(b.date)} {fmtRange(b.date, b.startTime, b.duration)}</div>
                </div>
              </div>
              <Pill tone="ok">예정</Pill>
            </div>
          </Card>
        );
      })}

      <SectionTitle>우리 동네 강아지 다이어리</SectionTitle>
      {feed.map((p) => {
        const dog = db.dogs.find((d) => d.id === p.dogId);
        const sitter = db.sitters.find((s) => s.id === p.sitterId);
        return (
          <Card key={p.id}>
            <div className="head">
              <div className="dog-face sm">{dog.emoji}</div>
              <div className="grow">
                <div className="bold">{withLang(dog.name)} 즐거웠어요</div>
                <div className="muted">{p.neighborhood} · {sitter.name}님이 돌봤어요</div>
              </div>
              <div className="muted">{fmtDate(p.createdAt)}</div>
            </div>
            {p.photos.length > 0 && (
              <div className="photo-tiles" style={{ marginBottom: 10 }}>
                {p.photos.map((ph, i) => <div key={i} className="photo-tile" style={{ cursor: 'default' }}>{ph}</div>)}
              </div>
            )}
            <div className="chips" style={{ marginBottom: 8 }}>
              {p.checks.map((c) => <Chip key={c} tone="peach">{c}</Chip>)}
            </div>
            <div className="small" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {p.body}
            </div>
          </Card>
        );
      })}
      <Banner tone="info" emoji="🔒">
        다이어리와 카드에는 <b>동네(동 단위)</b>까지만 표시돼요. 상세 주소는 그 누구에게도 보이지 않아요.
      </Banner>
    </div>
  );
}

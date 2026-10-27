import React from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { TopBar, Card, Chip, SectionTitle, Stars, Empty } from '../../components/ui.jsx';
import { fmtDate, ageText } from '../../utils.js';

// 보호자 프로필 — 시터가 보호자를 볼 때 + 마이 상단과 같은 모양
export default function GuardianProfile({ params }) {
  const { db, push, pop } = useApp();
  const user = db.users.find((u) => u.id === (params.userId || db.session.userId));
  if (!user) return <Empty emoji="🙂" text="보호자를 찾을 수 없어요" />;
  const dogs = db.dogs.filter((d) => d.guardianId === user.id);
  const reviews = (db.guardianReviews || []).filter((r) => r.guardianId === user.id);
  const bookings = db.bookings.filter((b) => b.guardianId === user.id);

  return (
    <div>
      <TopBar title="보호자 프로필" onBack={pop} />
      <div className="profile-cover">
        <div className="cover-emoji">{user.photo || '🙂'}</div>
        <div className="cover-paws">🌿 🏠 🌿</div>
        <div className="profile-avatar-wrap">
          <div className="profile-avatar big"><span>{user.photo || '🙂'}</span></div>
        </div>
      </div>
      <div className="profile-head">
        <div className="bold" style={{ fontSize: 20 }}>{user.name}님</div>
        <div className="muted">📍 {user.neighborhood} · 돌봄 {bookings.length}번 이용</div>
        {user.intro && <div className="small" style={{ marginTop: 6, lineHeight: 1.8 }}>{user.intro}</div>}
      </div>

      <SectionTitle>우리 강아지들</SectionTitle>
      {dogs.length === 0 && <Card><div className="muted small">등록된 강아지가 없어요</div></Card>}
      {dogs.map((d) => (
        <Card key={d.id} onClick={() => push('dogProfile', { dogId: d.id })}>
          <div className="row between">
            <div className="row">
              <div className="dog-face sm">{d.emoji}</div>
              <div>
                <div className="bold">{d.name} · {d.breed}</div>
                <div className="muted">{d.weight}kg · {ageText(d)}</div>
              </div>
            </div>
            <span className="muted">›</span>
          </div>
        </Card>
      ))}

      <SectionTitle>시터들이 남긴 후기</SectionTitle>
      {reviews.length === 0 && <Card><div className="muted small">아직 후기가 없어요</div></Card>}
      {reviews.map((rv) => {
        const s = db.sitters.find((x) => x.id === rv.sitterId);
        return (
          <Card key={rv.id}>
            <div className="row between" style={{ marginBottom: 6 }}>
              <div className="row">
                <div className="avatar sm">{s?.emoji || '🙂'}</div>
                <span className="small bold">{s?.name || '시터'}님</span>
              </div>
              <Stars value={rv.rating} small />
            </div>
            <div className="small">{rv.content}</div>
            <div className="muted small" style={{ marginTop: 4 }}>{fmtDate(rv.createdAt)}</div>
          </Card>
        );
      })}

      <div className="muted small" style={{ textAlign: 'center', marginTop: 8 }}>
        채팅은 예약이 확정된 뒤에 열려요 🌿
      </div>
    </div>
  );
}

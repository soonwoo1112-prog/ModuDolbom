import React from 'react';
import { useApp } from '../store/AppContext.jsx';
import { Btn, Chip } from './ui.jsx';
import DogSizeChart from './DogSizeChart.jsx';
import { SERVICE, fmtDate, fmtClock, won, subject, ageText } from '../utils.js';

// 들어온 돌봄 요청 카드 (시터 홈 · 일정 탭에서 재사용)
export default function RequestCard({ r, compact = false }) {
  const { db, acceptRequest, declineRequest } = useApp();
  const me = db.sitters.find((s) => s.userId === db.session.userId);
  const dog = db.dogs.find((d) => d.id === r.dogId);
  const guardian = db.users.find((u) => u.id === r.guardianId);
  const distance = dog.neighborhood === me?.neighborhood ? '같은 동네' : '한 동네 거리';
  const amount = me ? me.ratePer30 * (r.duration / 30) : 0;
  const isDedicated = db.favorites.some((f) => f.dogId === dog.id && f.sitterId === me?.id);
  const isNewNeighbor = !db.bookings.some((b) => b.guardianId === r.guardianId && b.sitterId === me?.id);

  return (
    <div className="card">
      <div className="row between" style={{ marginBottom: 8 }}>
        <div className="row">
          <div className="dog-face">{dog.emoji}</div>
          <div>
            <div className="bold">
              {SERVICE[r.service].emoji} {SERVICE[r.service].label} · {subject(dog.name)}가 기다려요
            </div>
            <div className="muted">{fmtDate(r.date)} · {fmtClock(r.startTime)} · {r.duration}분</div>
          </div>
        </div>
        {isDedicated && <Chip tone="peach">⭐ 전담</Chip>}
      </div>

      {!compact && (
        <div style={{ margin: '8px 0' }}>
          <DogSizeChart weight={dog.weight} name={dog.name} compact />
        </div>
      )}

      <div className="small" style={{ lineHeight: 1.9 }}>
        🐶 {dog.breed} · {dog.weight}kg · {ageText(dog)} <Chip>{dog.neighborhood}</Chip> <Chip>{distance}</Chip>
        {isNewNeighbor && <Chip tone="green">🌱 첫 만남이에요</Chip>}
        <br />
        <span className="chips" style={{ display: 'inline-flex', marginTop: 4 }}>
          {dog.tags.slice(0, 5).map((t) => <Chip key={t} tone="peach">{t}</Chip>)}
        </span>
      </div>
      <div className="divider" />
      <div className="small">
        {r.cautions && <div>⚠️ {r.cautions}</div>}
        {r.route && r.service === 'walk' && <div style={{ marginTop: 4 }}>🛣️ 선호 경로: {r.route}</div>}
        <div className="muted" style={{ marginTop: 4 }}>보호자: {guardian.name}님</div>
      </div>
      <div className="divider" />
      <div className="row between">
        <span className="muted small">30분 {won(me?.ratePer30)} 기준</span>
        <span className="amount">{won(amount)}</span>
      </div>

      <div className="btn-row" style={{ marginTop: 12 }}>
        <Btn onClick={() => acceptRequest(r.id)}>수락할게요 🐾</Btn>
        <Btn variant="ghost" onClick={() => declineRequest(r.id)}>이번엔 어려워요</Btn>
      </div>
    </div>
  );
}

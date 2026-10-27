import React from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Btn, TopBar, Chip, Empty, Banner } from '../../components/ui.jsx';
import DogSizeChart from '../../components/DogSizeChart.jsx';
import { SERVICE, fmtDate, fmtClock, won, subject } from '../../utils.js';

// 시터 '요청함' — 들어온 요청 카드, 원클릭 수락/거절
export default function Inbox() {
  const { db, acceptRequest, declineRequest, push } = useApp();
  const me = db.sitters.find((s) => s.userId === db.session.userId);
  if (!me) return <Empty emoji="🙋" text="시터 프로필을 먼저 만들어주세요" />;
  const myReqIds = db.requests.filter((r) => r.requestedSitterIds.includes(me.id));
  const received = db.requests.filter(
    (r) => myReqIds.includes(r) && (r.status === 'awaiting_dedicated' || r.status === 'asking_neighbors')
  );

  return (
    <div>
      <TopBar title="들어온 돌봄 요청" />
      {received.length === 0 && <Empty emoji="🌱" text="지금은 새 요청이 없어요. 조금만 기다려봐요!" />}

      {received.map((r) => {
        const dog = db.dogs.find((d) => d.id === r.dogId);
        const guardian = db.users.find((u) => u.id === r.guardianId);
        const distance = dog.neighborhood === me.neighborhood ? '같은 동네' : '한 동네 거리';
        const amount = me.ratePer30 * (r.duration / 30);
        const isDedicated = db.favorites.some((f) => f.dogId === dog.id && f.sitterId === me.id);
        return (
          <Card key={r.id}>
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

            <div style={{ margin: '8px 0' }}>
              <DogSizeChart weight={dog.weight} name={dog.name} compact />
            </div>

            <div className="small" style={{ lineHeight: 1.9 }}>
              🐶 {dog.breed} · {dog.weight}kg · {dog.age}살 <Chip>{dog.neighborhood}</Chip> <Chip>{distance}</Chip>
              <br />
              <span className="chips" style={{ display: 'inline-flex', marginTop: 4 }}>
                {dog.tags.map((t) => <Chip key={t} tone="peach">{t}</Chip>)}
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
              <span className="muted small">30분 {won(me.ratePer30)} 기준</span>
              <span className="amount">{won(amount)}</span>
            </div>

            <div className="btn-row" style={{ marginTop: 12 }}>
              <Btn onClick={() => acceptRequest(r.id)}>수락할게요 🐾</Btn>
              <Btn variant="ghost" onClick={() => declineRequest(r.id)}>이번엔 어려워요</Btn>
            </div>
          </Card>
        );
      })}

      <Banner tone="info" emoji="🔒">채팅은 예약이 확정된 뒤에 열려요. 확정 전에는 요청 내용으로만 판단해주세요.</Banner>
    </div>
  );
}

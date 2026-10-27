import React from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, TopBar, Chip, Banner } from '../../components/ui.jsx';
import { SERVICE, fmtDate, withLang } from '../../utils.js';

// 다이어리 상세 보기 (보호자가 예약에서 열거나, 시터가 자신의 글 확인)
export default function DiaryDetail({ params }) {
  const { db } = useApp();
  const p = db.diaries.find((x) => x.id === params.diaryId);
  if (!p) return <div className="empty">다이어리를 찾을 수 없어요</div>;
  const dog = db.dogs.find((d) => d.id === p.dogId);
  const sitter = db.sitters.find((s) => s.id === p.sitterId);
  const booking = db.bookings.find((b) => b.id === p.bookingId);

  return (
    <div>
      <TopBar title={`${dog.name} 다이어리`} />
      <Card>
        <div className="head">
          <div className="dog-face sm">{dog.emoji}</div>
          <div className="grow">
            <div className="bold">{withLang(dog.name)} {SERVICE[booking?.service || 'walk'].label} 다녀왔어요</div>
            <div className="muted">{fmtDate(p.createdAt)} · {sitter.name}님이 작성</div>
          </div>
        </div>
        {p.photos.length > 0 && (
          <div className="photo-tiles" style={{ margin: '12px 0' }}>
            {p.photos.map((ph, i) => <div key={i} className="photo-tile" style={{ cursor: 'default' }}>{ph}</div>)}
          </div>
        )}
        <div className="chips" style={{ marginBottom: 10 }}>
          {p.checks.map((c) => <Chip key={c} tone="peach">{c}</Chip>)}
        </div>
        <div style={{ fontSize: 14.5, lineHeight: 1.8 }}>{p.body}</div>
      </Card>
      <Banner tone="info" emoji="📍">{p.neighborhood} 이웃들에게 공개된 다이어리예요 — 동 단위 위치만 표시돼요.</Banner>
    </div>
  );
}

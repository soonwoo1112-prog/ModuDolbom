import React, { useState } from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Chip, Empty, Banner } from '../../components/ui.jsx';
import { fmtDate } from '../../utils.js';

const FILTERS = ['우리 동네 전체', '우리 강아지', '내 시터들'];

// 동네일기 탭 — 인스타그램 같은 세로 스크롤 피드
// 시터는 예쁜 사진과 산책 기록으로 자기를 보여주고, 동네 강아지들이 친근해지는 공간
export default function Feed() {
  const { db, toggleLike, push } = useApp();
  const [filter, setFilter] = useState(FILTERS[0]);
  const me = db.users.find((u) => u.id === db.session.userId);
  const mySitter = db.sitters.find((s) => s.userId === db.session.userId);
  const isSitterMode = db.session.mode === 'sitter';
  const myDogIds = db.dogs.filter((d) => d.guardianId === me.id).map((d) => d.id);
  // 내 시터들: 내 강아지와 예약이 있었거나 전담으로 지정된 시터 (보호자 모드)
  const mySitterIds = new Set([
    ...db.bookings.filter((b) => myDogIds.includes(b.dogId)).map((b) => b.sitterId),
    ...db.favorites.filter((f) => f.guardianId === me.id).map((f) => f.sitterId),
  ]);

  let posts = db.diaries.filter((p) => p.isPublic);
  if (filter === '우리 강아지') posts = posts.filter((p) => myDogIds.includes(p.dogId));
  if (filter === '내 시터들') posts = posts.filter((p) => mySitterIds.has(p.sitterId));
  posts = [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <div className="section-title" style={{ marginTop: 0 }}>
        <h3>📸 동네일기</h3>
        <span className="muted small">{db.session.region || me.neighborhood}</span>
      </div>

      <div className="chips" style={{ marginBottom: 14 }}>
        {FILTERS.map((f) => (
          <Chip key={f} selectable selected={filter === f} onClick={() => setFilter(f)}>{f}</Chip>
        ))}
      </div>

      {posts.length === 0 && <Empty emoji="📷" text="아직 게시물이 없어요 — 돌봄이 이어지면 동네일기가 채워져요" />}

      {posts.map((p) => {
        const dog = db.dogs.find((d) => d.id === p.dogId);
        const sitter = db.sitters.find((s) => s.id === p.sitterId);
        return (
          <div key={p.id} className="feed-card card">
            <div className="feed-head">
              <button className="feed-dog" onClick={() => push('dogProfile', { dogId: dog.id })}>
                <span className="dog-face sm">{dog.emoji}</span>
                <span className="bold">{dog.name}</span>
              </button>
              <span className="muted small">와 함께했어요 · 📍 {p.neighborhood}</span>
            </div>

            {p.photos.length > 0 && (
              <div className={`feed-photos ${p.photos.length > 1 ? 'multi' : ''}`}>
                {p.photos.map((ph, i) => (
                  <div key={i} className="feed-photo">
                    {typeof ph === 'string' && (ph.startsWith('blob:') || ph.startsWith('data:'))
                      ? <img src={ph} alt="" />
                      : <span>{ph}</span>}
                  </div>
                ))}
              </div>
            )}

            <div className="chips" style={{ margin: '10px 0 8px' }}>
              {p.checks.map((c) => <Chip key={c} tone="peach">{c}</Chip>)}
            </div>

            <div style={{ fontSize: 14.5, lineHeight: 1.8 }}>{p.body}</div>

            <div className="feed-foot">
              <button className="feed-sitter" onClick={() => push('sitterProfile', { sitterId: sitter.id, dogId: dog.id })}>
                <span className="avatar sm">{sitter.emoji}</span>
                <span className="bold small">{sitter.name}님</span>
                <span className="muted small">· {fmtDate(p.createdAt)}</span>
              </button>
              <div className="feed-likes">
                <button className={`like-btn ${p.liked ? 'on' : ''}`} onClick={() => toggleLike(p.id)}>
                  {p.liked ? '❤️' : '🤍'} {p.likes || 0}
                </button>
                <span className="muted small">💬 {p.comments || 0}</span>
              </div>
            </div>
            {isSitterMode && sitter.id === mySitter?.id && (
              <div className="muted small" style={{ marginTop: 6 }}>내가 올린 동네일기예요 ✍️</div>
            )}
          </div>
        );
      })}

      <Banner tone="info" emoji="🔒">
        동네일기에는 <b>동 단위</b> 위치만 표시돼요. 상세 주소는 그 누구에게도 보이지 않아요.
      </Banner>
      <div className="muted small" style={{ textAlign: 'center' }}>
        강아지들이 친구가 되어가는 우리 동네 — 시터님들의 산책 기록이 자라나는 곳이에요 🌿
      </div>
    </div>
  );
}

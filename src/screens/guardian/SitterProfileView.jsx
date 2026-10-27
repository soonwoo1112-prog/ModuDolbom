import React, { useState } from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Btn, TopBar, Chip, Banner, Stars, SectionTitle } from '../../components/ui.jsx';
import { SERVICE, fmtDate, won, meetCountText } from '../../utils.js';

// 시터 프로필 — 커버 사진, 인증 배지, 통계, 함께한 강아지들,
// 이 시터가 올린 동네일기 사진 그리드, 리뷰, 전담 시터 지정
export default function SitterProfileView({ params }) {
  const { db, push, pop, toggleFavorite, showToast } = useApp();
  const s = db.sitters.find((x) => x.id === params.sitterId);
  if (!s) return <div className="empty">시터를 찾을 수 없어요</div>;
  const myDogs = db.dogs.filter((d) => d.guardianId === db.session.userId);
  const [pickDog, setPickDog] = useState(params.dogId || (myDogs[0] ? myDogs[0].id : null));

  const reviews = db.reviews.filter((rv) => rv.sitterId === s.id);
  const bookings = db.bookings.filter((b) => b.sitterId === s.id);
  const completed = bookings.filter((b) => b.status === 'completed');
  const dogsMet = [...new Set(bookings.map((b) => b.dogId))];
  const diaryPosts = db.diaries.filter((p) => p.sitterId === s.id && p.isPublic);
  const isFav = pickDog ? db.favorites.some((f) => f.dogId === pickDog && f.sitterId === s.id) : false;
  const meetCount = pickDog ? bookings.filter((b) => b.dogId === pickDog).length : null;
  const pickDogObj = db.dogs.find((d) => d.id === pickDog);

  return (
    <div>
      <TopBar title="시터 프로필" onBack={pop} />

      <div className="profile-cover">
        <div className="cover-emoji">{s.emoji}</div>
        <div className="cover-paws">🌿 🐾 🌿</div>
        <div className="profile-avatar-wrap">
          <div className="profile-avatar big"><span>{s.emoji}</span></div>
        </div>
      </div>

      <div className="profile-head">
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <span className="bold" style={{ fontSize: 20 }}>{s.name}님</span>
          {s.isNew && <Chip tone="peach">🌱 새로 온 이웃이에요</Chip>}
        </div>
        <div className="muted">📍 {s.neighborhood} · ⭐ {s.rating ?? '첫 돌봄 대기'} ({s.reviewCount}) · {s.hours}</div>
        <div className="muted small">30분 {won(s.ratePer30)} · 가능 요일 {s.days.join(', ')}</div>
        <div className="small" style={{ marginTop: 8, lineHeight: 1.8 }}>{s.intro}</div>
        <div className="chips" style={{ marginTop: 10 }}>
          <Chip tone={s.verified.identity ? 'green' : 'off'}>{s.verified.identity ? '✓ 신원 인증' : '신원 인증 대기'}</Chip>
          <Chip tone={s.verified.neighborhood ? 'green' : 'off'}>{s.verified.neighborhood ? '✓ 동네 인증' : '동네 인증 대기'}</Chip>
          <Chip tone={s.verified.account ? 'green' : 'off'}>{s.verified.account ? '✓ 계좌 인증' : '계좌 인증 대기'}</Chip>
          {s.eduBadge && <Chip tone="green">🎓 교육 이수</Chip>}
          {s.gpsShare && <Chip>📍 GPS 공유</Chip>}
          {s.actionCam && <Chip>📹 액션캠</Chip>}
        </div>
      </div>

      {/* ── 통계 ── */}
      <div className="stat-row">
        <div className="stat"><b>{completed.length}</b><span>돌본 횟수</span></div>
        <div className="stat"><b>{dogsMet.length}</b><span>동네 강아지</span></div>
        <div className="stat"><b>{s.rating ?? '—'}</b><span>평점 ({s.reviewCount})</span></div>
      </div>

      {/* ── 함께한 강아지들 ── */}
      <SectionTitle>함께한 강아지들</SectionTitle>
      <Card>
        <div className="row" style={{ flexWrap: 'wrap', gap: 12 }}>
          {dogsMet.map((did) => {
            const d = db.dogs.find((x) => x.id === did);
            const cnt = bookings.filter((b) => b.dogId === did).length;
            return (
              <button key={did} className="my-dog-avatar" onClick={() => push('dogProfile', { dogId: did })}>
                <span className="circle">{d.emoji}</span>
                <span className="nm">{d.name} <span className="muted">{cnt}번</span></span>
              </button>
            );
          })}
          {dogsMet.length === 0 && <div className="muted small">아직 함께한 강아지가 없어요</div>}
        </div>
      </Card>

      {/* ── 이 시터가 올린 동네일기 (3열 사진 그리드) ── */}
      <SectionTitle>이 시터의 동네일기</SectionTitle>
      {diaryPosts.length === 0 && <Card><div className="muted small">아직 올린 동네일기가 없어요</div></Card>}
      {diaryPosts.length > 0 && (
        <div className="gallery-grid">
          {diaryPosts.map((p) => {
            const d = db.dogs.find((x) => x.id === p.dogId);
            return (
              <div key={p.id} className="gallery-cell" onClick={() => push('diaryDetail', { diaryId: p.id })}>
                <span>{p.photos[0] || '📷'}</span>
                <span className="cell-cap small">{d.name}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 우리 강아지와의 인연 ── */}
      {pickDogObj && (
        <SectionTitle>우리 강아지와의 인연</SectionTitle>
      )}
      {pickDogObj && (
        <Card>
          <div className="small" style={{ lineHeight: 1.8 }}>
            🐾 {pickDogObj.name}와 <b>{meetCount}번</b> 만났어요<br />
            {meetCount >= 3 ? '이제 서로 아주 익숙한 사이예요.' : meetCount === 0 ? '아직 첫 만남이 남았어요. 온보딩 1단계부터 함께해요.' : '온보딩 단계를 하나씩 올라가는 중이에요.'}
          </div>
        </Card>
      )}

      {/* ── 리뷰 ── */}
      <SectionTitle>리뷰 {reviews.length}개</SectionTitle>
      {reviews.length === 0 && (
        <Card>
          <div className="row" style={{ gap: 8 }}>
            <span>🌱</span>
            <div className="muted small">새로 온 이웃이에요 — 아직 리뷰가 없어요. 첫 리뷰의 주인공이 되어보세요!</div>
          </div>
        </Card>
      )}
      {reviews.map((rv) => {
        const author = db.users.find((u) => u.id === rv.authorId);
        return (
          <Card key={rv.id}>
            <div className="row between" style={{ marginBottom: 6 }}>
              <div className="row">
                <div className="avatar sm">{author?.photo || '🙂'}</div>
                <span className="small bold">{author?.name || '보호자'}님</span>
              </div>
              <div className="row"><Stars value={rv.rating} small /><span className="muted small">{fmtDate(rv.createdAt)}</span></div>
            </div>
            <div className="small">{rv.content}</div>
          </Card>
        );
      })}

      {/* ── 전담 시터 지정 ── */}
      <SectionTitle>전담 시터 지정</SectionTitle>
      <Card>
        <div className="muted small" style={{ marginBottom: 8 }}>
          전담 시터를 지정하면 요청마다 가장 먼저 물어봐요. 같은 시터님과 반복돌봄으로 신뢰가 쌓여요.
        </div>
        {myDogs.length > 1 && (
          <div className="chips" style={{ marginBottom: 10 }}>
            {myDogs.map((d) => (
              <Chip key={d.id} selectable selected={pickDog === d.id} onClick={() => setPickDog(d.id)}>{d.emoji} {d.name}</Chip>
            ))}
          </div>
        )}
        <Btn
          full
          variant={isFav ? 'ghost' : 'primary'}
          disabled={!pickDog}
          onClick={() => {
            toggleFavorite(pickDog, s.id);
            showToast(isFav ? '전담 시터를 해제했어요' : `${s.name}님을 전담 시터로 지정했어요 💚`);
          }}
        >
          {isFav ? '⭐ 전담 시터 해제하기' : '⭐ 전담 시터로 지정하기'}
        </Btn>
      </Card>
      <Banner tone="info" emoji="🔒">연락처는 예약 확정 후에만 공유돼요. 그 전에는 채팅이 열리지 않아요.</Banner>
    </div>
  );
}

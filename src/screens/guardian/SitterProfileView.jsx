import React, { useState } from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Btn, TopBar, Chip, Banner, Stars, SectionTitle } from '../../components/ui.jsx';
import { SERVICE, fmtDate, won } from '../../utils.js';

// 시터 프로필 보기 — 인증 배지, 교육 배지, 리뷰, 만남 횟수, 전담 지정
export default function SitterProfileView({ params }) {
  const { db, push, toggleFavorite, showToast } = useApp();
  const s = db.sitters.find((x) => x.id === params.sitterId);
  if (!s) return <div className="empty">시터를 찾을 수 없어요</div>;
  const myDogs = db.dogs.filter((d) => d.guardianId === db.session.userId);
  const [pickDog, setPickDog] = useState(params.dogId || (myDogs[0] ? myDogs[0].id : null));

  const reviews = db.reviews.filter((rv) => rv.sitterId === s.id);
  const fav = myDogs.map((d) => db.favorites.find((f) => f.dogId === d.id && f.sitterId === s.id));
  const isFav = pickDog ? db.favorites.some((f) => f.dogId === pickDog && f.sitterId === s.id) : false;
  const meetCount = pickDog ? db.bookings.filter((b) => b.sitterId === s.id && b.dogId === pickDog).length : null;
  const pickDogObj = db.dogs.find((d) => d.id === pickDog);

  return (
    <div>
      <TopBar title="시터 프로필" />
      <Card>
        <div className="row" style={{ marginBottom: 10 }}>
          <div className="avatar lg">{s.emoji}</div>
          <div className="grow" style={{ paddingLeft: 6 }}>
            <div className="bold" style={{ fontSize: 18 }}>{s.name}님</div>
            <div className="muted">📍 {s.neighborhood} · <Stars value={s.rating} small /> {s.rating ?? '새 시터'} ({s.reviewCount})</div>
            <div className="muted small">{s.hours} · 30분 {won(s.ratePer30)}</div>
          </div>
        </div>
        {s.isNew && <Chip tone="peach">🌱 첫 돌봄을 기다리는 새 시터예요</Chip>}
        <div className="chips" style={{ marginTop: 8 }}>
          <Chip tone={s.verified.identity ? 'green' : 'off'}>{s.verified.identity ? '✓ 신원 인증' : '신원 인증 대기'}</Chip>
          <Chip tone={s.verified.neighborhood ? 'green' : 'off'}>{s.verified.neighborhood ? '✓ 동네 인증' : '동네 인증 대기'}</Chip>
          <Chip tone={s.verified.account ? 'green' : 'off'}>{s.verified.account ? '✓ 계좌 인증' : '계좌 인증 대기'}</Chip>
        </div>
        <div className="chips" style={{ marginTop: 6 }}>
          {s.eduBadge && <Chip tone="green">🎓 강아지 이해·안전 교육 이수</Chip>}
          {s.gpsShare && <Chip>📍 산책 GPS 공유</Chip>}
          {s.actionCam && <Chip>📹 액션캠 사용</Chip>}
        </div>
      </Card>

      <Card><div className="small">{s.intro}</div></Card>

      {pickDogObj && (
        <Card>
          <div className="bold" style={{ marginBottom: 8 }}>우리 강아지와의 인연</div>
          <div className="small" style={{ lineHeight: 1.8 }}>
            🐾 {pickDogObj.name}와 <b>{meetCount}번</b> 만났어요<br />
            {meetCount >= 3 ? '이제 서로 아주 익숙한 사이예요.' : meetCount === 0 ? '아직 첫 만남이 남았어요. 온보딩 1단계부터 함께해요.' : '온보딩 단계를 하나씩 올라가는 중이에요.'}
          </div>
        </Card>
      )}

      <SectionTitle>리뷰 {reviews.length}개</SectionTitle>
      {reviews.length === 0 && <Card><div className="muted small">아직 리뷰가 없어요. 첫 리뷰의 주인공이 되어보세요!</div></Card>}
      {reviews.map((rv) => (
        <Card key={rv.id}>
          <div className="row between" style={{ marginBottom: 6 }}>
            <Stars value={rv.rating} small />
            <span className="muted small">{fmtDate(rv.createdAt)}</span>
          </div>
          <div className="small">{rv.content}</div>
        </Card>
      ))}

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

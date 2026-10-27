import React from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Btn, TopBar, Chip, Card, SectionTitle, Banner, Empty } from '../../components/ui.jsx';
import DogSizeChart from '../../components/DogSizeChart.jsx';
import { PERSONALITY_CATEGORIES, ageText, sizeOf, fmtDate, meetCountText } from '../../utils.js';

// 강아지 프로필 — 커버 사진 + 큰 동그란 프로필 사진, 사진첩, 성격 태그,
// 소개/주의사항 분리, 건강·기본 정보, 크기 비교 다이어그램
export default function DogProfile({ params }) {
  const { db, push, pop } = useApp();
  const dog = db.dogs.find((d) => d.id === params.dogId);
  if (!dog) return <Empty emoji="🐶" text="강아지를 찾을 수 없어요" />;
  const isMine = dog.guardianId === db.session.userId;
  const diaryPosts = db.diaries.filter((p) => p.dogId === dog.id && p.isPublic);
  const bookings = db.bookings.filter((b) => b.dogId === dog.id);
  const sittersMet = new Set(bookings.map((b) => b.sitterId));

  return (
    <div>
      <TopBar
        title={dog.name}
        onBack={pop}
        right={isMine ? <Btn small onClick={() => push('dogEdit', { dogId: dog.id })}>✏️ 수정</Btn> : null}
      />

      <div className="profile-cover">
        <div className="cover-emoji">{dog.emoji}</div>
        <div className="cover-paws">🐾 🌿 🐾</div>
        <div className="profile-avatar-wrap">
          <div className="profile-avatar big">
            {dog.photo
              ? <img src={dog.photo} alt={dog.name} />
              : <span>{dog.emoji}</span>}
          </div>
        </div>
      </div>

      <div className="profile-head">
        <div className="bold" style={{ fontSize: 20 }}>{dog.name}</div>
        <div className="muted">
          {dog.breed} · {dog.weight}kg ({sizeOf(dog.weight)}) · {ageText(dog)} · 📍 {dog.neighborhood}
        </div>
        <div className="muted small" style={{ marginTop: 2 }}>
          {dog.birthday && !dog.birthdayUnknown && <>🎂 {fmtDate(dog.birthday).slice(0, -4)}</>}
          {dog.birthdayUnknown && <>🎂 정확한 생일은 몰라요{dog.approxYears ? ` · 약 ${dog.approxYears}살` : ''}</>}
          {dog.gotchaDate && <> · 🏠 가족이 된 날 {fmtDate(dog.gotchaDate)}</>}
        </div>
      </div>

      <SectionTitle>이런 아이예요</SectionTitle>
      <Card><div className="small" style={{ lineHeight: 1.8 }}>{dog.intro || '아직 소개가 없어요'}</div></Card>

      {dog.cautions && (
        <>
          <SectionTitle>꼭 지켜주세요</SectionTitle>
          <Card className="caution-card">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div className="small" style={{ lineHeight: 1.8, color: 'var(--danger)' }}>{dog.cautions}</div>
            </div>
          </Card>
        </>
      )}

      <SectionTitle>성격 태그</SectionTitle>
      <Card>
        {PERSONALITY_CATEGORIES.filter((c) => dog.tags.some((t) => c.tags.includes(t))).map((c) => (
          <div key={c.key} style={{ marginBottom: 8 }}>
            <div className="muted small bold">{c.label}</div>
            <div className="chips" style={{ marginTop: 4 }}>
              {dog.tags.filter((t) => c.tags.includes(t)).map((t) => <Chip key={t} tone="peach">{t}</Chip>)}
            </div>
          </div>
        ))}
        {dog.tags.filter((t) => !PERSONALITY_CATEGORIES.some((c) => c.tags.includes(t))).length > 0 && (
          <div>
            <div className="muted small bold">직접 추가한 태그</div>
            <div className="chips" style={{ marginTop: 4 }}>
              {dog.tags.filter((t) => !PERSONALITY_CATEGORIES.some((c) => c.tags.includes(t))).map((t) => <Chip key={t} tone="green">{t}</Chip>)}
            </div>
          </div>
        )}
        {dog.tags.length === 0 && <div className="muted small">아직 성격 태그가 없어요</div>}
      </Card>

      <SectionTitle>건강 · 기본 정보</SectionTitle>
      <Card>
        <div className="small" style={{ lineHeight: 2 }}>
          🩺 중성화: <b>{dog.neutered ? '했어요' : '아직이에요'}</b><br />
          🍚 알레르기·지병: <b>{dog.allergies || '없어요'}</b><br />
          💊 복용 약: <b>{dog.meds || '없어요'}</b><br />
          💉 예방접종: <b>{dog.vaccination || '미등록'}</b><br />
          {dog.regNumber && <>🪪 동물등록번호: <b>{dog.regNumber}</b><br /></>}
          {dog.vet?.name && <>🏥 자주 가는 병원: <b>{dog.vet.name}{dog.vet.phone ? ` (${dog.vet.phone})` : ''}</b></>}
        </div>
      </Card>

      <SectionTitle>사진첩</SectionTitle>
      <Card>
        {(dog.gallery || []).length === 0 && <div className="muted small">아직 사진이 없어요</div>}
        <div className="gallery-grid">
          {(dog.gallery || []).map((g, i) => (
            <div key={i} className="gallery-cell">
              {typeof g === 'string' && (g.startsWith('blob:') || g.startsWith('data:'))
                ? <img src={g} alt="" />
                : <span>{g}</span>}
            </div>
          ))}
        </div>
        {isMine && <div className="muted small" style={{ marginTop: 8 }}>수정 화면에서 사진을 추가할 수 있어요</div>}
      </Card>

      <SectionTitle>함께한 시터님들</SectionTitle>
      <Card>
        <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
          {[...sittersMet].map((sid) => {
            const s = db.sitters.find((x) => x.id === sid);
            const count = bookings.filter((b) => b.sitterId === sid).length;
            return (
              <button key={sid} className="feed-sitter" onClick={() => push('sitterProfile', { sitterId: sid, dogId: dog.id })}>
                <span className="avatar sm">{s.emoji}</span>
                <span className="small bold">{s.name}님 <span className="muted">{count}번</span></span>
              </button>
            );
          })}
          {sittersMet.size === 0 && <div className="muted small">아직 함께한 시터님이 없어요</div>}
        </div>
      </Card>

      <SectionTitle>{dog.name}가 나온 동네일기</SectionTitle>
      {diaryPosts.length === 0 && <Card><div className="muted small">아직 동네일기가 없어요</div></Card>}
      {diaryPosts.map((p) => {
        const sitter = db.sitters.find((s) => s.id === p.sitterId);
        return (
          <Card key={p.id} onClick={() => push('diaryDetail', { diaryId: p.id })}>
            <div className="row between">
              <div className="row">
                <div className="photo-tile sm">{p.photos[0] || '📷'}</div>
                <div>
                  <div className="bold small">{sitter.name}님이 남긴 일기</div>
                  <div className="muted small">{fmtDate(p.createdAt)} · 📍 {p.neighborhood}</div>
                </div>
              </div>
              <span className="muted">›</span>
            </div>
          </Card>
        );
      })}

      <SectionTitle>크기 비교 그림</SectionTitle>
      <Card>
        <DogSizeChart weight={dog.weight} name={dog.name} />
        <div className="muted small" style={{ textAlign: 'center', marginTop: 8 }}>
          보호자(165cm) 옆에 {dog.name}의 실루엣을 비율로 보여드려요.
        </div>
      </Card>

      <Banner tone="info" emoji="🔒">강아지 프로필 상세는 예약한 시터님에게만 공유돼요. 동네일기에는 동 단위까지만 보여요.</Banner>
    </div>
  );
}

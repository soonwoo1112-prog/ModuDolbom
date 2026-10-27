import React, { useState } from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Btn, TopBar, Chip, Empty, Field, SectionTitle, Banner } from '../../components/ui.jsx';
import { SERVICE, CHECK_ITEMS, fmtDate, fmtClock, withLang } from '../../utils.js';

const PHOTO_TILES = ['🐕', '🌳', '🦮', '🎾', '💧', '🌤️'];

// 시터 '다이어리' 탭 — 쓸 예약 선택 / 작성 화면(파라미터로 진입) + 비공개 인계 메모
export default function DiaryWrite({ params }) {
  const { db, push, postDiary, addNote, pop, showToast } = useApp();
  const me = db.sitters.find((s) => s.userId === db.session.userId);
  if (!me) return <Empty emoji="🙋" text="시터 프로필을 먼저 만들어주세요" />;

  if (params.bookingId) {
    return (
      <DiaryCompose
        bookingId={params.bookingId}
        db={db}
        me={me}
        postDiary={postDiary}
        addNote={addNote}
        pop={pop}
        showToast={showToast}
      />
    );
  }

  const myBookings = db.bookings.filter((b) => b.sitterId === me.id && b.status === 'completed');
  const writable = myBookings.filter((b) => !db.diaries.some((p) => p.bookingId === b.id));

  return (
    <div>
      <TopBar title="돌봄 다이어리" />
      <SectionTitle>다이어리 쓸 예약</SectionTitle>
      {writable.length === 0 && <Empty emoji="✍️" text="다이어리를 쓸 완료된 돌봄이 아직 없어요" />}
      {writable.map((b) => {
        const dog = db.dogs.find((d) => d.id === b.dogId);
        return (
          <Card key={b.id} onClick={() => push('diary', { bookingId: b.id })} className="row between">
            <div className="row">
              <div className="dog-face sm">{dog.emoji}</div>
              <div>
                <div className="bold">{withLang(dog.name)} {SERVICE[b.service].label} 다이어리 쓰기</div>
                <div className="muted">{fmtDate(b.date)} · {fmtClock(b.startTime)} 돌봄</div>
              </div>
            </div>
            <span className="muted">›</span>
          </Card>
        );
      })}

      <SectionTitle>우리 강아지 비공개 인계 메모</SectionTitle>
      <Card>
        <div className="muted small" style={{ marginBottom: 8 }}>
          이 강아지를 돌본 시터들만 볼 수 있어요. 보호자에게는 보이지 않아요.
        </div>
        {db.notes.map((n) => {
          const dog = db.dogs.find((d) => d.id === n.dogId);
          const sitter = db.sitters.find((s) => s.id === n.sitterId);
          return (
            <div key={n.id} className="small" style={{ padding: '8px 0', borderBottom: '1px solid #EAE3D8' }}>
              <b>{dog?.name}</b> <span className="muted">· {sitter?.name}님 · {fmtDate(n.createdAt)}</span>
              <div className="muted">{n.content}</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function DiaryCompose({ bookingId, db, me, postDiary, addNote, pop, showToast }) {
  const b = db.bookings.find((x) => x.id === bookingId);
  const dog = db.dogs.find((d) => d.id === b.dogId);
  const [photos, setPhotos] = useState(['🐕']);
  const [checks, setChecks] = useState([]);
  const [body, setBody] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [memo, setMemo] = useState('');

  // AI(연동 전) 자동 초안: 체크 항목과 강아지 정보로 따뜻한 한 문단 생성
  const autoWrite = () => {
    const lines = [];
    const where = b.service === 'walk' && dog.route ? `${dog.route}을` : '보호자님 댁을';
    lines.push(b.service === 'walk'
      ? `${withLang(dog.name)} ${where} 함께 천천히 걸었어요.`
      : `${withLang(dog.name)} 보호자님 댁에 방문해 함께 시간을 보냈어요.`);
    if (checks.includes('잘 먹었어요')) lines.push('간식도 잘 받아먹고');
    if (checks.includes('신나게 놀았어요')) lines.push('놀이 시간엔 신이 나서 폴짝폴짝 뛰었어요.');
    if (checks.includes('배변 잘 했어요')) lines.push('배변도 깔끔하게 잘 했어요.');
    if (checks.includes('낮잠 잘 잤어요')) lines.push('지친 듯 기지개를 켜고는 제 옆에서 낮잠에 빠졌어요.');
    if (checks.includes('산책 즐겁게 했어요')) lines.push('코를 킁풍거리며 구석구석 행복하게 산책했어요.');
    if (dog.tags.includes('겁많음') && b.service === 'walk') lines.push('처음엔 낯선 길을 머뭇거렸지만, 곧 제 곁에 바짝 붙어 편안하게 걸었어요.');
    if (dog.tags.includes('활발함')) lines.push(`${dog.name}의 에너지가 오늘도 저를 웃게 했어요.`);
    lines.push(`다음에도 ${dog.name}가 건강하고 즐겁게 지낼 수 있도록 함께해 주세요. 오늘도 좋은 시간이었어요! 🐾`);
    setBody(lines.join(' '));
    showToast('AI가 초안을 써줬어요 — 자유롭게 다듬어주세요 ✨');
  };

  const submit = () => {
    postDiary({
      bookingId: b.id, dogId: b.dogId, sitterId: me.id,
      photos, checks, body, neighborhood: dog.neighborhood, isPublic,
    });
    if (memo.trim()) addNote({ dogId: b.dogId, sitterId: me.id, content: memo.trim() });
    showToast('다이어리를 게시했어요! 보호자님에게 알림이 갔어요 📬');
    pop();
  };

  return (
    <div>
      <TopBar title={`${dog.name} 다이어리 쓰기`} />
      <Card>
        <div className="small muted">{fmtDate(b.date)} · {SERVICE[b.service].label} · {fmtClock(b.startTime)}</div>
      </Card>

      <SectionTitle>사진 (최대 3장)</SectionTitle>
      <Card>
        <div className="photo-tiles">
          {PHOTO_TILES.map((t) => (
            <div
              key={t}
              className={`photo-tile ${photos.includes(t) ? 'picked' : ''}`}
              onClick={() => setPhotos(photos.includes(t) ? photos.filter((x) => x !== t) : photos.length < 3 ? [...photos, t] : photos)}
            >
              {t}
            </div>
          ))}
        </div>
        <div className="muted small" style={{ marginTop: 8 }}>데모에서는 사진 타일로 대체돼요 — 실제 업로드는 준비 중이에요.</div>
      </Card>

      <SectionTitle>체크 항목</SectionTitle>
      <Card>
        <div className="chips">
          {CHECK_ITEMS.map((c) => (
            <Chip key={c} selectable selected={checks.includes(c)} onClick={() => setChecks(checks.includes(c) ? checks.filter((x) => x !== c) : [...checks, c])}>{c}</Chip>
          ))}
        </div>
      </Card>

      <SectionTitle>본문</SectionTitle>
      <Btn full variant="peach" onClick={autoWrite} style={{ marginBottom: 10 }}>✨ 다이어리 자동으로 써주기</Btn>
      <Field hint="자동 초안은 AI가 만든 거예요 — 마음껏 고쳐주세요">
        <textarea className="textarea" rows={6} value={body} onChange={(e) => setBody(e.target.value)} placeholder="오늘 돌봄 이야기를 적어주세요" />
      </Field>

      <SectionTitle>다음 시터를 위한 비공개 메모</SectionTitle>
      <Field hint="이 강아지를 돌본 시터들만 볼 수 있어요">
        <textarea className="textarea" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="예) 낯선 길에서 멈칫하면 잠깐 기다려주면 돼요" />
      </Field>

      <Card className="row between">
        <span className="small">우리 동네 피드에 공개하기</span>
        <Chip selectable selected={isPublic} onClick={() => setIsPublic(!isPublic)}>{isPublic ? '공개' : '비공개'}</Chip>
      </Card>

      <Banner tone="info" emoji="🔒">공개 다이어리에는 동 단위 위치만 표시돼요. 상세 주소는 절대 공유되지 않아요.</Banner>
      <Btn full big disabled={!body.trim() || checks.length === 0} onClick={submit}>다이어리 게시하기</Btn>
    </div>
  );
}

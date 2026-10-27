import React, { useState } from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Btn, TopBar, Chip, Field, Empty, Banner } from '../../components/ui.jsx';
import DogSizeChart from '../../components/DogSizeChart.jsx';

const TAGS = ['겁많음', '활발함', '사람좋아함', '고집있음', '조용해요', '짖어요', '낯가려요'];

// 보호자 '내 강아지' 탭 — 목록 + 등록/수정 폼 (크기 비교 그림 포함)
export default function Dogs({ params }) {
  const { db, push } = useApp();
  const myDogs = db.dogs.filter((d) => d.guardianId === db.session.userId);

  if (params.dogId !== undefined) {
    return <DogForm dogId={params.dogId} />;
  }

  return (
    <div>
      <TopBar
        title="내 강아지"
        right={<Btn small onClick={() => push('dogs', { dogId: 'new' })}>+ 강아지 추가</Btn>}
      />
      {myDogs.length === 0 && <Empty emoji="🐶" text="등록된 강아지가 없어요. 첫 아이를 등록해보세요!" />}
      {myDogs.map((d) => (
        <Card key={d.id} onClick={() => push('dogs', { dogId: d.id })}>
          <div className="row">
            <div className="dog-face">{d.emoji}</div>
            <div className="grow">
              <div className="bold">{d.name} · {d.breed}</div>
              <div className="muted">{d.weight}kg · {d.age}살 · {d.neighborhood}</div>
              <div className="chips" style={{ marginTop: 6 }}>
                {d.tags.map((t) => <Chip key={t} tone="peach">{t}</Chip>)}
              </div>
            </div>
            <span className="muted">수정 ›</span>
          </div>
        </Card>
      ))}
      <Banner tone="info" emoji="🔒">강아지 프로필은 예약한 시터님에게만 상세히 보여요. 피드에는 동 단위까지만 표시돼요.</Banner>
    </div>
  );
}

function DogForm({ dogId }) {
  const { db, saveDog, pop, showToast } = useApp();
  const existing = dogId === 'new' ? null : db.dogs.find((d) => d.id === dogId);
  const [d, setD] = useState(
    existing || { id: null, guardianId: db.session.userId, name: '', emoji: '🐶', breed: '', weight: 5, age: 1, tags: [], cautions: '', route: '', neighborhood: db.session.region || '망원동' }
  );
  const emojiOptions = ['🐶', '🐕', '🐩', '🦮', '🐕‍🦺'];

  const submit = () => {
    saveDog(existing ? d : { ...d, id: `d-${Date.now()}` });
    showToast(existing ? '강아지 정보를 저장했어요 🐾' : '새 가족을 등록했어요 🎉');
    pop();
  };

  return (
    <div>
      <TopBar title={existing ? `${existing.name} 정보 수정` : '강아지 등록'} onBack={pop} />
      <Card>
        <div className="chips" style={{ marginBottom: 12 }}>
          {emojiOptions.map((e) => (
            <Chip key={e} selectable selected={d.emoji === e} onClick={() => setD({ ...d, emoji: e })} className="chip" >{e}</Chip>
          ))}
        </div>
        <Field label="이름">
          <input className="input" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} placeholder="예) 콩이" />
        </Field>
        <Field label="견종">
          <input className="input" value={d.breed} onChange={(e) => setD({ ...d, breed: e.target.value })} placeholder="예) 말티즈" />
        </Field>
        <div className="row">
          <Field label="몸무게 (kg)" style={{ flex: 1 }}>
            <input className="input" type="number" min="1" max="60" value={d.weight} onChange={(e) => setD({ ...d, weight: Number(e.target.value) })} />
          </Field>
          <Field label="나이" style={{ flex: 1 }}>
            <input className="input" type="number" min="0" max="25" value={d.age} onChange={(e) => setD({ ...d, age: Number(e.target.value) })} />
          </Field>
        </div>
        <Field label="성격 태그">
          <div className="chips">
            {TAGS.map((t) => (
              <Chip key={t} selectable selected={d.tags.includes(t)} onClick={() => setD({ ...d, tags: d.tags.includes(t) ? d.tags.filter((x) => x !== t) : [...d.tags, t] })}>{t}</Chip>
            ))}
          </div>
        </Field>
        <Field label="주의사항" hint="시터님에게 꼭 알려야 할 내용을 적어주세요">
          <textarea className="textarea" value={d.cautions} onChange={(e) => setD({ ...d, cautions: e.target.value })} placeholder="예) 큰 소리를 무려워해요" />
        </Field>
        <Field label="산책 선호 경로">
          <textarea className="textarea" value={d.route} onChange={(e) => setD({ ...d, route: e.target.value })} placeholder="예) 망원한강공원 물가 둘레길" />
        </Field>
      </Card>

      <div className="section-title"><h3>크기 비교 그림</h3></div>
      <Card>
        <DogSizeChart weight={d.weight} name={d.name || '우리 강아지'} />
        <div className="muted small" style={{ textAlign: 'center', marginTop: 8 }}>
          몸무게와 견종을 넣으면 보호자(165cm) 옆에 강아지 실루엣을 비율로 보여드려요.
        </div>
      </Card>

      <Btn full big disabled={!d.name || !d.breed} onClick={submit}>
        {existing ? '저장하기' : '등록하기'}
      </Btn>
    </div>
  );
}

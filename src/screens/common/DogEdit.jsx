import React, { useState } from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Btn, TopBar, Chip, Card, Field, Banner, SectionTitle } from '../../components/ui.jsx';
import DogSizeChart from '../../components/DogSizeChart.jsx';
import { PERSONALITY_CATEGORIES, ageText } from '../../utils.js';

const GALLERY_EMOJI = ['🐕', '🌳', '🎾', '🦴', '⛺', '💧', '🌤️', '🐾'];
const isImg = (v) => typeof v === 'string' && (v.startsWith('blob:') || v.startsWith('data:'));

// 강아지 등록/수정 — 커버·프로필 사진 업로드(메모리 저장), 생일 or 추정 나이,
// 카테고리별 성격 태그, 소개/주의사항 분리, 건강 정보, 크기 비교
export default function DogEdit({ params }) {
  const { db, saveDog, pop, showToast } = useApp();
  const existing = params.dogId && params.dogId !== 'new' ? db.dogs.find((d) => d.id === params.dogId) : null;
  const [d, setD] = useState(existing || {
    id: null, guardianId: db.session.userId, name: '', emoji: '🐶', photo: null,
    breed: '', weight: 5,
    birthday: '', birthdayUnknown: false, approxYears: 1, approxMonths: 0, gotchaDate: '',
    tags: [], intro: '', cautions: '',
    neutered: false, allergies: '', meds: '', vaccination: '', regNumber: '',
    vet: { name: '', phone: '' },
    gallery: [],
    neighborhood: db.session.region || '망원동',
  });
  const [customTag, setCustomTag] = useState('');

  const set = (patch) => setD((x) => ({ ...x, ...patch }));
  const toggleTag = (t) => set({ tags: d.tags.includes(t) ? d.tags.filter((x) => x !== t) : [...d.tags, t] });

  const uploadPhoto = (e, target) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    if (target === 'photo') set({ photo: url });
    else set({ gallery: [...(d.gallery || []), url] });
    showToast('사진을 붙였어요 — 미리보기로 보여드려요 (메모리 저장)');
  };

  const submit = () => {
    saveDog(existing ? d : { ...d, id: `d-${Date.now()}` });
    showToast(existing ? '강아지 정보를 저장했어요 🐾' : '새 가족을 등록했어요 🎉');
    pop();
  };

  const customTags = d.tags.filter((t) => !PERSONALITY_CATEGORIES.some((c) => c.tags.includes(t)));

  return (
    <div>
      <TopBar title={existing ? `${existing.name} 정보 수정` : '강아지 등록'} onBack={pop} />

      <div className="profile-cover small-cover">
        <div className="cover-emoji">{d.emoji}</div>
        <div className="profile-avatar-wrap">
          <label className="profile-avatar big upload">
            {d.photo ? <img src={d.photo} alt="" /> : <span>{d.emoji}</span>}
            <span className="upload-hint">📷</span>
            <input type="file" accept="image/*" hidden onChange={(e) => uploadPhoto(e, 'photo')} />
          </label>
        </div>
      </div>

      <Card>
        <div className="chips" style={{ marginBottom: 12 }}>
          {['🐶', '🐕', '🐩', '🦮', '🐕‍🦺'].map((e) => (
            <Chip key={e} selectable selected={d.emoji === e} onClick={() => set({ emoji: e, photo: null })}>{e}</Chip>
          ))}
        </div>
        <Field label="이름">
          <input className="input" value={d.name} onChange={(e) => set({ name: e.target.value })} placeholder="예) 콩이" />
        </Field>
        <Field label="견종">
          <input className="input" value={d.breed} onChange={(e) => set({ breed: e.target.value })} placeholder="예) 말티즈" />
        </Field>
        <div className="row">
          <Field label="몸무게 (kg)" style={{ flex: 1 }}>
            <input className="input" type="number" min="1" max="60" value={d.weight} onChange={(e) => set({ weight: Number(e.target.value) })} />
          </Field>
          <Field label="사는 동네" style={{ flex: 1 }}>
            <input className="input" value={d.neighborhood} onChange={(e) => set({ neighborhood: e.target.value })} />
          </Field>
        </div>
      </Card>

      <SectionTitle>나이</SectionTitle>
      <Card>
        <Field label="생일">
          <input className="input" type="date" value={d.birthday || ''} disabled={d.birthdayUnknown}
            onChange={(e) => set({ birthday: e.target.value })} />
        </Field>
        <label className="check-row">
          <input type="checkbox" checked={d.birthdayUnknown} onChange={(e) => set({ birthdayUnknown: e.target.checked })} />
          <span className="small">정확한 생일을 몰라요 (입양했어요 등)</span>
        </label>
        {d.birthdayUnknown && (
          <div className="row" style={{ marginTop: 10 }}>
            <Field label="대략 나이 (년)" style={{ flex: 1 }}>
              <input className="input" type="number" min="0" max="25" value={d.approxYears}
                onChange={(e) => set({ approxYears: Number(e.target.value) })} />
            </Field>
            <Field label="개월" style={{ flex: 1 }}>
              <input className="input" type="number" min="0" max="11" value={d.approxMonths}
                onChange={(e) => set({ approxMonths: Number(e.target.value) })} />
            </Field>
          </div>
        )}
        <Field label="가족이 된 날 (입양일, 선택)">
          <input className="input" type="date" value={d.gotchaDate || ''} onChange={(e) => set({ gotchaDate: e.target.value })} />
        </Field>
        <div className="muted small">표시: <b>{ageText(d)}</b>{d.gotchaDate ? ' · 가족이 된 날 표시' : ''}</div>
      </Card>

      <SectionTitle>성격 태그</SectionTitle>
      {PERSONALITY_CATEGORIES.map((c) => (
        <Card key={c.key}>
          <div className="bold small" style={{ marginBottom: 8 }}>{c.label}</div>
          <div className="chips">
            {c.tags.map((t) => (
              <Chip key={t} selectable selected={d.tags.includes(t)} onClick={() => toggleTag(t)}>{t}</Chip>
            ))}
          </div>
        </Card>
      ))}
      <Card>
        <div className="bold small" style={{ marginBottom: 8 }}>직접 추가</div>
        <div className="row">
          <input className="input" style={{ flex: 1 }} value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && customTag.trim()) { toggleTag(customTag.trim()); setCustomTag(''); } }}
            placeholder="예) 고양이를 좋아해요" />
          <Btn small variant="soft" onClick={() => { if (customTag.trim()) { toggleTag(customTag.trim()); setCustomTag(''); } }}>추가</Btn>
        </div>
        {customTags.length > 0 && (
          <div className="chips" style={{ marginTop: 10 }}>
            {customTags.map((t) => <Chip key={t} tone="green" selectable selected onClick={() => toggleTag(t)}>{t} ✕</Chip>)}
          </div>
        )}
      </Card>

      <SectionTitle>소개와 주의사항</SectionTitle>
      <Card>
        <Field label="소개 — 이런 아이예요" hint="자유롭게 우리 강아지를 소개해주세요">
          <textarea className="textarea" value={d.intro} onChange={(e) => set({ intro: e.target.value })}
            placeholder="예) 처음엔 낯가리지만, 간식 하나면 금방 친해져요." />
        </Field>
        <Field label="주의사항 — 꼭 지켜주세요" hint="시터님이 꼭 알아야 할 내용이에요">
          <textarea className="textarea" value={d.cautions} onChange={(e) => set({ cautions: e.target.value })}
            placeholder="예) 오토바이 소리에 놀라 멈춰요. 목줄은 꼭 채워주세요." />
        </Field>
      </Card>

      <SectionTitle>건강 · 기본 정보</SectionTitle>
      <Card>
        <Field label="중성화 여부">
          <div className="chips">
            <Chip selectable selected={d.neutered} onClick={() => set({ neutered: true })}>했어요</Chip>
            <Chip selectable selected={!d.neutered} onClick={() => set({ neutered: false })}>아직이에요</Chip>
          </div>
        </Field>
        <Field label="알레르기 · 지병">
          <input className="input" value={d.allergies} onChange={(e) => set({ allergies: e.target.value })} placeholder="예) 없어요 / 닭고기 알레르기" />
        </Field>
        <Field label="복용 약">
          <input className="input" value={d.meds} onChange={(e) => set({ meds: e.target.value })} placeholder="예) 없어요 / 심장사상충 예방약 월 1회" />
        </Field>
        <Field label="예방접종 상태">
          <input className="input" value={d.vaccination} onChange={(e) => set({ vaccination: e.target.value })} placeholder="예) 종합백신·광견병 연 1회 접종 완료" />
        </Field>
        <Field label="동물등록번호 (선택)">
          <input className="input" value={d.regNumber} onChange={(e) => set({ regNumber: e.target.value })} />
        </Field>
        <div className="row">
          <Field label="자주 가는 동물병원 (선택)" style={{ flex: 1 }}>
            <input className="input" value={d.vet?.name || ''} onChange={(e) => set({ vet: { ...(d.vet || { name: '', phone: '' }), name: e.target.value } })} placeholder="병원 이름" />
          </Field>
          <Field label="연락처 (선택)" style={{ flex: 1 }}>
            <input className="input" value={d.vet?.phone || ''} onChange={(e) => set({ vet: { ...(d.vet || { name: '', phone: '' }), phone: e.target.value } })} placeholder="02-000-0000" />
          </Field>
        </div>
      </Card>

      <SectionTitle>사진첩</SectionTitle>
      <Card>
        <div className="gallery-grid">
          {(d.gallery || []).map((g, i) => (
            <div key={i} className="gallery-cell" onClick={() => set({ gallery: d.gallery.filter((_, j) => j !== i) })}>
              {isImg(g) ? <img src={g} alt="" /> : <span>{g}</span>}
              <span className="del">✕</span>
            </div>
          ))}
          <label className="gallery-cell add">
            <span>📷</span>
            <span className="small muted">사진 추가</span>
            <input type="file" accept="image/*" hidden onChange={(e) => uploadPhoto(e, 'gallery')} />
          </label>
        </div>
        <div className="chips" style={{ marginTop: 10 }}>
          {GALLERY_EMOJI.map((e) => (
            <Chip key={e} selectable selected={(d.gallery || []).includes(e)}
              onClick={() => set({ gallery: (d.gallery || []).includes(e) ? d.gallery.filter((x) => x !== e) : [...(d.gallery || []), e] })}>
              {e}
            </Chip>
          ))}
        </div>
        <div className="muted small" style={{ marginTop: 8 }}>
          업로드한 사진은 미리보기로 표시돼요 (메모리 저장). 데모에서는 이모지 타일도 쓸 수 있어요.
        </div>
      </Card>

      <SectionTitle>크기 비교 그림</SectionTitle>
      <Card>
        <DogSizeChart weight={d.weight} name={d.name || '우리 강아지'} />
      </Card>

      <Banner tone="info" emoji="🛣️">산책 선호 경로는 프로필이 아니라 요청할 때마다 적어주시면 돼요.</Banner>
      <Btn full big disabled={!d.name || !d.breed} onClick={submit}>
        {existing ? '저장하기' : '등록하기'}
      </Btn>
    </div>
  );
}

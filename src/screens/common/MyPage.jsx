import React, { useState } from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { Card, Btn, TopBar, Chip, SectionTitle, Field, Modal } from '../../components/ui.jsx';
import { ageText } from '../../utils.js';

// 마이페이지 — 내 프로필(편집 가능), 내 강아지(보호자), 시터 활동(시터), 우리 동네
export default function MyPage() {
  const { db, setMode, push, updateMyUser, showToast } = useApp();
  const user = db.users.find((u) => u.id === db.session.userId);
  const me = db.sitters.find((s) => s.userId === db.session.userId);
  const isSitter = db.session.mode === 'sitter';
  const myDogs = db.dogs.filter((d) => d.guardianId === user.id);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ photo: null, name: '', intro: '' });

  const openEdit = () => {
    setForm({ photo: user.photo, name: user.name, intro: user.intro || '' });
    setEditing(true);
  };
  const upload = (e) => {
    const f = e.target.files?.[0];
    if (f) setForm((f2) => ({ ...f2, photo: URL.createObjectURL(f) }));
  };
  const save = () => {
    updateMyUser({ photo: form.photo, name: form.name || user.name, intro: form.intro });
    setEditing(false);
    showToast('프로필을 저장했어요 😊');
  };

  return (
    <div>
      <TopBar title="마이" />

      {/* ── 내 프로필 ── */}
      <div className="profile-cover small-cover">
        <div className="cover-emoji">{user.photo || '🙂'}</div>
        <div className="profile-avatar-wrap">
          <div className="profile-avatar big"><span>{user.photo || '🙂'}</span></div>
        </div>
      </div>
      <div className="profile-head">
        <div className="row between">
          <div className="bold" style={{ fontSize: 20 }}>{user.name}님</div>
          <Btn small variant="soft" onClick={openEdit}>✏️ 프로필 편집</Btn>
        </div>
        <div className="muted">
          📍 {db.session.region || user.neighborhood} ·{' '}
          {db.session.role === 'both' ? '보호자 · 이웃 시터' : db.session.role === 'sitter' ? '이웃 시터' : '보호자'}
        </div>
        {user.intro && <div className="small" style={{ marginTop: 6, lineHeight: 1.8 }}>{user.intro}</div>}
      </div>

      {/* ── 역할 전환 ── */}
      <SectionTitle>역할 전환</SectionTitle>
      <Card>
        <div className="muted small" style={{ marginBottom: 10 }}>
          상단 칩이나 여기에서 언제든 바꿔요. 두 역할 모두 활동할 수 있어요.
        </div>
        <div className="btn-row">
          <Btn variant={!isSitter ? 'primary' : 'ghost'} onClick={() => setMode('guardian')}>🐶 보호자 모드</Btn>
          {me && <Btn variant={isSitter ? 'primary' : 'ghost'} onClick={() => setMode('sitter')}>🤝 시터 모드</Btn>}
        </div>
      </Card>

      {/* ── 내 강아지 (보호자) ── */}
      {!isSitter && (
        <>
          <SectionTitle action={<Btn small variant="soft" onClick={() => push('dogEdit', { dogId: 'new' })}>+ 추가</Btn>}>
            내 강아지
          </SectionTitle>
          {myDogs.length === 0 && <Card><div className="muted small">아직 등록된 강아지가 없어요</div></Card>}
          {myDogs.map((d) => (
            <Card key={d.id} onClick={() => push('dogProfile', { dogId: d.id })}>
              <div className="row between">
                <div className="row">
                  <div className="dog-face sm">{d.emoji}</div>
                  <div>
                    <div className="bold">{d.name} · {d.breed}</div>
                    <div className="muted">{d.weight}kg · {ageText(d)} · {d.neighborhood}</div>
                  </div>
                </div>
                <span className="muted">›</span>
              </div>
            </Card>
          ))}
        </>
      )}

      {/* ── 시터 활동 (시터) ── */}
      {me && isSitter && (
        <>
          <SectionTitle>시터 활동</SectionTitle>
          <Card onClick={() => push('verify')} className="row between">
            <div>
              <div className="bold">🪪 내 시터 프로필 · 인증</div>
              <div className="muted small">
                신원·동네·계좌 인증 {Object.values(me.verified).filter(Boolean).length}/3
                {me.eduBadge && ' · 🎓 교육 배지'}
              </div>
            </div>
            <span className="muted">›</span>
          </Card>
          <Card onClick={() => push('diary')} className="row between">
            <div>
              <div className="bold">✍️ 돌봄 다이어리 작성</div>
              <div className="muted small">완료된 돌봄의 다이어리 쓰기 · 인계 메모</div>
            </div>
            <span className="muted">›</span>
          </Card>
          <Card onClick={() => push('learn')} className="row between">
            <div>
              <div className="bold">📚 배우기 (선택)</div>
              <div className="muted small">짧은 아티클 + 퀴즈 · 이수하면 🎓 배지</div>
            </div>
            <span className="muted">›</span>
          </Card>
          <Card onClick={() => push('membership')} className="row between">
            <div>
              <div className="bold">🌱 멤버십 (월 구독료)</div>
              <div className="muted small">플랜: {me.plan ?? '미가입'} · ⭐ {me.rating ?? '—'} ({me.reviewCount})</div>
            </div>
            <span className="muted">›</span>
          </Card>
        </>
      )}

      {/* ── 우리 동네 ── */}
      <SectionTitle>우리 동네</SectionTitle>
      <Card onClick={() => push('waitlist')} className="row between">
        <div>
          <div className="bold">✉️ 다른 동네 오픈 알림 받기</div>
          <div className="muted small">지금은 마포구 망원동·성산동에서 운영해요</div>
        </div>
        <span className="muted">›</span>
      </Card>

      <SectionTitle>약관·안내</SectionTitle>
      <Card>
        <div className="small muted" style={{ lineHeight: 1.9 }}>
          · 개인정보: 상세 주소는 어디에도 표시되지 않아요 (동 단위만 노출)<br />
          · 결제: 플랫폼을 통해 안전하게 결제돼요 (연동 준비 중)<br />
          · 문의: help@modudolbom.example
        </div>
      </Card>

      {editing && (
        <Modal title="프로필 편집" onClose={() => setEditing(false)}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <label className="profile-avatar big upload">
              {form.photo ? <img src={form.photo} alt="" /> : <span>🙂</span>}
              <span className="upload-hint">📷</span>
              <input type="file" accept="image/*" hidden onChange={upload} />
            </label>
          </div>
          <Field label="이름">
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="소개" hint="시터님들이 보는 나의 소개예요">
            <textarea className="textarea" value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })}
              placeholder="예) 콩이와 보리를 키우는 보호자예요. 시간 약속을 잘 지켜요." />
          </Field>
          <div className="btn-row">
            <Btn variant="ghost" onClick={() => setEditing(false)}>취소</Btn>
            <Btn onClick={save}>저장하기</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

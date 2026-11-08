import React from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../store.jsx';
import { Btn, Badge, ChipGroup, Icon, IconButton } from '../ui.jsx';

// Calendar for the preview: November 2026 (the 1st is a Sunday); today is the 6th.
const DOW = ['일', '월', '화', '수', '목', '금', '토'];
const ORDER = ['월', '화', '수', '목', '금', '토', '일'];
const TODAY = 6;
export const dowOf = (d) => DOW[(d - 1) % 7];
export const fmtDay = (d) => `11월 ${d}일 (${dowOf(d)})`;

// One wording of the schedule, used on 예약, 시터 고르기 and 요청 현황.
export function describeSchedule(f) {
  if (f.freq === '한 번') return { ok: true, label: fmtDay(f.once), sub: '', title: fmtDay(f.once), summary: `${fmtDay(f.once)} 한 번 산책해요` };
  const days = ORDER.filter((k) => f.days[k]);
  if (!days.length) return { ok: false, label: '요일을 골라 주세요', sub: '', title: '반복', summary: '산책하는 요일을 골라 주세요', why: '요일을 골라 주세요' };
  const list = days.join(', ');
  if (f.noEnd) return { ok: true, label: `매주 ${list}`, sub: `11월 ${f.start}일부터 계속`, title: `매주 ${list}`, summary: `11월 ${f.start}일부터 매주 ${list}에 산책해요` };
  if (!f.end) return { ok: false, label: `매주 ${list}`, sub: `11월 ${f.start}일부터`, title: `매주 ${list}`, summary: '끝나는 날을 골라 주세요', why: '끝나는 날을 골라 주세요' };
  let count = 0;
  for (let d = f.start; d <= f.end; d++) if (f.days[dowOf(d)]) count++;
  return { ok: true, label: `매주 ${list}`, sub: `11월 ${f.start}일부터 ${f.end}일까지, 모두 ${count}번`, title: `매주 ${list}`, summary: `11월 ${f.start}일부터 ${f.end}일까지 매주 ${list}, 모두 ${count}번 산책해요` };
}

export const entryText = (a) => (a.method === '비밀번호' ? '공동현관 비밀번호로 들어와요' : a.method === '호출' ? `${a.code}호 호출해요` : '현관이 열려 있어요');

export const PICKUP_HINTS = {
  '비밀번호로 들어와요': '비밀번호로 들어오시면 돼요.',
  '호출해 주세요': '집에 있어요. 호출하시면 현관에서 뵐게요.',
  '용품은 현관에': '목줄이랑 용품은 현관 앞에 뒀어요.',
  '크레이트에 있어요': '크레이트 안에 있어요. 꺼내 주시고 산책 후에는 풀어 두세요.',
};

function Sheet({ title, onClose, onBack, children }) {
  const host = document.querySelector('.app-shell');
  const sheet = (
    <div className="app-overlay" onClick={onClose}>
      <div className="app-sheet" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <span className="app-sheet__handle" aria-hidden="true" />
        <div className="md-sheet__head">
          {onBack ? <IconButton icon="ChevronLeft" label="주소 목록으로" onClick={onBack} /> : <span />}
          <h2>{title}</h2>
          {onBack ? <span /> : <IconButton icon="X" label="닫기" onClick={onClose} />}
        </div>
        {children}
      </div>
    </div>
  );
  return host ? createPortal(sheet, host) : sheet;
}

// ── 날짜 고르기 (한 번 / 반복) ──
export function DateSheet({ onClose }) {
  const { flow, update } = useApp();
  const repeat = flow.freq === '반복';
  const end = flow.noEnd ? null : flow.end;
  const s = describeSchedule(flow);
  const pick = (d) => {
    if (!repeat) return update({ once: d });
    if (flow.noEnd) return update({ start: d });
    if (!flow.pickingEnd || d <= flow.start) return update({ start: d, end: null, pickingEnd: true });
    update({ end: d, pickingEnd: false });
  };
  return (
    <Sheet title={repeat ? '반복 일정 고르기' : '날짜 고르기'} onClose={onClose}>
      <div className="md-seg" role="group" aria-label="산책 횟수">
        {['한 번', '반복'].map((l) => <button key={l} type="button" aria-pressed={flow.freq === l} onClick={() => update({ freq: l })}>{l}</button>)}
      </div>
      {repeat ? (
        <>
          <section className="app-section">
            <span className="md-field__label">산책하는 요일</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0,1fr))', gap: 4 }} role="group" aria-label="산책하는 요일">
              {ORDER.map((k) => <button key={k} type="button" className="md-chip md-pressable" aria-pressed={!!flow.days[k]} style={{ justifyContent: 'center', padding: 0 }} onClick={() => update((f) => ({ days: { ...f.days, [k]: !f.days[k] } }))}><span style={{ padding: 0 }}>{k}</span></button>)}
            </div>
          </section>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}>
            <span className="md-label">끝나는 날 없이 계속하기</span>
            <input className="md-check" type="checkbox" checked={flow.noEnd} onChange={() => update((f) => ({ noEnd: !f.noEnd, pickingEnd: false, end: f.end || 30 }))} />
          </label>
        </>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="md-section-title md-num">2026년 11월</span>
          <span className="md-detail">{repeat ? (flow.noEnd ? '시작하는 날을 골라 주세요' : '시작하는 날과 끝나는 날을 골라 주세요') : '산책할 날을 골라 주세요'}</span>
        </div>
        <div className="md-cal" aria-hidden="true">{DOW.map((d, i) => <span key={d} className="md-cal__dow" style={i === 0 ? { color: 'var(--fg-critical)' } : i === 6 ? { color: 'var(--fg-informative)' } : undefined}>{d}</span>)}</div>
        <div className="md-cal" role="grid" aria-label="2026년 11월">
          {Array.from({ length: 30 }).map((_, i) => {
            const d = i + 1;
            const isStart = repeat && d === flow.start;
            const isEnd = repeat && !!end && d === end;
            const picked = repeat ? isStart || isEnd : d === flow.once;
            const walk = repeat && !picked && flow.days[dowOf(d)] && d >= flow.start && (end ? d <= end : true);
            let band;
            if (repeat && end && d > flow.start && d < end) band = { background: 'var(--bg-brand-weak)' };
            if (repeat && end && isStart && end > flow.start) band = { background: 'linear-gradient(to right, transparent 50%, var(--bg-brand-weak) 50%)' };
            if (isEnd) band = { background: 'linear-gradient(to left, transparent 50%, var(--bg-brand-weak) 50%)' };
            const num = picked ? { background: 'var(--bg-brand-solid)', color: 'var(--fg-on-brand-solid)', fontWeight: 700 }
              : walk ? { color: 'var(--fg-brand)', fontWeight: 700 }
                : d === TODAY ? { boxShadow: 'inset 0 0 0 1.5px var(--stroke-neutral-contrast)', fontWeight: 700 } : undefined;
            return (
              <button key={d} type="button" className="md-cal__cell" disabled={d < TODAY} aria-pressed={picked} aria-label={`${fmtDay(d)}${walk ? ', 산책하는 날' : ''}`} style={band} onClick={() => pick(d)}>
                <span className="md-cal__num" style={num}>{d}</span>
                {walk ? <span className="md-cal__dot" /> : null}
              </button>
            );
          })}
        </div>
      </div>
      <div role="status" style={{ padding: 12, borderRadius: 'var(--r3)', background: 'var(--bg-layer-basement)', fontSize: 14, lineHeight: '19px' }}>{s.summary}</div>
      <Btn variant="brand" size="large" disabled={!s.ok} onClick={onClose}>{s.ok ? (repeat ? '이 일정으로 정하기' : `${fmtDay(flow.once)}로 정하기`) : s.why}</Btn>
    </Sheet>
  );
}

// ── 주소 목록 ──
export function AddressSheet({ onClose, onOpen }) {
  const { flow, showSnack } = useApp();
  return (
    <Sheet title="주소" onClose={onClose}>
      <div className="md-list" style={{ margin: '0 -16px' }}>
        {Object.entries(flow.addrs).map(([id, a]) => (
          <button key={id} type="button" className="md-item md-pressable" style={{ border: 0, width: '100%', textAlign: 'left', boxShadow: 'inset 0 -1px 0 var(--stroke-neutral-subtle)' }} onClick={() => onOpen(id)}>
            <span className="md-thumb" style={{ width: 44, height: 44, borderRadius: 9999 }}><Icon name="MapPin" size={18} /></span>
            <span className="md-item__body">
              <span className="md-item__head"><span className="md-list-title">{a.label}</span>{id === flow.addrId ? <Badge tone="brand">지금 쓰는 주소</Badge> : null}</span>
              <span className="md-item__muted">{a.line}, {a.detail}</span>
              <span className="md-detail">{entryText(a)}</span>
            </span>
            <Icon name="ChevronRight" size={18} style={{ color: 'var(--fg-neutral-subtle)' }} />
          </button>
        ))}
      </div>
      <Btn variant="outline" style={{ width: '100%' }} onClick={() => showSnack('주소 추가는 다음 버전에서 볼 수 있어요')}><Icon name="Plus" size={18} />주소 추가하기</Btn>
      <span className="md-detail" style={{ textAlign: 'center' }}>주소를 누르면 상세 주소와 들어오는 방법을 적을 수 있어요</span>
    </Sheet>
  );
}

// ── 주소 자세히 ──
export function AddressDetailSheet({ id, onClose, onBack }) {
  const { flow, update, showSnack } = useApp();
  const a = flow.addrs[id];
  const set = (patch) => update((f) => ({ addrs: { ...f.addrs, [id]: { ...f.addrs[id], ...patch } } }));
  return (
    <Sheet title={a.label} onClose={onClose} onBack={onBack}>
      <div className="md-field">
        <span className="md-field__label">주소</span>
        <div className="md-inputbtn" style={{ cursor: 'default' }}><Icon name="MapPin" size={18} /><span className="md-inputbtn__text">{a.line}</span></div>
      </div>
      <div className="md-field"><label className="md-field__label" htmlFor="addr-detail">상세 주소</label><input className="md-input" id="addr-detail" value={a.detail} onChange={(e) => set({ detail: e.target.value })} /></div>
      <section className="app-section"><span className="md-field__label">이름</span><ChipGroup label="주소 이름" outline options={['집', '회사', '부모님 댁', '기타']} value={a.label} onChange={(label) => set({ label })} /></section>
      <section className="app-section">
        <span className="md-field__label">들어오는 방법</span>
        <ChipGroup label="들어오는 방법" options={['비밀번호', '호출', '열려 있어요']} value={a.method} onChange={(method) => set({ method })} />
        {a.method !== '열려 있어요' ? (
          <div className="md-field">
            <label className="md-field__label" htmlFor="addr-code">{a.method === '비밀번호' ? '공동현관 비밀번호' : '호출할 호수'}</label>
            <input className="md-input md-num" id="addr-code" value={a.code} onChange={(e) => set({ code: e.target.value })} aria-describedby="addr-code-help" />
            <div className="md-field__foot"><span id="addr-code-help">예약이 확정된 시터에게만, 산책 당일에 보여요.</span></div>
          </div>
        ) : null}
      </section>
      <Btn variant="brand" size="large" onClick={() => { update({ addrId: id }); onClose(); showSnack(`${a.label} 주소로 바꿨어요`); }}>저장하고 이 주소 쓰기</Btn>
    </Sheet>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { useApp, useSend } from '../store.jsx';
import { TopNav, Btn, Badge, Callout, Icon, Avatar } from '../ui.jsx';
import { Sheet, fmtDay, entryText } from './booking.jsx';

// ── 4-2. 예약 정보 (bottom sheet in the chat) ──
export function ChatInfoSheet({ onClose }) {
  const { flow, push } = useApp();
  const a = flow.addrs[flow.addrId];
  const row = (label, value) => (
    <React.Fragment key={label}><dt className="md-label" style={{ color: 'var(--fg-neutral-subtle)' }}>{label}</dt><dd style={{ margin: 0 }}>{value}</dd></React.Fragment>
  );
  return (
    <Sheet title="예약 정보" onClose={onClose}>
      <button type="button" className="md-item md-pressable" style={{ border: 0, textAlign: 'left', margin: '0 -16px', width: 'calc(100% + 32px)' }} onClick={() => { onClose(); push('dog'); }}>
        <Avatar icon="PawPrint" />
        <span className="md-item__body"><span className="md-list-title">보리</span><span className="md-item__muted">중형견, 3살</span></span>
        <span className="md-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: 'var(--fg-brand)' }}>프로필 보기<Icon name="ChevronRight" size={16} /></span>
      </button>
      <dl className="md-num" style={{ margin: 0, display: 'grid', gridTemplateColumns: '72px minmax(0,1fr)', rowGap: 12, columnGap: 12, fontSize: 15, lineHeight: '21px' }}>
        {row('시작', `${fmtDay(flow.editDay || 7)} ${flow.editTime || '오후 12:30'}`)}
        {row('끝', `${fmtDay(flow.editDay || 7)} 오후 1:00`)}
        {row('비용', <><b>15,000원</b> <span className="md-detail">30분 산책 1번</span></>)}
        {row('주소', `${a.label}, ${a.line} ${a.detail}`)}
        {row('들어오는 방법', entryText(a))}
      </dl>
      <Callout>앱에서 예약한 산책만 보험으로 보장돼요.</Callout>
    </Sheet>
  );
}

// ── 4-3. 채팅 더보기 (Menu Sheet) ──
export function ChatMenuSheet({ onClose, confirmed, onCancel }) {
  const { showSnack } = useApp();
  const item = (icon, title, sub, onClick, critical) => (
    <button key={title} type="button" className="md-item md-pressable" style={{ border: 0, textAlign: 'left', margin: '0 -16px', width: 'calc(100% + 32px)', gridTemplateColumns: '24px minmax(0,1fr)', color: critical ? 'var(--fg-critical)' : undefined }} onClick={onClick}>
      <Icon name={icon} />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span className="md-list-title">{title}</span>{sub ? <span className="md-detail">{sub}</span> : null}</span>
    </button>
  );
  return (
    <Sheet title="더보기" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {item('Phone', '전화 걸기', '안심번호로 연결돼요', () => { onClose(); showSnack('안심번호 전화는 다음 버전에서 볼 수 있어요'); })}
        {item('Headset', '고객센터', '', () => { onClose(); showSnack('고객센터는 다음 버전에서 볼 수 있어요'); })}
        {item('Flag', '신고하기', '', () => { onClose(); showSnack('신고하기는 다음 버전에서 볼 수 있어요'); })}
        {item('CalendarX', confirmed ? '예약 취소하기' : '요청 취소하기', '', () => { onClose(); onCancel(); }, true)}
      </div>
    </Sheet>
  );
}

// Wheel Picker (SEED): items 44px high, five shown, the middle one picked; scrolls and snaps.
function Wheel({ label, values, value, onChange }) {
  const ref = useRef(null);
  const timer = useRef(null);
  const idx = Math.max(0, values.indexOf(value));
  useEffect(() => { if (ref.current) ref.current.scrollTop = idx * 44; }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const onScroll = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const i = Math.min(values.length - 1, Math.max(0, Math.round(ref.current.scrollTop / 44)));
      if (values[i] !== value) onChange(values[i]);
    }, 80);
  };
  return (
    <div ref={ref} className="app-wheel" role="listbox" aria-label={label} onScroll={onScroll}>
      {values.map((v, i) => (
        <button key={v} type="button" role="option" aria-selected={v === value} className="app-wheel__item"
          onClick={() => { ref.current.scrollTo({ top: i * 44, behavior: 'smooth' }); onChange(v); }}>{v}</button>
      ))}
    </div>
  );
}

// ── 4-1. 예약 수정 요청 ──
export function ChatEdit() {
  const { flow, update, pop, showSnack } = useApp();
  const [day, setDay] = useState(flow.editDay || 7);
  const [ampm, setAmpm] = useState('오후');
  const [hour, setHour] = useState(1);
  const [minute, setMinute] = useState('00');
  const [reason, setReason] = useState('');
  const [busy, send] = useSend();
  const time = `${ampm} ${hour}:${minute}`;
  const changed = !(day === 7 && time === '오후 12:30');
  const ok = changed && reason.trim();
  return (
    <>
      <TopNav title="예약 수정 요청" />
      <div className="app-scroll">
        <div className="app-pad" style={{ paddingTop: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 12, borderRadius: 'var(--r3)', background: 'var(--bg-layer-basement)' }}>
            <span className="md-detail">지금 예약</span>
            <span className="md-label md-num">보리, 11월 7일 (토) 오후 12:30부터 30분</span>
          </div>
          <section style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span className="md-section-title">날짜</span><span className="md-label md-num" style={{ color: 'var(--fg-brand)' }}>{fmtDay(day)}</span></div>
            <div className="md-cal" aria-hidden="true">{['일', '월', '화', '수', '목', '금', '토'].map((d, i) => <span key={d} className="md-cal__dow" style={i === 0 ? { color: 'var(--fg-critical)' } : i === 6 ? { color: 'var(--fg-informative)' } : undefined}>{d}</span>)}</div>
            <div className="md-cal" role="grid" aria-label="2026년 11월">
              {Array.from({ length: 30 }).map((_, i) => {
                const d = i + 1;
                const picked = d === day;
                return (
                  <button key={d} type="button" className="md-cal__cell" disabled={d < 6} aria-pressed={picked} aria-label={fmtDay(d)} onClick={() => setDay(d)}>
                    <span className="md-cal__num" style={picked ? { background: 'var(--bg-brand-solid)', color: 'var(--fg-on-brand-solid)', fontWeight: 700 } : d === 6 ? { boxShadow: 'inset 0 0 0 1.5px var(--stroke-neutral-contrast)', fontWeight: 700 } : undefined}>{d}</span>
                  </button>
                );
              })}
            </div>
          </section>
          <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span className="md-section-title">시작 시간</span><span className="md-label md-num" style={{ color: 'var(--fg-brand)' }}>{time}</span></div>
            <div className="app-wheels" role="group" aria-label="시작 시간">
              <span className="app-wheels__band" aria-hidden="true" />
              <Wheel label="오전 오후" values={['오전', '오후']} value={ampm} onChange={setAmpm} />
              <Wheel label="시" values={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} value={hour} onChange={setHour} />
              <Wheel label="분" values={['00', '10', '20', '30', '40', '50']} value={minute} onChange={setMinute} />
            </div>
          </section>
          <div className="md-field">
            <label className="md-field__label" htmlFor="reason">수정 이유</label>
            <textarea className="md-input" id="reason" aria-describedby="reason-help" placeholder="예: 회의가 늦게 끝나서 30분 늦춰도 될까요?" value={reason} onChange={(e) => setReason(e.target.value.slice(0, 200))} />
            <div className="md-field__foot"><span id="reason-help">시터에게 수정 요청과 함께 보내져요.</span><span className="md-num">{reason.length}/200</span></div>
          </div>
        </div>
      </div>
      <div className="app-footer">
        <Btn variant="brand" size="large" disabled={!ok} busy={busy} busyLabel="보내는 중" onClick={() => send(() => { update({ editSent: true, editDay: day, editTime: time }); pop(); showSnack('김하늘 시터에게 수정 요청을 보냈어요'); })}>
          {ok ? '수정 요청 보내기' : !changed ? '바꿀 날짜나 시간을 골라 주세요' : '수정 이유를 적어 주세요'}
        </Btn>
        <span className="md-detail">시터가 수락하면 예약이 바뀌어요</span>
      </div>
    </>
  );
}

// ── 4-4. 강아지 프로필 ──
export function DogProfile() {
  return (
    <>
      <TopNav title="보리" />
      <div className="app-scroll">
        <div className="md-slot"><Icon name="PawPrint" size={40} label="보리 사진" /></div>
        <section style={{ padding: '20px 16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 className="md-screen-title">보리</h2>
          <div className="md-row"><Badge>중형견</Badge><Badge>3살</Badge><Badge>수컷, 중성화</Badge><Badge>12kg</Badge></div>
          <p style={{ margin: '4px 0 0', color: 'var(--fg-neutral-muted)', fontSize: 15, lineHeight: '21px' }}>산책을 아주 좋아하는 진돗개 믹스예요. 사람한테는 순하지만 다른 강아지를 보면 조금 짖어요.</p>
        </section>
        <div className="md-band" />
        <div className="md-list-header">성격</div>
        <div className="md-row" style={{ padding: '0 16px 8px' }}><Badge tone="brand">사람을 좋아해요</Badge><Badge>다른 강아지를 보면 짖어요</Badge><Badge>줄을 조금 당겨요</Badge></div>
        <div className="md-list-header">산책할 때 알아 두세요</div>
        <ul style={{ margin: 0, padding: '0 16px 8px 34px', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 15, lineHeight: '21px' }}>
          <li>길에 떨어진 음식을 주워 먹으려고 해요.</li>
          <li>큰 오토바이 소리에 놀라요.</li>
        </ul>
        <div className="md-list-header">건강</div>
        <dl style={{ margin: 0, padding: '0 16px 32px', display: 'grid', gridTemplateColumns: '88px minmax(0,1fr)', rowGap: 8, fontSize: 15, lineHeight: '21px' }}>
          <dt className="md-label" style={{ color: 'var(--fg-neutral-subtle)' }}>예방접종</dt><dd style={{ margin: 0 }}>종합백신, 광견병 접종 완료</dd>
          <dt className="md-label" style={{ color: 'var(--fg-neutral-subtle)' }}>알레르기</dt><dd style={{ margin: 0 }}>닭고기</dd>
          <dt className="md-label" style={{ color: 'var(--fg-neutral-subtle)' }}>동물병원</dt><dd style={{ margin: 0 }}>역삼 24시 동물병원</dd>
        </dl>
      </div>
    </>
  );
}

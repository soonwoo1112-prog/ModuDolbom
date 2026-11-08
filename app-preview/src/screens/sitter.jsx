import React, { useEffect, useState } from 'react';
import { useApp, useLoad, useSend } from '../store.jsx';
import { TopNav, IconButton, Btn, Badge, ChipGroup, Callout, ListHeader, Band, Thumb, Tags, Icon, SkeletonList, SkeletonBlock, Result, ErrorResult, Region, RouteMap } from '../ui.jsx';
import { Figs, Timeline, Section } from './walkparts.jsx';
import { NEIGHBORHOOD, SITTER_TODAY, SITTER_WEEK, SITTER_HOURS, SITTER_WALKS } from '../data.js';
import { Sheet } from './booking.jsx';

// ── 5. 시터 오늘 탭 ──
export function SitterToday() {
  const { flow, update, push, showSnack, goTab } = useApp();
  const today = useLoad(() => SITTER_TODAY);
  const decline = () => {
    update({ declinedRequest: true });
    showSnack('요청을 거절했어요', { label: '되돌리기', run: () => update({ declinedRequest: false }) });
  };
  return (
    <>
      <TopNav root location title={NEIGHBORHOOD} right={<IconButton icon="Bell" label="알림" />} />
      <div className="app-scroll">
        <div style={{ padding: '24px 16px 4px', display: 'flex', flexDirection: 'column', gap: 4 }}><h2 className="md-screen-title">오늘도 동네 산책을 부탁받았어요</h2><p className="md-item__muted" style={{ margin: 0 }}>새 요청과 오늘 예약을 확인해 보세요</p></div>
        <Region load={today}
          skeleton={<><ListHeader>새 요청</ListHeader><SkeletonList rows={1} avatar="square" label="새 요청 불러오는 중" /><Band /><ListHeader>오늘 예약</ListHeader><SkeletonList rows={2} avatar="square" label="오늘 예약 불러오는 중" /></>}
          empty={<Result icon="Calendar" title="오늘은 예약이 없어요" action="일할 수 있는 시간 열기" actionVariant="weak" onAction={() => goTab('calendar')}>시간을 열어 두면 동네 보호자가 요청을 보낼 수 있어요.</Result>}
          error={<ErrorResult what="오늘 일정" onRetry={today.retry} />}>
          {(list) => (
            <>
              <ListHeader>{flow.declinedRequest ? '새 요청' : '새 요청 1건'}</ListHeader>
              {flow.declinedRequest
                ? <p className="md-detail" style={{ margin: 0, padding: '0 16px 12px' }}>새 요청이 오면 여기에 맨 먼저 보여요.</p>
                : (
                  <div className="md-item md-item--top" style={{ cursor: 'default' }}>
                    <Thumb />
                    <span className="md-item__body">
                      <span className="md-item__head"><span className="md-list-title">보리</span><Badge>중형견</Badge><Badge tone="brand">같은 아파트</Badge></span>
                      <span className="md-item__muted">11월 7일 (토) 오후 12:30부터 30분, 역삼로 123</span>
                      <Tags items={['3분 전', '보리네 보호자']} />
                      <span style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 8, marginTop: 8 }}>
                        <Btn variant="neutral" size="small" onClick={() => push('chat', { id: 's-bori' })}>대화창 열기</Btn>
                        <Btn size="small" onClick={decline}>거절</Btn>
                      </span>
                    </span>
                    <span />
                  </div>
                )}
              <Band />
              <ListHeader>오늘 예약 {list.length}건</ListHeader>
              <div className="md-list">
                {list.map((b, i) => (
                  <React.Fragment key={b.id}>
                    {i > 0 ? <hr className="md-divider" /> : null}
                    <div className="md-item" style={{ cursor: 'default' }}>
                      <Thumb />
                      <span className="md-item__body"><span className="md-list-title">{b.dog}, {b.time}</span><span className="md-item__muted">{b.detail}</span></span>
                      {b.canStart
                        ? (flow.walkDone ? <Badge tone="brand">산책완료</Badge> : <Btn variant="brand" size="small" onClick={() => push('walking')}><Icon name="Footprints" size={16} />산책 시작</Btn>)
                        : <Badge tone="outline">예약확정</Badge>}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </Region>
      </div>
    </>
  );
}

// ── 7. 산책중 ──
export function Walking() {
  const { push, showSnack } = useApp();
  const [sec, setSec] = useState(18 * 60 + 43);
  const [pee, setPee] = useState(1);
  const [poop, setPoop] = useState(0);
  const [photos, setPhotos] = useState(1);
  const [events, setEvents] = useState([
    { time: '오후 12:41', kind: 'pee', text: '쉬했어요' },
    { time: '오후 12:38', kind: 'photo', text: '사진을 보냈어요' },
    { time: '오후 12:30', kind: 'start', text: '콩이와 산책을 시작했어요' },
  ]);
  useEffect(() => {
    const t = setInterval(() => setSec((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const now = () => { const m = 30 + Math.floor(sec / 60); return `오후 ${12 + Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`; };
  const log = (kind, text) => setEvents((e) => [{ time: now(), kind, text }, ...e]);
  const addPhoto = (how) => { setPhotos((n) => n + 1); log('photo', '사진을 보냈어요'); showSnack(how === 'camera' ? '찍은 사진을 보호자에게 보냈어요' : '고른 사진을 보호자에게 보냈어요'); };
  return (
    <>
      <TopNav title="콩이 산책중" />
      <RouteMap height={280} label="지금까지 걸은 경로와 지금 위치">
        <span className="app-map__badge"><Badge tone="info">보호자가 지금 위치를 보고 있어요</Badge></span>
      </RouteMap>
      <div className="app-scroll">
        <Section>
          <Figs items={[['산책 시간', `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`], ['거리', (sec / 60 * 0.06).toFixed(2), 'km']]} />
          <p className="wk-sub" style={{ marginTop: -6 }}>30분 예약, 오후 1:00에 끝나요</p>
        </Section>
        <div className="md-band" />
        <Section title="기록하기">
          <div className="wk-counters">
            <button type="button" className="wk-counter md-pressable" aria-label={`쉬 기록, 지금 ${pee}번`} onClick={() => { setPee(pee + 1); log('pee', '쉬했어요'); }}><Icon name="Droplet" size={20} /><span>쉬</span><b>{pee}</b></button>
            <button type="button" className="wk-counter md-pressable" aria-label={`응가 기록, 지금 ${poop}번`} onClick={() => { setPoop(poop + 1); log('poop', '응가했어요'); }}><Icon name="Poop" size={20} /><span>응가</span><b>{poop}</b></button>
          </div>
          <div className="wk-photos">
            <button type="button" className="wk-photos__add md-pressable" onClick={() => addPhoto('camera')}><Icon name="Camera" size={20} />찍기</button>
            <button type="button" className="wk-photos__add md-pressable" onClick={() => addPhoto('album')}><Icon name="ImagePlus" size={20} />앨범</button>
            {Array.from({ length: photos }, (_, i) => <span key={i} role="img" aria-label={`보낸 사진 ${i + 1}`}><Icon name="PawPrint" size={20} /></span>)}
          </div>
          <p className="wk-sub">누를 때마다 보호자에게 바로 알려요</p>
        </Section>
        <div className="md-band" />
        <Section title="산책 소식"><Timeline events={events} /></Section>
      </div>
      <div className="app-footer"><Btn variant="brand" size="large" onClick={() => push('walklog', { sec, pee, poop, events: [{ time: now(), kind: 'end', text: '산책을 마쳤어요' }, ...events], photos })}>산책 끝내기</Btn></div>
    </>
  );
}

// ── 8. 산책 기록 보내기 ──
export function WalkLogWrite({ params }) {
  const { update, showSnack, goTab } = useApp();
  const [mood, setMood] = useState('좋았어요');
  const [share, setShare] = useState(true);
  const [photos, setPhotos] = useState(params.photos || 2);
  const [busy, send] = useSend();
  const sec = params.sec || 31 * 60 + 8;
  const pee = params.pee ?? 1;
  const poop = params.poop ?? 1;
  const events = params.events || [
    { time: '오후 1:01', kind: 'end', text: '산책을 마쳤어요' },
    { time: '오후 12:52', kind: 'poop', text: '응가했어요' },
    { time: '오후 12:41', kind: 'pee', text: '쉬했어요' },
    { time: '오후 12:38', kind: 'photo', text: '사진을 보냈어요' },
    { time: '오후 12:30', kind: 'start', text: '콩이와 산책을 시작했어요' },
  ];
  return (
    <>
      <TopNav title="산책 기록" />
      <div className="app-scroll">
        <RouteMap height={180} progress="full" fit="meet" label="콩이가 걸은 산책 경로" />
        <Section title="콩이의 오후 산책" sub="11월 7일 (토) 오후 12:30에 시작했어요">
          <Figs small items={[['산책 시간', `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`], ['거리', (sec / 60 * 0.065).toFixed(2), 'km'], [`쉬 ${pee}번, 응가 ${poop}번`, pee + poop, '번']]} />
        </Section>
        <div className="md-band" />
        <Section title="산책 소식"><Timeline events={events} /></Section>
        <div className="md-band" />
        <Section title="사진" sub="첫 사진이 대표로 보여요">
          <div className="wk-photos">
            <button type="button" className="wk-photos__add md-pressable" onClick={() => setPhotos((n) => n + 1)}><Icon name="ImagePlus" size={20} />추가</button>
            {Array.from({ length: photos }, (_, i) => <span key={i} role="img" aria-label={`산책 사진 ${i + 1}${i === 0 ? ', 대표' : ''}`}><Icon name="PawPrint" size={20} />{i === 0 ? <span className="wk-photos__tag">대표</span> : null}</span>)}
          </div>
        </Section>
        <div className="md-band" />
        <Section title="콩이 컨디션">
          <div className="md-seg" role="group" aria-label="콩이 컨디션">
            {['좋았어요', '보통이에요', '피곤해 보여요'].map((m) => <button key={m} type="button" aria-pressed={mood === m} onClick={() => setMood(m)}>{m}</button>)}
          </div>
          <div className="md-field" style={{ marginTop: 8 }}><label className="md-field__label" htmlFor="memo">보호자에게 남길 말<em>선택</em></label><textarea className="md-input" id="memo" defaultValue="공원 한 바퀴 돌았어요. 물도 잘 마셨고, 다른 강아지와 인사도 했어요." /></div>
          <label className="wk-switchrow" style={{ marginTop: 8 }}>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span className="md-list-title">소셜에도 올리기</span><span className="md-detail">콩이네 보호자가 공유를 허용했어요. 경로 지도는 빼고 올라가요.</span></span>
            <input type="checkbox" role="switch" className="app-switch" checked={share} onChange={() => setShare(!share)} aria-label="소셜에도 올리기" />
          </label>
        </Section>
      </div>
      <div className="app-footer">
        <Btn variant="brand" size="large" busy={busy} busyLabel="보내는 중" onClick={() => send(() => { update({ walkDone: true }); goTab('today'); showSnack(share ? '기록을 보내고 소셜에도 올렸어요' : '콩이네 보호자에게 기록을 보냈어요'); })}>보호자에게 기록 보내기</Btn>
      </div>
    </>
  );
}

// ── 14. 시터 일할 수 있는 시간 ──
const DOW = ['일', '월', '화', '수', '목', '금', '토'];
const SC_MONTHS = [[10, 31, 4], [11, 30, 0], [12, 31, 2]];
const keyOf = (dt) => `${dt.getMonth() + 1}-${dt.getDate()}`;
const TODAY_DATE = new Date(2026, 10, 6);
function useWorks() {
  const { flow } = useApp();
  return (dt) => { const k = keyOf(dt); return k in (flow.dayOverride || {}) ? flow.dayOverride[k] : !!flow.availability[DOW[dt.getDay()]]; };
}

export function SitterSchedule() {
  const { push } = useApp();
  const walks = useLoad(() => SITTER_WALKS);
  const works = useWorks();
  const scrollRef = React.useRef(null);
  const nowRef = React.useRef(null);
  React.useEffect(() => { if (walks.status === 'ready' && nowRef.current && scrollRef.current) scrollRef.current.scrollTop = nowRef.current.offsetTop; }, [walks.status]);
  return (
    <>
      <TopNav root title="캘린더" />
      <div className="cl-dow" aria-hidden="true">{DOW.map((d) => <span key={d}>{d}</span>)}</div>
      <div className="app-scroll" ref={scrollRef} style={{ position: 'relative' }}>
        {walks.status === 'loading' ? <div style={{ padding: 16 }} aria-busy="true" aria-label="일정 불러오는 중"><SkeletonBlock height={300} /></div>
          : walks.status === 'error' ? <ErrorResult what="일정" onRetry={walks.retry} />
            : (
              <>
                {SC_MONTHS.map(([mo, len, lead]) => (
                  <section key={mo} className="cl-month" aria-label={`2026년 ${mo}월`} ref={mo === 11 ? nowRef : undefined}>
                    <h2 className="cl-month__title">2026년 {mo}월</h2>
                    <div className="cl-grid">
                      {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} />)}
                      {Array.from({ length: len }, (_, i) => {
                        const dt = new Date(2026, mo - 1, i + 1);
                        const k = keyOf(dt);
                        const list = walks.data[k];
                        const off = !works(dt);
                        return (
                          <button key={k} type="button" className="cl-day md-pressable" data-today={k === '11-6'} data-sun={dt.getDay() === 0} data-off={off} aria-label={`${mo}월 ${i + 1}일${list ? `, 산책 ${list.length}건` : ''}${off ? ', 쉬는 날' : ''}`} onClick={() => push('sitterWeek', { date: dt.getTime() })}>
                            <span className="cl-num">{i + 1}</span>
                            {list ? <span className="cl-dot" data-past={dt < TODAY_DATE} /> : null}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
                <div className="cl-legend"><span><span className="cl-dot" />예약된 산책</span><span><span className="cl-dot" data-past="true" />지난 산책</span><span><span className="cl-legend__off">13</span>쉬는 날</span></div>
              </>
            )}
      </div>
    </>
  );
}

export function SitterWeek({ params }) {
  const { update, showSnack } = useApp();
  const works = useWorks();
  const first = new Date(params.date || TODAY_DATE.getTime());
  const [start, setStart] = useState(() => new Date(first.getFullYear(), first.getMonth(), first.getDate() - first.getDay()));
  const [sel, setSel] = useState(keyOf(first));
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(true);
  const days = Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  const selDate = days.find((dt) => keyOf(dt) === sel) || days[0];
  const selKey = keyOf(selDate);
  const on = works(selDate);
  const list = SITTER_WALKS[selKey] || [];
  const nth = ['첫째', '둘째', '셋째', '넷째', '다섯째'][Math.floor((start.getDate() + 5) / 7)] || '';
  const shift = (n) => { const st = new Date(start.getFullYear(), start.getMonth(), start.getDate() + n); setStart(st); setSel(keyOf(st)); };
  const dayTitle = `${selDate.getMonth() + 1}월 ${selDate.getDate()}일 (${DOW[selDate.getDay()]})`;
  const weekTitle = `${start.getMonth() + 1}월 ${nth} 주`;
  return (
    <>
      <TopNav title={weekTitle} right={<span style={{ display: 'flex' }}><IconButton icon="ChevronLeft" label="지난주" onClick={() => shift(-7)} /><IconButton icon="ChevronRight" label="다음 주" onClick={() => shift(7)} /></span>} />
      <div className="sc-week" role="group" aria-label={weekTitle}>
        {days.map((dt) => {
          const k = keyOf(dt); const w = SITTER_WALKS[k]; const off = !works(dt);
          return (
            <button key={k} type="button" className="cl-day md-pressable" aria-pressed={k === selKey} data-today={k === '11-6'} data-sun={dt.getDay() === 0} data-off={off} aria-label={`${dt.getDate()}일 ${DOW[dt.getDay()]}요일${w ? `, 산책 ${w.length}건` : ''}${off ? ', 쉬는 날' : ''}`} onClick={() => setSel(k)}>
              <span className="sc-dow">{DOW[dt.getDay()]}</span>
              <span className="cl-num">{dt.getDate()}</span>
              {w ? <span className="cl-dot" data-past={dt < TODAY_DATE} /> : null}
            </button>
          );
        })}
      </div>
      <div className="app-scroll">
        <div className="sc-day">
          <h3>{dayTitle}</h3>
          <p className="sc-avail" data-off={!on}><b>{on ? '일할 수 있는 날' : '쉬는 날'}</b> {on ? SITTER_HOURS[DOW[selDate.getDay()]] : '이 날은 검색 결과에 보이지 않아요'}</p>
        </div>
        {list.length ? (
          <div className="md-list">
            {list.map((it) => (
              <div key={it.time} className="md-item" style={{ cursor: 'default' }}>
                <Thumb />
                <span className="md-item__body"><span className="md-item__head"><span className="md-list-title">{it.dog}, {it.time}</span><Badge tone={it.tone}>{it.status}</Badge></span><span className="md-item__muted">{it.detail}</span></span>
                <span />
              </div>
            ))}
          </div>
        ) : <p className="md-detail" style={{ margin: 0, padding: '16px 16px 8px' }}>{on ? '아직 예약된 산책이 없어요. 요청이 오면 오늘 탭에 먼저 보여요.' : '쉬는 날이라 예약된 산책이 없어요.'}</p>}
      </div>
      <div className="app-footer"><Btn size="large" onClick={() => { setDraft(on); setEditing(true); }}><Icon name="Pencil" size={18} />이 날 일정 수정</Btn></div>
      {editing ? (
        <Sheet title={dayTitle} onClose={() => setEditing(false)}>
          <div className="md-seg" role="group" aria-label="이 날 일하기">
            <button type="button" aria-pressed={draft} onClick={() => setDraft(true)}>일할 수 있어요</button>
            <button type="button" aria-pressed={!draft} onClick={() => setDraft(false)}>쉬어요</button>
          </div>
          <p className="md-detail" style={{ margin: 0 }}>{draft ? `시간은 프로필에서 정한 대로예요: ${SITTER_HOURS[DOW[selDate.getDay()]]}` : `이 날만 쉬어요. 다른 ${DOW[selDate.getDay()]}요일은 그대로예요.`}</p>
          {!draft && list.length ? <Callout>이미 예약된 산책 {list.length}건은 그대로 남아요. 못 가게 되면 채팅에서 보호자와 먼저 이야기해 주세요.</Callout> : null}
          <Btn variant="brand" size="large" onClick={() => { update((f) => ({ dayOverride: { ...(f.dayOverride || {}), [selKey]: draft } })); setEditing(false); showSnack(draft ? `${dayTitle}에 일할 수 있게 열었어요` : `${dayTitle}을 쉬는 날로 바꿨어요`); }}>저장하기</Btn>
        </Sheet>
      ) : null}
    </>
  );
}

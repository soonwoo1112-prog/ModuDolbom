import React, { useState } from 'react';
import { useApp, useLoad, useSend } from '../store.jsx';
import { TopNav, IconButton, Btn, Badge, ChipGroup, Callout, ListHeader, Band, Avatar, Thumb, Tags, Icon, SkeletonList, SkeletonBlock, Result, ErrorResult, Region, RouteMap } from '../ui.jsx';
import { NEIGHBORHOOD, MY_DOGS, SITTERS, GUARDIAN_BOOKINGS } from '../data.js';
import { DateSheet, AddressSheet, AddressDetailSheet, describeSchedule, entryText, PICKUP_HINTS } from './booking.jsx';

// ── 1. 예약 (guardian first tab) ──
export function BookHome() {
  const { flow, update, push, showSnack } = useApp();
  const dogs = useLoad(() => MY_DOGS);
  const [sheet, setSheet] = useState(null); // 'date' | 'address' | { detail: id }
  const sched = describeSchedule(flow);
  const addr = flow.addrs[flow.addrId];
  return (
    <>
      <TopNav root location title={NEIGHBORHOOD} right={<IconButton icon="Bell" label="알림" badge={flow.confirmed ? 1 : 0} onClick={() => push('log')} />} />
      <div className="app-scroll">
        <div className="app-pad">
          <button type="button" className="app-banner md-pressable" onClick={() => push('live')}>
            <span className="md-thumb" style={{ width: 40, height: 40, background: 'var(--bg-layer-default)' }}><Icon name="Footprints" size={20} style={{ color: 'var(--fg-brand)' }} /></span>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}><span className="md-label">보리가 김하늘 시터와 산책중이에요</span><span className="md-detail">지금 위치와 산책 소식을 볼 수 있어요</span></span>
            <Icon name="ChevronRight" size={18} style={{ color: 'var(--fg-neutral-subtle)' }} />
          </button>
          <h2 className="md-screen-title">오늘 산책, 누구에게 부탁할까요</h2>
          <section className="app-section">
            <span className="md-field__label">강아지</span>
            <Region load={dogs}
              skeleton={<div className="md-row" aria-busy="true" aria-label="강아지 불러오는 중"><SkeletonBlock height={36} radius={9999} style={{ width: 64 }} /><SkeletonBlock height={36} radius={9999} style={{ width: 64 }} /></div>}
              empty={<div className="md-card" style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}><span className="md-item__muted">아직 등록한 강아지가 없어요</span><Btn size="small" onClick={() => showSnack('강아지 등록은 다음 버전에서 볼 수 있어요')}>강아지 등록하기</Btn></div>}
              error={<Callout tone="critical" title="강아지 정보를 불러오지 못했어요"><button type="button" className="md-btn md-btn--ghost md-btn--small" style={{ padding: 0, minHeight: 0 }} onClick={dogs.retry}>다시 시도</button></Callout>}>
              {(list) => <ChipGroup label="강아지" options={list.map((d) => d.name)} value={flow.dog} onChange={(dog) => update({ dog })} />}
            </Region>
          </section>
          <section className="app-section">
            <span className="md-field__label">날짜</span>
            <div className="md-seg" role="group" aria-label="산책 횟수">
              {['한 번', '반복'].map((l) => <button key={l} type="button" aria-pressed={flow.freq === l} onClick={() => update({ freq: l })}>{l}</button>)}
            </div>
            <button type="button" className="md-inputbtn md-pressable" onClick={() => setSheet('date')}>
              <Icon name="Calendar" size={18} />
              <span className="md-inputbtn__text"><span>{sched.label}</span>{sched.sub ? <span className="md-detail">{sched.sub}</span> : null}</span>
              <Icon name="ChevronRight" size={18} />
            </button>
          </section>
          <section className="app-section">
            <span className="md-field__label">시작 시간</span>
            <button className="md-inputbtn md-pressable" type="button" onClick={() => showSnack('시간 고르기는 다음 버전에서 볼 수 있어요')}>
              <Icon name="Clock" size={18} /><span className="md-inputbtn__text">{flow.time}</span><Icon name="ChevronRight" size={18} />
            </button>
          </section>
          <section className="app-section">
            <span className="md-field__label">산책 길이</span>
            <ChipGroup label="산책 길이" options={['30분', '60분', '90분']} value={flow.length} onChange={(length) => update({ length })} />
          </section>
          <section className="app-section">
            <span className="md-field__label">주소</span>
            <button type="button" className="md-inputbtn md-pressable" onClick={() => setSheet('address')}>
              <Icon name="MapPin" size={18} />
              <span className="md-inputbtn__text"><span style={{ fontWeight: 700 }}>{addr.label}</span><span className="md-detail">{addr.line}, {addr.detail}</span><span className="md-detail">{entryText(addr)}</span></span>
              <Icon name="ChevronRight" size={18} />
            </button>
          </section>
          <div className="md-field">
            <label className="md-field__label" htmlFor="pickup">픽업 안내<em>선택</em></label>
            <textarea className="md-input" id="pickup" aria-describedby="pickup-help" placeholder="예: 제가 출근하는 시간이라 비밀번호로 들어오시면 돼요." value={flow.pickup} onChange={(e) => update({ pickup: e.target.value.slice(0, 300) })} />
            <div className="md-row" role="group" aria-label="자주 쓰는 안내">
              {Object.entries(PICKUP_HINTS).map(([label, text]) => (
                <button key={label} type="button" className="md-chip md-chip--outline md-pressable" style={{ height: 32 }} onClick={() => update((f) => ({ pickup: ((f.pickup ? f.pickup + ' ' : '') + text).slice(0, 300) }))}><span>{label}</span></button>
              ))}
            </div>
            <div className="md-field__foot"><span id="pickup-help">예약이 확정된 시터에게만 보여요.</span><span className="md-num">{flow.pickup.length}/300</span></div>
          </div>
          <Callout title="앱에서 예약한 산책만 보험으로 보장돼요">앱 밖에서 약속하면 사고가 나도 도움을 받을 수 없어요.</Callout>
        </div>
      </div>
      <div className="app-footer">
        <Btn variant="brand" size="large" disabled={!sched.ok} onClick={() => push('matching')}>{sched.ok ? '조건에 맞는 시터 찾기' : sched.why}</Btn>
      </div>
      {sheet === 'date' ? <DateSheet onClose={() => setSheet(null)} /> : null}
      {sheet === 'address' ? <AddressSheet onClose={() => setSheet(null)} onOpen={(id) => setSheet({ detail: id })} /> : null}
      {sheet && sheet.detail ? <AddressDetailSheet id={sheet.detail} onClose={() => setSheet(null)} onBack={() => setSheet('address')} /> : null}
    </>
  );
}

// Sitter stats with an icon in front of each figure: 리뷰, 반복고객, 답장.
function SitterStats({ s }) {
  return (
    <span className="md-stat-row md-num">
      <span className="md-stat"><Icon name="Star" size={14} />{s.reviews}</span>
      {s.repeat ? <span className="md-stat"><Icon name="Repeat" size={14} />{s.repeat}</span> : null}
      <span className="md-stat"><Icon name="MessageCircle" size={14} />{s.reply}</span>
    </span>
  );
}

// ── 2. 시터 고르기 ──
export function Matching() {
  const { flow, update, push, pop } = useApp();
  const sitters = useLoad(() => SITTERS);
  const [busy, send] = useSend();
  const count = SITTERS.filter((s) => flow.picked[s.id]).length;
  return (
    <>
      <TopNav title="시터 고르기" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '8px 16px 12px', boxShadow: 'inset 0 -1px 0 var(--stroke-neutral-subtle)' }}>
        <span className="md-tags" style={{ fontSize: 14, lineHeight: '19px', color: 'var(--fg-neutral-muted)' }}><span><b>{flow.dog}</b></span><span>{describeSchedule(flow).label} {flow.time}</span><span>{flow.length}</span></span>
        <Btn variant="ghost" size="small" onClick={pop}>조건 바꾸기</Btn>
      </div>
      <div className="app-scroll">
        <Region load={sitters}
          skeleton={<><ListHeader>조건에 맞는 시터를 찾고 있어요</ListHeader><SkeletonList rows={5} label="시터 목록 불러오는 중" /></>}
          empty={<Result icon="Search" title="조건에 맞는 시터가 아직 없어요" action="조건 바꾸기" actionVariant="weak" onAction={pop}>시간이나 날짜를 바꾸면 더 많은 이웃을 볼 수 있어요.</Result>}
          error={<ErrorResult what="시터 목록" onRetry={sitters.retry} />}>
          {(list) => (
            <>
              <ListHeader sub="여러 명을 골라 한 번에 요청할 수 있어요">조건에 맞는 시터 {list.length}명</ListHeader>
              <div className="md-list">
                {list.map((s) => (
                  <label key={s.id} className="md-item md-item--top md-pressable">
                    <Avatar />
                    <span className="md-item__body">
                      <span className="md-item__head"><span className="md-list-title">{s.name}</span>{s.sameApt ? <Badge tone="brand">같은 아파트</Badge> : null}{s.isNew ? <Badge>새로 온 시터</Badge> : null}</span>
                      <span className="md-item__muted">{s.bio}</span>
                      <span className="md-tags md-num"><span><b>{s.price}</b></span><span>{s.distance}</span></span>
                      <SitterStats s={s} />
                    </span>
                    <input className="md-check" type="checkbox" checked={!!flow.picked[s.id]} onChange={() => update((f) => ({ picked: { ...f.picked, [s.id]: !f.picked[s.id] } }))} aria-label={`${s.name} 시터 선택`} style={{ marginTop: 12 }} />
                  </label>
                ))}
              </div>
            </>
          )}
        </Region>
      </div>
      {sitters.status === 'ready' ? (
        <div className="app-footer">
          {count > 0
            ? <Btn variant="brand" size="large" busy={busy} busyLabel="요청 보내는 중" onClick={() => send(() => { update({ requested: true }); push('sent', { justSent: count }); })}>{count}명에게 요청 보내기</Btn>
            : <Btn size="large" disabled>시터를 한 명 이상 골라 주세요</Btn>}
          <span className="md-detail">한 명과 확정되면 나머지 요청은 자동으로 닫혀요</span>
        </div>
      ) : null}
    </>
  );
}

// ── 3. 요청 현황 ──
export function Sent({ params }) {
  const { flow, push, showSnack, update, goTab } = useApp();
  const picked = SITTERS.filter((s) => flow.picked[s.id]);
  const status = useLoad(() => picked);
  React.useEffect(() => {
    if (params.justSent) showSnack(`${params.justSent}명에게 요청을 보냈어요`, { label: '요청 취소', run: () => { update({ requested: false }); goTab('book'); } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <TopNav title="요청 현황" />
      <div className="app-scroll">
        <section style={{ padding: '20px 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Thumb />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}><span className="md-section-title">{flow.dog}의 {describeSchedule(flow).title} 산책</span>{describeSchedule(flow).sub ? <span className="md-detail">{describeSchedule(flow).sub}</span> : null}<Tags items={[flow.time, flow.length]} /></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12, borderRadius: 'var(--r3)', background: 'var(--bg-layer-basement)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '18px minmax(0,1fr)', gap: 8 }}>
              <Icon name="MapPin" size={18} style={{ color: 'var(--fg-neutral-subtle)', marginTop: 1 }} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span className="md-label">{flow.addrs[flow.addrId].label}</span><span className="md-item__muted">{flow.addrs[flow.addrId].line}, {flow.addrs[flow.addrId].detail}</span><span className="md-detail">{entryText(flow.addrs[flow.addrId])}</span></span>
            </div>
            {flow.pickup ? (
              <div style={{ display: 'grid', gridTemplateColumns: '18px minmax(0,1fr)', gap: 8 }}>
                <Icon name="NotebookPen" size={18} style={{ color: 'var(--fg-neutral-subtle)', marginTop: 1 }} />
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span className="md-label">픽업 안내</span><span className="md-item__muted">{flow.pickup}</span></span>
              </div>
            ) : null}
            <span className="md-detail">주소와 픽업 안내는 예약이 확정된 시터에게만 보여요</span>
          </div>
          <Callout>{flow.confirmed ? '예약을 확정해서 나머지 요청은 닫혔어요.' : '한 명과 예약을 확정하면 나머지 요청은 자동으로 닫혀요.'}</Callout>
        </section>
        <Band />
        <Region load={status}
          skeleton={<SkeletonList rows={2} label="요청 현황 불러오는 중" />}
          empty={<Result icon="Send" title="보낸 요청이 없어요" action="산책 부탁하기" onAction={() => goTab('book')}>시터를 골라 요청을 보내면 여기에서 답장을 볼 수 있어요.</Result>}
          error={<ErrorResult what="요청 현황" onRetry={status.retry} />}>
          {(list) => (
            <>
              <ListHeader>요청한 시터 {list.length}명</ListHeader>
              <div className="md-list">
                {list.map((s, i) => {
                  const talking = s.id === 'haneul';
                  const closed = flow.confirmed && !talking;
                  return (
                    <React.Fragment key={s.id}>
                      {i > 0 ? <hr className="md-divider" /> : null}
                      <div className="md-item md-item--top" style={{ cursor: 'default' }}>
                        <Avatar />
                        <span className="md-item__body">
                          <span className="md-item__head"><span className="md-list-title">{s.name}</span>
                            {talking ? <Badge tone={flow.confirmed ? 'brandSolid' : 'info'}>{flow.confirmed ? '예약확정' : '대화중'}</Badge> : <Badge tone="outline">{closed ? '요청종료' : '요청중'}</Badge>}
                          </span>
                          <span className="md-item__muted">{talking ? (flow.confirmed ? '산책을 함께하기로 했어요.' : '대화를 시작했어요. 조건을 맞춰 보세요.') : (closed ? '다른 시터와 확정해서 요청이 닫혔어요.' : '아직 답장이 없어요.')}</span>
                          <span className="md-tags md-num"><span><b>{s.price}</b></span><span>방금</span></span>
                        </span>
                        {talking ? <Btn variant="neutral" size="small" onClick={() => push('chat', { id: 'c-haneul' })}>대화창 열기</Btn> : <span />}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
              {flow.confirmed ? null : <div style={{ padding: '24px 16px' }}><Btn variant="outline" style={{ width: '100%' }} onClick={() => push('matching')}>다른 시터에게도 요청하기</Btn></div>}
            </>
          )}
        </Region>
      </div>
    </>
  );
}

// ── 9. 실시간 위치 ──
export function Live() {
  const { push } = useApp();
  const live = useLoad(() => ({ minutes: 12, km: 0.7 }));
  return (
    <>
      <TopNav title="보리 산책중" />
      <div className="app-scroll">
        {live.status === 'loading'
          ? <div aria-busy="true" aria-label="위치 불러오는 중"><SkeletonBlock height={320} radius={0} /><div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 }}><SkeletonBlock height={52} /><SkeletonBlock height={52} /><SkeletonBlock height={52} /></div></div>
          : live.status === 'error' || live.status === 'empty'
            ? <Result title="지금 위치를 불러오지 못했어요" action="다시 시도" actionVariant="weak" onAction={live.retry} role="alert">시터의 휴대폰 연결이 잠시 끊겼을 수 있어요. 마지막으로 받은 위치는 산책 기록에 남아요.</Result>
            : (
              <>
                <RouteMap height={320} label="보리가 지금까지 걸은 경로와 지금 위치">
                  <span className="app-map__badge"><Badge tone="brandSolid">산책중</Badge></span>
                  <span className="app-map__caption md-detail">1분 전 위치예요</span>
                </RouteMap>
                <div style={{ padding: '20px 16px 16px' }}>
                  <dl className="md-stats"><div><dt>지난 시간</dt><dd>{live.data.minutes}<small>분</small></dd></div><div><dt>거리</dt><dd>{live.data.km}<small>km</small></dd></div><div><dt>끝나는 시간</dt><dd style={{ fontSize: 20 }}>오후 1:00</dd></div></dl>
                </div>
                <div className="md-item" style={{ cursor: 'default', boxShadow: 'inset 0 1px 0 var(--stroke-neutral-subtle), inset 0 -1px 0 var(--stroke-neutral-subtle)' }}>
                  <Avatar />
                  <span className="md-item__body"><span className="md-item__head"><span className="md-list-title">김하늘 시터</span><Badge tone="brand">같은 아파트</Badge></span><span className="md-item__muted">보리와 산책하고 있어요</span></span>
                  <Btn size="small" onClick={() => push('chat', { id: 'c-haneul' })}>채팅</Btn>
                </div>
                <ListHeader>산책 소식</ListHeader>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px 24px' }}>
                  {[['오후 12:38', '소변 1회를 기록했어요'], ['오후 12:33', '공원 산책로에 들어섰어요'], ['오후 12:31', '보리를 데리고 산책을 시작했어요']].map(([t, m]) => (
                    <div key={t} style={{ display: 'grid', gridTemplateColumns: '72px minmax(0,1fr)', gap: 8 }}><span className="md-detail md-num">{t}</span><span style={{ fontSize: 14, lineHeight: '19px' }}>{m}</span></div>
                  ))}
                  <Callout>산책이 끝나면 사진과 기록을 보내 드려요.</Callout>
                </div>
              </>
            )}
      </div>
    </>
  );
}

// ── 10. 산책 기록 받기와 후기 ──
export function Log() {
  const { flow, update, showSnack } = useApp();
  const log = useLoad(() => true);
  const [rating, setRating] = useState('또 맡기고 싶어요');
  const [share, setShare] = useState(true);
  const [busy, send] = useSend();
  return (
    <>
      <TopNav title="산책 기록" />
      <div className="app-scroll">
        <Region load={log}
          skeleton={<div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }} aria-busy="true" aria-label="산책 기록 불러오는 중"><SkeletonBlock height={190} radius={16} /><SkeletonBlock height={14} radius={9999} style={{ width: '50%' }} /><SkeletonBlock height={14} radius={9999} style={{ width: '80%' }} /></div>}
          empty={<Result icon="Footprints" title="아직 받은 산책 기록이 없어요">산책이 끝나면 시터가 사진과 기록을 보내 줘요.</Result>}
          error={<ErrorResult what="산책 기록" onRetry={log.retry} />}>
          {() => (
            <div className="app-pad" style={{ paddingTop: 12, gap: 20 }}>
              <article className="md-card">
                <div className="md-walk__media">
                  <div className="md-slot"><Icon name="PawPrint" label="산책 사진" /></div>
                  <RouteMap aspect="4 / 3" progress="full" label="보리가 걸은 산책 경로" />
                </div>
                <div className="md-walk__body">
                  <div className="md-item__head" style={{ justifyContent: 'space-between' }}><h2 className="md-section-title">보리의 점심 산책</h2><Badge tone="brand">산책완료</Badge></div>
                  <dl className="md-stats"><div><dt>산책 시간</dt><dd>30<small>분</small></dd></div><div><dt>거리</dt><dd>1.9<small>km</small></dd></div><div><dt>배변</dt><dd>2<small>회</small></dd></div></dl>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 12, borderRadius: 'var(--r3)', background: 'var(--bg-layer-basement)' }}>
                    <span className="md-item__head"><span className="md-label">김하늘 시터가 남긴 말</span><Badge>컨디션 좋았어요</Badge></span>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: '19px', color: 'var(--fg-neutral-muted)' }}>다른 강아지를 보고 한 번 짖었지만 금방 진정했어요. 물도 잘 마셨어요.</p>
                  </div>
                </div>
              </article>
              <label style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span className="md-list-title">소셜 공유 허용</span><span className="md-detail">허용하면 시터가 이 기록을 동네 피드에 올릴 수 있어요. 경로 지도는 올라가지 않아요.</span></span>
                <input type="checkbox" role="switch" className="app-switch" checked={share} onChange={() => setShare(!share)} aria-label="소셜 공유 허용" />
              </label>
              <hr className="md-divider" style={{ margin: 0 }} />
              <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h2 className="md-section-title">김하늘 시터는 어땠나요</h2>
                <ChipGroup label="후기" options={['또 맡기고 싶어요', '괜찮았어요', '아쉬웠어요']} value={rating} onChange={setRating} />
                <div className="md-field"><label className="md-field__label" htmlFor="review">후기<em>선택</em></label><textarea className="md-input" id="review" placeholder="예: 산책 소식을 자주 보내 줘서 안심됐어요" /></div>
                <Btn variant="outline" style={{ width: '100%' }} onClick={() => { update({ pinned: !flow.pinned }); if (!flow.pinned) showSnack('다음 검색부터 김하늘 시터가 항상 보여요', { label: '되돌리기', run: () => update({ pinned: false }) }); }}>{flow.pinned ? '전담 시터로 지정했어요' : '전담 시터로 지정하기'}</Btn>
              </section>
            </div>
          )}
        </Region>
      </div>
      {log.status === 'ready' ? <div className="app-footer"><Btn variant="brand" size="large" busy={busy} busyLabel="보내는 중" onClick={() => send(() => showSnack('김하늘 시터에게 후기를 보냈어요'))}>후기 보내기</Btn></div> : null}
    </>
  );
}

// ── 13. 보호자 캘린더 ──
export function GuardianCalendar() {
  const { push, goTab } = useApp();
  const [sel, setSel] = useState(7);
  const cal = useLoad(() => GUARDIAN_BOOKINGS);
  const today = 6;
  const items = cal.status === 'ready' ? (cal.data[sel] || []) : [];
  return (
    <>
      <TopNav root title="캘린더" />
      <div className="app-scroll">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 8px 8px 16px' }}>
          <span className="md-section-title md-num">2026년 11월</span>
          <span style={{ display: 'flex' }}><IconButton icon="ChevronLeft" label="이전 달" /><IconButton icon="ChevronRight" label="다음 달" /></span>
        </div>
        <div className="app-cal" style={{ paddingBottom: 0 }} aria-hidden="true">{['일', '월', '화', '수', '목', '금', '토'].map((d) => <span key={d} className="md-detail app-cal__dow">{d}</span>)}</div>
        <div className="app-cal" aria-busy={cal.status === 'loading' ? 'true' : undefined}>
          {Array.from({ length: 30 }).map((_, i) => {
            const day = i + 1;
            const booked = cal.status === 'ready' && cal.data[day];
            return (
              <button key={day} type="button" className="app-cal__day md-pressable" data-dow={i % 7} data-today={day === today} aria-pressed={sel === day} aria-label={`11월 ${day}일${booked ? ', 산책 있음' : ''}`} onClick={() => setSel(day)}>
                <span className="app-cal__num">{day}</span>
                {booked ? <span className="app-dogtag">보리</span> : null}
              </button>
            );
          })}
        </div>
        <Band />
        <ListHeader>11월 {sel}일</ListHeader>
        {cal.status === 'loading' ? <SkeletonList rows={1} avatar="square" label="일정 불러오는 중" />
          : cal.status === 'error' ? <ErrorResult what="일정" onRetry={cal.retry} />
            : items.length ? items.map((it) => (
              <button key={it.title} type="button" className="md-item md-pressable" style={{ border: 0, width: '100%', textAlign: 'left' }} onClick={() => push(it.go, { id: 'c-haneul' })}>
                <Thumb />
                <span className="md-item__body"><span className="md-item__head"><span className="md-list-title">{it.title}</span><Badge tone={it.tone === 'brand' ? 'brandSolid' : it.tone}>{it.status}</Badge></span><span className="md-item__muted">{it.detail}</span></span>
                <Icon name="ChevronRight" size={18} style={{ color: 'var(--fg-neutral-subtle)' }} />
              </button>
            )) : <Result title="이 날은 예약된 산책이 없어요" action="이 날 산책 부탁하기" onAction={() => goTab('book')} />}
      </div>
    </>
  );
}

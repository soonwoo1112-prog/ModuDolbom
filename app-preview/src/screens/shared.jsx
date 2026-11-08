import React, { useState } from 'react';
import { useApp, useLoad, useSend } from '../store.jsx';
import { TopNav, IconButton, Btn, Badge, ChipGroup, Callout, ListHeader, Band, Avatar, Thumb, Tags, Icon, SkeletonList, SkeletonBlock, Result, ErrorResult, Region, Bubble, SystemNote } from '../ui.jsx';
import { ChatInfoSheet, ChatMenuSheet } from './chat.jsx';
import { NEIGHBORHOOD, GUARDIAN_CHATS, SITTER_CHATS, CHAT_MESSAGES, FEED, COMMUNITY } from '../data.js';

const STATUS_TONE = { 대화중: 'info', 요청중: 'outline', 예약확정: 'brandSolid' };

// ── 채팅 목록 ──
export function ChatList() {
  const { role, push, flow, goTab } = useApp();
  const chats = useLoad(() => (role === 'guardian' ? GUARDIAN_CHATS : SITTER_CHATS), [role]);
  const [filter, setFilter] = useState('전체');
  const filters = role === 'sitter' ? ['전체', '안 읽음', '확정', '대화중', '지난 대화'] : ['전체', '안 읽음'];
  return (
    <>
      <TopNav root title="채팅" />
      <div className="app-chiprow" role="group" aria-label="대화 보기">
        {filters.map((f) => <button key={f} type="button" className="md-chip md-pressable" aria-pressed={filter === f} onClick={() => setFilter(f)}><span>{f}</span></button>)}
      </div>
      <div className="app-scroll">
        <Region load={chats}
          skeleton={<SkeletonList rows={4} label="대화 목록 불러오는 중" />}
          empty={<Result icon="MessageCircle" title="아직 대화가 없어요" action={role === 'guardian' ? '산책 부탁하기' : undefined} onAction={() => goTab('book')}>{role === 'guardian' ? '시터에게 요청을 보내면 대화가 여기에 모여요.' : '보호자가 요청을 보내면 대화가 여기에 모여요.'}</Result>}
          error={<ErrorResult what="대화 목록" onRetry={chats.retry} />}>
          {(list) => {
            const shown = list
              .map((c) => (c.id === 'c-haneul' && flow.confirmed ? { ...c, status: '예약확정', unread: 0 } : c))
              .filter((c) => filter === '전체' || (filter === '안 읽음' && c.unread) || (filter === '확정' && c.status === '예약확정') || (filter === '대화중' && c.status === '대화중'));
            if (!shown.length) return <Result title="해당하는 대화가 없어요">다른 보기를 골라 보세요.</Result>;
            return (
              <div className="md-list">
                {shown.map((c) => (
                  <button key={c.id} type="button" className="md-item md-pressable" style={{ border: 0, width: '100%', textAlign: 'left', boxShadow: 'inset 0 -1px 0 var(--stroke-neutral-subtle)' }} onClick={() => push('chat', { id: c.id })}>
                    <Avatar />
                    <span className="md-item__body">
                      <span className="md-item__head"><span className="md-list-title">{c.with}</span><Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge></span>
                      <span className="md-item__muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.last}</span>
                      <Tags items={[c.sub, c.time]} />
                    </span>
                    {c.unread ? <span className="md-nbadge">{c.unread}</span> : <span />}
                  </button>
                ))}
              </div>
            );
          }}
        </Region>
      </div>
    </>
  );
}

// ── 4·6. 채팅방 ──
export function ChatRoom({ params }) {
  const { role, flow, update, setDialog, showSnack, goTab, push } = useApp();
  const isGuardian = role === 'guardian';
  const msgs = useLoad(() => CHAT_MESSAGES, [params.id]);
  const [busy, send] = useSend();
  const [extra, setExtra] = useState([]);
  const [draft, setDraft] = useState('');
  const title = isGuardian ? '김하늘' : (params.id === 's-kong' ? '콩이네 보호자' : '보리네 보호자');
  const dog = params.id === 's-kong' ? '콩이' : '보리';
  const confirmed = params.id === 's-kong' ? true : flow.confirmed;

  const [sheet, setSheet] = useState(null); // 'info' | 'menu'
  const confirm = () => send(() => { update({ confirmed: true }); showSnack('예약을 확정했어요'); });
  const askCancel = () => setDialog(confirmed ? {
    title: '예약을 취소할까요',
    body: isGuardian ? '취소하면 되돌릴 수 없어요. 산책 하루 전까지는 수수료 없이 취소할 수 있어요.' : `취소하면 되돌릴 수 없어요. ${dog}네 보호자에게 바로 알리고, 보호자는 다른 시터를 찾아야 해요.`,
    confirmLabel: '예약 취소',
    onConfirm: () => { update({ confirmed: false, requested: false }); showSnack('예약을 취소했어요'); },
  } : {
    title: isGuardian ? '요청을 취소할까요' : '요청을 거절할까요',
    body: isGuardian ? '김하늘 시터에게 보낸 요청이 닫혀요. 다시 요청하려면 처음부터 골라야 해요.' : `${dog}네 보호자에게 바로 알려요. 다시 하려면 보호자가 새로 요청해야 해요.`,
    confirmLabel: isGuardian ? '요청 취소' : '요청 거절',
    onConfirm: () => { update({ requested: false }); showSnack('요청을 취소했어요'); },
  });
  const sendMsg = () => {
    if (!draft.trim()) return;
    setExtra((e) => [...e, { mine: true, text: draft.trim(), time: '방금' }]);
    setDraft('');
  };

  return (
    <>
      <TopNav title={title} />
      <section className="app-pinned" style={{ paddingRight: 8, paddingTop: 8, paddingBottom: 10, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button type="button" className="md-avatar md-pressable" aria-label={`${dog} 프로필 보기`} style={{ width: 48, height: 48, border: 0, background: 'var(--bg-layer-default)', cursor: 'pointer' }} onClick={() => push('dog')}><Icon name="PawPrint" size={24} /></button>
          <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
            <span className="md-chatbar__name">{dog}</span>
            {confirmed ? <Badge tone="brandSolid">예약확정</Badge> : null}
            {flow.editSent ? <Badge tone="info">수정요청중</Badge> : null}
          </span>
          <IconButton icon="EllipsisVertical" label="더보기" onClick={() => setSheet('menu')} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8, paddingRight: 8 }}>
          {isGuardian
            ? (confirmed
              ? <Btn size="xsmall" className="md-chatbar__btn" disabled>확정했어요</Btn>
              : <Btn variant="brand" size="xsmall" className="md-chatbar__btn" busy={busy} busyLabel="확정 중" onClick={confirm}>예약 확정</Btn>)
            : <Btn size="xsmall" className="md-chatbar__btn" disabled>{confirmed ? '확정됐어요' : '확정 기다리는 중'}</Btn>}
          <Btn size="xsmall" className="md-chatbar__btn" onClick={() => push('chatEdit')}><Icon name="Pencil" size={14} />수정</Btn>
          <Btn size="xsmall" className="md-chatbar__btn" onClick={() => setSheet('info')}><Icon name="Info" size={14} />정보</Btn>
        </div>
      </section>
      {sheet === 'info' ? <ChatInfoSheet onClose={() => setSheet(null)} /> : null}
      {sheet === 'menu' ? <ChatMenuSheet confirmed={confirmed} onClose={() => setSheet(null)} onCancel={askCancel} /> : null}
      <div className="app-scroll">
        <Region load={msgs}
          skeleton={<div className="app-chat" aria-busy="true" aria-label="대화 불러오는 중"><SkeletonBlock height={62} radius={16} style={{ width: '70%' }} /><SkeletonBlock height={42} radius={16} style={{ width: '55%', alignSelf: 'flex-end' }} /><SkeletonBlock height={62} radius={16} style={{ width: '75%' }} /></div>}
          empty={<Result icon="MessageCircle" title="첫 메시지를 보내 보세요">만날 장소와 강아지 성격을 먼저 알려 주면 좋아요.</Result>}
          error={<ErrorResult what="대화" onRetry={msgs.retry} />}>
          {(list) => (
            <div className="app-chat">
              <span className="md-tagtext" style={{ alignSelf: 'center' }}>오늘</span>
              {list.map((m, i) => <Bubble key={i} mine={(m.from === 'guardian') === isGuardian} text={m.text} time={m.time} />)}
              {confirmed ? <SystemNote title={isGuardian ? '예약을 확정했어요' : `${dog}네 보호자가 예약을 확정했어요`}>{isGuardian ? '다른 시터에게 보낸 요청은 자동으로 닫혔어요.' : '이제 주소와 픽업 안내를 볼 수 있어요. 공동현관 비밀번호는 산책 당일에 보여요.'}</SystemNote> : null}
              {extra.map((m, i) => <Bubble key={`x${i}`} mine text={m.text} time={m.time} />)}
            </div>
          )}
        </Region>
      </div>
      <form className="app-composer" onSubmit={(e) => { e.preventDefault(); sendMsg(); }}>
        <label htmlFor="msg" className="visually-hidden" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>메시지</label>
        <input className="md-input" id="msg" placeholder="메시지 보내기" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <button className="md-iconbtn md-pressable" type="submit" aria-label="보내기" style={{ color: draft.trim() ? 'var(--fg-brand)' : 'var(--fg-disabled)' }} disabled={!draft.trim()}><Icon name="Send" /></button>
      </form>
    </>
  );
}

// ── 11·12. 소셜 ──
export function Social() {
  const [tab, setTab] = useState('feed');
  return (
    <>
      <TopNav root title={`${NEIGHBORHOOD} 소셜`} right={<IconButton icon="Search" label="검색" />} />
      <div className="app-tabs" role="tablist" aria-label="소셜 보기">
        <button type="button" role="tab" aria-selected={tab === 'feed'} onClick={() => setTab('feed')}>산책 피드</button>
        <button type="button" role="tab" aria-selected={tab === 'community'} onClick={() => setTab('community')}>동네 이야기</button>
      </div>
      {tab === 'feed' ? <Feed /> : <Community />}
      <Btn variant="brand" className="app-fab"><Icon name="Pencil" size={18} />글쓰기</Btn>
    </>
  );
}

function Feed() {
  const { flow, update, push, role } = useApp();
  const feed = useLoad(() => FEED);
  return (
    <div className="app-scroll">
      <Region load={feed}
        skeleton={<div aria-busy="true" aria-label="피드 불러오는 중">{[0, 1].map((i) => <div key={i} style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}><div style={{ display: 'flex', gap: 10, padding: '0 16px', alignItems: 'center' }}><SkeletonBlock height={36} radius={9999} style={{ width: 36 }} /><SkeletonBlock height={14} radius={9999} style={{ width: 120 }} /></div><SkeletonBlock height={290} radius={0} /><SkeletonBlock height={14} radius={9999} style={{ width: '70%', marginLeft: 16 }} /></div>)}</div>}
        empty={<Result icon="Footprints" title="아직 올라온 산책 기록이 없어요">{NEIGHBORHOOD} 이웃의 산책 기록이 여기에 올라와요.</Result>}
        error={<ErrorResult what="피드" onRetry={feed.retry} />}>
        {(list) => list.map((p) => {
          const on = !!flow.liked[p.id];
          return (
            <article key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 0 12px', boxShadow: 'inset 0 -8px 0 var(--bg-layer-basement)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px' }}>
                <Avatar size={36} />
                <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}><span className="md-item__head"><span className="md-label">{p.author}</span><Badge tone={p.isSitter ? 'brand' : 'neutral'}>{p.isSitter ? '시터' : '보호자'}</Badge></span><Tags items={[NEIGHBORHOOD, p.time]} /></span>
              </div>
              <div className="md-slot"><Icon name="PawPrint" label={`${p.author}의 산책 사진`} /></div>
              <p style={{ margin: 0, padding: '0 16px', fontSize: 15, lineHeight: '21px' }}>{p.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px' }}>
                <Btn variant="ghost" size="small" aria-pressed={on} style={on ? { color: 'var(--fg-critical)' } : undefined} onClick={() => update((f) => ({ liked: { ...f.liked, [p.id]: !on } }))}><Icon name="Heart" size={18} fill={on ? 'currentColor' : 'none'} /><span className="md-num">좋아요 {p.likes + (on ? 1 : 0)}</span></Btn>
                <Btn variant="ghost" size="small"><Icon name="MessageCircle" size={18} /><span className="md-num">댓글 {p.comments}</span></Btn>
                {p.isSitter && role === 'guardian' ? <Btn size="small" style={{ marginLeft: 'auto' }} onClick={() => push('matching')}>산책 부탁하기</Btn> : null}
              </div>
            </article>
          );
        })}
      </Region>
    </div>
  );
}

function Community() {
  const [cat, setCat] = useState('전체');
  const posts = useLoad(() => COMMUNITY);
  return (
    <>
      <div className="app-chiprow" role="group" aria-label="이야기 종류">
        {['전체', '잃어버렸어요', '추천', '나눔', '질문'].map((c) => <button key={c} type="button" className="md-chip md-pressable" aria-pressed={cat === c} onClick={() => setCat(c)}><span>{c}</span></button>)}
      </div>
      <div className="app-scroll">
        <Region load={posts}
          skeleton={<SkeletonList rows={4} avatar="square" label="동네 이야기 불러오는 중" />}
          empty={<Result title="아직 올라온 이야기가 없어요">{NEIGHBORHOOD} 이웃에게 처음으로 이야기를 남겨 보세요.</Result>}
          error={<ErrorResult what="동네 이야기" onRetry={posts.retry} />}>
          {(list) => {
            const shown = list.filter((p) => cat === '전체' || p.cat === cat);
            if (!shown.length) return <Result title={`아직 ${cat} 이야기가 없어요`}>{NEIGHBORHOOD} 이웃에게 처음으로 이야기를 남겨 보세요.</Result>;
            return (
              <div className="md-list">
                {shown.map((p) => (
                  <button key={p.id} type="button" className="md-item md-item--top md-pressable" style={{ border: 0, width: '100%', textAlign: 'left', gridTemplateColumns: 'minmax(0,1fr) auto', boxShadow: 'inset 0 -1px 0 var(--stroke-neutral-subtle)' }}>
                    <span className="md-item__body" style={{ gap: 4 }}>
                      <span className="md-item__head"><Badge tone={p.cat === '잃어버렸어요' ? 'critical' : 'neutral'}>{p.cat}</Badge></span>
                      <span className="md-list-title">{p.title}</span>
                      <span className="md-item__muted" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.body}</span>
                      <Tags items={[NEIGHBORHOOD, p.time, `댓글 ${p.comments}`]} />
                    </span>
                    {p.photo ? <Thumb size={64} label="첨부 사진" /> : <span />}
                  </button>
                ))}
              </div>
            );
          }}
        </Region>
      </div>
    </>
  );
}

// ── 더보기 ──
export function More() {
  const { role, setRole, setSheetOpen, restart, showSnack } = useApp();
  const other = role === 'guardian' ? 'sitter' : 'guardian';
  const rows = role === 'guardian'
    ? [['PawPrint', '내 강아지', '보리, 콩이'], ['CreditCard', '결제 수단', '등록된 카드 1개'], ['Star', '전담 시터', '김하늘'], ['CircleHelp', '고객 지원', '']]
    : [['ChartColumn', '내 시터 분석', '이번 주 검색 노출 42회'], ['Wallet', '정산', '다음 정산 11월 10일'], ['BadgeCheck', '인증', '본인, 계좌, 거주지 인증 완료'], ['CircleHelp', '고객 지원', '']];
  return (
    <>
      <TopNav root title="더보기" />
      <div className="app-scroll">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px 20px' }}>
          <Avatar size={56} />
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span className="md-section-title">{role === 'guardian' ? '보리네 보호자' : '김하늘'}</span><span className="md-detail">{NEIGHBORHOOD}, {role === 'guardian' ? '보호자' : '시터'}로 쓰는 중</span></span>
        </div>
        <Band />
        <div className="md-list">
          {rows.map(([icon, title, sub]) => (
            <button key={title} type="button" className="md-item md-pressable" style={{ border: 0, width: '100%', textAlign: 'left' }} onClick={() => showSnack(`${title}은 다음 버전에서 볼 수 있어요`)}>
              <Icon name={icon} style={{ color: 'var(--fg-neutral-muted)' }} />
              <span className="md-item__body"><span className="md-list-title">{title}</span>{sub ? <span className="md-detail">{sub}</span> : null}</span>
              <Icon name="ChevronRight" size={18} style={{ color: 'var(--fg-neutral-subtle)' }} />
            </button>
          ))}
        </div>
        <Band />
        <ListHeader>미리보기 설정</ListHeader>
        <div style={{ padding: '0 16px 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn style={{ width: '100%' }} onClick={() => setRole(other)}>{other === 'sitter' ? '시터로 바꿔 보기' : '보호자로 바꿔 보기'}</Btn>
          <Btn variant="outline" style={{ width: '100%' }} onClick={() => setSheetOpen(true)}>화면 점검 메뉴 열기</Btn>
          <Btn variant="ghost" style={{ width: '100%' }} onClick={restart}>처음 화면부터 다시 보기</Btn>
        </div>
      </div>
    </>
  );
}

// ── 화면 점검 메뉴 (preview only) ──
export function CheckSheet() {
  const { debug, setDebug, role, setRole, setSheetOpen, restart } = useApp();
  const set = (k) => (v) => setDebug((d) => ({ ...d, [k]: v }));
  const map = (pairs, value) => ({ options: pairs.map((p) => p[1]), value: (pairs.find((p) => p[0] === value) || pairs[0])[1], toKey: (label) => pairs.find((p) => p[1] === label)[0] });
  const data = map([['normal', '정상'], ['empty', '비어 있음'], ['error', '오류']], debug.data);
  const net = map([['fast', '빠름'], ['slow', '느림']], debug.network);
  const theme = map([['system', '기기 설정'], ['light', '라이트'], ['dark', '다크']], debug.theme);
  const who = map([['guardian', '보호자'], ['sitter', '시터']], role);
  return (
    <div className="app-overlay" onClick={() => setSheetOpen(false)}>
      <div className="app-sheet" role="dialog" aria-modal="true" aria-label="화면 점검 메뉴" onClick={(e) => e.stopPropagation()}>
        <span className="app-sheet__handle" aria-hidden="true" />
        <div className="app-sheet__head">
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span className="md-section-title">화면 점검 메뉴</span><span className="md-detail">미리보기에만 있는 메뉴예요. 실제 앱에는 없어요.</span></span>
          <IconButton icon="X" label="닫기" onClick={() => setSheetOpen(false)} />
        </div>
        <section className="app-section"><span className="md-field__label">역할</span><ChipGroup label="역할" options={who.options} value={who.value} onChange={(l) => setRole(who.toKey(l))} /></section>
        <section className="app-section"><span className="md-field__label">데이터 상태</span><ChipGroup label="데이터 상태" options={data.options} value={data.value} onChange={(l) => set('data')(data.toKey(l))} /><span className="md-detail">목록과 기록이 있는 화면에 적용돼요. 바꾸면 다시 불러와요.</span></section>
        <section className="app-section"><span className="md-field__label">인터넷 속도</span><ChipGroup label="인터넷 속도" options={net.options} value={net.value} onChange={(l) => set('network')(net.toKey(l))} /><span className="md-detail">느림으로 두면 로딩 화면을 오래 볼 수 있어요.</span></section>
        <section className="app-section"><span className="md-field__label">테마</span><ChipGroup label="테마" options={theme.options} value={theme.value} onChange={(l) => set('theme')(theme.toKey(l))} /></section>
        <Btn variant="outline" style={{ width: '100%' }} onClick={() => { setSheetOpen(false); restart(); }}>처음 화면부터 다시 보기</Btn>
      </div>
    </div>
  );
}

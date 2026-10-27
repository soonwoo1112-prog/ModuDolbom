// 공용 유틸: 표시 문구·포맷 (모두 한국어)

export const SERVICE = {
  walk: { label: '산책', emoji: '🚶', full: '산책 돌봄' },
  visit: { label: '방문 돌봄', emoji: '🏠', full: '방문 돌봄 (보호자님 댁으로 방문)' },
  daycare: { label: '데이케어', emoji: '🌞', full: '시터 집 돌봄' },
  boarding: { label: '위탁 보딩', emoji: '🎒', full: '시터 집 위탁' },
};

export const REQ_STATUS = {
  awaiting_dedicated: { label: '전담 시터 대기', pill: 'wait' },
  asking_neighbors: { label: '이웃에게 요청 중', pill: 'ask' },
  confirmed: { label: '확정', pill: 'ok' },
  cancelled: { label: '취소', pill: 'bad' },
};

export const BK_STATUS = {
  upcoming: { label: '예정', pill: 'ok' },
  progress: { label: '진행 중', pill: 'ask' },
  completed: { label: '완료', pill: 'gray' },
  noshow: { label: '노쇼·취소', pill: 'bad' },
};

export const ONBOARD_STAGES = [
  { title: '첫 만남은 보호자님과 함께', desc: '시터님이 댁 앞에서 뵈요. 보호자님이 동석해서 첫인사를 나눠요.' },
  { title: '짧은 단독 돌봄', desc: '조금씩 혼자 시간을 늘려요. 첫 몇 분은 함께 걷다가 맡겨요.' },
  { title: '혼자서도 편하게', desc: '이제 시터님과 강아지가 서로 익숙해요. 마음 놓고 맡겨요.' },
];

export const CHECK_ITEMS = ['잘 먹었어요', '신나게 놀았어요', '배변 잘 했어요', '낮잠 잘 잤어요', '산책 즐겁게 했어요'];

export const won = (n) => (n == null ? '금액 추후 확정' : `${n.toLocaleString('ko-KR')}원`);

export const sizeOf = (kg) => (kg < 10 ? '소형견' : kg < 25 ? '중형견' : '대형견');

export const D = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

export const fmtDate = (iso) => {
  if (!iso) return '';
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  const base = `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEK[d.getDay()]})`;
  if (diff === 0) return `오늘 · ${base}`;
  if (diff === 1) return `내일 · ${base}`;
  if (diff === -1) return `어제 · ${base}`;
  return base;
};

export const fmtRange = (date, time, dur) => {
  if (!time) return fmtDate(date);
  const [h, m] = time.split(':').map(Number);
  const end = new Date(2000, 0, 1, h, m + dur);
  const pad = (x) => String(x).padStart(2, '0');
  const ampm = (x) => (x < 12 ? `오전 ${x}` : x === 12 ? '오후 12' : `오후 ${x - 12}`);
  return `${ampm(h)}시 ${pad(m) === '00' ? '' : `${pad(m)}분 `}~ ${ampm(end.getHours())}시 ${pad(end.getMinutes()) === '00' ? '' : `${pad(end.getMinutes())}분`}`;
};

export const fmtClock = (time) => {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const ampm = h < 12 ? '오전' : '오후';
  const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${ampm} ${hh}시${m ? ` ${m}분` : ''}`;
};

export const remainingTime = (deadline) => {
  if (!deadline) return null;
  const ms = new Date(deadline) - new Date();
  if (ms <= 0) return null;
  const mins = Math.ceil(ms / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
};

// 조사: '랑' 결합 (콩이→콩이랑, 보리→보리랑)
export const hasBatchim = (name) => {
  const code = name.charCodeAt(name.length - 1);
  return (code - 0xac00) % 28 > 0;
};
export const withLang = (name) => (hasBatchim(name) ? `${name}이랑` : `${name}랑`);
export const subject = (name) => (hasBatchim(name) ? `${name}이` : `${name}`);

export const meetCountText = (n) => `${n}번째 만남`;

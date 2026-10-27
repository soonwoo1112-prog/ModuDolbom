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

// ── 강아지 성격 태그 카테고리 ──
export const PERSONALITY_CATEGORIES = [
  { key: 'people', label: '사람', tags: ['사람 좋아함', '낯가림', '아이 좋아함', '남자 어른 무서워함'] },
  { key: 'dogs', label: '다른 강아지', tags: ['친구 좋아함', '소형견만 괜찮음', '다른 개 무서워함', '거리 두기 필요'] },
  { key: 'walk', label: '산책 스타일', tags: ['당기는 편', '천천히 냄새 맡기', '에너지 폭발', '금방 지침'] },
  { key: 'temper', label: '성향', tags: ['겁 많음', '호기심 많음', '독립적', '애교쟁이', '분리불안 있음', '식탐 많음'] },
  { key: 'noise', label: '소리·환경', tags: ['오토바이 무서워함', '천둥 무서워함', '잘 짖음', '조용함'] },
];

// ── 강아지 나이 표시: 생년월일 기준 또는 추정 나이 ──
export const ageText = (dog) => {
  if (!dog.birthdayUnknown && dog.birthday) {
    const b = new Date(`${dog.birthday}T00:00:00`);
    const now = new Date();
    let years = now.getFullYear() - b.getFullYear();
    if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) years -= 1;
    return `${Math.max(years, 0)}살`;
  }
  const y = dog.approxYears || 0;
  const m = dog.approxMonths || 0;
  const parts = [];
  if (y) parts.push(`${y}살`);
  if (m) parts.push(`${m}개월`);
  const base = parts.join(' ') || '나이 미정';
  return dog.birthdayUnknown ? `${base} (추정)` : base;
};

// ── 날짜 도우미 (달력용) ──
export const isoOf = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const todayISO = () => isoOf(new Date());
export const addDaysISO = (isoDate, n) => {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + n);
  return isoOf(d);
};
export const diffDays = (a, b) => Math.round((new Date(`${b}T00:00:00`) - new Date(`${a}T00:00:00`)) / 86400000);

// Example data for the preview. Every name, price and count here is a sample, not real data.

export const NEIGHBORHOOD = '역삼동';

export const MY_DOGS = [
  { id: 'bori', name: '보리', size: '중형견', note: '다른 강아지를 보면 조금 짖어요' },
  { id: 'kong', name: '콩이', size: '소형견', note: '산책을 아주 좋아해요' },
];

export const SITTERS = [
  { id: 'haneul', name: '김하늘', sameApt: true, isNew: false, bio: '점심시간에 산책할 수 있어요', price: '30분 15,000원', distance: '120m', meta: ['리뷰 48', '재이용 12명', '답장 10분'] },
  { id: 'doyun', name: '이도윤', sameApt: false, isNew: true, bio: '수업 없는 화요일과 목요일에 산책해요', price: '30분 12,000원', distance: '450m', meta: ['리뷰 아직 없음', '답장 25분'] },
  { id: 'seoyeon', name: '박서연', sameApt: false, isNew: false, bio: '대형견 산책 경험이 많아요', price: '30분 18,000원', distance: '800m', meta: ['리뷰 112', '재이용 31명', '답장 5분'] },
  { id: 'minjun', name: '정민준', sameApt: true, isNew: false, bio: '아침과 점심에 산책할 수 있어요', price: '30분 13,000원', distance: '200m', meta: ['리뷰 9', '답장 40분'] },
  { id: 'yuna', name: '최유나', sameApt: false, isNew: false, bio: '천천히 걷는 산책을 좋아해요', price: '30분 14,000원', distance: '600m', meta: ['리뷰 23', '재이용 4명', '답장 15분'] },
];

export const GUARDIAN_CHATS = [
  { id: 'c-haneul', with: '김하늘', sub: '보리 산책, 내일 오후 12:30', last: '확정해 주시면 내일 101동 1층 현관에서 만나요.', time: '오후 3:05', unread: 1, status: '대화중' },
  { id: 'c-doyun', with: '이도윤', sub: '보리 산책, 내일 오후 12:30', last: '요청을 보냈어요', time: '오후 2:58', unread: 0, status: '요청중' },
];

export const SITTER_CHATS = [
  { id: 's-bori', with: '보리네 보호자', sub: '보리 산책, 내일 오후 12:30', last: '좋아요. 보리가 다른 강아지를 보면 조금 짖어요.', time: '오후 3:04', unread: 1, status: '대화중' },
  { id: 's-kong', with: '콩이네 보호자', sub: '콩이 산책, 오늘 오후 2:00', last: '오늘도 잘 부탁드려요.', time: '오전 10:12', unread: 0, status: '예약확정' },
];

export const CHAT_MESSAGES = [
  { from: 'sitter', text: '안녕하세요. 같은 아파트 103동에 살아요. 내일 12시 반에 산책할 수 있어요.', time: '오후 3:02' },
  { from: 'guardian', text: '좋아요. 보리가 다른 강아지를 보면 조금 짖어요.', time: '오후 3:04' },
  { from: 'sitter', text: '괜찮아요. 강아지가 적은 공원 길로 걸을게요. 확정해 주시면 내일 101동 1층 현관에서 만나요.', time: '오후 3:05' },
];

export const FEED = [
  { id: 'p1', author: '김하늘', isSitter: true, time: '1시간 전', text: '보리와 점심 산책을 했어요. 공원 산책로에 은행잎이 많이 떨어져 있었어요.', likes: 12, comments: 3 },
  { id: 'p2', author: '콩이네', isSitter: false, time: '3시간 전', text: '콩이가 처음으로 다른 강아지와 인사했어요. 산책 다녀오면 늘 기분이 좋아 보여요.', likes: 8, comments: 1 },
  { id: 'p3', author: '정민준', isSitter: true, time: '어제', text: '아침 산책은 공기가 차가워져서 짧게 다녀왔어요. 두부가 낙엽 밟는 소리를 좋아해요.', likes: 5, comments: 0 },
];

export const COMMUNITY = [
  { id: 'q1', cat: '잃어버렸어요', title: '하얀 말티즈를 찾고 있어요', body: '오늘 오전 9시쯤 역삼공원 정문 근처에서 잃어버렸어요. 빨간 목줄을 하고 있어요. 보신 분은 댓글 남겨 주세요.', time: '20분 전', comments: 6, photo: true },
  { id: 'q2', cat: '추천', title: '강아지와 들어갈 수 있는 카페 있나요', body: '테라스 말고 실내에도 함께 들어갈 수 있는 곳을 찾고 있어요.', time: '1시간 전', comments: 4, photo: false },
  { id: 'q3', cat: '나눔', title: '소형견 하네스 나눔해요', body: 'S 사이즈예요. 몇 번 안 썼어요. 101동 앞에서 드릴게요.', time: '어제', comments: 2, photo: true },
  { id: 'q4', cat: '질문', title: '겨울 산책 몇 분이 적당할까요', body: '추워지니까 산책 시간을 줄여야 할지 고민이에요.', time: '2일 전', comments: 9, photo: false },
];

export const GUARDIAN_BOOKINGS = {
  6: [{ title: '보리 산책, 오후 12:30', detail: '김하늘 시터와 산책하고 있어요', status: '산책중', tone: 'info', go: 'live' }],
  3: [{ title: '보리 산책, 오후 12:30', detail: '김하늘 시터, 30분', status: '산책완료', tone: 'neutral', go: 'log' }],
  7: [{ title: '보리 산책, 오후 12:30', detail: '김하늘 시터, 30분, 101동 1층 현관', status: '예약확정', tone: 'brand', go: 'chat' }],
  14: [{ title: '보리 산책, 오후 6:00', detail: '시터 2명에게 요청했어요', status: '요청중', tone: 'outline', go: 'sent' }],
};

export const SITTER_TODAY = [
  { id: 'kong', dog: '콩이', time: '오후 2:00', detail: '30분, 103동 정문', guardian: '콩이네 보호자', canStart: true },
  { id: 'dubu', dog: '두부', time: '오후 6:30', detail: '60분, 101동 1층 현관', guardian: '두부네 보호자', canStart: false },
];

export const SITTER_WEEK = [
  { dow: '일', day: 1, dogs: [] }, { dow: '월', day: 2, dogs: ['콩이'] }, { dow: '화', day: 3, dogs: ['보리'] },
  { dow: '수', day: 4, dogs: [] }, { dow: '목', day: 5, dogs: ['두부'] }, { dow: '금', day: 6, dogs: ['콩이', '두부'] },
  { dow: '토', day: 7, dogs: ['보리'] },
];

export const SITTER_HOURS = {
  월: '오전 7:00~9:00, 오전 11:30~오후 1:30', 화: '오전 11:30~오후 1:30', 수: '오전 11:30~오후 1:30',
  목: '오전 11:30~오후 1:30', 금: '오전 11:30~오후 2:30', 토: '오전 10:00~오후 7:00', 일: '오전 10:00~오후 5:00',
};

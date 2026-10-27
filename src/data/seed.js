// 모두돌봄 샘플 데이터 — 엔티티: Dog, SitterProfile, CareRequest, Booking,
// DiaryPost, SitterNote, Review, Waitlist, FavoriteSitter, Chat
// 날짜는 실행일 기준 상대 오프셋(D(n))로 생성한다.

const D = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const hoursFromNow = (h) => new Date(Date.now() + h * 3600 * 1000).toISOString();

export const CURRENT_USER_ID = 'u1';

export const seed = {
  session: {
    onboarded: false,
    userId: CURRENT_USER_ID,
    region: null,          // 선택한 운영 동네
    regionLocked: false,   // 오픈 전 지역(미리보기 모드)
    role: null,            // 'guardian' | 'sitter' | 'both'
    mode: 'guardian',      // 현재 화면 모드
  },

  users: [
    { id: 'u1', name: '김하늘', neighborhood: '망원동', email: 'haneul@example.com' },
    { id: 'u2', name: '이민서', neighborhood: '망원동', email: 'minseo@example.com' },
  ],

  // ── SitterProfile ──
  sitters: [
    {
      id: 's-jiun', userId: 'su-jiun', name: '박지은', emoji: '👩',
      neighborhood: '망원동',
      intro: '강아지 산책이 저의 운동이자 취미예요. 망원한강공원을 매일 다니며 반려견들의 언어를 조금씩 배우고 있어요. 첫 만남은 늘 보호자님과 함께, 서두르지 않고 마음을 열어줄게요.',
      ratePer30: 15000,
      days: ['월', '화', '수', '목', '금', '토'],
      hours: '오전 8시 ~ 오후 8시',
      verified: { identity: true, neighborhood: true, account: true },
      eduBadge: true,
      rating: 4.9, reviewCount: 23,
      plan: '프로 이웃',
      gpsShare: true, actionCam: true,
    },
    {
      id: 's-doyun', userId: 'su-doyun', name: '최도윤', emoji: '🧑',
      neighborhood: '망원동',
      intro: '보리 같은 에너지 넘치는 아이들이 좋아요. 시바 친구들과 산책 모임도 운영하고 있어서 고집스러운 친구들도 편하게 다뤄요.',
      ratePer30: 13000,
      days: ['화', '수', '목', '금', '토', '일'],
      hours: '오후 2시 ~ 오후 9시',
      verified: { identity: true, neighborhood: true, account: true },
      eduBadge: true,
      rating: 4.7, reviewCount: 11,
      plan: '기본 이웃',
      gpsShare: false, actionCam: true,
    },
    {
      id: 's-seoyeon', userId: 'su-seoyeon', name: '한서연', emoji: '👩‍🦰',
      neighborhood: '성산동',
      intro: '대형견과 함께 자라서 힘센 친구들도 홀딱! 두부 같은 골든 친구들이 제 특기예요. 방문 돌봄 때는 집 안을 아이 리듬에 맞춰 움직여요.',
      ratePer30: 14000,
      days: ['월', '수', '금', '토'],
      hours: '오전 9시 ~ 오후 9시',
      verified: { identity: true, neighborhood: true, account: false },
      eduBadge: false,
      rating: 4.8, reviewCount: 8,
      plan: '프로 이웃',
      gpsShare: true, actionCam: false,
    },
    {
      id: 's-saebyeok', userId: 'su-saebyeok', name: '강새벽', emoji: '🧑‍🎤',
      neighborhood: '망원동',
      intro: '반려견을 키워본 경험은 오래됐지만 마음은 새벽처럼 신선해요! 첫 시터로 꼼꼼하게, 사진 많이 보내드릴게요.',
      ratePer30: 12000,
      days: ['월', '화', '목', '토', '일'],
      hours: '오전 7시 ~ 오후 10시',
      verified: { identity: false, neighborhood: false, account: false },
      eduBadge: false,
      rating: null, reviewCount: 0,
      plan: null,
      gpsShare: false, actionCam: false,
      isNew: true,
    },
    {
      id: 's-haneul', userId: 'u1', name: '김하늘', emoji: '🙋‍♀️',
      neighborhood: '망원동',
      intro: '콩이와 보리를 키우는 보호자이자, 이웃 시터예요. 내 아이들을 돌보듯 정성껏 돌봐드릴게요.',
      ratePer30: 13000,
      days: ['월', '수', '금'],
      hours: '오전 9시 ~ 오후 6시',
      verified: { identity: true, neighborhood: false, account: true },
      eduBadge: false,
      rating: 4.8, reviewCount: 3,
      plan: '기본 이웃',
      gpsShare: false, actionCam: false,
    },
  ],

  // ── Dog ──
  dogs: [
    {
      id: 'd-kong', guardianId: 'u1', name: '콩이', emoji: '🐩',
      breed: '말티즈', weight: 3, age: 4,
      tags: ['겁많음', '사람좋아함'],
      cautions: '큰 소리와 큰 강아지를 무서워해요. 산책은 목줄 필수예요.',
      route: '망원한강공원 물가 둘레길',
      neighborhood: '망원동',
    },
    {
      id: 'd-bori', guardianId: 'u1', name: '보리', emoji: '🐕',
      breed: '시바이누', weight: 9, age: 3,
      tags: ['활발함', '고집있음'],
      cautions: '앞발 만지는 건 싫어해요. 배변은 풀밭에서 해요.',
      route: '망원시장 뒷골목 → 웨스트게이트',
      neighborhood: '망원동',
    },
    {
      id: 'd-dubu', guardianId: 'u2', name: '두부', emoji: '🦮',
      breed: '골든리트리버', weight: 30, age: 2,
      tags: ['사람좋아함', '활발함'],
      cautions: '힘이 세서 리드를 단단히 잡아주세요. 물을 좋아해요.',
      route: '성산천 산책로',
      neighborhood: '망원동',
    },
  ],

  // ── FavoriteSitter (전담 시터) ──
  favorites: [
    { guardianId: 'u1', dogId: 'd-kong', sitterId: 's-jiun' },
  ],

  // ── CareRequest ──
  requests: [
    {
      id: 'r1', guardianId: 'u1', dogId: 'd-kong', service: 'walk',
      date: D(1), startTime: '10:00', duration: 30,
      cautions: '큰 소리와 큰 강아지를 무서워해요.',
      route: '망원한강공원 물가 둘레길',
      status: 'confirmed',
      requestedSitterIds: ['s-jiun'], confirmedSitterId: 's-jiun',
      createdAt: D(-1),
    },
    {
      id: 'r2', guardianId: 'u1', dogId: 'd-bori', service: 'walk',
      date: D(2), startTime: '11:00', duration: 60,
      cautions: '앞발 만지는 건 싫어해요.',
      route: '망원시장 뒷골목 → 웨스트게이트',
      status: 'asking_neighbors',
      requestedSitterIds: ['s-jiun', 's-doyun', 's-seoyeon', 's-saebyeok'],
      createdAt: D(0),
    },
    {
      id: 'r3', guardianId: 'u1', dogId: 'd-kong', service: 'walk',
      date: D(4), startTime: '16:00', duration: 60,
      cautions: '큰 소리와 큰 강아지를 무서워해요.',
      route: '망원한강공원 물가 둘레길',
      status: 'awaiting_dedicated',
      requestedSitterIds: ['s-jiun'],
      dedicatedDeadline: hoursFromNow(2),
      createdAt: D(0),
    },
    {
      id: 'r4', guardianId: 'u2', dogId: 'd-dubu', service: 'walk',
      date: D(1), startTime: '10:00', duration: 60,
      cautions: '힘이 세서 리드를 단단히 잡아주세요.',
      route: '성산천 산책로',
      status: 'asking_neighbors',
      requestedSitterIds: ['s-haneul', 's-jiun', 's-doyun', 's-saebyeok'],
      createdAt: D(0),
    },
    {
      id: 'r5', guardianId: 'u2', dogId: 'd-dubu', service: 'visit',
      date: D(3), startTime: '19:00', duration: 30,
      cautions: '저녁 사료는 냉장고 왼쪽에 있어요.',
      route: '',
      status: 'asking_neighbors',
      requestedSitterIds: ['s-haneul', 's-seoyeon'],
      createdAt: D(0),
    },
  ],

  // ── Booking ──
  bookings: [
    { id: 'b1', requestId: null, guardianId: 'u1', sitterId: 's-jiun', dogId: 'd-kong', service: 'walk', date: D(-21), startTime: '10:00', duration: 30, meetingNumber: 1, stage: 1, status: 'completed', amount: 15000 },
    { id: 'b2', requestId: null, guardianId: 'u1', sitterId: 's-jiun', dogId: 'd-kong', service: 'walk', date: D(-18), startTime: '10:00', duration: 60, meetingNumber: 2, stage: 2, status: 'completed', amount: 30000 },
    { id: 'b3', requestId: null, guardianId: 'u1', sitterId: 's-jiun', dogId: 'd-kong', service: 'walk', date: D(-14), startTime: '09:30', duration: 30, meetingNumber: 3, stage: 3, status: 'completed', amount: 15000 },
    { id: 'b4', requestId: null, guardianId: 'u1', sitterId: 's-jiun', dogId: 'd-kong', service: 'visit', date: D(-10), startTime: '19:00', duration: 30, meetingNumber: 4, stage: 3, status: 'completed', amount: 15000 },
    { id: 'b5', requestId: null, guardianId: 'u1', sitterId: 's-jiun', dogId: 'd-kong', service: 'walk', date: D(-7), startTime: '10:00', duration: 60, meetingNumber: 5, stage: 3, status: 'completed', amount: 30000 },
    { id: 'b6', requestId: null, guardianId: 'u1', sitterId: 's-jiun', dogId: 'd-kong', service: 'walk', date: D(-3), startTime: '10:00', duration: 30, meetingNumber: 6, stage: 3, status: 'completed', amount: 15000 },
    { id: 'b7', requestId: 'r1', guardianId: 'u1', sitterId: 's-jiun', dogId: 'd-kong', service: 'walk', date: D(1), startTime: '10:00', duration: 30, meetingNumber: 7, stage: 3, status: 'upcoming', amount: 15000 },
    { id: 'b8', requestId: null, guardianId: 'u1', sitterId: 's-doyun', dogId: 'd-bori', service: 'walk', date: D(-3), startTime: '11:00', duration: 60, meetingNumber: 1, stage: 1, status: 'completed', amount: 26000 },
    { id: 'b9', requestId: 'r2', guardianId: 'u1', sitterId: 's-doyun', dogId: 'd-bori', service: 'walk', date: D(2), startTime: '11:00', duration: 60, meetingNumber: 2, stage: 2, status: 'upcoming', amount: 26000 },
    { id: 'b10', requestId: null, guardianId: 'u2', sitterId: 's-seoyeon', dogId: 'd-dubu', service: 'visit', date: D(-5), startTime: '19:00', duration: 30, meetingNumber: 1, stage: 1, status: 'completed', amount: 14000 },
    { id: 'b11', requestId: null, guardianId: 'u2', sitterId: 's-seoyeon', dogId: 'd-dubu', service: 'visit', date: D(5), startTime: '19:00', duration: 30, meetingNumber: 2, stage: 2, status: 'upcoming', amount: 14000 },
    { id: 'b12', requestId: null, guardianId: 'u2', sitterId: 's-haneul', dogId: 'd-dubu', service: 'walk', date: D(-9), startTime: '10:00', duration: 60, meetingNumber: 1, stage: 1, status: 'completed', amount: 26000 },
    { id: 'b13', requestId: null, guardianId: 'u1', sitterId: 's-saebyeok', dogId: 'd-kong', service: 'walk', date: D(-1), startTime: '17:00', duration: 30, meetingNumber: 1, stage: 1, status: 'noshow', amount: 12000 },
    { id: 'b14', requestId: null, guardianId: 'u2', sitterId: 's-haneul', dogId: 'd-dubu', service: 'visit', date: D(-2), startTime: '19:30', duration: 30, meetingNumber: 2, stage: 2, status: 'completed', amount: 13000 },
  ],

  // ── DiaryPost ──
  diaries: [
    {
      id: 'p1', bookingId: 'b2', dogId: 'd-kong', sitterId: 's-jiun',
      photos: ['🌳', '🐕'], checks: ['신나게 놀았어요', '배변 잘 했어요'],
      body: '콩이랑 망원한강공원 물가 둘레길을 천천히 걸었어요. 자전거 소리에 슬금슬금 다리 뒤로 숨는 게 귀여워서 잠깐 쉬어가며 산책했어요. 둘레길 한 바퀴 돌고 나서 물도 잘 마시고, 집 앞에서는 꼬리를 살랑살랑 흔들며 인사했어요.',
      neighborhood: '망원동', isPublic: true, createdAt: D(-18),
    },
    {
      id: 'p2', bookingId: 'b4', dogId: 'd-kong', sitterId: 's-jiun',
      photos: ['🏠'], checks: ['잘 먹었어요', '낮잠 잘 잤어요'],
      body: '저녁 방문 돌봄으로 뵀어요. 간식도 잘 받아먹고, 좋아하는 담요 위에서 낮잠까지 편하게 잤어요. 문 앞에서 인사할 때 폼폼 뛰는 콩이를 보고 가는 길이 늘 행복해요.',
      neighborhood: '망원동', isPublic: true, createdAt: D(-10),
    },
    {
      id: 'p3', bookingId: 'b8', dogId: 'd-bori', sitterId: 's-doyun',
      photos: ['🌇', '🐕'], checks: ['신나게 놀았어요', '배변 잘 했어요', '산책 즐겁게 했어요'],
      body: '보리는 역시 시본심이 강한 친구예요. 망원시장 뒷골목을 지날 땐 저를 리드했고, 웨스트게이트 앞 잔디밭에서는 신이 나서 팔각뛰기를 두 번이나 했어요. 배변은 딱 한 번, 풀밭에서 깔끔하게! 다음 산책도 기대돼요.',
      neighborhood: '망원동', isPublic: true, createdAt: D(-3),
    },
    {
      id: 'p4', bookingId: 'b10', dogId: 'd-dubu', sitterId: 's-seoyeon',
      photos: ['🦮', '🌙'], checks: ['잘 먹었어요', '낮잠 잘 잤어요'],
      body: '두부 집에 처음 방문했어요. 첫인사 후 제 팔에 얼굴을 비벼대더니 금방 친해졌어요. 저녁 사료 맛있게 다 먹고, 거실 한 바퀴 돌다가 제 옆에서 코를 골며 잠들었어요. 대형견의 온기, 참 따뜻해요.',
      neighborhood: '망원동', isPublic: true, createdAt: D(-5),
    },
    {
      id: 'p5', bookingId: 'b12', dogId: 'd-dubu', sitterId: 's-haneul',
      photos: ['💧', '🦮'], checks: ['신나게 놀았어요', '산책 즐겁게 했어요'],
      body: '두부랑 성산천 산책로를 걸었어요. 물가에만 다가가면 사륜구동으로 기쁨의 몸부림을 쳐서, 잠깐 발만 담그고 봤어요. 돌아오는 길엔 보호자님 생각인지 앞장서서 걷다가 뒤를 꼭 확인하는 두부가 참 예뻤어요.',
      neighborhood: '망원동', isPublic: true, createdAt: D(-9),
    },
  ],

  // ── SitterNote (시터 간 비공개 인계 메모) ──
  notes: [
    { id: 'n1', dogId: 'd-kong', sitterId: 's-jiun', createdAt: D(-7), content: '콩이는 지나가는 오토바이 소리에 멈칫해요. 잠깐 안아주거나 길 건너편으로 바꾸면 금방 진정돼요. 물가 둘레길에서는 비둘기떼에 주의!' },
    { id: 'n2', dogId: 'd-bori', sitterId: 's-doyun', createdAt: D(-3), content: '보리는 리드에 여유를 주면 더 편하게 걸어요. 앞발 만지려 하면 슬쩍 피하니까 쓰다듬기 전에 보리가 먼저 다가오게 두세요.' },
  ],

  // ── Review ──
  reviews: [
    { id: 'rv1', bookingId: 'b1', authorId: 'u1', sitterId: 's-jiun', rating: 5, content: '첫 만남부터 콩이가 지은님을 정말 좋아해요. 산책 사진도 매번 보내주셔서 안심이 돼요.', createdAt: D(-20) },
    { id: 'rv2', bookingId: 'b10', authorId: 'u2', sitterId: 's-seoyeon', rating: 5, content: '방문 돌봄 첫날이라 조마조마했는데, 두부가 바로 편해하는 게 보였어요. 다이어리도 정성 가득!', createdAt: D(-4) },
    { id: 'rv3', bookingId: 'b12', authorId: 'u2', sitterId: 's-haneul', rating: 5, content: '실시간으로 사진도 보내주시고, 두부가 힘세게 달릴 때도 안전하게 잡아주셨어요. 이웃 시터 최고!', createdAt: D(-8) },
    { id: 'rv4', bookingId: null, authorId: 'u2', sitterId: 's-jiun', rating: 5, content: '정말 꼼꼼하고 친절해요. 강아지 기질까지 파악해서 돌봐주세요.', createdAt: D(-30) },
    { id: 'rv5', bookingId: null, authorId: 'u1', sitterId: 's-doyun', rating: 4, content: '활발한 보리를 잘 받아줬어요. 다음에도 부탁드릴게요!', createdAt: D(-15) },
  ],

  // ── Waitlist (우리 동네 오픈 알림 대기자) ──
  waitlist: [],

  // ── 1:1 채팅 (예약 확정 후에만) ──
  chats: [
    {
      id: 'c1', bookingId: 'b7', guardianId: 'u1', sitterId: 's-jiun',
      messages: [
        { from: 'sitter', text: '내일 콩이 산책 정말 기대돼요! 만나는 곳은 망원한강공원 북문 어귀 어떠세요?', time: D(0) },
        { from: 'guardian', text: '네, 그 장소 딱 좋아요! 콩이가 좋아할 거예요 😊', time: D(0) },
        { from: 'sitter', text: '날이 좀 쌀쌀하니 콩이 외투 챙겨가세요. 제가 챙겨 입혀드릴게요!', time: D(0) },
      ],
    },
    {
      id: 'c2', bookingId: 'b12', guardianId: 'u2', sitterId: 's-haneul',
      messages: [
        { from: 'guardian', text: '하늘님, 두부 산책 다녀오시면 사진 부탁드려도 될까요?', time: D(-9) },
        { from: 'sitter', text: '당연히죠! 물가에서 놀라는 두부 사진 많이 찍어올게요 📸', time: D(-9) },
      ],
    },
  ],

  // ── 배우기 진도 ──
  learnDone: [],
};

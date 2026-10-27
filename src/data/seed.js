// 모두돌봄 샘플 데이터 — 엔티티: Dog, SitterProfile, CareRequest, Booking,
// DiaryPost, SitterNote, Review, GuardianReview, Waitlist, FavoriteSitter, Chat
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
    loggedIn: false,       // 첫 화면 = 로그인(목업)
    onboarded: false,
    userId: CURRENT_USER_ID,
    region: null,          // 선택한 운영 동네
    regionLocked: false,   // 오픈 전 지역(미리보기 모드)
    role: null,            // 'guardian' | 'sitter' | 'both'
    mode: 'guardian',      // 현재 화면 모드
  },

  users: [
    {
      id: 'u1', name: '김하늘', photo: '🙋‍♀️', neighborhood: '망원동', email: 'haneul@example.com',
      intro: '콩이와 보리를 키우는 망원동 보호자예요. 아침마다 두 아이와 한강으로 산책해요. 예의 바르고 시간 약속을 잘 지키려고 노력해요.',
    },
    {
      id: 'u2', name: '이민서', photo: '🧑', neighborhood: '망원동', email: 'minseo@example.com',
      intro: '골든리트리버 두부와 살아요. 두부는 힘이 세지만 마음은 순해요. 출장이 있을 때 이웃 시터님들께 부탁드려요.',
    },
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
      id: 'd-kong', guardianId: 'u1', name: '콩이', emoji: '🐩', photo: null,
      breed: '말티즈', weight: 3, neighborhood: '망원동',
      birthday: D(-1580), birthdayUnknown: false, gotchaDate: null,
      tags: ['사람 좋아함', '낯가림', '겁 많음', '애교쟁이', '분리불안 있음', '천둥 무서워함', '오토바이 무서워함', '천천히 냄새 맡기', '조용함'],
      intro: '처음 보는 사람에게는 슬금슬금하지만, 한번 친해지면 꼬리가 몸에서 떨어질 듯 흔들어요. 간식을 아주 좋아해서 마음의 문이 빨리 열려요.',
      cautions: '큰 소리(오토바이·천둥)에 놀라 걸음을 멈춰요. 그럴 땐 잠깐 안아주거나 반대편으로 방향을 바꿔주세요. 산책은 목줄 필수예요.',
      neutered: true, allergies: '없어요', meds: '없어요',
      vaccination: '종합백신·광견병·코로나 연 1회 접종 완료',
      regNumber: '410123456789012',
      vet: { name: '망원동물메디컬센터', phone: '02-332-1234' },
      gallery: ['🐕', '🦴', '🎾', '⛺'],
    },
    {
      id: 'd-bori', guardianId: 'u1', name: '보리', emoji: '🐕', photo: null,
      breed: '시바이누', weight: 9, neighborhood: '망원동',
      birthday: D(-1290), birthdayUnknown: false, gotchaDate: null,
      tags: ['친구 좋아함', '에너지 폭발', '당기는 편', '호기심 많음', '오토바이 무서워함', '식탐 많음', '잘 짖음', '독립적'],
      intro: '망원시장 골목길의 스타예요. 산책이 시작되면 앞장서고, 마음에 안 들면 딱 멈추는 시바다움이 있어요. 마당친구들과 노는 걸 제일 좋아해요.',
      cautions: '앞발 만지는 건 싫어해요. 배변은 풀밭에서 해요. 리드가 팽팽해지면 잠깐 멈추고 기다려주세요.',
      neutered: true, allergies: '없어요', meds: '심장사상충 예방약 월 1회',
      vaccination: '종합백신·광견병 접종 완료 (켄넬코로나 추가)',
      regNumber: '410123456789013',
      vet: { name: '망원동물메디컬센터', phone: '02-332-1234' },
      gallery: ['🐕', '🌇', '🐾'],
    },
    {
      id: 'd-dubu', guardianId: 'u2', name: '두부', emoji: '🦮', photo: null,
      breed: '골든리트리버', weight: 30, neighborhood: '망원동',
      birthday: null, birthdayUnknown: true, approxYears: 2, approxMonths: 0,
      gotchaDate: D(-870),
      tags: ['사람 좋아함', '아이 좋아함', '다른 개 무서워함', '금방 지침', '애교쟁이', '조용함', '천천히 냄새 맡기', '식탐 많음'],
      intro: '태어난 곳이 어딘지는 몰라도, 지금은 망원동이 온 세상인 아이예요. 이웃들 인사를 받으면 꼬리 흔드는 데 온몸이 다 들어가요. 물 보면 사륜구동!',
      cautions: '힘이 세서 리드를 두 겹으로 잡아주세요. 물가에선 발만 담그게 해주세요 (수영 못해요). 닭고기 알레르기가 의심돼요.',
      neutered: true, allergies: '닭고기 알레르기 의심', meds: '없어요',
      vaccination: '종합백신·광견병 접종 완료',
      regNumber: '410123456789014',
      vet: { name: '성산펫클리닉', phone: '02-335-5678' },
      gallery: ['🦮', '💧', '🐕', '🌙'],
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
      date: D(9), startTime: '16:00', duration: 60,
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
    // 콩이 정기 산책 — 5일 연속 (캘린더에 막대로 이어져요)
    { id: 'b15', requestId: null, guardianId: 'u1', sitterId: 's-jiun', dogId: 'd-kong', service: 'walk', date: D(4), startTime: '10:00', duration: 30, meetingNumber: 8, stage: 3, status: 'upcoming', amount: 15000 },
    { id: 'b16', requestId: null, guardianId: 'u1', sitterId: 's-jiun', dogId: 'd-kong', service: 'walk', date: D(5), startTime: '10:00', duration: 30, meetingNumber: 9, stage: 3, status: 'upcoming', amount: 15000 },
    { id: 'b17', requestId: null, guardianId: 'u1', sitterId: 's-jiun', dogId: 'd-kong', service: 'walk', date: D(6), startTime: '10:00', duration: 30, meetingNumber: 10, stage: 3, status: 'upcoming', amount: 15000 },
    { id: 'b18', requestId: null, guardianId: 'u1', sitterId: 's-jiun', dogId: 'd-kong', service: 'walk', date: D(7), startTime: '10:00', duration: 30, meetingNumber: 11, stage: 3, status: 'upcoming', amount: 15000 },
    { id: 'b19', requestId: null, guardianId: 'u1', sitterId: 's-jiun', dogId: 'd-kong', service: 'walk', date: D(8), startTime: '10:00', duration: 30, meetingNumber: 12, stage: 3, status: 'upcoming', amount: 15000 },
    { id: 'b8', requestId: null, guardianId: 'u1', sitterId: 's-doyun', dogId: 'd-bori', service: 'walk', date: D(-3), startTime: '11:00', duration: 60, meetingNumber: 1, stage: 1, status: 'completed', amount: 26000 },
    { id: 'b9', requestId: null, guardianId: 'u1', sitterId: 's-doyun', dogId: 'd-bori', service: 'walk', date: D(2), startTime: '11:00', duration: 60, meetingNumber: 2, stage: 2, status: 'upcoming', amount: 26000 },
    { id: 'b10', requestId: null, guardianId: 'u2', sitterId: 's-seoyeon', dogId: 'd-dubu', service: 'visit', date: D(-5), startTime: '19:00', duration: 30, meetingNumber: 1, stage: 1, status: 'completed', amount: 14000 },
    { id: 'b11', requestId: null, guardianId: 'u2', sitterId: 's-seoyeon', dogId: 'd-dubu', service: 'visit', date: D(5), startTime: '19:00', duration: 30, meetingNumber: 2, stage: 2, status: 'upcoming', amount: 14000 },
    // 두부 방문 돌봄 — 3일 연속
    { id: 'b20', requestId: null, guardianId: 'u2', sitterId: 's-seoyeon', dogId: 'd-dubu', service: 'visit', date: D(10), startTime: '19:00', duration: 30, meetingNumber: 3, stage: 3, status: 'upcoming', amount: 14000 },
    { id: 'b21', requestId: null, guardianId: 'u2', sitterId: 's-seoyeon', dogId: 'd-dubu', service: 'visit', date: D(11), startTime: '19:00', duration: 30, meetingNumber: 4, stage: 3, status: 'upcoming', amount: 14000 },
    { id: 'b22', requestId: null, guardianId: 'u2', sitterId: 's-seoyeon', dogId: 'd-dubu', service: 'visit', date: D(12), startTime: '19:00', duration: 30, meetingNumber: 5, stage: 3, status: 'upcoming', amount: 14000 },
    { id: 'b12', requestId: null, guardianId: 'u2', sitterId: 's-haneul', dogId: 'd-dubu', service: 'walk', date: D(-9), startTime: '10:00', duration: 60, meetingNumber: 1, stage: 1, status: 'completed', amount: 26000 },
    { id: 'b13', requestId: null, guardianId: 'u1', sitterId: 's-saebyeok', dogId: 'd-kong', service: 'walk', date: D(-1), startTime: '17:00', duration: 30, meetingNumber: 1, stage: 1, status: 'noshow', amount: 12000 },
    { id: 'b14', requestId: null, guardianId: 'u2', sitterId: 's-haneul', dogId: 'd-dubu', service: 'visit', date: D(-2), startTime: '19:30', duration: 30, meetingNumber: 2, stage: 2, status: 'completed', amount: 13000 },
  ],

  // ── DiaryPost (동네일기) ──
  diaries: [
    {
      id: 'p1', bookingId: 'b2', dogId: 'd-kong', sitterId: 's-jiun',
      photos: ['🌳', '🐕', '🎾'], checks: ['신나게 놀았어요', '배변 잘 했어요'],
      body: '콩이랑 망원한강공원 물가 둘레길을 천천히 걸었어요. 자전거 소리에 슬금슬금 다리 뒤로 숨는 게 귀여워서 잠깐 쉬어가며 산책했어요. 둘레길 한 바퀴 돌고 나서 물도 잘 마시고, 집 앞에서는 꼬리를 살랑살랑 흔들며 인사했어요.',
      neighborhood: '망원동', isPublic: true, createdAt: D(-18),
      likes: 12, liked: false, comments: 3,
    },
    {
      id: 'p2', bookingId: 'b4', dogId: 'd-kong', sitterId: 's-jiun',
      photos: ['🏠', '🌙'], checks: ['잘 먹었어요', '낮잠 잘 잤어요'],
      body: '저녁 방문 돌봄으로 뵀어요. 간식도 잘 받아먹고, 좋아하는 담요 위에서 낮잠까지 편하게 잤어요. 문 앞에서 인사할 때 폼폼 뛰는 콩이를 보고 가는 길이 늘 행복해요.',
      neighborhood: '망원동', isPublic: true, createdAt: D(-10),
      likes: 8, liked: false, comments: 1,
    },
    {
      id: 'p3', bookingId: 'b8', dogId: 'd-bori', sitterId: 's-doyun',
      photos: ['🌇', '🐕'], checks: ['신나게 놀았어요', '배변 잘 했어요', '산책 즐겁게 했어요'],
      body: '보리는 역시 시본심이 강한 친구예요. 망원시장 뒷골목을 지날 땐 저를 리드했고, 웨스트게이트 앞 잔디밭에서는 신이 나서 팔각뛰기를 두 번이나 했어요. 배변은 딱 한 번, 풀밭에서 깔끔하게! 다음 산책도 기대돼요.',
      neighborhood: '망원동', isPublic: true, createdAt: D(-3),
      likes: 15, liked: false, comments: 4,
    },
    {
      id: 'p4', bookingId: 'b10', dogId: 'd-dubu', sitterId: 's-seoyeon',
      photos: ['🦮', '🌙'], checks: ['잘 먹었어요', '낮잠 잘 잤어요'],
      body: '두부 집에 처음 방문했어요. 첫인사 후 제 팔에 얼굴을 비벼대더니 금방 친해졌어요. 저녁 사료 맛있게 다 먹고, 거실 한 바퀴 돌다가 제 옆에서 코를 골며 잠들었어요. 대형견의 온기, 참 따뜻해요.',
      neighborhood: '망원동', isPublic: true, createdAt: D(-5),
      likes: 21, liked: false, comments: 5,
    },
    {
      id: 'p5', bookingId: 'b12', dogId: 'd-dubu', sitterId: 's-haneul',
      photos: ['💧', '🦮', '🌤️'], checks: ['신나게 놀았어요', '산책 즐겁게 했어요'],
      body: '두부랑 성산천 산책로를 걸었어요. 물가에만 다가가면 사륜구동으로 기쁨의 몸부림을 쳐서, 잠깐 발만 담그고 봤어요. 돌아오는 길엔 보호자님 생각인지 앞장서서 걷다가 뒤를 꼭 확인하는 두부가 참 예뻤어요.',
      neighborhood: '망원동', isPublic: true, createdAt: D(-9),
      likes: 18, liked: false, comments: 2,
    },
    {
      id: 'p6', bookingId: 'b5', dogId: 'd-kong', sitterId: 's-jiun',
      photos: ['🍂', '🐕'], checks: ['산책 즐겁게 했어요', '잘 먹었어요'],
      body: '낙엽이 쌓인 둘레길이 콩이의 새 놀이터가 됐어요. 낙엽 위를 살랑살랑 밟으며 걷다가, 가끔 낙엽 속에 코를 쏙 넣고 냄새 맡는 여유가 참 귀여웠어요. 한 시간 내내 느긋하게, 콩이 페이스로 다녀왔어요.',
      neighborhood: '망원동', isPublic: true, createdAt: D(-7),
      likes: 11, liked: false, comments: 0,
    },
    {
      id: 'p7', bookingId: 'b14', dogId: 'd-dubu', sitterId: 's-haneul',
      photos: ['🛋️', '🦮'], checks: ['잘 먹었어요', '낮잠 잘 잤어요'],
      body: '저녁 방문 돌봄이었어요. 두부는 문 열자마자 앞발로 인사를 해서 깜짝 놀랐어요(는 아직 안 살짝이에요!). 사료 다 먹이고, 거실에서 나란히 누워 하루를 마무리했어요. 다음 주에도 뵈어요!',
      neighborhood: '망원동', isPublic: true, createdAt: D(-2),
      likes: 9, liked: false, comments: 1,
    },
    {
      id: 'p8', bookingId: 'b6', dogId: 'd-kong', sitterId: 's-jiun',
      photos: ['🐕', '💧'], checks: ['배변 잘 했어요', '산책 즐겁게 했어요'],
      body: '오늘은 콩이가 제일 좋아하는 물가 루트로 갔어요. 물 그릇 앞에서 폼폼 뛰고, 한 모금 마시고는 꼭 제 눈을 봐요. "잘 마셨어요" 인사 같아서 매번 웃게 돼요. 짧지만 알찬 30분이었어요.',
      neighborhood: '망원동', isPublic: true, createdAt: D(-3),
      likes: 14, liked: true, comments: 2,
    },
    {
      id: 'p9', bookingId: 'b1', dogId: 'd-kong', sitterId: 's-jiun',
      photos: ['🌱'], checks: ['산책 즐겁게 했어요'],
      body: '콩이와의 첫 만남! 처음엔 보호자님 뒤에 슬금슬금 숨었는데, 간식 하나로 금방 친구가 됐어요. 공원 모래밭에서 잠깐 뛰어놀고 집까지 데려다줬어요. 앞으로 콩이의 산책 친구가 되어주고 싶어요.',
      neighborhood: '망원동', isPublic: true, createdAt: D(-21),
      likes: 16, liked: false, comments: 2,
    },
  ],

  // ── SitterNote (시터 간 비공개 인계 메모) ──
  notes: [
    { id: 'n1', dogId: 'd-kong', sitterId: 's-jiun', createdAt: D(-7), content: '콩이는 지나가는 오토바이 소리에 멈칫해요. 잠깐 안아주거나 길 건너편으로 바꾸면 금방 진정돼요. 물가 둘레길에서는 비둘기떼에 주의!' },
    { id: 'n2', dogId: 'd-bori', sitterId: 's-doyun', createdAt: D(-3), content: '보리는 리드에 여유를 주면 더 편하게 걸어요. 앞발 만지려 하면 슬쩍 피하니까 쓰다듬기 전에 보리가 먼저 다가오게 두세요.' },
  ],

  // ── Review (보호자 → 시터) ──
  reviews: [
    { id: 'rv1', bookingId: 'b1', authorId: 'u1', sitterId: 's-jiun', rating: 5, content: '첫 만남부터 콩이가 지은님을 정말 좋아해요. 산책 사진도 매번 보내주셔서 안심이 돼요.', createdAt: D(-20) },
    { id: 'rv2', bookingId: 'b10', authorId: 'u2', sitterId: 's-seoyeon', rating: 5, content: '방문 돌봄 첫날이라 조마조마했는데, 두부가 바로 편해하는 게 보였어요. 다이어리도 정성 가득!', createdAt: D(-4) },
    { id: 'rv3', bookingId: 'b12', authorId: 'u2', sitterId: 's-haneul', rating: 5, content: '실시간으로 사진도 보내주시고, 두부가 힘세게 달릴 때도 안전하게 잡아주셨어요. 이웃 시터 최고!', createdAt: D(-8) },
    { id: 'rv4', bookingId: null, authorId: 'u2', sitterId: 's-jiun', rating: 5, content: '정말 꼼꼼하고 친절해요. 강아지 기질까지 파악해서 돌봐주세요.', createdAt: D(-30) },
    { id: 'rv5', bookingId: null, authorId: 'u1', sitterId: 's-doyun', rating: 4, content: '활발한 보리를 잘 받아줬어요. 다음에도 부탁드릴게요!', createdAt: D(-15) },
  ],

  // ── GuardianReview (시터 → 보호자) ──
  guardianReviews: [
    { id: 'grv1', sitterId: 's-jiun', guardianId: 'u1', rating: 5, content: '만날 때마다 강아지 상태와 주의사항을 꼼꼼히 알려주셔서 돌봄이 편해요. 시간 약속도 완벽해요!', createdAt: D(-15) },
    { id: 'grv2', sitterId: 's-doyun', guardianId: 'u1', rating: 5, content: '보리 성격까지 미리 알려주셔서 산책 준비가 쉬웠어요. 응답도 빠르시고요.', createdAt: D(-2) },
    { id: 'grv3', sitterId: 's-haneul', guardianId: 'u2', rating: 5, content: '두부 알레르기까지 챙겨주세요. 믿고 맡길 수 있는 보호자예요.', createdAt: D(-6) },
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
      id: 'c3', bookingId: 'b9', guardianId: 'u1', sitterId: 's-doyun',
      messages: [
        { from: 'sitter', text: '보리랑 골목길 산책 기대하고 있어요! 배변 봉투는 제가 챙길게요.', time: D(-1) },
        { from: 'guardian', text: '감사해요! 보리가 앞장서면 잠깐 멈춰주세요 🐕', time: D(-1) },
      ],
    },
    {
      id: 'c2', bookingId: 'b12', guardianId: 'u2', sitterId: 's-haneul',
      messages: [
        { from: 'guardian', text: '하늘님, 두부 산책 다녀오시면 사진 부탁드려도 될까요?', time: D(-9) },
        { from: 'sitter', text: '당연히죠! 물가에서 놀라는 두부 사진 많이 찍어올게요 📸', time: D(-9) },
      ],
    },
    {
      id: 'c4', bookingId: 'b14', guardianId: 'u2', sitterId: 's-haneul',
      messages: [
        { from: 'guardian', text: '저녁 사료는 냉장고 왼쪽에 있어요. 양은 계량컵 한 컵이에요!', time: D(-2) },
        { from: 'sitter', text: '네, 확인했어요! 두부 저녁 거뜬해요 😊', time: D(-2) },
      ],
    },
  ],

  // ── 배우기 진도 ──
  learnDone: [],
};

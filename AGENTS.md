# 모두돌봄 (ModuDolbom)

동네 기반 P2P 반려견 돌봄 앱 MVP 뼈대. 프론트엔드 단일 React + Vite 앱이며,
모든 데이터는 `src/data/seed.js`의 샘플 데이터를 `src/store/AppContext.jsx`가
메모리에서 관리한다 (백엔드/DB 없음).

## 실행

```
docker compose -f docker-compose.base44.yml up -d
```

- Vite 개발 서버가 5173 포트에서 `--host 0.0.0.0`로 돌고 호스트 3000에 매핑된다.
- 의존성은 컨테이너 시작 시 `npm install`로 설치된다 (node_modules는 named volume).
- Base44 샌드박스에서는 `BASE44_PREVIEW_MODE=1`과
  `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`가 서비스 환경변수로 전달된다
  (Vite allowedHosts 확장용). 플래그가 없으면 원래 동작 그대로다.

## 구조

- 첫 화면은 로그인(목업) — 소셜 버튼을 누르면 온보딩(동네 → 역할)으로 넘어간다.
- 하단 탭: 보호자 = 홈/동네일기/예약/채팅/마이, 시터 = 홈/동네일기/일정/채팅/마이.
  보호자 "요청" 탭은 예약 탭의 "요청 중" 섹션으로 합쳐졌고, "내 강아지"·시터
  "배우기/멤버십/인증"은 마이 안으로 들어갔다.
- `src/data/seed.js` — 엔티티 샘플 데이터 (Dog, SitterProfile, CareRequest, Booking,
  DiaryPost, SitterNote, Review, GuardianReview, FavoriteSitter, Chat). 날짜는 실행일 기준
  상대 오프셋. 강아지는 생일 또는 추정 나이(birthdayUnknown/approxYears)와 카테고리별
  성격 태그, 소개/주의사항 분리, 건강 정보를 가진다. 동네일기는 likes/comments 포함.
- `src/store/AppContext.jsx` — 전역 상태 + 화면 내비게이션(push/pop/goTab) + 액션들.
- `src/components/` — 공용 UI 프리미티브, 레이아웃(하단 탭), 주간 스트립/월간 캘린더
  (`MonthCalendar`는 같은 강아지의 연속 예약을 막대로 잇는다), 요청 카드,
  크기 비교 SVG, 리뷰 넛지.
- `src/screens/guardian|sitter|common/` — 역할별 화면. 강아지 프로필(보기/편집),
  시터·보호자 프로필, 동네일기 피드, 채팅 목록은 common에 있다.
- 화면 전환은 react-router가 아니라 Context의 `nav` 상태(stack)로 처리한다.

## 확인 방법

- 로그인 → 온보딩 → 보호자 홈(강아지 프로필 바로가기, 산책 부탁하기 큰 카드,
  다음 돌봄, 주간 스트립, 전담 시터, 동네일기 미리보기).
- 예약 탭: 월간 캘린더(연속 일정 막대) → 날짜 눌러 그날 목록, 요청 중/다가오는/지난 섹션.
- 동네일기 탭: 필터 칩, 좋아요 토글, 시터/강아지 프로필 진입.
- 채팅 탭: 확정된 예약 상대 목록 → 1:1 채팅.
- 마이에서 시터 모드 전환 → 시터 홈(오늘 일정, 새 요청 원클릭 수락, 이번 달 정산) ·
  일정 탭(새 요청함 + 캘린더) · 다이어리 작성(자동 초안은 로컬 템플릿, LLM 연동
  자리표시자) · 배우기(배지) · 멤버십 · 인증.

## 1페이즈 제약 (의도된 것)

- 예약 가능 서비스: 산책, 방문 돌봄만. 데이케어/보딩은 "준비 중" 표시.
- 운영 동네: 마포구 망원동·성산동만. 그 외 지역은 대기자 등록.
- 결제 연동 없음(금액 표시 + 안내 문구만). 인증 화면은 상태 표시만.

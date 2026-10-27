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

- `src/data/seed.js` — 엔티티 샘플 데이터 (Dog, SitterProfile, CareRequest, Booking,
  DiaryPost, SitterNote, Review, FavoriteSitter, Chat). 날짜는 실행일 기준 상대 오프셋.
- `src/store/AppContext.jsx` — 전역 상태 + 화면 내비게이션(push/pop/goTab) + 액션들.
- `src/components/` — 공용 UI 프리미티브, 레이아웃(하단 탭), 크기 비교 SVG, 리뷰 넛지.
- `src/screens/guardian|sitter|common/` — 역할별 화면.
- 화면 전환은 react-router가 아니라 Context의 `nav` 상태(stack)로 처리한다.

## 확인 방법

- 보호자 홈 피드 · 요청 플로우(5단계) · 매칭 상태 화면(데모 단계 진행 버튼) ·
  예약 상세 · 시터 프로필 · 리뷰 넛지 모달.
- 마이페이지/상단 칩으로 시터 모드 전환 후 요청함 수락 → 일정 · 다이어리 작성
  (자동 초안 생성은 로컬 템플릿, LLM 연동 자리표시자) · 배우기(배지) · 멤버십.

## 1페이즈 제약 (의도된 것)

- 예약 가능 서비스: 산책, 방문 돌봄만. 데이케어/보딩은 "준비 중" 표시.
- 운영 동네: 마포구 망원동·성산동만. 그 외 지역은 대기자 등록.
- 결제 연동 없음(금액 표시 + 안내 문구만). 인증 화면은 상태 표시만.

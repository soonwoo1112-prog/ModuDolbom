# SEED 참고 노트

당근의 SEED Design(Apache-2.0)을 모두돌봄 디자인시스템의 참고 자료로 읽고 정리한 노트입니다. SEED를 그대로 가져다 쓰지 않고, 구조와 규칙만 참고합니다. 당근만의 요소(당근 주황, 매너온도, 당근 아이콘)는 가져오지 않습니다.

- 출처: seed-design.io의 컴포넌트 스펙 55개와 파운데이션 문서 23개, `@seed-design/css` 3.2.0 토큰 (2026-11-06 기준)
- 다시 볼 때: `seed-docs` MCP(`@seed-design/docs-mcp`)나 `https://seed-design.io/components/llms.txt`

## 파운데이션에서 가져올 규칙

| 영역 | SEED | 모두돌봄에 적용 |
|---|---|---|
| 색 역할 | `bg`/`fg`/`stroke` × `neutral`/`brand`/`critical`/`informative`/`positive`/`warning` × `solid`/`weak`/`pressed` | 같은 이름 체계로 토큰을 다시 짠다. 브랜드 색은 꼭 필요한 곳(주요 버튼, 선택 강조)에만 쓴다. |
| 바탕 | 흰색과 회색 11단계(`#fff` ~ `#1a1c20`), 면은 `layer-default`/`floating`/`basement`로 구분 | 종이 결과 크림 바탕을 빼고 평평한 면으로 바꾼다. |
| 서체 | 플랫폼 시스템 서체, Windows만 Pretendard. 굵기 400/500/700. 크기 t1~t14(11~48px), 본문 t5 16/22 | 별도 제목 서체(Jua)를 빼고 시스템 서체와 Pretendard로 통일한다. 휴대폰 글자 크기 설정을 따르되 최대 1.5배(iOS 1.35배). |
| 간격 | 4px 단위(`x1`~`x16`), 화면 좌우 여백 16px, 컴포넌트 세로 간격 12px, 화면 아래 여백 56px | 그대로 따른다. |
| 모서리 | 4, 8, 12, 16, 20, 24, full | 그대로 따른다. |
| 누름 피드백 | 눌린 동안 pressed 색으로 바뀌고, 세로로 2px만큼 작아진다(기준 = max(높이, 폭÷4, 24)). 주변 요소는 움직이지 않는다 | 카드 스톡의 두께선 대신 이 방식을 쓴다. |
| 모션 | 마이크로 모션 0.2초 이하, 매크로 모션은 0.2초 초과. 50~300ms, `enter`/`exit` 곡선 | 상태 변화에만 쓴다. |
| 아이콘 | 기본 24px, 최소 12px, 15px 이하는 채움형(Fill), 터치 영역 44px | 당근 아이콘은 쓰지 않고, 선형·채움형이 함께 있는 오픈소스 세트 하나를 고른다. |
| 높이(Elevation) | Global(화면 구조)과 Local(콘텐츠)로 층을 나누고, 메뉴처럼 떠 있는 요소에만 옅은 그림자를 쓴다 | 그대로 따른다. |

## 글쓰기 규칙 (SEED Writing, Voice and Tone)

- 명확하게, 이해하기 쉽게, 사려 깊게 쓴다.
- 익숙한 단어를 쓰고 기술 용어와 한자어는 피한다. "대화가 불가능합니다"가 아니라 "대화할 수 없어요"로 쓴다.
- 존칭을 줄인다. "등록하실 수 있어요"가 아니라 "등록할 수 있어요"로 쓴다.
- 숫자는 아라비아 숫자로 쓴다.
- 줄임말과 은어는 쓰지 않는다.
- 기능 이름보다 목적을 쓴다. "채팅하기"보다 "채팅으로 산책 맞추기".
- 긍정문과 능동문을 쓴다.
- 처리나 완료 같은 데이터 변화가 아니라 사용자의 행동을 쓴다. "작성을 완료했어요"가 아니라 "후기를 보냈어요".
- 한 문장에는 하나의 내용만 담는다.
- 동네 이름을 넣어 동네 이야기로 쓴다. 예: "역삼동 이웃에게 산책을 부탁해 보세요".
- 느낌표는 꼭 필요한 순간에만 쓴다.
- 상태값은 붙여 쓴다(예약중, 산책중). 상태값이 아니라 문장 속 서술일 때는 띄어 쓴다.
- 제목, 20pt 이상 큰 글씨, 버튼·메뉴·레이블에는 마침표를 찍지 않는다.
- 오류 문구에는 사용자가 직접 할 수 있는 해결 방법을 함께 쓴다.

## 컴포넌트 55개와 모두돌봄 대응

### 쓴다 (37개)
| SEED 컴포넌트 | 모두돌봄에서 쓰는 곳 |
|---|---|
| Action Button | 요청 보내기, 대화창 열기, 산책 시작(Large CTA). Brand Solid는 화면당 한 곳, 나머지는 Neutral |
| Bottom Navigation | 하단 탭 5개(보호자: 예약/채팅/소셜/캘린더/더보기, 시터: 오늘/채팅/소셜/캘린더/더보기) |
| Top Navigation | Root(탭 첫 화면)와 Standard(2단계 이상, 뒤로가기/닫기) |
| List (+ List Header) | 시터 후보, 오늘 예약, 채팅 목록, 더보기 메뉴 |
| Avatar, Identity Placeholder | 시터·보호자·강아지 사진. 사진이 없을 때 대체 이미지 |
| Badge | "같은 아파트", "새로 온 시터", "전담 시터". 누를 수 있는 요소로 쓰지 않는다 |
| Tag Group | 시터 카드의 거리, 리뷰 수, 재이용, 평균 답장 |
| Chip | 강아지 크기, 시간대, 필터 |
| Tabs (Line, Chip) | 시터 채팅 분류(확정/대기 중/진행 중/지난 대화/안 읽음/보관함), 소셜(피드/커뮤니티) |
| Segmented Control | 캘린더 월/주 보기. 화면당 하나, 2~4개 |
| Checkbox | 후보 시터 여러 명 선택, 약관 동의 |
| Radio, Select Box | 산책 길이, 강아지 선택 |
| Switch | 산책 로그 소셜 공유 허용, 알림 설정, 시터의 일할 수 있는 시간대 켜기·끄기 |
| Field, Text Input & Textarea | 요청 메모, 주의사항, 강아지 정보 |
| Date Picker | 예약 날짜. 캘린더 탭의 날짜 상태(고를 수 있음/고름/불가) |
| Time Picker | 산책 시작 시간 |
| Bottom Sheet | 요청 세부 보기, 필터, 시터 프로필 미리보기 |
| Menu Sheet | 게시물·채팅의 더보기 동작(신고, 차단은 Critical) |
| Alert Dialog | 예약 취소처럼 되돌릴 수 없는 확인 |
| Snackbar | "요청을 보냈어요", "거절했어요, 되돌리기" |
| Callout | 예약 화면의 "앱에서 예약한 산책만 보험으로 보장돼요" |
| Page Banner | 인증 미완료 같은 화면 전체 상태 |
| Skeleton | 목록 로딩(모양 그대로, 시머 애니메이션) |
| Result Section | 빈 상태와 오류 상태(전체 화면) |
| Notification Badge | 하단 탭과 채팅의 안 읽은 수 |
| Image Frame, Content Placeholder | 산책 로그 사진, 피드 사진 |
| Reaction Button | 피드 좋아요 |
| Attachment Input | 산책 로그 사진 첨부, 커뮤니티 글 사진 |
| Search Bar | 커뮤니티 검색 |
| Progress Circle | 요청 전송 중, 산책 기록 업로드 |
| Divider | 섹션 경계에만 쓰고, 목록의 마지막 줄 아래에는 넣지 않는다 |
| Floating Action Button | 소셜 글쓰기 |
| Help Bubble | "같은 아파트" 태그 설명, 처음 쓰는 기능 안내 |

### 상황에 따라 (10개)
Accordion(자주 묻는 질문) · Quantity Picker(강아지 여러 마리) · Slider(가격대 필터) · Wheel Picker(Time Picker 내부) · Select(긴 선택 목록) · Input Button(피커를 여는 입력) · Contextual Floating Button(지도 위 "내 위치") · Scroll Fog(가로 스크롤 칩) · Menu(웹 관리 화면) · Dialog(웹)

### 쓰지 않는다 (8개)
- 웹·데스크톱 전용: Side Navigation, Side Panel, Pagination, Table Pagination, Footer
- 본인 인증은 외부 서비스로 하므로 쓰지 않음: Segmented Text Input(주민번호·카드번호)
- 당근 고유 요소라서 가져오지 않음: Manner Temp & Manner Temp Badge
- 안내 문서: Deprecated Components(더 이상 쓰지 않는 컴포넌트 목록)

## 지금 시스템(Hum 기반)과 충돌하는 점

1. 제목 서체 Jua: SEED는 시스템 서체 하나만 쓴다.
2. 네 가지 강조색(노랑·파랑·산호·민트): SEED는 브랜드 색 하나와 의미 색(정보·긍정·경고·위험)만 쓴다.
3. 카드 스톡 버튼의 두께선과 스프링: SEED는 평평한 채움에 2px 축소 피드백을 쓴다.
4. 종이 결과 크림 바탕: SEED는 평평한 흰 바탕을 쓴다.
5. 글자 탭(아이콘 없음): SEED의 Bottom Navigation은 아이콘과 레이블을 함께 쓴다.

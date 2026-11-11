# ActionButton

SEED Action Button 구조를 따르는 버튼입니다. 숲 초록(`bg-brand-solid`)은 화면에서 가장 중요한 행동 하나에만 씁니다.

- **크기**
  - Small(`button-small` 36px): 목록 행 안 버튼.
  - Medium(`button-medium` 40px, `r2`): 기본.
  - Large(`button-large` 52px, `r3`): 화면이나 단계 끝의 주 버튼, 폭 100%.
  - **알약(`cb__btn`, 36px, `full`)**: 같은 무게의 행동 두세 개를 나란히 둘 때. 채팅 위 예약 바(예약 확정·수정·정보), 시터 오늘 탭의 새 요청(대화하기·거절). 흰 면에 1px `stroke-neutral-weak` 테두리, 아이콘 15px. 초록 알약(`cb__btn--brand`)은 그 줄의 주 행동 하나에만. 누르는 영역은 위아래로 넓혀 44px.
- **Variant**
  - `md-btn--brand`(Brand Solid): 시터 찾기, 요청 보내기, 홈으로 가기, 산책 시작. 화면당 하나.
  - `md-btn`(Neutral Weak, 기본): 보조 행동.
  - `md-btn--outline`(Neutral Outline): 가벼운 보조 행동("다른 시터에게도 요청하기").
  - `md-btn--ghost`: 흐름을 바꾸지 않는 이동이나 되돌릴 수 없는 행동의 입구("이 요청 거절하기", "요청 모두 취소하기", "조건 바꾸기"). 큰 주 버튼 아래에 작게 둡니다.
  - `md-btn--critical`(Critical Solid): 되돌릴 수 없는 행동의 확인 창 안에서만.
  - `md-btn--neutral`(Neutral Solid)은 더 쓰지 않습니다. 검은 버튼이 주 버튼과 다투었기 때문입니다.
- **상태**: 기본, 누름(pressed 색 + 2px 축소), 처리 중(`aria-busy="true"`와 스피너, "보내는 중"), 비활성(`disabled`, 글자로 무엇이 빠졌는지 알려 줌: "산책할 강아지를 골라 주세요").
- **글자**: 다음에 일어나는 일을 짧게, 마침표 없이. 고른 내용을 넣을 수 있으면 넣습니다("보리, 콩이 산책 맡기기", "2명에게 요청 보내기").
- **아이콘**: Lucide, 글자 앞 16px. 아이콘만 있는 버튼은 꼭 필요할 때만, `aria-label`과 함께.

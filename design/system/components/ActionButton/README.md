# ActionButton

SEED Action Button 구조를 따르는 버튼입니다. 숲 초록(`bg-brand-solid`)은 화면에서 가장 중요한 행동 하나에만 씁니다.

- **크기**: XSmall(`button-xsmall` 32px, 14px 글자, 헤더 아래에 여러 개를 나란히 둘 때. 예: 채팅 위 예약 확정·수정·정보) · Small(`button-small` 36px, `r2`) · Medium(`button-medium` 40px, `r2`, 기본) · Large(`button-large` 52px, `r3`, 화면 아래 고정 CTA, 폭 100%).
- **Variant**
  - `md-btn--brand`(Brand Solid): 요청 보내기, 산책 시작. 화면당 하나.
  - `md-btn--neutral`(Neutral Solid): 브랜드가 아닌 강한 행동. 시터의 "대화창 열기".
  - `md-btn`(Neutral Weak, 기본): 보조 행동. "거절".
  - `md-btn--outline`(Neutral Outline): 가벼운 보조 행동.
  - `md-btn--ghost`: 화면 흐름을 바꾸지 않는 이동.
  - `md-btn--critical`(Critical Solid): 되돌릴 수 없는 위험 행동 확인에만.
- **상태**: 기본, 누름(pressed 색 + 2px 축소), 처리 중(`aria-busy="true"`와 스피너, 글자는 "보내는 중"), 비활성(`disabled`).
- **글자**: 짧은 동사형, 마침표 없음. 버튼 두 개를 나란히 둘 때는 강한 쪽을 오른쪽에 둡니다.
- **아이콘**: Lucide, 글자 앞 16px. 아이콘만 있는 버튼은 꼭 필요할 때만, `aria-label`과 함께.

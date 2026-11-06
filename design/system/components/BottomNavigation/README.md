# BottomNavigation

탭 첫 화면의 아래에 고정되는 SEED Bottom Navigation입니다. 탭은 다섯 개로 고정합니다.

- **보호자**: 예약(첫 화면) / 채팅 / 소셜 / 캘린더 / 더보기
- **시터**: 오늘(첫 화면) / 채팅 / 소셜 / 캘린더 / 더보기
- **구성**: 아이콘 24px(Lucide)과 레이블 t1(11px)을 함께 씁니다. 레이블은 두 글자 안팎으로 짧게.
- **선택 상태**: 현재 탭은 `aria-current="page"`이고, `fg-neutral`에 굵은 글씨입니다. 나머지 탭은 `fg-neutral-subtle`입니다. 색만이 아니라 굵기로도 구분됩니다.
- **안 읽은 수**: `md-nbadge`(`bg-critical-solid`, 숫자). 숫자 없는 점은 쓰지 않습니다.
- **크기와 바탕**: 높이 `bottom-navigation`(56px)에 아래 안전 영역을 더합니다. 위쪽에 1px `stroke-neutral-subtle` 선을 둡니다.

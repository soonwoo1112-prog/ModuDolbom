# TopNavigation

화면 위쪽의 SEED Top Navigation입니다. 높이는 `top-navigation`(56px)입니다.

- **Root**: 탭 첫 화면에 씁니다. 왼쪽에 지금 동네 이름(t7 Bold), 오른쪽에 아이콘 버튼(알림)을 둡니다. 동네 이름을 먼저 보여 줘서 "우리 동네" 서비스라는 걸 계속 알립니다.
- **Standard**: 2단계 이상 화면에 씁니다. 왼쪽에 뒤로 가기, 가운데에 제목(t6 Bold)을 둡니다. 시트처럼 아래에서 올라온 화면에는 뒤로 가기 대신 닫기를 씁니다.
- **아이콘 버튼**: 아이콘 24px, 누르는 영역 44px, `aria-label` 필수.
- **스크롤**: 스크롤되면 아래쪽에 1px `stroke-neutral-subtle` 선이 나타납니다.

# TopNavigation

화면 위쪽의 SEED Top Navigation입니다. 높이는 `top-navigation`(56px)입니다.

- **Root, 동네 고르기(`md-topnav__location`)**: 예약·오늘 탭처럼 동네가 중요한 탭 첫 화면에 씁니다. 동네 이름을 t6 Bold(18px)로 쓰고 오른쪽에 아래 화살표(18px, `fg-neutral-subtle`)를 붙여 누르는 컨트롤로 보이게 합니다. 누르면 동네를 바꿉니다. `aria-label`은 "동네 바꾸기, 지금 역삼동".
- **Root, 글자 제목(`md-topnav__title`)**: 채팅, 캘린더, 더보기처럼 화면 이름이 곧 제목인 탭 첫 화면에 씁니다. t7 Bold(20px). 이때는 본문에 큰 화면 제목(`screen-title`)을 다시 두지 않습니다.
- **상단 바와 화면 제목을 겹치지 않기**: 상단 바 바로 아래에 `screen-title`(t8 Bold 22px)이 오는 화면에서는 상단 바에 글자 제목을 쓰지 않고 동네 고르기를 씁니다. 크기와 굵기가 비슷한 두 줄이 이어지면 무엇이 제목인지 흐려집니다.
- **Standard**: 2단계 이상 화면에 씁니다. 왼쪽에 뒤로 가기, 가운데에 제목(t6 Bold)을 둡니다. 시트처럼 아래에서 올라온 화면에는 뒤로 가기 대신 닫기를 씁니다.
- **아이콘 버튼**: 아이콘 24px, 누르는 영역 44px, `aria-label` 필수.
- **스크롤**: 스크롤되면 아래쪽에 1px `stroke-neutral-subtle` 선이 나타납니다.

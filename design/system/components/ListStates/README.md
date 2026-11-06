# ListStates

데이터를 불러오는 모든 영역은 네 가지 상태를 가집니다: **불러오는 중, 비어 있음, 오류, 채워짐**. 이 카드는 앞의 세 가지를 보여 줍니다.

- **불러오는 중(SEED Skeleton)**
  - 올 내용의 모양을 본뜬 `bg-neutral-weak` 블록에 시머 애니메이션을 겁니다.
  - 동작 줄이기 설정에서는 시머를 멈춥니다. 영역에는 `aria-busy="true"`.
- **비어 있음(SEED Result Section)**
  - 아이콘, 제목(`section-title`), 한 문장, 그리고 영역을 채우는 행동 하나(Brand Solid)를 둡니다.
- **오류(Result Section)**
  - 무엇이 안 됐는지와 어떻게 하면 되는지를 씁니다. "다시 시도"는 Neutral Weak 버튼, `role="alert"`.
  - 서버 오류나 기술 용어는 쓰지 않습니다.

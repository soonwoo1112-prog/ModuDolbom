# TextField

SEED Field와 Text Input(Outline, Large) 구조입니다. 레이블이 항상 위에 보이고, 아래에 도움말이나 오류와 글자 수를 둡니다.

- **입력창**: 높이 `input-large`(52px), 모서리 `r3`, 테두리 1px `stroke-neutral-solid`, 글자 t5(16px).
- **포커스**: 테두리가 2px `stroke-neutral-contrast`가 되고, 키보드 포커스에는 `stroke-focus-ring` 링이 함께 보입니다.
- **오류**: `aria-invalid="true"`, 테두리 2px `stroke-critical-solid`, 문장은 `fg-critical`. 무엇이 잘못됐는지와 어떻게 하면 되는지를 함께 씁니다.
- **선택 입력**: 레이블 뒤에 "선택"을 붙입니다. 필수 표시(*)는 쓰지 않습니다.
- **레이블**: 명사형으로, 마침표 없이, 한 줄로 씁니다.
- **여러 줄 입력**: `textarea`, 최소 94px.

# TextField

레이블이 항상 입력창 위에 보이는 입력창입니다. 자리표시자(placeholder)를 레이블 대신 쓰지 않습니다.

- 구조: `md-field` 안에 `md-field__label`, `md-field__input`(`input` 또는 `textarea`), 필요하면 `md-field__help`나 `md-field__error`.
- 크기: 높이 `control-md`(44px), 모서리 `radius-input`(14px), 테두리 1px `muted`.
- 포커스: `focus` 2px 링.
- 오류: `aria-invalid="true"`와 `aria-describedby`로 오류 문장을 연결합니다. 테두리는 2px `error`. 문장은 무엇이 잘못됐는지와 어떻게 고치는지를 함께 씁니다("만날 장소를 적어 주세요. 시터가 찾아올 곳이에요.").
- 비활성: 왜 바꿀 수 없는지 도움말로 알려 줍니다.

소비자가 줄 것: 고유한 `id`, 레이블, 값, 오류 문장.

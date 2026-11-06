# 모두돌봄 앱 미리보기

휴대폰 브라우저에서 실제 앱처럼 눌러 보는 미리보기입니다. 화면과 흐름, 문구, 로딩·빈 상태·오류 상태를 검토하는 용도이며, 데이터는 모두 예시입니다.

- 디자인: `../design/tokens.css`와 `../design/system/components/bundle.css`를 그대로 불러와 씁니다. 규칙은 `../DESIGN.md`와 `../design/system/README.md`.
- 화면 점검 메뉴: 왼쪽 가장자리의 작은 손잡이, 또는 더보기 › 화면 점검 메뉴 열기. 역할(보호자/시터), 데이터 상태(정상/비어 있음/오류), 인터넷 속도(빠름/느림), 테마를 바꿀 수 있어요. 실제 앱에는 넣지 않습니다.

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # dist/index.html 한 파일, dist/artifact.html (Claude 아티팩트용)
```

## 구조

- `src/store.jsx`: 화면 이동(탭과 쌓이는 화면), 역할, 점검 메뉴, 스낵바, 확인 창. `useLoad`는 데이터를 불러오는 흉내를 내며 점검 메뉴의 상태를 따릅니다.
- `src/ui.jsx`: 디자인시스템 클래스로 만든 공용 부품(버튼, 배지, 칩, 상단 바, 하단 탭, 스켈레톤, Result Section, 지도).
- `src/screens/`: `entry`(스플래시, 시작, 동네 인증, 역할), `guardian`, `sitter`, `shared`(채팅, 소셜, 더보기, 점검 메뉴).
- `src/data.js`: 예시 데이터.

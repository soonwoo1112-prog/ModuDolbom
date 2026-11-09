# 모두돌봄 앱 미리보기

휴대폰 브라우저에서 캔버스 화면을 실제 앱처럼 눌러 보는 미리보기입니다. 데이터는 모두 예시입니다.

캔버스(Claude Design)의 화면 파일을 그대로 실행하므로 캔버스와 미리보기가 따로 놀지 않습니다. 화면을 고칠 때는 캔버스를 고치고, 바뀐 파일을 `../design/canvas/`에 다시 내려받은 뒤 빌드합니다.

- 화면 원본: `../design/canvas/*.dc.html`, 공용 CSS `modudolbom.css`, 디자인시스템 `ds/modudolbom/components/bundle.css`, 사진 `img/`, 배치와 제목 `canvas.json`.
- 화면 안의 링크(`href="Walking.dc.html"`)를 누르면 그 화면으로 넘어가요. 위쪽 버튼을 누르면 캔버스 구역별 화면 목록이 열려요. 주소의 `#/Walking`처럼 화면을 바로 열 수도 있어요.

## 실행

```bash
npm install
npm run dev      # 화면을 컴파일하고 개발 서버를 띄워요
npm run build    # dist/index.html 한 파일, dist/artifact.html (Claude 아티팩트용)
```

## 구조

- `scripts/gen-boards.mjs`: 캔버스 화면을 `src/boards.gen.js` 하나로 컴파일해요(템플릿, 속성 기본값, 화면 로직). 빌드할 때마다 새로 만들므로 직접 고치지 않아요.
- `src/player.js`: 캔버스 템플릿(`{{값}}`, `sc-if`, `sc-for`, `dc-import`)과 화면 로직(`DCLogic`)을 Preact로 실행해요.
- `src/main.js`, `src/shell.css`: 휴대폰 화면 크기에 맞추기, 링크 따라가기, 화면 목록.

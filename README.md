# 모두돌봄 · 디자인 브랜치 (`design`)

모두돌봄 앱의 **디자인 시스템, 브랜드, 화면 시안, 앱 미리보기**를 만드는 브랜치입니다.
기획 문서는 `main`, 영상·이미지 콘텐츠는 `content`, 스킬 설치와 설정은 `skills` 브랜치에 있습니다.

> 이 브랜치는 `main`을 주기적으로 합쳐 받아요. 그래서 `docs/` 아래 기획 문서도 함께 들어 있어요. 기획 문서를 고칠 때는 `main`에서 고치세요.

## 먼저 읽을 문서

| 문서 | 내용 |
|---|---|
| [`DESIGN.md`](DESIGN.md) | 확정된 디자인 시스템 규칙. 토큰, 브랜드, 예외 규칙. 모든 화면 작업 전에 먼저 읽어요. |
| [`PRODUCT.md`](PRODUCT.md) | 디자인 작업용 제품 맥락. 사용자, 예약·산책 흐름, 원칙, 아직 정하지 않은 것. |
| [`docs/product/v1-tasks.md`](docs/product/v1-tasks.md) | 첫 출시를 위한 디자인 작업 목록 |

## 폴더 구성

```
design/
├── canvas/            화면 시안 (Claude Design 캔버스). canvas.json에 화면 배치와 제목
├── system/            디자인 시스템 사본 (tokens.json, 브랜드북 README, 컴포넌트 16종)
├── brand/             로고(마크, 워드마크, 앱 아이콘)와 그리는 스크립트
├── content/           시안용 예시 문구 (예: 예시 후기)
├── tokens.css         화면이 불러 쓰는 디자인 토큰
├── base.css           기본 스타일
├── direction.md       디자인 방향 (토스·크림·애플·당근 기준, 2026-11-09)
├── system-research.md 네 앱의 디자인 시스템 조사
├── ux-research.md     네 앱의 UX 리서치
└── seed-reference.md  당근 SEED 디자인 시스템 참고 노트
app-preview/           휴대폰에서 캔버스 화면을 실제 앱처럼 눌러 보는 미리보기
assets/photos/         시안에 쓰는 강아지 사진 (창업자가 시터로 일하며 찍은 사진)
```

## 지금까지 정한 것

- **방향:** 평평한 흰 바탕, 목록 중심 레이아웃, 브랜드 색은 **숲 초록** 하나. 구조는 당근 SEED를 참고하되 당근의 정체성(주황, 매너온도, 아이콘)은 쓰지 않아요.
- **로고:** "나란히 걷기" 마크. 이웃, 강아지 발바닥, 웃는 길로 이루어져 있어요. 자세한 내용은 [`design/brand/logo/README.md`](design/brand/logo/README.md).
- **글꼴:** 제목, 숫자, 워드마크는 SUIT. 본문은 기본 한글 산세리프.
- **브랜드북과 컴포넌트 미리보기:** Claude Design System 아티팩트(링크는 `DESIGN.md`에 있어요).

## 앱 미리보기 실행

```bash
cd app-preview
npm install
npm run dev      # 개발 서버
npm run build    # dist/index.html, dist/artifact.html (Claude 아티팩트용)
```

화면을 고칠 때는 캔버스를 고친 뒤, 바뀐 파일을 `design/canvas/`에 다시 내려받고 빌드해요. 자세한 내용은 [`app-preview/README.md`](app-preview/README.md).

## 스킬

이 브랜치의 작업에는 Hallmark, Impeccable, Taste 스킬을 써요. 설치 방법과 설정 파일은 `skills` 브랜치에 모아 두었어요. 스킬이 작업 중에 만드는 로컬 상태 파일(`.hallmark/`, `.impeccable/`, `.taste-skill/`)은 이 브랜치에 커밋하지 않도록 `.gitignore`에 넣었어요.

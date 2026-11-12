# 모두돌봄 · 콘텐츠 브랜치 (`content`)

모두돌봄의 **홍보 영상, 로고 모션, 광고용 모델 이미지**를 만드는 브랜치입니다.
기획 문서는 `main`, 디자인은 `design`, 스킬 설치와 설정은 `skills` 브랜치에 있습니다.

> 이 브랜치는 콘텐츠만 담아요. `main`에 합치지 마세요. 합치면 이 브랜치에서 지운 기획 문서(`docs/`)가 `main`에서도 지워질 수 있어요.

## 폴더 구성

```
content/
├── logo-animation/      로고 모션 (릴스 엔딩, 광고 마지막 장면, 프로필 영상용)
├── models/              광고·릴스에 계속 쓰는 모델 레퍼런스 시트
│   ├── dog-01/          모델 강아지 (흰색 몰티즈 계열)
│   ├── neighbor-01/     이웃 시터 역할 (30대 초반 여성)
│   └── neighbor-02/     보호자 역할 (30대 초반 남성)
└── reels/               인스타그램 릴스
    ├── 01-intro/        소개 릴스 (18초, 9:16)
    └── 02-neighbor-walk/ 이웃 산책 릴스 (32초, 9:16, 제작 중)
```

## 지금 쓰는 것

| 용도 | 파일 | 상태 |
|---|---|---|
| 로고 모션 | `content/logo-animation/popin/` | **확정** (2026-11-11). 다른 버전은 비교·기록용 |
| 소개 릴스 | `content/reels/01-intro/modudolbom_intro.mp4` | 완성 |
| 이웃 산책 릴스 | `content/reels/02-neighbor-walk/` | 제작 중. 첫 프레임 13장, 영상 클립 4개(샷 4~7) |
| 모델 이미지 | `content/models/*/` | neighbor-02는 로고를 지운 `reference-sheet-clean.png`를 써요 |

각 폴더의 `README.md`에 만든 방법, 쓴 도구와 설정, 프롬프트가 정리되어 있어요.

## 만드는 도구

- **이미지:** Higgsfield (GPT Image 2.6)
- **영상:** Kling 3.0 Turbo, Gemini Omni Flash 1.2, Seedance
- **로고 모션:** 디자인 시스템의 로고 파일과 SUIT 글꼴로 직접 렌더링 (`render.js`, `build.sh`)

로고, 글꼴, 색은 `design` 브랜치의 디자인 시스템을 따라요. 디자인 시스템이 바뀌면 여기 로고 파일도 다시 맞춰야 해요.

# 모두돌봄 · 스킬 브랜치 (`skills`)

모두돌봄 작업에 쓰는 Claude Code 스킬의 **설치 방법과 설정 파일**을 한곳에 모아 둔 브랜치입니다.
기획 문서는 `main`, 디자인은 `design`, 영상·이미지 콘텐츠는 `content` 브랜치에 있습니다.

> 이 브랜치는 다른 브랜치와 기록을 공유하지 않는 독립 브랜치입니다. 다른 브랜치에 합치지 말고, 필요한 파일만 꺼내 쓰세요.

## 쓰는 스킬

| 스킬 | 하는 일 | 설치 | 주로 쓰는 곳 |
|---|---|---|---|
| **gstack** | 웹 브라우징(`/browse`)을 비롯한 작업용 스킬 묶음. 시장성 논의(gstack 스킬)에도 썼어요. | 아래 [gstack](#gstack) 참고 | 기획 |
| **Hallmark** | "AI가 만든 티가 안 나는" 웹 페이지·화면 디자인 | `npx skills add nutlope/hallmark -g` | 디자인 |
| **Impeccable** | 화면 디자인 비평(critique)과 제품 맥락 정리 | 설치 출처가 저장소에 기록되어 있지 않아요. 디자인 세션에서 확인해 여기에 적어 주세요. | 디자인 |
| **Taste** | 디자인 실험과 블라인드 비교 | 설치 출처가 저장소에 기록되어 있지 않아요. 디자인 세션에서 확인해 여기에 적어 주세요. | 디자인 |

`-g`는 전역 설치예요. 컴퓨터마다, 그리고 새 클라우드 세션마다 한 번씩 설치해야 해요.

### gstack

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
```

## 이 브랜치의 파일

| 파일 | 내용 | 원래 있던 곳 |
|---|---|---|
| `CLAUDE.md` | gstack 설치 방법과 "웹 브라우징은 gstack의 `/browse`를 쓴다"는 세션 규칙 | `claude/loving-galileo-9ogm7o` |
| `.hallmark/salt` | Hallmark가 디자인 방향을 정할 때 쓰는 값. 연속 작업에서 같은 방향이 반복되지 않게 해요. | `claude/practical-einstein-3ts148` (현 `design`) |
| `.impeccable/critique/ignore.md` | Impeccable 비평에서 일부러 무시하기로 한 항목 목록 | `claude/practical-einstein-3ts148` (현 `design`) |
| `.gitignore` | Taste 스킬의 로컬 확인 상태(`.taste-skill/`)를 커밋하지 않도록 하는 설정 | `claude/practical-einstein-3ts148` (현 `design`) |

## 다른 브랜치에서 쓰는 법

작업 브랜치에서 필요한 파일만 꺼내 오면 돼요.

```bash
git fetch origin skills
git checkout origin/skills -- CLAUDE.md          # 예: gstack 규칙만 가져오기
```

디자인 시스템 규칙인 `DESIGN.md`와 제품 맥락 `PRODUCT.md`는 스킬이 읽는 문서지만 디자인 결정 자체라서 `design` 브랜치에 그대로 두었어요.

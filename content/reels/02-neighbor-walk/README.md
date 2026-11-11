# 02. 이웃 산책 릴스 (32초, 9:16)

샷 리스트: [모두돌봄 릴스 샷 리스트 (9:16)](https://claude.ai/artifact/7zJJG2pefW84ziDKxyHLXM)

## 만드는 방식

1. **첫 프레임**: GPT Image 2.6 (medium, 2K → 1520×2688). 등장하는 인물과 강아지의 캐릭터 시트를 레퍼런스로 넣어 일관성을 맞춤. 장당 1크레딧.
   - 인물 A(주인): `content/models/neighbor-02/reference-sheet-clean.png`
   - 인물 B(이웃 시터): `content/models/neighbor-01/reference-sheet.png`
   - 강아지: `content/models/dog-01/reference-sheet.png`
2. **영상**: Kling 3.0 Turbo, 첫 프레임 → 1080p, 3초. 클립당 6크레딧.
3. **편집**: 2, 8번 초록 화면에 앱 화면 녹화 합성, 2a번 지도와 10번 엔드카드(`content/logo-animation/popin/out/logo-popin-overlay-*`)는 편집에서.

## 진행 상황

| 샷 | 첫 프레임 | Higgsfield 이미지 job | 영상 |
|---|---|---|---|
| 0 | `frames/shot00.png` | 9072dbac-2cbb-4166-b6e3-b033c4022be1 | 대기 (실제 촬영본이 있으면 그걸 씀) |
| 1 | `frames/shot01.png` | bb286264-a3df-4093-ab42-7c60d27fce2c | 대기 |
| 2 | `frames/shot02.png` | 903dcac3-9b19-45eb-ae90-bed59b74304a | 대기 |
| 3a | `frames/shot03a.png` | 596626ca-ab9e-48bb-8eb9-da5ce81b7cc2 | 대기 |
| 3b | `frames/shot03b.png` | 749f619f-e63f-4d05-9701-1bb00036bf2f | 대기 |
| 3c | `frames/shot03c.png` | 5fadf3e7-9565-4512-84a9-e7c6cbd1acc2 | 대기 |
| 4 | `frames/shot04.png` | 95f3fa5b-70df-4a9d-817e-359a6751743a | `clips/shot04.mp4` |
| 5 | `frames/shot05.png` | a63bd195-bcf0-478e-977d-0aec1e410584 | `clips/shot05.mp4` |
| 6 | `frames/shot06.png` | dae475fe-183f-474a-9b38-d75bb4bb37ed | `clips/shot06.mp4` |
| 7 | `frames/shot07.png` | a0b55ba1-3346-442e-875a-412f0c00774e | `clips/shot07.mp4` |
| 8 | `frames/shot08.png` | bcc15afe-6407-4b1a-b25f-95dcb62138a4 | 대기 |
| 9 | `frames/shot09.png` | 0e9ea320-02ce-4c16-9016-9e8e1dcdaffa | 대기 |
| 9a | `frames/shot09a.png` | 822e2504-0d84-49a8-ac1f-5a69d09bac55 | 대기 (정지 이미지 + 편집 줌으로도 가능) |

남은 영상 9개는 크레딧 약 54가 필요합니다(Kling 3.0 Turbo 1080p 3초 × 9). 이미지 job ID를 start_image로 넣으면 첫 프레임을 다시 만들 필요가 없습니다.

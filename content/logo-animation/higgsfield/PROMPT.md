# Higgsfield 로고 모션 프롬프트

`source-seedance-a.mp4`(Seedance 2.0 Mini, 720×1280, 24fps, 5초)를 프레임 단위로 보고 그대로 받아 적은 모션 설명입니다. 같은 느낌으로 다시 뽑거나, 고화질 모델로 올리거나, 다른 비율로 만들 때 씁니다.

## 넣는 재료

| 역할 | 파일 |
|---|---|
| start_image | 빈 흰 화면 (1080×1920) |
| end_image | 마크만 있는 정지 프레임 (`../render.js reel-light <dir> --layer=mark --still`) |
| video_references | 코드 버전 마크만 렌더한 참고 영상 (선택) |

설정: 9:16, 5초, 오디오 끔.

## 타임라인 (24fps 프레임 기준)

| 시간 | 프레임 | 일어나는 일 |
|---|---|---|
| 0.00–0.17s | 0–4 | 거의 흰 빈 화면. 0.08s쯤 바닥에 옅은 회색 그림자 타원이 먼저 생김(떨어질 자리 예고) |
| 0.17–0.21s | 4–5 | 큰 원이 화면 위에서 세로로 길게 늘어난 타원으로 빠르게 떨어짐. 살짝 모션 블러 |
| 0.25s | 6 | 바닥에 철퍽. 아래는 납작한 웅덩이, 위에 둥근 덩어리가 얹힌 모양 |
| 0.29–0.33s | 7–8 | 웅덩이가 원 지름의 약 2.5배로 퍼짐. 위 덩어리는 다시 공 모양으로 부풀고, 오른쪽 위에서 작은 원이 반투명하게 늘어난 채 떨어짐 |
| 0.38s | 9 | 작은 원도 웅덩이 오른쪽으로 떨어져 합쳐짐. 큰 혹과 작은 혹이 있는 넓은 젤리 덩어리 |
| 0.42–0.54s | 10–13 | 그대로 출렁이며 잠깐 머묾 |
| 0.54–0.71s | 13–17 | 거꾸로 감듯 액체가 위로 빨려 올라감. 큰 혹이 목처럼 늘어난 물방울 모양으로 솟고, 웅덩이가 그 안으로 빨려 들어감 |
| 0.71–0.88s | 17–21 | 큰 원이 떨어져 나와 완전한 원으로 공중에 섬. 남은 웅덩이는 작은 방울 → 점 → 사라짐. 그림자도 사라짐 |
| 0.88–0.92s | 21–22 | 큰 원 하나만 둥둥, 아주 미세한 타원 흔들림 |
| 0.92–1.04s | 22–25 | 작은 원이 오른쪽 위에서 떨어져 들어옴 |
| 1.08–1.17s | 26–28 | 착지: 가로로 납작한 타원으로 눌림, 아래에 접지 그림자 |
| 1.21–1.29s | 29–31 | 반동: 세로로 홀쭉한 타원으로 늘어남 |
| 1.33–1.46s | 32–35 | 약간의 타원 → 원으로 출렁이며 자리 잡음 |
| 1.46–1.54s | 35–37 | 두 원만 있는 상태로 정지 |
| 1.58s | 38 | 큰 원 왼쪽 아래(길이 시작되는 자리)에 작은 물방울 하나가 톡 생김 |
| 1.58–1.96s | 38–47 | 그 방울이 머리가 되어, 굵은 물감 띠처럼 호를 따라 왼쪽에서 오른쪽으로 쭉 뻗어 나감. 앞쪽 끝은 둥글게 부푼 방울 |
| 2.00s | 48 | 길 완성. 오른쪽 끝이 살짝 두툼하게 넘쳤다가 제 굵기로 정리 |
| 2.04–2.29s | 49–55 | 정지 (쉼 0.25초) |
| 2.33–2.38s | 56–57 | 여운: 큰 원과 작은 원이 살짝 가로로 눌렸다가 돌아옴(젤리처럼 미세한 출렁임) |
| 2.42–2.54s | 58–61 | 다시 정지 |
| 2.58–2.75s | 62–66 | 첫째 발가락(왼쪽): 핀 끝만 한 점으로 생겨나 제 크기로 커짐 |
| 2.67–2.79s | 64–67 | 둘째 발가락(위): 화면 위에서 세로로 늘어난 타원으로 떨어져 꽂힘 |
| 2.79–2.92s | 67–70 | 위 발가락 착지. 그 충격으로 작은 원(발바닥)이 가로로 눌렸다가 튀어 돌아옴 |
| 2.96–3.08s | 71–74 | 셋째 발가락(오른쪽): 오른쪽 위에서 작은 점 → 늘어난 타원으로 떨어져 가로로 납작하게 착지 |
| 3.13s | 75 | 셋째 발가락이 원으로 돌아오며 로고 완성 |
| 3.13–3.96s | 75–95 | 완성된 로고 그대로 정지 (약 0.85초) |
| 4.00–4.04s | 96–97 | 준비 동작: 로고 전체가 아래로 살짝 내려앉으며 모든 원이 가로 타원으로 눌림 |
| 4.08–4.21s | 98–101 | 점프: 모든 요소가 세로로 약 1.5배 쭉 늘어남. 원은 키 큰 타원, 발가락도 세로 타원, 웃는 길은 더 깊은 U자로 휨 |
| 4.25s | 102 | 스냅백: 거의 원으로 돌아오되 살짝 기울어진 채 넘침 |
| 4.29–4.42s | 103–106 | 작게 한 번 더 눌렸다 펴지며 기울기도 바로잡힘 |
| 4.46–5.00s | 107–120 | 최종 로고로 고정, 완전히 정지 |

## 스타일

- 배경: 아주 옅은 오프화이트(약 #FAFAFA), 무늬 없음. 합성할 때 순백으로 보정합니다.
- 도형: 단색 숲 초록(#00733a), 평면. 떨어지고 퍼질 때만 아주 옅은 광택과 볼륨감이 살짝 생깁니다.
- 그림자: 바닥 접지 그림자(옅은 회색 타원)는 첫 철퍽과 작은 원 착지 때만 나오고, 로고가 완성되면 없습니다.
- 질감: 고무공보다 **물엿·젤리 같은 끈적한 액체**. 떨어지면 퍼지고, 되감기듯 다시 뭉칩니다.
- 빠른 낙하에만 짧은 모션 블러와 잔상이 있습니다. 카메라는 완전히 고정입니다.
- 리듬: 0~1.5초 큰 사건(철퍽과 재결합) → 1.6~2.0초 길 → 0.5초 쉼 → 2.6~3.1초 발가락 셋 → 0.85초 정지 → 4.0~4.4초 마지막 점프 → 정지.

## 붙여 넣는 프롬프트 (영문)

```
2D logo reveal motion graphic, 9:16, static locked-off camera, near-white seamless background (#FAFAFA), flat solid forest-green (#00733a) shapes, no text, no extra objects, no particles. The shapes behave like thick glossy syrup or jelly with real weight: they splash, pool, and pull themselves back together.

0.0–0.2s: empty frame; a faint grey contact shadow fades in on the floor first, then the BIG circle falls fast from the top, stretched tall, with slight motion blur.
0.25s: it SPLATS on impact into a wide flat puddle about 2.5x its own width, with a round lump on top and a soft grey shadow under it.
0.3–0.4s: the MEDIUM circle falls in from the upper right, stretched and semi-transparent with speed, and lands in the right side of the puddle; the two merge into one wide jelly mass with a big bump and a small bump, wobbling.
0.55–0.9s: like rewinding, the liquid pulls itself back up: the big bump rises into a gooey teardrop with a neck, the puddle drains into it, the big circle snaps free as a perfect circle, and the leftover puddle shrinks to a droplet, a dot, then vanishes along with the shadow.
0.9–1.5s: the medium circle drops again from the upper right, lands squashed wide, rebounds tall and thin, jiggles from oval to round and settles to the right of the big circle.
1.6–2.0s: a tiny droplet pops up under the lower left of the big circle and becomes the head of a thick paint stroke that extrudes along a smiling arc from left to right under both circles, its leading end swollen like a drop; it finishes with a small bulge at the right end and evens out.
2.0–2.55s: stillness, with one small jelly jiggle of both circles at 2.35s.
2.6–3.1s: the three small toe dots above the medium circle arrive one by one: left toe grows from a pinpoint; top toe drops from above stretched tall and stamps in, making the medium circle squash and bounce back; right toe drops from the upper right, lands squashed flat and pops round. Now it reads as a dog paw next to a person with a smile.
3.1–4.0s: the complete logo holds perfectly still.
4.0–4.45s: one big happy jump: the whole mark crouches down squashed wide, then stretches up about 1.5x taller (circles become tall ovals, the smile deepens into a U), snaps back with a slight tilt, squashes once more and straightens.
4.45–5.0s: settles exactly into the final logo from the end frame and holds completely still.

Exaggerated squash and stretch, snappy timing, natural physical easing, crisp edges, exact final shapes and colors.
```

## 주의

- AI는 매번 결과가 다릅니다. 같은 프롬프트로도 시작의 철퍽 부분이 덜하거나 더할 수 있습니다.
- 끝 프레임을 넣어도 마지막 몇 프레임의 모양이 조금 어긋날 수 있어, `build.sh`에서 4.45초부터 벡터 마크로 크로스페이드합니다.
- 같은 날 뽑은 다른 결과(B)는 1.6~2.0초에 길이 일자 막대로 깨졌습니다. 길이 그려지는 구간은 꼭 프레임 단위로 확인하세요.

---

# 버전 2: 제자리 팝업 (낙하 없음)

떨어지는 대신 빈 공간에서 제자리로 팝업합니다. 순서: 큰 원 → 작은 원 → 길 스와이프 → 쉼 → 발가락 셋 팝업 → 마지막 점프. 질감(젤리 같은 탄성)과 리듬은 버전 1을 따릅니다.

## 타임라인

| 시간 | 동작 |
|---|---|
| 0.00–0.25s | 빈 흰 화면 |
| 0.25–0.85s | 큰 원: 제자리 중심의 점에서 팝업. 0.45s에 1.25배까지 넘쳤다가 0.9배 → 1.05배 → 1배로 젤리처럼 출렁이며 자리 잡음 |
| 0.55–1.05s | 작은 원: 같은 방식으로 더 빠르게 팝업(1.3배 넘침). 터질 때 큰 원이 살짝 따라 출렁임 |
| 1.05–1.45s | 길: 왼쪽 둥근 끝에서 시작해 호를 따라 오른쪽으로 한 번에 스와이프(약 0.35초, 빠르게 출발해 부드럽게 멈춤). 앞끝이 살짝 부풀고, 끝에서 조금 넘쳤다가 탄성 있게 돌아옴 |
| 1.45–2.25s | 쉼(약 0.8초). 아주 미세한 숨쉬기만 |
| 2.25 / 2.40 / 2.55s | 발가락 셋: 왼쪽 → 위 → 오른쪽 순서로 점에서 톡 팝업(1.4배 넘침 후 약 0.2초 만에 정착). 하나 터질 때마다 발바닥이 살짝 눌렸다 돌아옴 |
| 2.85–3.60s | 완성된 로고 정지 |
| 3.60–4.15s | 마지막 점프(선택): 다 같이 웅크렸다가 세로로 약 1.3배 늘어나고, 한 번 출렁인 뒤 정렬 |
| 4.15–5.00s | 최종 로고로 고정 |

## 붙여 넣는 프롬프트 (영문)

```
2D logo reveal motion graphic, 9:16, static locked-off camera, pure white seamless background, flat solid forest-green (#00733a) shapes, no text, no shadows, no extra objects, no particles. Nothing falls or enters from outside the frame: every shape pops into existence in place, growing out of a tiny point at its own center, like a soft elastic jelly balloon inflating with real weight and springiness.

0.0–0.25s: empty white frame, completely still.
0.25–0.85s: the BIG circle on the left pops out of a pinpoint at its center, overshoots to about 125% size at 0.45s, then wobbles like jelly (shrinks to 90%, swells to 105%) and settles to exact size.
0.55–1.05s: the MEDIUM circle on the right pops out the same way but snappier, overshooting to about 130%; as it pops, the big circle gives a small sympathetic jiggle.
1.05–1.45s: the thick SMILING PATH under both circles appears from its rounded left end and SWIPES along the curved arc to the right in one fast confident stroke (fast start, smooth stop), its leading tip slightly swollen; it overshoots a little past the right end and springs back. Both circles bounce slightly in reaction.
1.45–2.25s: a clear pause, the mark almost still with only a barely visible breathing wobble.
2.25–2.8s: the three small TOE dots above the medium circle POP up one by one, left at 2.25s, top at 2.40s, right at 2.55s; each one grows from a pinpoint, overshoots to about 140% and snaps to size within 0.2s, and each pop makes the medium circle squash slightly and bounce back. Now it reads as a dog paw beside a person, with a smile underneath.
2.85–3.6s: the complete logo holds perfectly still.
3.6–4.15s: one happy bounce: the whole mark squashes down wide, stretches up about 1.3x taller (the smile deepens), then settles with one small jiggle.
4.15–5.0s: settles exactly into the final logo from the end frame and holds completely still.

Exaggerated squash and stretch, snappy pop timing, natural elastic easing, crisp edges, exact final shapes, positions and colors.
```

## 넣는 재료

- start_image: 빈 흰 화면, end_image: 마크만 있는 정지 프레임(버전 1과 같음)
- video_references: 지금 코드 버전은 "위에서 떨어지는" 움직임이라 넣지 않거나, 팝업 버전으로 바꾼 참고 영상을 넣습니다. 떨어지는 참고 영상을 넣으면 낙하 동작이 섞여 나올 수 있습니다.

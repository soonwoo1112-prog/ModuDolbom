# Gemini Omni Flash 1.2 로고 영상 (3초, 9:16, 1080p)

`../higgsfield/PROMPT.md`의 버전 2(제자리 팝업, 젤리 없음)를 3초에 맞게 줄이고, 워드마크와 태그라인("이웃과 나란히 걷는 산책")이 올라오는 동작을 더해 Higgsfield에서 생성했습니다.

- 모델: Gemini Omni Flash 1.2, image-to-video, 3초, 1080p, 9.75크레딧
- start_image: 빈 흰 화면 / end_image: `end-frame-916.png` (`lockup-tagline-1280.png`를 1080×1920 가운데에 놓은 것)
- 결과: `out/logo-gemini-reel-light.mp4` (30fps, 3.0초, 무음)

## 실제로 나온 움직임

| 시간 | 동작 |
|---|---|
| 0.08–0.46s | 큰 원이 점에서 팝업, 0.25s부터 작은 원도 팝업 |
| 0.42–0.83s | 길이 왼쪽에서 오른쪽으로 스와이프 |
| 0.83–1.17s | 쉼 |
| 1.17–1.58s | 발가락 셋이 차례로 팝업 |
| 1.58–2.21s | 카메라가 빠지듯 전체가 줄어들며, 워드마크와 태그라인이 나타남 |
| 2.21–3.00s | 최종 로고 정지 |

프롬프트와 다른 점: 마크가 처음엔 최종 크기의 약 1.5배로 그려지고, 1.6초부터 줌아웃되며 최종 크기로 줄어듭니다.

## 후처리 (`build.sh`)

- AI가 태그라인을 **"이웃과 니란히 걷는 산책"**으로 잘못 그리고 굵기·색도 바꿔서, 줌이 멈추는 2.08~2.23초에 원본 이미지로 크로스페이드합니다. 끝 화면은 원본과 같습니다.
- 1.75~2.08초 사이에는 AI가 그린 글자가 작게 보일 수 있습니다.
- 모델이 넣은 오디오는 뺐습니다.

## 쓴 프롬프트

```
2D logo reveal motion graphic, 9:16, static locked-off camera, pure white seamless background, flat solid forest-green (#00733a) shapes, no shadows, no extra objects, no particles. Nothing falls or enters from outside the frame: every shape pops into existence in place, scaling up from a tiny point at its own center. The shapes are rigid and clean: circles stay perfect circles and the path keeps a constant thickness at all times. No jelly, no wobble, no squash and stretch, no liquid, no morphing, no deformation. Motion comes only from scale and position, with crisp spring easing: one small overshoot, then a clean stop.

0.0-0.1s: empty white frame, completely still.
0.1-0.35s: the BIG circle on the left pops out of a pinpoint at its center, overshoots once to about 112% and settles exactly at full size.
0.25-0.5s: the MEDIUM circle on the right pops out the same way, slightly snappier, overshooting to about 112% and settling.
0.5-0.85s: the thick SMILING PATH under both circles appears from its rounded left end and SWIPES along the curved arc to the right in one fast, confident stroke (fast start, smooth stop), with constant thickness and rounded ends, stopping exactly at its right end.
0.85-1.3s: a clear pause, the mark completely still.
1.3-1.7s: the three small TOE dots above the medium circle POP up one by one, left at 1.3s, top at 1.4s, right at 1.5s; each grows from a pinpoint, overshoots to about 115% and snaps to size. Now it reads as a dog paw beside a person, with a smile underneath.
1.75-2.15s: the black Korean wordmark below the mark fades in while sliding up a short distance, then the small grey tagline under it does the same 0.1s later. The text is exactly as in the end frame, sharp and unchanged, never redrawn or distorted.
2.15-3.0s: holds exactly as the final end frame, completely still.

Snappy pop timing, clean spring easing, crisp edges, exact final shapes, positions, text and colors. Silent, no music, no sound effects.
```

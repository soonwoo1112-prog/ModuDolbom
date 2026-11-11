#!/bin/bash
# 팝업 로고 모션: 9:16, 1:1을 4K(2배)로 렌더하고 4K와 1080p mp4를 만든다. 60fps, 3.5초.
set -e
R=$(cd "$(dirname "$0")" && pwd); cd "$R"
mkdir -p out
for v in reel square; do
  rm -rf .frames/$v
  node render.js $v .frames/$v --scale=2
  # 4K 원본
  ffmpeg -nostdin -v error -y -framerate 60 -i .frames/$v/%04d.png \
    -c:v libx264 -preset slow -crf 12 -profile:v high -pix_fmt yuv420p -movflags +faststart out/logo-popin-$v-4k.mp4
  # 1080p (4K에서 줄여 가장자리가 더 매끈함)
  ffmpeg -nostdin -v error -y -framerate 60 -i .frames/$v/%04d.png -vf "scale=iw/2:ih/2:flags=lanczos" \
    -c:v libx264 -preset slow -crf 14 -profile:v high -pix_fmt yuv420p -movflags +faststart out/logo-popin-$v-1080.mp4
  cp .frames/$v/$(ls .frames/$v | tail -1) out/logo-popin-$v-4k.png
done
rm -rf .frames
for f in out/*.mp4; do echo "$f $(ffprobe -v error -show_entries stream=width,height,r_frame_rate:format=duration -of csv=p=0 "$f" | tr '\n' ' ')"; done

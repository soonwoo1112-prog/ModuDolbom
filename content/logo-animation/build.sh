#!/bin/bash
# 모두돌봄 로고 애니메이션 빌드: 4가지 버전을 mp4로 만든다 (60fps, 3.2초).
set -e
R=$(cd "$(dirname "$0")" && pwd); cd "$R"
mkdir -p out
for v in reel-light reel-brand square-light square-brand; do
  rm -rf .frames/$v
  node render.js $v .frames/$v
  ffmpeg -nostdin -v error -y -framerate 60 -i .frames/$v/%04d.png \
    -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p -movflags +faststart out/logo-$v.mp4
  cp .frames/$v/$(ls .frames/$v | tail -1) out/logo-$v.png
done
rm -rf .frames .tmp
ls -la out

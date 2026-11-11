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
# 투명 오버레이 (릴스 엔드카드: 마크가 장면 위에 그려지고 흰 바탕이 아래에서 올라옴), 1080×1920
rm -rf .frames/overlay
node render.js reel .frames/overlay --overlay
ffmpeg -nostdin -v error -y -framerate 60 -i .frames/overlay/%04d.png -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le -vendor apl0 .frames/logo-popin-overlay-prores4444.mov
rm -f out/logo-popin-overlay-prores4444.zip && (cd .frames && zip -q ../out/logo-popin-overlay-prores4444.zip logo-popin-overlay-prores4444.mov)
ffmpeg -nostdin -v error -y -framerate 60 -i .frames/overlay/%04d.png -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 18 -auto-alt-ref 0 -row-mt 1 out/logo-popin-overlay.webm
ffmpeg -nostdin -v error -y -loop 1 -i ../../models/dog-01/source-photo.jpg -framerate 60 -i .frames/overlay/%04d.png \
  -filter_complex "[0:v]scale=-2:1920,crop=1080:1920,eq=brightness=-0.03,fps=60[b];[b][1:v]overlay=shortest=1,format=yuv420p[o]" \
  -map "[o]" -t 3.5 -c:v libx264 -preset slow -crf 16 -movflags +faststart out/logo-popin-overlay-preview.mp4
rm -rf .frames
for f in out/*.mp4; do echo "$f $(ffprobe -v error -show_entries stream=width,height,r_frame_rate:format=duration -of csv=p=0 "$f" | tr '\n' ' ')"; done

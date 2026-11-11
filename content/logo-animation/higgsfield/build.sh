#!/bin/bash
# Higgsfield(Seedance 2.0 Mini) 로고 영상 + 정확한 벡터 로고와 워드마크 합성.
# 필요: ../render.js 와 ../fonts (../build.sh 를 한 번 돌리면 준비됨)
set -e
R=$(cd "$(dirname "$0")" && pwd); cd "$R"
XF=4.45     # AI 마크 → 벡터 마크 크로스페이드 시작(초)
TXT=4.50    # 워드마크가 올라오기 시작하는 시각(초)
END=6.40    # 전체 길이(초)
rm -rf .t .m && node ../render.js reel-light .t --layer=text --alpha && node ../render.js reel-light .m --layer=mark --still
MARK=$(ls .m/*.png | tail -1)
OFF=$(python3 -c "print(round($TXT-2.38,3))")   # render.js에서 워드마크는 2.38초에 시작
mkdir -p out
ffmpeg -nostdin -v error -y -i source-seedance-a.mp4 -loop 1 -t $END -i "$MARK" \
  -itsoffset $OFF -framerate 60 -i .t/%04d.png -filter_complex "
  [0:v]fps=60,scale=1080:1920:flags=lanczos,colorlevels=rimax=0.972:gimax=0.972:bimax=0.972,tpad=stop_mode=clone:stop_duration=3,trim=0:$END,setpts=PTS-STARTPTS[ai];
  [1:v]fps=60,format=yuv444p,trim=0:$END,setpts=PTS-STARTPTS[vec];
  [ai]format=yuv444p[ai2];
  [ai2][vec]xfade=transition=fade:duration=0.3:offset=$XF[base];
  [2:v]format=rgba[txt];
  [base][txt]overlay=0:0:eof_action=repeat,trim=0:$END,format=yuv420p[o]" \
  -map "[o]" -r 60 -c:v libx264 -preset slow -crf 14 -movflags +faststart out/logo-ai-reel-light.mp4
ffmpeg -nostdin -v error -y -i out/logo-ai-reel-light.mp4 -vf "crop=1080:1080:0:340" -c:v libx264 -preset slow -crf 14 -movflags +faststart out/logo-ai-square-light.mp4
rm -rf .t .m
for f in out/*.mp4; do ffprobe -v error -show_entries format=duration:stream=width,height -of compact "$f"; done

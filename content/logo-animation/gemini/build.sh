#!/bin/bash
# Gemini Omni Flash 1.2 로고 영상 정리: 오디오 제거, 줌이 멈춘 뒤 원본 로고 이미지로 크로스페이드.
# AI가 태그라인을 "니란히"로 잘못 그려서, 끝 화면은 원본(end-frame-916.png)으로 덮는다.
set -e
R=$(cd "$(dirname "$0")" && pwd); cd "$R"
XF=2.08   # 크로스페이드 시작(초). 줌은 2.21초에 멈추고 이때 이미 원본과 위치가 거의 같음
DUR=3.0
ffmpeg -nostdin -v error -y -i source-gemini-omni-flash-1-2.mp4 -loop 1 -t $DUR -i end-frame-916.png -filter_complex "
  [0:v]fps=30,format=yuv444p,trim=0:$DUR,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=1[ai];
  [1:v]fps=30,format=yuv444p,setpts=PTS-STARTPTS[img];
  [ai][img]xfade=transition=fade:duration=0.15:offset=$XF,trim=0:$DUR,format=yuv420p[o]" \
  -map "[o]" -an -r 30 -c:v libx264 -preset slow -crf 14 -movflags +faststart out/logo-gemini-reel-light.mp4
ffprobe -v error -show_entries format=duration:stream=width,height -of compact out/logo-gemini-reel-light.mp4

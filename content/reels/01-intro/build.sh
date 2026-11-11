#!/bin/bash
set -e
R=$(cd "$(dirname "$0")" && pwd); cd $R; mkdir -p seg
# idx ss dur caption
SEGS="1 0.3 2.2 c1 -420
2 1.0 1.6 c2 300
3 1.5 2.0 c3 300
4 1.8 1.8 c4 300
5 0.5 2.3 c5 300
6 1.0 2.0 c6 300
7 1.8 2.0 c7 300"
GRADE="eq=contrast=1.06:saturation=1.08,vignette=PI/5"
while read i ss d c yo; do
  frames=$(python3 -c "print(round($d*30))")
  ffmpeg -nostdin -v error -y -ss $ss -t $d -i clips/s$i.mp4 -loop 1 -t $d -i png/$c.png -filter_complex "
   [0:v]fps=30,scale=1080:1920:flags=lanczos,zoompan=z='1+0.05*on/$frames':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1080x1920:fps=30,$GRADE[v];
   [1:v]format=rgba,fade=t=in:st=0.08:d=0.18:alpha=1[t];
   [v][t]overlay=x=0:y='$yo+max(0,40-(t-0.08)*220)':format=auto,format=yuv420p[o]" \
   -map "[o]" -r 30 -c:v libx264 -preset medium -crf 17 -an seg/$i.mp4
done <<< "$SEGS"
# final: dog run -> blur + darken -> logo
ffmpeg -nostdin -v error -y -ss 0 -t 4.2 -i clips/s8.mp4 -loop 1 -t 4.2 -i png/logo.png -f lavfi -t 4.2 -i "color=c=0x1c0f06:s=1080x1920:r=30" -filter_complex "
 [0:v]fps=30,scale=1080:1920:flags=lanczos,zoompan=z='1+0.06*on/126':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1080x1920:fps=30,$GRADE,split[a][b];
 [b]gblur=sigma=28[bb];
 [a][bb]blend=all_expr='A*(1-clip((T-1.5)/0.6,0,1))+B*clip((T-1.5)/0.6,0,1)'[bl];
 [2:v]format=rgba,colorchannelmixer=aa=0.5,fade=t=in:st=1.5:d=0.6:alpha=1[dk];
 [bl][dk]overlay[v2];
 [1:v]format=rgba,fade=t=in:st=1.8:d=0.45:alpha=1[lg];
 [v2][lg]overlay=x=0:y='max(0,50-(t-1.8)*160)',fade=t=out:st=3.9:d=0.3,format=yuv420p[o]" \
 -map "[o]" -r 30 -c:v libx264 -preset medium -crf 17 -an seg/8.mp4
printf "file 'seg/%s.mp4'\n" 1 2 3 4 5 6 7 8 > list.txt
ffmpeg -nostdin -v error -y -f concat -safe 0 -i list.txt -c copy video_noaudio.mp4
if [ -f music.mp3 ]; then
  D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 video_noaudio.mp4)
  ffmpeg -nostdin -v error -y -i video_noaudio.mp4 -i music.mp3 -filter_complex "[1:a]atrim=0:$D,afade=t=in:d=0.2,afade=t=out:st=$(python3 -c "print($D-0.8)"):d=0.8,loudnorm=I=-14:TP=-1.5[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart modudolbom_intro.mp4
else cp video_noaudio.mp4 modudolbom_intro.mp4; fi
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height -of compact modudolbom_intro.mp4

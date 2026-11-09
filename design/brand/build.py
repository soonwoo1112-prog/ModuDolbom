import base64, subprocess, re, html, os
S='/tmp/claude-0/-home-user-ModuDolbom/20cae9ea-b03b-5e56-87a0-029b26c69c9c/scratchpad/'
P=S+'fontpk/'
src=open('src.html').read()
FONTS=[
 ('Pretendard','Pretendard','토스·크림이 쓰는 표준 고딕. 가장 무난하고 얼굴은 약해요.',None),
 ('SUIT','SUIT','기하학적이고 또렷해요. 숫자가 단단하게 서요.',None),
 ('Wanted Sans','Wanted Sans','넓고 열린 형태에 아주 굵은 굵기까지 있어요. 숫자가 크게 잘 보여요.',None),
 ('LINE Seed','LINE Seed Sans KR','둥근 기하 형태라 다정해요. 굵기는 세 가지뿐이에요.',None),
 ('Hahmlet','Hahmlet','붓 맛이 남은 명조 계열. 로고와 짧은 제목에만 쓰고 본문은 고딕으로 둬요.','Pretendard'),
]
HEAVY={'Pretendard':800,'SUIT':900,'Wanted Sans':900,'LINE Seed Sans KR':700,'Hahmlet':700}
def card(label, fam, note, body):
    bf = body or fam
    hw = HEAVY[fam]
    return f'''<article class="fcard">
<div class="fcard__name"><b>{label}</b><span class="tag">OFL</span></div>
<div class="s-word" style="font-family: '{fam}', var(--f-ui); font-weight: {hw}">모두돌봄</div>
<div class="s-title" style="font-family: '{fam}', var(--f-ui)">오늘 산책, 누구에게 부탁할까요</div>
<div class="s-nums" style="font-family: '{fam}', var(--f-ui); font-weight: {hw}"><span>30:12</span><span>1.92<small>km</small></span><span>15,000<small>원</small></span></div>
<div class="s-row" style="font-family: '{bf}', var(--f-ui)"><i aria-hidden="true"></i><div><b>김하늘 시터</b><br><span>역삼동 · 같은 아파트 · 120m</span></div></div>
<p class="s-body" style="font-family: '{bf}', var(--f-ui)">점심시간과 토요일에 걸어요. 산책하는 동안 쉬, 응가, 사진 소식을 바로 보내 드려요.</p>
<p class="fcard__note">{note}</p>
</article>'''
cards='\n'.join(card(*f) for f in FONTS)
MARKS={
 'route': ('산책 길','출발점(빈 원)에서 한 바퀴 돌아 도착점(점)에서 끝나는 산책 경로. 산책 기록 지도와 같은 언어예요.',
  '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="37.5" r="3.6" stroke-width="3.4"/><path d="M14 34.6C21 29 9.5 18 17.5 11.2 25.5 4.4 39.6 9.4 38.6 20.4 37.8 29 28.4 30.6 27.2 24.6"/><circle cx="26.6" cy="22.6" r="4.6" fill="currentColor" stroke="none"/></svg>'),
 'leash': ('나란히 걷기','큰 점(이웃)과 작은 점(강아지)이 같은 길을 나란히 걷는 모양. 가장 단순해서 작은 크기에서도 또렷해요.',
  '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" aria-hidden="true"><circle cx="17" cy="17.5" r="7" fill="currentColor" stroke="none"/><circle cx="32.5" cy="23" r="4.6" fill="currentColor" stroke="none"/><path d="M6.5 36.5C16 30.5 32 30.5 41.5 36.5"/></svg>'),
 'home': ('동네 집','지붕 아래 발자국. 가장 바로 읽히지만, 반려동물 앱에서 흔한 모양이라 기억에 덜 남을 수 있어요.',
  '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 22.5 24 8.5l16.5 14V38a3 3 0 0 1-3 3h-27a3 3 0 0 1-3-3z"/><g fill="currentColor" stroke="none"><ellipse cx="24" cy="32.6" rx="5.4" ry="4.4"/><circle cx="17.6" cy="25.8" r="2.4"/><circle cx="24" cy="23.4" r="2.4"/><circle cx="30.4" cy="25.8" r="2.4"/></g></svg>'),
}
def mark(k):
    t,d,svg=MARKS[k]
    return f'''<article class="mcard">
<h3>{t}</h3><p>{d}</p>
<div class="lockup">{svg}<span>모두돌봄</span></div>
<div class="icons" role="img" aria-label="{t} 마크의 앱 아이콘, 큰 크기·중간·작은 크기와 흰 바탕, 브라우저 탭 크기">
<span class="appicon appicon--l">{svg}</span><span class="appicon appicon--m">{svg}</span><span class="appicon appicon--s">{svg}</span><span class="appicon appicon--m appicon--light">{svg}</span><span class="fav">{svg}</span>
</div>
</article>'''
marks='\n'.join(mark(k) for k in MARKS)
out=src.replace('<!--CARDS-->',cards).replace('<!--MARKS-->',marks)
# subset each local font to the page's text
text=re.sub(r'<[^>]+>',' ',out); text=html.unescape(text)
chars=''.join(sorted(set(text)|set(chr(c) for c in range(32,127))))
open('chars.txt','w').write(chars)
FILES=[('Pretendard',400,P+'pretendard-1.3.9/package/dist/web/static/woff2/Pretendard-Regular.woff2'),
 ('Pretendard',700,P+'pretendard-1.3.9/package/dist/web/static/woff2/Pretendard-Bold.woff2'),
 ('Pretendard',800,P+'pretendard-1.3.9/package/dist/web/static/woff2/Pretendard-ExtraBold.woff2'),
 ('SUIT','400 900',P+'sun-typeface-suit-2.0.5/package/fonts/variable/woff2/SUIT-Variable.woff2'),
 ('Wanted Sans','400 950',P+'wanted-sans-1.0.3/package/fonts/webfonts/variable/complete/woff2/WantedSansVariable.woff2'),
 ('LINE Seed Sans KR',400,P+'kfonts-line-seed-sans-kr-0.1.0/package/LINESeedKR-Rg.woff2'),
 ('LINE Seed Sans KR',700,P+'kfonts-line-seed-sans-kr-0.1.0/package/LINESeedKR-Bd.woff2')]
faces=[]
for i,(fam,w,f) in enumerate(FILES):
    o=f'sub{i}.woff2'
    subprocess.run(['pyftsubset',f,'--text-file=chars.txt','--flavor=woff2','--layout-features=*','--output-file='+o],check=True)
    b=base64.b64encode(open(o,'rb').read()).decode()
    faces.append(f'@font-face {{ font-family: "{fam}"; src: url(data:font/woff2;base64,{b}) format("woff2"); font-weight: {w}; font-display: swap; }}')
    print(fam,w,os.path.getsize(o))
out=out.replace('/*FONTFACES*/','\n'.join(faces))
open('brand.html','w').write(out)
print('size',len(out))

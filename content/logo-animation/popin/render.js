// 모두돌봄 로고 팝업 모션 (젤리 없음): 프레임을 PNG로 렌더한다.
// node render.js <reel|square> <outDir> [--scale=2] [--still] [--overlay]
//   --overlay: 투명 바탕. 마크는 아래 장면 위에 바로 그려지고, 1.50~2.05초에 흰 바탕이 아래에서 올라온 뒤 글자가 나온다.
//   reel: 1080×1920, square: 1080×1080 (CSS px). --scale=2 이면 2160×3840 / 2160×2160.
// 최종 레이아웃은 lockup-tagline-1280.png(1280×1280)와 픽셀 단위로 같다.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FPS = 60;
const DURATION = 3500; // ms
const ROOT = path.join(__dirname, '..');
const SUIT = 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'SUIT-Variable.woff2')).toString('base64');
const WORDMARK = fs.readFileSync(path.join(ROOT, 'modudolbom-wordmark.svg'), 'utf8').match(/<g fill[\s\S]*<\/g>/)[0];

const GREEN = '#00733a';
const TAGLINE = '이웃과 나란히 걷는 산책';
const TAG_COLOR = '#5b625d';

// 1280×1280 원본 로고 이미지에서 잰 잉크 영역
const BOX = {
  mark: { x: 440, y: 304, w: 398 },          // 마크 viewBox 2000×1590
  word: { x: 356, y: 697, w: 570 },          // 워드마크 잉크: viewBox 안 x 30~3378, y 0~879
  tag:  { x: 462, y: 910, w: 355, h: 32 },
};

const CANVAS = { reel: { w: 1080, h: 1920 }, square: { w: 1080, h: 1080 } };

function html(c, overlay) {
  const s = c.w / 1280;                 // 1280 정사각 원본 → 캔버스 폭
  const oy = (c.h - 1280 * s) / 2;      // 정사각 원본을 세로 가운데에
  const markH = BOX.mark.w * 1590 / 2000;
  const wScale = BOX.word.w / 3348;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:S;font-weight:100 900;src:url(${SUIT}) format('woff2')}
html,body{margin:0;width:${c.w}px;height:${c.h}px;background:${overlay ? 'transparent' : '#fff'};overflow:hidden}
#bg{position:absolute;inset:0;background:#fff;display:${overlay ? 'block' : 'none'}}
#sq{position:absolute;left:0;top:${oy}px;width:1280px;height:1280px;transform-origin:0 0;transform:scale(${s})}
#markWrap{position:absolute;left:${BOX.mark.x}px;top:${BOX.mark.y}px;width:${BOX.mark.w}px;height:${markH}px;transform-origin:50% 50%}
#markWrap svg{display:block;width:100%;height:100%;overflow:visible}
.p{transform-box:fill-box;transform-origin:50% 50%}
#word{position:absolute;left:${BOX.word.x - 30 * wScale}px;top:${BOX.word.y}px;width:${3406 * wScale}px}
#word svg{display:block;width:100%;height:auto;transform-origin:0 0;transform:scaleY(0.968)} /* 원본 이미지의 워드마크 세로 비율 */
#tag{position:absolute;left:0;top:0;width:1280px;height:1280px;overflow:visible}
</style></head><body><div id="bg"></div><div id="sq">
<div id="markWrap"><svg viewBox="0 0 2000 1590"><g fill="${GREEN}">
<circle id="person" class="p" cx="476.5" cy="476.5" r="476.5"/>
<circle id="pad" class="p" cx="1514.5" cy="668" r="327"/>
<circle id="toeL" class="p" cx="1194" cy="268" r="124.5"/>
<circle id="toeT" class="p" cx="1524" cy="124.5" r="124.5"/>
<circle id="toeR" class="p" cx="1851" cy="268" r="124.5"/>
</g><path id="road" d="M120 1140A1300 1300 0 0 0 1880 1140" fill="none" stroke="${GREEN}" stroke-width="224" stroke-linecap="round" pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="1"/></svg></div>
<div id="word"><svg viewBox="0 0 3406 879">${WORDMARK}</svg></div>
<svg id="tag" viewBox="0 0 1280 1280"><text id="tagText" font-family="S" font-weight="700" fill="${TAG_COLOR}">${TAGLINE}</text></svg>
</div>
<script>
// 태그라인: 잉크 폭과 위치를 원본 이미지에 맞춘다
function fitTag(){
  const cv=document.createElement('canvas').getContext('2d');
  cv.font='700 100px S';
  const m=cv.measureText(${JSON.stringify(TAGLINE)});
  const ink=m.actualBoundingBoxLeft+m.actualBoundingBoxRight;
  const f=100*${BOX.tag.w}/ink;
  const k=f/100;
  const t=document.getElementById('tagText');
  t.setAttribute('font-size',f);
  t.setAttribute('x',${BOX.tag.x}+m.actualBoundingBoxLeft*k);
  t.setAttribute('y',${BOX.tag.y}+m.actualBoundingBoxAscent*k);
}
const POP='cubic-bezier(.34,1.32,.64,1)';     // 한 번 살짝 넘치고 멈춤 (약 6~8%)
const SWIPE='cubic-bezier(.22,1,.36,1)';     // 빠르게 출발, 부드럽게 멈춤
const MOVE='cubic-bezier(.76,0,.24,1)';      // 레이아웃 전환
const RISE='cubic-bezier(.16,1,.3,1)';       // 디자인 시스템 ease-out-expo
function pop(id,start,dur){
  document.getElementById(id).animate(
    [{transform:'scale(0)',opacity:0,offset:0},{opacity:1,offset:.12},{transform:'scale(1)',opacity:1}],
    {duration:dur,delay:start,easing:POP,fill:'both'});
}
function build(overlay){
  fitTag();
  if (overlay) document.getElementById('bg').animate(
    [{transform:'translateY(100%)'},{transform:'none'}],
    {duration:550,delay:1500,easing:'cubic-bezier(.65,0,.35,1)',fill:'both'});
  // 시작: 마크만 화면 가운데에 1.3배. 1.6초부터 최종 자리로 이동
  const s=${s}, oy=${oy}, ch=${c.h};
  const mcx=${BOX.mark.x + BOX.mark.w / 2}, mcy=${BOX.mark.y + markH / 2};
  const dy=((ch/2)-oy)/s - mcy;               // 1280 좌표계에서 화면 가운데까지
  const dx=640 - mcx;
  const S0=1.3;
  document.getElementById('markWrap').animate(
    [{transform:'translate('+dx+'px,'+dy+'px) scale('+S0+')'},{transform:'none'}],
    {duration:700,delay:1600,easing:MOVE,fill:'both'});
  pop('person',80,420);
  pop('pad',220,400);
  document.getElementById('road').animate(
    [{strokeDashoffset:1,opacity:0},{opacity:1,offset:.04},{strokeDashoffset:0,opacity:1}],
    {duration:440,delay:450,easing:SWIPE,fill:'both'});
  pop('toeL',1060,320);
  pop('toeT',1160,320);
  pop('toeR',1260,320);
  const rise=(id,start)=>document.getElementById(id).animate(
    [{opacity:0,transform:'translateY(36px)'},{opacity:1,transform:'none'}],
    {duration:650,delay:start,easing:RISE,fill:'both'});
  rise('word',2080);
  rise('tag',2200);
}
</script></body></html>`;
}

(async () => {
  const args = process.argv.slice(2);
  const [name, out] = args.filter((a) => !a.startsWith('--'));
  const scale = Number((args.find((a) => a.startsWith('--scale=')) || '--scale=1').split('=')[1]);
  const still = args.includes('--still');
  const overlay = args.includes('--overlay');
  const c = CANVAS[name];
  if (!c || !out) throw new Error('usage: node render.js <reel|square> <outDir> [--scale=2] [--still]');
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: c.w, height: c.h }, deviceScaleFactor: scale });
  await p.setContent(html(c, overlay));
  await p.evaluate(() => document.fonts.load('700 40px S'));
  const ok = await p.evaluate(() => document.fonts.check('700 40px S', '이웃과 나란히 걷는 산책'));
  if (!ok) throw new Error('SUIT 서체를 불러오지 못했어요');
  await p.evaluate((o) => build(o), overlay);
  const n = Math.round(DURATION / 1000 * FPS);
  const frames = still ? [n - 1] : [...Array(n).keys()];
  for (const i of frames) {
    const t = i * 1000 / FPS;
    await p.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), t);
    await p.screenshot({ path: path.join(out, String(i).padStart(4, '0') + '.png'), omitBackground: overlay });
  }
  await b.close();
})();

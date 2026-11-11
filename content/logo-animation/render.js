// 모두돌봄 로고 애니메이션: 프레임을 PNG로 렌더한다.
// node render.js <variant> <outDir> [--layer=all|mark|text] [--alpha] [--still]
//   variant: reel-light | reel-brand | square-light | square-brand
//   --layer=mark  마크만 (AI 참고 영상, 끝 프레임용)
//   --layer=text  워드마크와 태그라인만 (AI 영상 위에 얹는 용도, --alpha와 함께)
//   --alpha       투명 바탕
//   --still       마지막 프레임 한 장만
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FPS = 60;
const DURATION = 3800; // ms
const FONT_DIR = process.env.FONT_DIR || path.join(__dirname, 'fonts');
const INK = '#141a16'; // 디자인 시스템 워드마크 색

const VARIANTS = {
  'reel-light':   { w: 1080, h: 1920, bg: '#ffffff', mark: '#00733a', text: INK, sub: 'oklch(40% 0.01 150)', symbol: 600, word: 128, tag: 50, cy: 0.45 },
  'reel-brand':   { w: 1080, h: 1920, bg: '#00733a', mark: '#ffffff', text: '#ffffff', sub: 'rgba(255,255,255,.86)', symbol: 600, word: 128, tag: 50, cy: 0.45 },
  'square-light': { w: 1080, h: 1080, bg: '#ffffff', mark: '#00733a', text: INK, sub: 'oklch(40% 0.01 150)', symbol: 430, word: 96, tag: 40, cy: 0.47 },
  'square-brand': { w: 1080, h: 1080, bg: '#00733a', mark: '#ffffff', text: '#ffffff', sub: 'rgba(255,255,255,.86)', symbol: 430, word: 96, tag: 40, cy: 0.47 },
};

// 디자인 시스템 Logos: modudolbom-mark.svg (viewBox 2000×1590)와 modudolbom-wordmark.svg (viewBox 3406×879)
const WORD = [
  ['0', 'M370 127V306H114V749H757V306H503V127H845V19H30V127ZM245 644V411H626V644Z'],
  ['844', 'M742 767V661H268V497H752V392H132V767ZM845 306V198H501V-86H368V198H30V306Z'],
  ['1688', 'M741 784V680H263V610H749V506H503V452H843V348H30V452H370V506H131V784ZM745 303V69H254V20H769V-80H124V161H614V205H122V303Z'],
  ['2532', 'M368 385V452H133V793H265V719H608V793H740V452H502V385H843V279H30V385ZM265 555H608V621H265ZM746 225V-76H124V225ZM254 120V29H616V120Z'],
];

function html(v, layer, alpha) {
  const showMark = layer !== 'text';
  const showText = layer !== 'mark';
  const outE = 'cubic-bezier(.16,1,.3,1)';
  const markH = v.symbol * 1590 / 2000;
  const wordW = v.word * 3406 / 879 * 0.82; // 워드마크 높이를 글자 크기에 맞춤
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:P;font-weight:500;src:url(file://${FONT_DIR}/Pretendard-Medium.otf)}
html,body{margin:0;width:${v.w}px;height:${v.h}px;background:${alpha ? 'transparent' : v.bg};overflow:hidden}
.stage{position:absolute;left:0;right:0;top:${v.h * v.cy}px;transform:translateY(-50%);display:flex;flex-direction:column;align-items:center}
svg.mark{width:${v.symbol}px;height:${markH}px;overflow:visible;visibility:${showMark ? 'visible' : 'hidden'}}
.part{transform-box:fill-box;transform-origin:50% 50%}
.hidden{visibility:hidden}
#person{transform-origin:50% 100%;animation:land 620ms linear 0ms both}
#pad{transform-origin:50% 100%;animation:land 600ms linear 260ms both}
#road{animation:draw 560ms ${outE} 620ms both}
#toeL{transform-origin:50% 100%;animation:stamp 460ms linear 1500ms both}
#toeT{transform-origin:50% 100%;animation:stamp 460ms linear 1640ms both}
#toeR{transform-origin:50% 100%;animation:stamp 460ms linear 1780ms both}
#mark{transform-box:fill-box;transform-origin:50% 100%;animation:nod 640ms cubic-bezier(.45,0,.55,1) 2260ms both}
/* 큰 원과 작은 원: 위에서 떨어져 바닥에 눌렸다가 튀어 오르며 자리 잡음 */
@keyframes land{
  0%{transform:translateY(-140%) scale(.55,1.35);opacity:0;animation-timing-function:cubic-bezier(.55,0,1,.45)}
  8%{opacity:1}
  42%{transform:translateY(0) scale(1.32,.66);animation-timing-function:cubic-bezier(.2,.9,.3,1)}
  62%{transform:translateY(-10%) scale(.9,1.12);animation-timing-function:cubic-bezier(.5,0,.6,1)}
  80%{transform:translateY(0) scale(1.06,.95)}
  100%{transform:none;opacity:1}}
@keyframes draw{0%{stroke-dashoffset:1}100%{stroke-dashoffset:0}}
/* 발가락: 꾹 찍히듯 내려와 눌리고 돌아옴 */
@keyframes stamp{
  0%{transform:translateY(-120%) scale(.4);opacity:0;animation-timing-function:cubic-bezier(.55,0,1,.45)}
  15%{opacity:1}
  45%{transform:translateY(0) scale(1.38,.62);animation-timing-function:cubic-bezier(.2,.9,.3,1)}
  70%{transform:translateY(-6%) scale(.92,1.1)}
  100%{transform:none;opacity:1}}
@keyframes nod{0%{transform:none}30%{transform:translateY(-18px) scale(1.035,.965)}62%{transform:translateY(4px) scale(.99,1.01)}100%{transform:none}}
.word{margin-top:${v.word * 0.55}px;width:${wordW}px;animation:rise 620ms ${outE} 2380ms both;visibility:${showText ? 'visible' : 'hidden'}}
.word svg{display:block;width:100%;height:auto}
.tag{font-family:P;font-weight:500;color:${v.sub};font-size:${v.tag}px;line-height:1.3;letter-spacing:-0.01em;margin-top:${v.tag * 0.5}px;white-space:nowrap;animation:rise 620ms ${outE} 2540ms both;visibility:${showText ? 'visible' : 'hidden'}}
@keyframes rise{0%{opacity:0;transform:translateY(36px)}100%{opacity:1;transform:none}}
</style></head><body><div class="stage">
<svg class="mark" viewBox="0 0 2000 1590"><g id="mark" fill="${v.mark}">
<circle id="person" class="part" cx="476.5" cy="476.5" r="476.5"/>
<circle id="pad" class="part" cx="1514.5" cy="668" r="327"/>
<circle id="toeL" class="part" cx="1194" cy="268" r="124.5"/>
<circle id="toeT" class="part" cx="1524" cy="124.5" r="124.5"/>
<circle id="toeR" class="part" cx="1851" cy="268" r="124.5"/>
<path id="road" class="part" d="M120 1140A1300 1300 0 0 0 1880 1140" fill="none" stroke="${v.mark}" stroke-width="224" stroke-linecap="round" pathLength="1" stroke-dasharray="1 2"/>
</g></svg>
<div class="word"><svg viewBox="0 0 3406 879"><g fill="${v.text}"><g transform="scale(1 -1) translate(0 -793)">${WORD.map(([x, d]) => `<path transform="translate(${x} 0)" d="${d}"/>`).join('')}</g></g></svg></div>
<div class="tag">우리 동네 산책 이웃</div>
</div></body></html>`;
}

(async () => {
  const args = process.argv.slice(2);
  const [name, out] = args.filter((a) => !a.startsWith('--'));
  const layer = (args.find((a) => a.startsWith('--layer=')) || '--layer=all').split('=')[1];
  const alpha = args.includes('--alpha');
  const still = args.includes('--still');
  const v = VARIANTS[name];
  if (!v || !out) throw new Error('usage: node render.js <' + Object.keys(VARIANTS).join('|') + '> <outDir> [--layer=all|mark|text] [--alpha] [--still]');
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 1 });
  await p.setContent(html(v, layer, alpha));
  await p.evaluate(() => document.fonts.ready);
  const n = Math.round(DURATION / 1000 * FPS);
  const frames = still ? [n - 1] : [...Array(n).keys()];
  for (const i of frames) {
    const t = i * 1000 / FPS;
    await p.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), t);
    await p.screenshot({ path: path.join(out, String(i).padStart(4, '0') + '.png'), omitBackground: alpha });
  }
  await b.close();
})();

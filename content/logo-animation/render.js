// 모두돌봄 로고 애니메이션: 프레임을 PNG로 렌더한다.
// node render.js <variant> <outDir>
//   variant: reel-light | reel-brand | square-light | square-brand
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FPS = 60;
const DURATION = 3200; // ms
const FONT_DIR = process.env.FONT_DIR || path.join(__dirname, 'fonts');

const VARIANTS = {
  'reel-light':   { w: 1080, h: 1920, bg: '#ffffff', mark: '#00733a', text: 'oklch(20% 0.01 150)', sub: 'oklch(40% 0.01 150)', symbol: 560, word: 150, tag: 54, cy: 0.44 },
  'reel-brand':   { w: 1080, h: 1920, bg: '#00733a', mark: '#ffffff', text: '#ffffff', sub: 'rgba(255,255,255,.86)', symbol: 560, word: 150, tag: 54, cy: 0.44 },
  'square-light': { w: 1080, h: 1080, bg: '#ffffff', mark: '#00733a', text: 'oklch(20% 0.01 150)', sub: 'oklch(40% 0.01 150)', symbol: 400, word: 112, tag: 42, cy: 0.47 },
  'square-brand': { w: 1080, h: 1080, bg: '#00733a', mark: '#ffffff', text: '#ffffff', sub: 'rgba(255,255,255,.86)', symbol: 400, word: 112, tag: 42, cy: 0.47 },
};

// 원본 심볼(modudolbom-symbol.svg)의 도형. 색만 바꿔 쓴다.
const P = {
  person: 'M 256 512 C 397.385 512 512 397.385 512 256 C 512 114.615 397.385 0 256 0 C 114.615 0 0 114.615 0 256 C 0 397.385 114.615 512 256 512 Z',
  pad: 'M 789.333 522.667 C 883.59 522.667 960 446.257 960 352 C 960 257.743 883.59 181.333 789.333 181.333 C 695.077 181.333 618.667 257.743 618.667 352 C 618.667 446.257 695.077 522.667 789.333 522.667 Z',
  toeL: 'M 618.667 213.333 C 654.013 213.333 682.667 184.68 682.667 149.333 C 682.667 113.987 654.013 85.333 618.667 85.333 C 583.32 85.333 554.667 113.987 554.667 149.333 C 554.667 184.68 583.32 213.333 618.667 213.333 Z',
  toeT: 'M 789.333 128 C 824.68 128 853.333 99.346 853.333 64 C 853.333 28.654 824.68 0 789.333 0 C 753.987 0 725.333 28.654 725.333 64 C 725.333 99.346 753.987 128 789.333 128 Z',
  toeR: 'M 960 213.333 C 995.346 213.333 1024 184.68 1024 149.333 C 1024 113.987 995.346 85.333 960 85.333 C 924.654 85.333 896 113.987 896 149.333 C 896 184.68 924.654 213.333 960 213.333 Z',
  smile: 'M 28.084 660.364 C 14.541 649.374 6.07 633.334 4.629 615.953 C 3.189 598.572 8.904 581.356 20.453 568.287 C 32.002 555.218 48.384 547.428 65.811 546.72 C 83.237 546.011 100.198 552.445 112.77 564.533 C 335.746 778.933 688.254 778.933 911.23 564.533 C 923.802 552.445 940.763 546.011 958.189 546.72 C 975.616 547.428 991.998 555.218 1003.547 568.287 C 1015.096 581.356 1020.811 598.572 1019.371 615.953 C 1017.93 633.334 1009.459 649.374 995.916 660.364 C 713.89 889.212 310.11 889.212 28.084 660.364 Z',
};

function html(v) {
  const pop = 'cubic-bezier(.34,1.56,.64,1)';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:P;font-weight:700;src:url(file://${FONT_DIR}/Pretendard-Bold.otf)}
@font-face{font-family:P;font-weight:500;src:url(file://${FONT_DIR}/Pretendard-Medium.otf)}
html,body{margin:0;width:${v.w}px;height:${v.h}px;background:${v.bg};overflow:hidden}
.stage{position:absolute;left:0;right:0;top:${v.h * v.cy}px;transform:translateY(-50%);display:flex;flex-direction:column;align-items:center}
svg{width:${v.symbol}px;height:${v.symbol * 832 / 1024}px;overflow:visible}
.part{transform-box:fill-box;transform-origin:center;animation-fill-mode:both;animation-play-state:paused}
#person{animation:pop 560ms ${pop} 0ms both}
#pad{animation:pop 520ms ${pop} 240ms both}
#toeL{animation:toe 380ms ${pop} 560ms both}
#toeT{animation:toe 380ms ${pop} 660ms both}
#toeR{animation:toe 380ms ${pop} 760ms both}
#draw{animation:draw 620ms cubic-bezier(.22,1,.36,1) 920ms both}
#mark{transform-box:fill-box;transform-origin:50% 100%;animation:nod 520ms cubic-bezier(.45,0,.55,1) 1500ms both}
@keyframes pop{0%{transform:scale(0)}100%{transform:scale(1)}}
@keyframes toe{0%{transform:translateY(40px) scale(0);opacity:0}30%{opacity:1}100%{transform:none;opacity:1}}
@keyframes draw{0%{stroke-dashoffset:1}100%{stroke-dashoffset:0}}
@keyframes nod{0%{transform:none}35%{transform:translateY(-14px) scale(1.025,.975)}70%{transform:translateY(3px) scale(.995,1.005)}100%{transform:none}}
.word,.tag{font-family:P;letter-spacing:-0.02em;white-space:nowrap;animation-fill-mode:both}
.word{color:${v.text};font-weight:700;font-size:${v.word}px;line-height:1.1;margin-top:${v.word * 0.62}px;animation:rise 560ms cubic-bezier(.22,1,.36,1) 1560ms both}
.tag{color:${v.sub};font-weight:500;font-size:${v.tag}px;line-height:1.3;margin-top:${v.tag * 0.4}px;animation:rise 560ms cubic-bezier(.22,1,.36,1) 1720ms both}
@keyframes rise{0%{opacity:0;transform:translateY(28px)}100%{opacity:1;transform:none}}
</style></head><body><div class="stage">
<svg viewBox="0 0 1024 832"><defs><mask id="m" maskUnits="userSpaceOnUse" x="-100" y="0" width="1224" height="1000">
<path id="draw" class="part" d="M -40 520 C 250 860 774 860 1064 520" pathLength="1" stroke="#fff" stroke-width="210" fill="none" stroke-dasharray="1 2"/>
</mask></defs>
<g id="mark" fill="${v.mark}">
<path id="person" class="part" d="${P.person}"/>
<path id="pad" class="part" d="${P.pad}"/>
<path id="toeL" class="part" d="${P.toeL}"/>
<path id="toeT" class="part" d="${P.toeT}"/>
<path id="toeR" class="part" d="${P.toeR}"/>
<path d="${P.smile}" mask="url(#m)"/>
</g></svg>
<div class="word">모두돌봄</div>
<div class="tag">우리 동네 산책 이웃</div>
</div></body></html>`;
}

(async () => {
  const [name, out] = process.argv.slice(2);
  const v = VARIANTS[name];
  if (!v || !out) throw new Error('usage: node render.js <' + Object.keys(VARIANTS).join('|') + '> <outDir>');
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 1 });
  await p.setContent(html(v));
  await p.evaluate(() => document.fonts.ready);
  const n = Math.round(DURATION / 1000 * FPS);
  for (let i = 0; i < n; i++) {
    const t = i * 1000 / FPS;
    await p.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), t);
    await p.screenshot({ path: path.join(out, String(i).padStart(4, '0') + '.png') });
  }
  await b.close();
})();

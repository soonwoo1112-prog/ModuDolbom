const { chromium } = require('playwright');
const path = require('path');
const F = path.join(__dirname, 'fonts');
const css = `
@font-face{font-family:P;font-weight:900;src:url(file://${F}/Pretendard-Black.otf)}
@font-face{font-family:P;font-weight:800;src:url(file://${F}/Pretendard-ExtraBold.otf)}
@font-face{font-family:P;font-weight:700;src:url(file://${F}/Pretendard-Bold.otf)}
@font-face{font-family:P;font-weight:600;src:url(file://${F}/Pretendard-SemiBold.otf)}
html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:P}
.cap{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center}
.t{color:#fff;font-weight:900;font-size:118px;letter-spacing:-4px;line-height:1.12;text-shadow:0 6px 40px rgba(0,0,0,.55),0 2px 8px rgba(0,0,0,.4)}
.s{color:#fff;font-weight:700;font-size:58px;letter-spacing:-1.5px;margin-top:22px;opacity:.92;text-shadow:0 4px 24px rgba(0,0,0,.6)}
.o{color:#FFB37A}
`;
const caps = {
  c1: `<div class="t">오늘도<br>혼자.</div>`,
  c2: `<div class="t">하루 <span class="o">9시간</span>.</div><div class="s">아무도 없는 집</div>`,
  c3: `<div class="t">산책,<br>하고 싶어.</div>`,
  c4: `<div class="t">옆집 <span class="o">이웃</span>이</div>`,
  c5: `<div class="t">대신<br>걸어줄게요.</div>`,
  c6: `<div class="t">지금 어디인지,</div><div class="s">실시간 GPS로</div>`,
  c7: `<div class="t">오늘의 산책,<br><span class="o">전부 기록</span>.</div><div class="s">사진 · 경로 · 배변까지</div>`,
};
const logo = `
<div class="cap" style="gap:0">
  <svg width="300" height="300" viewBox="0 0 120 120">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFB37A"/><stop offset="1" stop-color="#FF6B35"/></linearGradient></defs>
    <path d="M60 10 L108 50 Q112 54 108 58 L102 58 L102 100 Q102 110 92 110 L28 110 Q18 110 18 100 L18 58 L12 58 Q8 54 12 50 Z" fill="url(#g)"/>
    <g fill="#fff">
      <ellipse cx="60" cy="86" rx="15" ry="12.5"/>
      <ellipse cx="41" cy="70" rx="6.5" ry="8.5" transform="rotate(-20 41 70)"/>
      <ellipse cx="53" cy="60" rx="6.5" ry="8.8"/>
      <ellipse cx="67" cy="60" rx="6.5" ry="8.8"/>
      <ellipse cx="79" cy="70" rx="6.5" ry="8.5" transform="rotate(20 79 70)"/>
    </g>
  </svg>
  <div style="color:#fff;font-weight:900;font-size:150px;letter-spacing:-6px;margin-top:40px;text-shadow:0 6px 40px rgba(0,0,0,.35)">모두돌봄</div>
  <div style="color:#fff;font-weight:700;font-size:56px;letter-spacing:-1px;margin-top:18px;opacity:.95">우리 동네 산책 이웃</div>
</div>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const all = { ...Object.fromEntries(Object.entries(caps).map(([k, v]) => [k, `<div class="cap">${v}</div>`])), logo };
  for (const [k, v] of Object.entries(all)) {
    await p.setContent(`<style>${css}</style>${v}`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(150);
    await p.screenshot({ path: path.join(__dirname, 'png', k + '.png'), omitBackground: true });
  }
  await b.close();
})();

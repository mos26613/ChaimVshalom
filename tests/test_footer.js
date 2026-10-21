// The footer's Contact and Pages columns mirror each other around the middle on phones,
// and nothing makes the page scroll sideways.
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); let bad = 0;
 for (const w of [320, 360, 375, 390, 414, 600, 700]) {
   const p = await b.newPage({ viewport: { width: w, height: 800 } });
   await p.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
   const r = await p.evaluate(() => { const mid = innerWidth / 2; const cols = [...document.querySelectorAll('.footer-columns > div')];
     const box = el => el.getBoundingClientRect();
     const c = box(cols[1]), q = box(cols[2]);
     return { side: Math.abs(c.top - q.top) < 1, contactW: Math.round(c.width), pagesW: Math.round(q.width),
       // distance of each column's center from the middle of the screen (equal = symmetric)
       leftGap: Math.round(mid - (c.left + c.width / 2)), rightGap: Math.round((q.left + q.width / 2) - mid),
       overflow: document.documentElement.scrollWidth - innerWidth }; });
   const sym = !r.side || Math.abs(r.leftGap - r.rightGap) <= 1;
   console.log(String(w).padStart(4), 'px:', r.side ? `side by side | widths ${r.contactW} / ${r.pagesW} | centers from middle: left ${r.leftGap}, right ${r.rightGap}` : 'stacked', sym ? '' : ' <-- NOT SYMMETRIC', r.overflow > 0 ? ' OVERFLOW' : '');
   if (!sym || r.overflow > 0) bad++;
   if (process.argv[2]) await (await p.$('.site-footer')).screenshot({ path: `${process.argv[2]}/footer-${w}.png` });
   await p.close(); }
 process.exitCode = bad ? 1 : 0;   // tells run_all.sh whether this check passed
 console.log(bad ? `${bad} width(s) not symmetric/overflowing` : 'FOOTER SYMMETRIC, NO OVERFLOW'); await b.close(); })();

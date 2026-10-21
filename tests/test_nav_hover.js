// Header menu links: a pink (rose) underline appears while the mouse is over a link,
// and goes away when the mouse moves off. Checked on a computer and in the open phone menu.
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); let bad = 0;
 const fail = msg => { console.log('  FAIL:', msg); bad++; };
 const look = (p, sel) => p.$eval(sel, a => { const s = getComputedStyle(a); const rose = getComputedStyle(document.documentElement).getPropertyValue('--color-rose').trim();
   const hex = c => '#' + c.match(/\d+/g).slice(0, 3).map(n => (+n).toString(16).padStart(2, '0')).join('');
   return { line: s.textDecorationLine, color: hex(s.textDecorationColor), rose, thick: s.textDecorationThickness }; });
 for (const [w, h] of [[1280, 800], [768, 1024], [390, 844]]) {
   const p = await b.newPage({ viewport: { width: w, height: h } });
   await p.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' });
   if (w < 768) await p.click('.menu-toggle');
   const sel = '.site-nav a[href="about.html"]';
   const before = await look(p, sel);
   await p.hover(sel); await p.waitForTimeout(100);
   const on = await look(p, sel);
   await p.mouse.move(5, h - 5); await p.waitForTimeout(100);
   const after = await look(p, sel);
   if (before.line !== 'none') fail(`${w}px: underlined before hovering`);
   if (on.line !== 'underline' || on.color !== on.rose || on.thick !== '3px') fail(`${w}px: hover look ${JSON.stringify(on)}`);
   if (after.line !== 'none') fail(`${w}px: underline stays after the mouse leaves`);
   if (process.argv[2] && w === 1280) { await p.hover(sel); await p.screenshot({ path: `${process.argv[2]}/nav-hover-1280.png`, clip: { x: 0, y: 0, width: w, height: 270 } }); }
   console.log(String(w).padStart(5), 'px: hover underline', on.line, on.color);
   await p.close(); }
 process.exitCode = bad ? 1 : 0;   // tells run_all.sh whether this check passed
 console.log(bad ? `${bad} NAV HOVER PROBLEM(S)` : 'NAV HOVER CHECKS PASSED'); await b.close(); })();

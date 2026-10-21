// Home page logo intro: the first visit to Home in a tab shows the big logo in the middle;
// the first scroll / tap / key glides it exactly onto the header logo and the page stays at
// the top; it never repeats in that tab (other pages, back to Home, reload). Skipped for
// "reduce motion", and never shown on other pages.
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); let bad = 0;
 const fail = msg => { console.log('  FAIL:', msg); bad++; };
 const state = p => p.evaluate(() => { const i = document.querySelector('.intro'); const big = i && i.querySelector('.intro-logo');
   const hdr = document.querySelector('.brand-logo'), r = big && big.getBoundingClientRect(), t = hdr.getBoundingClientRect();
   return { on: document.documentElement.classList.contains('intro-on') && !!i && getComputedStyle(i).display !== 'none',
     big: r && { cx: Math.round(r.left + r.width / 2), cy: Math.round(r.top + r.height / 2), w: Math.round(r.width) },
     hdr: { cx: Math.round(t.left + t.width / 2), cy: Math.round(t.top + t.height / 2), w: Math.round(t.width), visible: getComputedStyle(hdr).visibility === 'visible' },
     scrollY, vw: innerWidth, vh: innerHeight, overflow: document.documentElement.scrollWidth - innerWidth }; });
 for (const [w, h, how] of [[320, 640, 'tap'], [390, 844, 'tap'], [768, 1024, 'key'], [1280, 800, 'wheel'], [1920, 1080, 'wheel']]) {
   const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: how === 'tap' });
   const p = await ctx.newPage();
   await p.goto('http://localhost:8765/', { waitUntil: 'load' }); await p.waitForTimeout(300);
   let s = await state(p);
   if (!s.on) { fail(`${w}px: intro did not show on the first visit`); await ctx.close(); continue; }
   if (Math.abs(s.big.cx - s.vw / 2) > 2 || Math.abs(s.big.cy - s.vh / 2) > 2 || s.big.w < s.hdr.w * 1.5) fail(`${w}px: big logo not large and centered ${JSON.stringify(s.big)}`);
   if (s.hdr.visible) fail(`${w}px: header logo visible behind the intro`);
   if (s.overflow > 0) fail(`${w}px: sideways scrolling during the intro`);
   // Measure where the big logo is at the moment its glide ends
   // (listening on the window first, before the page removes the intro)
   await p.evaluate(() => { const big = document.querySelector('.intro-logo');
     window.addEventListener('transitionend', e => { if (e.target !== big || window.landed) return;
       const r = big.getBoundingClientRect(), t = document.querySelector('.brand-logo').getBoundingClientRect();
       window.landed = { dx: Math.round(r.left + r.width / 2 - (t.left + t.width / 2)), dy: Math.round(r.top + r.height / 2 - (t.top + t.height / 2)), dw: Math.round(r.width - t.width) }; }, true); });
   if (how === 'tap') await p.tap('.intro'); else if (how === 'key') await p.keyboard.press('ArrowDown'); else await p.mouse.wheel(0, 400);
   await p.waitForTimeout(2300);
   const landed = await p.evaluate(() => window.landed || null);
   if (!landed || Math.abs(landed.dx) > 2 || Math.abs(landed.dy) > 2 || Math.abs(landed.dw) > 2)
     fail(`${w}px: big logo did not land on the header logo ${JSON.stringify(landed)}`);
   s = await state(p);
   if (s.on || !s.hdr.visible) fail(`${w}px: intro still showing after the glide`);
   if (s.scrollY !== 0) fail(`${w}px: page scrolled during the intro (${s.scrollY}px)`);
   await p.mouse.wheel(0, 400); await p.waitForTimeout(400);
   if ((await p.evaluate(() => scrollY)) === 0) fail(`${w}px: page doesn't scroll after the intro`);
   // Same tab: other page, back to Home, reload: no intro
   await p.goto('http://localhost:8765/classes.html', { waitUntil: 'load' });
   if ((await state(p)).on) fail(`${w}px: intro shown on the Classes page`);
   await p.goto('http://localhost:8765/index.html', { waitUntil: 'load' }); await p.waitForTimeout(200);
   if ((await state(p)).on) fail(`${w}px: intro repeated when coming back to Home`);
   await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(200);
   if ((await state(p)).on) fail(`${w}px: intro repeated after reload`);
   console.log(String(w).padStart(5), `px: intro shows once, glides onto the header logo (${how})`);
   await ctx.close(); }
 // A visit that starts on another page: no intro there
 let ctx = await b.newContext(); let p = await ctx.newPage();
 await p.goto('http://localhost:8765/about.html', { waitUntil: 'load' });
 if ((await state(p)).on) fail('intro shown on the About page'); await ctx.close();
 // "Reduce motion": no intro
 ctx = await b.newContext({ reducedMotion: 'reduce' }); p = await ctx.newPage();
 await p.goto('http://localhost:8765/', { waitUntil: 'load' });
 if ((await state(p)).on) fail('intro shown although the device asks to reduce motion'); else console.log('reduce motion: no intro');
 await ctx.close();
 // Screenshot of the intro for the record
 if (process.argv[2]) { ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); p = await ctx.newPage();
   await p.goto('http://localhost:8765/', { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
   await p.screenshot({ path: `${process.argv[2]}/intro-390.png` }); await ctx.close(); }
 console.log(bad ? `${bad} INTRO PROBLEM(S)` : 'INTRO CHECKS PASSED'); await b.close(); })();

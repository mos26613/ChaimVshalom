// The scroll fade-in: items fade in gradually as they come up the screen, never fade back out,
// nothing is left hidden at the bottom of any page, and reduce-motion / no JavaScript / printing
// show everything.
const { chromium } = require('playwright');
const pages = ['index','about','classes','events','support','contact','privacy'];
// the same items the script fades: sections without cards; otherwise their headings + each card
const ITEMS = `(() => { const out = []; document.querySelectorAll('main section').forEach(s => { const c = s.querySelectorAll('.card');
  if (!c.length) out.push(s); else { [...s.children].filter(e => /^H[1-6]$/.test(e.tagName)).forEach(e => out.push(e)); c.forEach(e => out.push(e)); } }); return out; })()`;
(async () => { const b = await chromium.launch(); let bad = 0; const fail = m => { bad++; console.log('PROBLEM:', m); };
 const state = p => p.evaluate(`${ITEMS}.map(e => ({ op: +getComputedStyle(e).opacity, top: e.getBoundingClientRect().top - (new DOMMatrix(getComputedStyle(e).transform).m42), card: e.classList.contains('card') }))`);
 // 1. cards fade individually; 2. only fade in, never out
 { const p = await b.newPage({ viewport: { width: 390, height: 700 } });
   await p.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1000);
   const st = await state(p); console.log('home page items:', st.length, '(cards:', st.filter(s => s.card).length + ')');
   for (const s of st) { if (s.top <= 490 && s.op !== 1) fail('on-screen item not shown at load'); if (s.top >= 700 && s.op !== 0) fail('item below the screen not hidden at load'); }
   const lastCard = st.length - 1;
   const at = async frac => {
     await p.evaluate(({ f, i, src }) => { const e = eval(src)[i]; window.scrollTo(0, e.getBoundingClientRect().top + scrollY - innerHeight * f); }, { f: frac, i: lastCard, src: ITEMS });
     await p.waitForTimeout(150); return (await state(p))[lastCard].op; };
   const a = await at(0.95), m = await at(0.85), backDown = await at(0.97), full = await at(0.6), back2 = await at(1.05);
   console.log(`last card opacity — top at 95%: ${a.toFixed(2)}, 85%: ${m.toFixed(2)}, scrolled back to 97%: ${backDown.toFixed(2)}, 60%: ${full.toFixed(2)}, scrolled back below the screen: ${back2.toFixed(2)}`);
   if (!(a > 0 && m > a && Math.abs(backDown - m) < 0.01 && full === 1 && back2 === 1)) fail('cards do not fade in gradually and stay shown');
   await p.close(); }
 // 3. hover lift still works on cards after they faded in (computer)
 { const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
   await p.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' }); await p.keyboard.press('End'); await p.waitForTimeout(1200);
   await p.hover('main .card'); await p.waitForTimeout(400);
   const t = await p.evaluate(() => getComputedStyle(document.querySelector('main .card')).transform);
   console.log('card hover after fade-in:', t); if (t !== 'matrix(1, 0, 0, 1, 0, -3)') fail('card hover lift broken');
   await p.close(); }
 // 4. everything fully shown at the bottom of every page, many sizes
 for (const [w, h] of [[390, 600], [390, 844], [600, 900], [800, 1280], [1280, 800], [1920, 1080]]) {
   const p = await b.newPage({ viewport: { width: w, height: h } });
   for (const pg of pages) {
     await p.goto(`http://localhost:8765/${pg}.html`, { waitUntil: 'networkidle' }); await p.keyboard.press('End'); await p.waitForTimeout(900);
     if ((await state(p)).some(s => s.op !== 1)) fail(`${w}x${h} ${pg}: not fully shown after End key`);
     await p.goto(`http://localhost:8765/${pg}.html`, { waitUntil: 'networkidle' });
     for (let y = 0; y < 3500; y += 150) { await p.mouse.wheel(0, 150); await p.waitForTimeout(40); } await p.waitForTimeout(900);
     if ((await state(p)).some(s => s.op !== 1)) fail(`${w}x${h} ${pg}: not fully shown after scrolling down`);
     await p.keyboard.press('Home'); await p.waitForTimeout(500);
     if ((await state(p)).some(s => s.op !== 1)) fail(`${w}x${h} ${pg}: something faded out after scrolling back to the top`); }
   await p.close(); }
 console.log('bottom-of-page and back-to-top checks done at 6 sizes x 7 pages');
 // 5. reduced motion, no JavaScript, printing
 for (const [label, opts, media] of [['reduced motion', { reducedMotion: 'reduce' }, null], ['no JavaScript', { javaScriptEnabled: false }, null], ['print', {}, 'print']]) {
   const ctx = await b.newContext({ viewport: { width: 390, height: 700 }, ...opts });
   for (const pg of pages) { const p = await ctx.newPage(); if (media) await p.emulateMedia({ media });
     await p.goto(`http://localhost:8765/${pg}.html`, { waitUntil: 'networkidle' }); await p.waitForTimeout(300);
     if ((await state(p)).some(s => s.op !== 1)) fail(`${pg}: hidden with ${label}`); await p.close(); }
   console.log(label + ': all pages fully shown'); await ctx.close(); }
 process.exitCode = bad ? 1 : 0;   // tells run_all.sh whether this check passed
 console.log(bad ? `${bad} problem(s)` : 'FADE CHECKS PASSED'); await b.close(); })();

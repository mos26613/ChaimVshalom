// Header decorations. Watercolor washes behind the header on every screen; on computers
// (1024px+) an open-book medallion on each side of the pesukim arc, mirrored exactly around
// the centre and clear of the arc text and the בס״ד line. Once the page is scrolled on large
// screens, the stuck links row is plain again (no washes, just the pastel line).
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); let bad = 0;
 const fail = msg => { console.log('  FAIL:', msg); bad++; };
 const look = () => { const h = document.querySelector('.site-header'), cs = getComputedStyle(h);
   const side = which => { const s = getComputedStyle(h, which); if (s.content === 'none' || s.display === 'none') return null;
     const hr = h.getBoundingClientRect(), l = parseFloat(s.left), r = parseFloat(s.right), w = parseFloat(s.width), t = parseFloat(s.top), hh = parseFloat(s.height);
     const left = which === '::before' ? hr.right - r - w : hr.left + l; return { left, right: left + w, top: hr.top + t, bottom: hr.top + t + hh, img: s.backgroundImage, flip: s.transform }; };
   const arc = [...document.querySelectorAll('.brand-arc')].find(a => getComputedStyle(a).display !== 'none');
   const texts = [...arc.querySelectorAll('text')].map(t => t.getBoundingClientRect());
   return { washes: (cs.backgroundImage.match(/radial-gradient/g) || []).length, line: cs.backgroundImage.includes('linear-gradient'), stuck: h.classList.contains('is-stuck'),
     before: side('::before'), after: side('::after'), mid: innerWidth / 2,
     arcL: Math.min(...texts.map(r => r.left)), arcR: Math.max(...texts.map(r => r.right)), bsd: document.querySelector('.bsd').getBoundingClientRect().bottom,
     overflow: document.documentElement.scrollWidth - innerWidth }; };
 for (const [w, h] of [[320, 640], [390, 844], [768, 1024], [1024, 768], [1280, 800], [1920, 1080]]) {
   const p = await b.newPage({ viewport: { width: w, height: h } });
   for (const pg of ['index', 'about']) {
     await p.goto(`http://localhost:8765/${pg}.html`, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
     const r = await p.evaluate(look); const problems = [];
     if (r.washes !== 5 || !r.line) problems.push(`washes ${r.washes}, line ${r.line}`);
     if (r.overflow > 0) problems.push('sideways scrolling');
     if (w >= 1024) {
       if (!r.before || !r.after) problems.push('medallions missing');
       else {
         if (!r.before.img.includes('header-book.svg')) problems.push('wrong drawing');
         if (!r.after.flip.startsWith('matrix(-1')) problems.push('right medallion not mirrored');
         if (Math.abs((r.mid - r.before.right) - (r.after.left - r.mid)) > 1 || Math.abs(r.before.top - r.after.top) > 0.5) problems.push('medallions not symmetric');
         if (r.before.right > r.arcL - 8 || r.after.left < r.arcR + 8) problems.push('medallions touch the arc');
         if (r.before.left < 0 || r.after.right > w) problems.push('medallions off screen');
         if (r.before.top < r.bsd) problems.push('medallions overlap the בס״ד line');
       }
     } else if (r.before || r.after) problems.push('medallions shown on a small screen');
     if (problems.length) fail(`${w}px ${pg}: ${problems.join('; ')}`);
   }
   // scrolled: large screens → plain stuck row; phones keep the washes on the header
   await p.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' });
   await p.evaluate(() => window.scrollTo(0, 900)); await p.waitForTimeout(200);
   const s = await p.evaluate(look);
   if (w >= 768 && (!s.stuck || s.washes !== 0 || !s.line)) fail(`${w}px scrolled: stuck row not plain (${JSON.stringify({ stuck: s.stuck, washes: s.washes, line: s.line })})`);
   if (w < 768 && s.stuck) fail(`${w}px scrolled: header marked stuck on a phone`);
   await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(200);
   const t = await p.evaluate(look);
   if (t.stuck || t.washes !== 5) fail(`${w}px back at the top: washes not back`);
   if (process.argv[2] && (w === 1280 || w === 1920)) await p.screenshot({ path: `${process.argv[2]}/header-decor-${w}.png`, clip: { x: 0, y: 0, width: w, height: 360 } });
   console.log(String(w).padStart(5), `px: washes${w >= 1024 ? ', book medallions symmetric' : ''}${w >= 768 ? ', plain stuck row when scrolled' : ''}`);
   await p.close(); }
 process.exitCode = bad ? 1 : 0;   // tells run_all.sh whether this check passed
 console.log(bad ? `${bad} HEADER DECORATION PROBLEM(S)` : 'HEADER DECORATION CHECKS PASSED'); await b.close(); })();

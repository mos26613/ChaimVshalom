// The pesukim arc over the logo. Larger screens: the text's outer edges line up with the
// start of the word "Home" and the end of "Contact Us", the gold diamond is centered over
// the logo, and the text doesn't touch the logo or the links. Phones: the small arc fits on
// screen and clears the Menu button. Text navy, diamond gold. During the Home page intro
// the arc stays visible.
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); let bad = 0;
 const fail = msg => { console.log('  FAIL:', msg); bad++; };
 const measure = () => { const vis = [...document.querySelectorAll('.brand-arc')].find(s => getComputedStyle(s).display !== 'none');
   const texts = [...vis.querySelectorAll('.arc-text')].map(t => t.getBoundingClientRect());
   const box = { left: Math.min(...texts.map(r => r.left)), right: Math.max(...texts.map(r => r.right)),
     top: Math.min(...texts.map(r => r.top)), bottom: Math.max(...texts.map(r => r.bottom)) };
   const mark = vis.querySelector('.arc-mark').getBoundingClientRect(), logo = document.querySelector('.brand-logo').getBoundingClientRect();
   const words = a => { const r = document.createRange(); r.selectNodeContents(a); return r.getBoundingClientRect(); };
   const links = document.querySelectorAll('.site-nav a'), home = words(links[0]), contact = words(links[links.length - 1]);
   const btn = document.querySelector('.menu-toggle').getBoundingClientRect();
   const cs = getComputedStyle(vis.querySelector('.arc-text')), ms = getComputedStyle(vis.querySelector('.arc-mark'));
   return { which: vis.classList.contains('arc-wide') ? 'wide' : 'narrow', text: [...vis.querySelectorAll('.arc-text')].map(t => t.textContent).join(' | '),
     box, markX: (mark.left + mark.right) / 2, markBottom: mark.bottom, logo: { left: logo.left, right: logo.right, top: logo.top, cx: (logo.left + logo.right) / 2 },
     home: home.left, contact: contact.right, navTop: links[0].getBoundingClientRect().top, btn: { left: btn.left, top: btn.top, w: btn.width },
     barTop: document.querySelector('.header-bar').getBoundingClientRect().top,
     fill: cs.fill, markFill: ms.fill, font: cs.fontFamily, overflow: document.documentElement.scrollWidth - innerWidth }; };
 for (const [w, h] of [[320, 640], [390, 844], [600, 900], [768, 1024], [1024, 768], [1280, 800], [1920, 1080]]) {
   const p = await b.newPage({ viewport: { width: w, height: h } });
   for (const pg of ['index', 'classes']) {
     await p.goto(`http://localhost:8765/${pg}.html`, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
     const r = await p.evaluate(measure);
     const problems = [];
     if (r.text !== 'עץ חיים היא למחזיקים בה | ה׳ יברך את עמו בשלום') problems.push('text ' + r.text);
     if (r.fill !== 'rgb(15, 31, 80)' || r.markFill !== 'rgb(196, 154, 92)' || !r.font.includes('Frank Ruhl Libre')) problems.push(`colors/font ${r.fill} ${r.markFill} ${r.font}`);
     if (Math.abs(r.markX - r.logo.cx) > 1.5) problems.push(`diamond ${(r.markX - r.logo.cx).toFixed(1)}px off the logo's centre`);
     if (r.box.left < 0 || r.box.right > w || r.overflow > 0) problems.push('arc off screen');
     if (r.box.top < r.barTop - 1) problems.push('arc sticks out above the header bar');
     if (r.markBottom > r.logo.top) problems.push('diamond touches the logo');
     if (r.which === 'wide') {
       if (w < 768) problems.push('wide arc on a phone');
       if (Math.abs(r.box.left - r.home) > 2) problems.push(`left edge ${(r.box.left - r.home).toFixed(1)}px from the start of "Home"`);
       if (Math.abs(r.box.right - r.contact) > 2) problems.push(`right edge ${(r.box.right - r.contact).toFixed(1)}px from the end of "Contact Us"`);
       if (r.box.bottom > r.navTop) problems.push('arc text overlaps the menu links');
     } else {
       if (w >= 768) problems.push('small arc on a large screen');
       if (r.box.right > r.btn.left && r.box.bottom > r.btn.top) problems.push('arc overlaps the Menu button');
     }
     if (problems.length) fail(`${w}px ${pg}: ${problems.join('; ')}`);
     else if (pg === 'index') console.log(String(w).padStart(5), `px: ${r.which} arc OK` + (r.which === 'wide' ? ` (edges ${(r.box.left - r.home).toFixed(1)} / ${(r.box.right - r.contact).toFixed(1)}px from Home / Contact Us, diamond ${(r.markX - r.logo.cx).toFixed(1)}px from centre)` : ''));
   }
   if (process.argv[2] && (w === 1280 || w === 390)) { await p.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
     await p.screenshot({ path: `${process.argv[2]}/arc-${w}.png`, clip: { x: 0, y: 0, width: w, height: w > 700 ? 380 : 330 } }); }
   await p.close(); }
 // During the Home page intro the arc is visible on top of the intro screen (phone and computer)
 for (const [w, h] of [[390, 844], [1280, 800]]) {
   const ctx = await b.newContext({ viewport: { width: w, height: h } }); const p = await ctx.newPage();
   await p.addInitScript(() => sessionStorage.removeItem('intro-seen'));
   await p.goto('http://localhost:8765/', { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
   const seen = await p.evaluate(() => { if (!document.documentElement.classList.contains('intro-on')) return 'no intro';
     const vis = [...document.querySelectorAll('.brand-arc')].find(s => getComputedStyle(s).display !== 'none');
     vis.style.pointerEvents = 'auto';   // the arc normally ignores the mouse, which would hide it from elementFromPoint
     const r = vis.querySelector('.arc-mark').getBoundingClientRect(); const hit = document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2);
     return hit && hit.closest('.brand-arc') ? 'visible' : 'hidden under ' + (hit && hit.className); });
   if (seen !== 'visible') fail(`${w}px intro: arc ${seen}`); else console.log(String(w).padStart(5), 'px: arc visible during the intro');
   await ctx.close(); }
 process.exitCode = bad ? 1 : 0;   // tells run_all.sh whether this check passed
 console.log(bad ? `${bad} ARC PROBLEM(S)` : 'ARC CHECKS PASSED'); await b.close(); })();

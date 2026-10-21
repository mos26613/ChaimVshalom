// Sticky header. Large screens: after scrolling, only the row of page links stays at the
// top (logo scrolled away), on top of the page, and clickable; jumping to #registration
// isn't hidden behind it. Phones: the header scrolls away, but the Menu button stays in the
// top-right corner (without jumping) and its menu box opens under it.
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); let bad = 0;
 const fail = msg => { console.log('  FAIL:', msg); bad++; };
 for (const [w, h] of [[768, 1024], [1024, 768], [1280, 800], [1920, 1080]]) {
   const p = await b.newPage({ viewport: { width: w, height: h } });
   for (const pg of ['index', 'about', 'classes']) {
     await p.goto(`http://localhost:8765/${pg}.html`, { waitUntil: 'load' });
     const top0 = await p.evaluate(() => document.getElementById('site-nav').getBoundingClientRect().top);
     await p.evaluate(() => window.scrollTo(0, 900)); await p.waitForTimeout(100);
     const r = await p.evaluate(() => { const nav = document.getElementById('site-nav').getBoundingClientRect();
       const logo = document.querySelector('.brand-logo').getBoundingClientRect();
       const link = document.querySelector('.site-nav a[href="events.html"]').getBoundingClientRect();
       const hit = document.elementFromPoint(link.left + link.width / 2, link.top + link.height / 2);
       return { navTop: Math.round(nav.top), navBottom: Math.round(nav.bottom), logoGone: logo.bottom <= 0, onTop: !!(hit && hit.closest('.site-nav')),
         scrolled: scrollY, overflow: document.documentElement.scrollWidth - innerWidth }; });
     if (r.scrolled < 100) { console.log(`  (${w}px ${pg}: page too short to scroll)`); continue; }
     if (Math.abs(r.navTop) > 1 || !r.logoGone || !r.onTop || r.overflow > 0) fail(`${w}px ${pg}: ${JSON.stringify(r)}`);
     await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(100);
     const top1 = await p.evaluate(() => document.getElementById('site-nav').getBoundingClientRect().top);
     if (Math.abs(top1 - top0) > 1) fail(`${w}px ${pg}: header looks different at the top of the page (${top0} vs ${top1})`);
   }
   // A link in the stuck row still works, and jumping to Registration isn't hidden under the row.
   await p.goto('http://localhost:8765/about.html', { waitUntil: 'load' }); await p.evaluate(() => window.scrollTo(0, 900));
   await p.click('.site-nav a[href="classes.html"]'); await p.waitForLoadState('load');
   if (!p.url().endsWith('classes.html')) fail(`${w}px: stuck link did not open Classes`);
   await p.click('.register-float'); await p.waitForTimeout(600);
   const gap = await p.evaluate(() => document.querySelector('#registration h2').getBoundingClientRect().top - document.getElementById('site-nav').getBoundingClientRect().bottom);
   if (gap < 0) fail(`${w}px: Registration heading is hidden under the links row (${gap}px)`);
   if (process.argv[2] && w === 1280) { await p.evaluate(() => window.scrollTo(0, 1100)); await p.waitForTimeout(200);
     await p.screenshot({ path: `${process.argv[2]}/sticky-1280.png` }); }
   console.log(String(w).padStart(5), 'px: links row stays at the top');
   await p.close(); }
 for (const w of [320, 390, 600]) {
   const p = await b.newPage({ viewport: { width: w, height: 800 } });
   await p.goto('http://localhost:8765/about.html', { waitUntil: 'load' });
   await p.evaluate(() => window.scrollTo(0, 900)); await p.waitForTimeout(100);
   const gone = await p.evaluate(() => document.querySelector('.brand-logo').getBoundingClientRect().bottom <= 0 && getComputedStyle(document.querySelector('.site-header')).position !== 'sticky');
   if (!gone) fail(`${w}px: header should scroll away on phones`);
   // The Menu button: in its usual place at the top of the page, then pinned to the top-right
   // corner while scrolling, without jumping; the menu box opens under it and works.
   await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(100);
   const btn = () => p.evaluate(() => { const r = document.querySelector('.menu-toggle').getBoundingClientRect();
     return { top: Math.round(r.top), right: Math.round(innerWidth - r.right), fixed: getComputedStyle(document.querySelector('.menu-toggle')).position === 'fixed' }; });
   const start = await btn();
   if (start.fixed) fail(`${w}px: Menu button pinned before scrolling`);
   let prev = start.top, jump = 0;
   for (let y = 10; y <= 400; y += 10) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(30);
     const now = await btn(); jump = Math.max(jump, Math.abs(prev - now.top) - 10); prev = now.top; }
   const end = await btn();
   if (!end.fixed || end.top !== 12 || end.right !== 16) fail(`${w}px: Menu button not in the top-right corner after scrolling ${JSON.stringify(end)}`);
   if (jump > 1) fail(`${w}px: Menu button jumped by ${jump}px while scrolling`);
   await p.evaluate(() => window.scrollTo(0, 900)); await p.waitForTimeout(100);
   await p.click('.menu-toggle');
   const box = await p.evaluate(() => { const n = document.getElementById('site-nav').getBoundingClientRect(), bt = document.querySelector('.menu-toggle').getBoundingClientRect();
     const hit = document.elementFromPoint((n.left + n.right) / 2, n.bottom - 10);
     return { visible: n.height > 0, below: n.top >= bt.bottom && n.top - bt.bottom < 12, inside: n.left >= 0 && n.right <= innerWidth && n.bottom <= innerHeight, onTop: !!(hit && hit.closest('#site-nav')) }; });
   if (!box.visible || !box.below || !box.inside || !box.onTop) fail(`${w}px: menu box after scrolling ${JSON.stringify(box)}`);
   if (process.argv[2] && w === 390) await p.screenshot({ path: `${process.argv[2]}/menu-floating-390.png` });
   await p.mouse.click(w / 2, 600);
   if (await p.isVisible('.site-nav')) fail(`${w}px: tap outside did not close the menu`);
   await p.click('.menu-toggle'); await p.click('.site-nav a[href="contact.html"]'); await p.waitForLoadState('load');
   if (!p.url().endsWith('contact.html')) fail(`${w}px: menu link did not work after scrolling`);
   console.log(String(w).padStart(5), 'px: header scrolls away, Menu button stays in the corner (phone)');
   await p.close(); }
 process.exitCode = bad ? 1 : 0;   // tells run_all.sh whether this check passed
 console.log(bad ? `${bad} STICKY HEADER PROBLEM(S)` : 'STICKY HEADER CHECKS PASSED'); await b.close(); })();

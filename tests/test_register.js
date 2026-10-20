// The floating "Register for classes" button: on every page, inside the screen,
// never covering the footer links, and one click reaches the Registration section.
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); let bad = 0;
 const pages = ['index', 'about', 'classes', 'events', 'support', 'contact', 'privacy'];
 const fail = msg => { console.log('  FAIL:', msg); bad++; };
 for (const [w, h] of [[320, 640], [390, 844], [768, 1024], [1280, 800]]) {
   const p = await b.newPage({ viewport: { width: w, height: h } });
   for (const pg of pages) {
     await p.goto(`http://localhost:8765/${pg}.html`, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
     const r = await p.evaluate(() => { const a = document.querySelector('.register-float'); if (!a) return null;
       const box = a.getBoundingClientRect();
       return { text: a.textContent.trim(), href: a.getAttribute('href'), fixed: getComputedStyle(a).position === 'fixed',
         inside: box.left >= 0 && box.right <= innerWidth && box.bottom <= innerHeight,
         overflow: document.documentElement.scrollWidth - innerWidth }; });
     if (!r) { fail(`${w}px ${pg}: no button`); continue; }
     if (!r.text.includes('Register for classes') || r.href !== 'classes.html#registration' || !r.fixed || !r.inside || r.overflow > 0)
       fail(`${w}px ${pg}: ${JSON.stringify(r)}`);
   }
   // At the very bottom of the page, the button must not cover the footer links
   // (covering the copyright line is fine, as the maintainer decided).
   await p.goto('http://localhost:8765/about.html', { waitUntil: 'networkidle' });
   await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(300);
   const covered = await p.evaluate(() => { const a = document.querySelector('.register-float').getBoundingClientRect();
     // measure the text itself (a Range), not the full-width line it sits on
     return [...document.querySelectorAll('.footer-columns a')].filter(el => { const rg = document.createRange(); rg.selectNodeContents(el); const r = rg.getBoundingClientRect();
       return r.left < a.right && r.right > a.left && r.top < a.bottom && r.bottom > a.top; }).map(el => el.textContent.trim()); });
   if (covered.length) fail(`${w}px: button covers ${covered.join(', ')}`);
   // One click from the home page shows the Registration section.
   await p.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' });
   await p.click('.register-float'); await p.waitForLoadState('networkidle'); await p.waitForTimeout(300);
   const seen = await p.evaluate(() => { const s = document.getElementById('registration'); if (!s) return false;
     const r = s.querySelector('h2').getBoundingClientRect(); return location.hash === '#registration' && r.top >= 0 && r.bottom <= innerHeight; });
   if (!seen) fail(`${w}px: click did not show the Registration section`);
   console.log(String(w).padStart(5), 'px: checked');
   await p.close(); }
 // Keyboard: Tab reaches the button; printing hides it.
 const p = await b.newPage({ viewport: { width: 390, height: 844 } });
 await p.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' });
 let reached = false; for (let i = 0; i < 30 && !reached; i++) { await p.keyboard.press('Tab');
   reached = await p.evaluate(() => document.activeElement.classList.contains('register-float')); }
 if (!reached) fail('Tab never reaches the button'); else console.log('keyboard: Tab reaches the button');
 await p.emulateMedia({ media: 'print' });
 if (await p.isVisible('.register-float')) fail('button shows when printing'); else console.log('print: button hidden');
 if (process.argv[2]) { await p.emulateMedia({ media: 'screen' }); await p.screenshot({ path: `${process.argv[2]}/register-390.png` }); }
 console.log(bad ? `${bad} REGISTER BUTTON PROBLEM(S)` : 'REGISTER BUTTON CHECKS PASSED'); await b.close(); })();

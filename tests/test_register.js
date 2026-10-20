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
 // The "Sign up here" button on the Classes page opens the Google Form in a new tab.
 for (const w of [320, 390, 1280]) {
   const p = await b.newPage({ viewport: { width: w, height: 800 } });
   await p.goto('http://localhost:8765/classes.html', { waitUntil: 'networkidle' });
   const r = await p.evaluate(() => { const a = document.querySelector('#registration .button--signup'); if (!a) return null;
     const box = a.getBoundingClientRect();
     return { text: a.textContent.trim(), href: a.href, target: a.target, rel: a.rel,
       inside: box.left >= 0 && box.right <= innerWidth, overflow: document.documentElement.scrollWidth - innerWidth }; });
   if (!r || r.text !== '📝 Sign up here' || r.href !== 'https://forms.gle/sbRKyN59JcLqJEvbA' || r.target !== '_blank'
       || !r.rel.includes('noopener') || !r.inside || r.overflow > 0) fail(`${w}px sign-up button: ${JSON.stringify(r)}`);
   else console.log(String(w).padStart(5), 'px: Sign up button OK');
   await p.close(); }
 // Classes page layout: Sign up, then the leaf divider, then "Have a question?", and
 // "Share with a friend" in its own narrow, centered box further down.
 for (const w of [320, 390, 768, 1280]) {
   const p = await b.newPage({ viewport: { width: w, height: 800 } });
   await p.goto('http://localhost:8765/classes.html', { waitUntil: 'networkidle' });
   const r = await p.evaluate(() => { const reg = document.getElementById('registration');
     const kids = [...reg.children].map(el => el.matches('hr.leaf-divider') ? 'divider' : el.querySelector('.button--signup') ? 'signup'
       : /Have a question/.test(el.textContent) ? 'question' : '');
     const order = kids.filter(Boolean).join(' > ');
     const box = document.querySelector('.share-box'), bb = box && box.getBoundingClientRect(), hr = reg.querySelector('hr.leaf-divider');
     return { order, shareInReg: !!reg.querySelector('a[href*="wa.me/?text"]'), shareInBox: !!(box && box.querySelector('a[href*="wa.me/?text"]')),
       boxAfter: !!box && reg.compareDocumentPosition(box) === Node.DOCUMENT_POSITION_FOLLOWING,
       boxW: bb && Math.round(bb.width), centered: bb && Math.abs((bb.left + bb.right) / 2 - innerWidth / 2) <= 1,
       divider: hr && hr.getBoundingClientRect().height > 0 && getComputedStyle(hr).backgroundImage.includes('svg'),
       overflow: document.documentElement.scrollWidth - innerWidth }; });
   const okW = r.boxW <= 30 * 16 + 1;
   if (r.order !== 'signup > divider > question' || r.shareInReg || !r.shareInBox || !r.boxAfter || !okW || !r.centered || !r.divider || r.overflow > 0)
     fail(`${w}px Classes layout: ${JSON.stringify(r)}`);
   else console.log(String(w).padStart(5), `px: layout OK (share box ${r.boxW}px wide)`);
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

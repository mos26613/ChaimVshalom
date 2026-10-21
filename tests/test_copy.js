const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); let bad = 0; const fail = m => { bad++; console.log('PROBLEM:', m); };
 const pop = p => p.evaluate(() => { const e = document.querySelector('.popover'); const r = e.getBoundingClientRect();
   return { op: +getComputedStyle(e).opacity, l: r.left, r: r.right, w: innerWidth, label: document.querySelector('.copy-label').textContent, icon: document.querySelector('.copy-icon').textContent, status: document.querySelector('.copy-status').textContent }; });
 // 1. mouse
 for (const w of [800, 1280, 1920]) {
   const ctx = await b.newContext({ viewport: { width: w, height: 800 } }); await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
   const p = await ctx.newPage(); await p.goto('http://localhost:8765/contact.html', { waitUntil: 'networkidle' });
   const link = p.locator('.has-popover > a'); await link.scrollIntoViewIfNeeded(); await p.waitForTimeout(1200);
   if ((await pop(p)).op !== 0) fail(w + ': popover visible before hover');
   await link.hover(); await p.waitForTimeout(300); let s = await pop(p);
   if (s.op !== 1) fail(w + ': popover not shown on hover'); if (s.l < 0 || s.r > s.w) fail(w + ': popover off screen');
   // move the mouse slowly from the link up into the Copy button, through the gap
   const lb = await link.boundingBox(), bb = await p.locator('.copy-button').boundingBox();
   await p.mouse.move(lb.x + lb.width / 2, lb.y + 2); await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 15 }); await p.waitForTimeout(200);
   if ((await pop(p)).op !== 1) fail(w + ': popover closed while moving the mouse to it');
   if (w === 1280) { const f = await p.locator('.site-footer').boundingBox(); await p.screenshot({ path: process.argv[2] + '/popover.png', clip: { x: 300, y: f.y - 30, width: 700, height: 230 } }); }
   await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(300); s = await pop(p);
   const clip = await p.evaluate(() => navigator.clipboard.readText());
   if (clip !== 'cvswomenslc@gmail.com') fail(w + ': clipboard has ' + JSON.stringify(clip));
   if (s.label !== 'Copied!' || s.icon !== '✅' || s.status !== 'Email address copied') fail(w + ': no Copied! feedback ' + JSON.stringify(s));
   if (w === 1280) { const f = await p.locator('.site-footer').boundingBox(); await p.screenshot({ path: process.argv[2] + '/copied.png', clip: { x: 300, y: f.y - 30, width: 700, height: 230 } }); }
   // It stays "Copied!" and a second click copies nothing, until the page is loaded again
   await p.waitForTimeout(2500); s = await pop(p);
   if (s.label !== 'Copied!' || s.icon !== '✅') fail(w + ': "Copied!" did not stay ' + JSON.stringify(s));
   if ((await p.getAttribute('.copy-button', 'aria-disabled')) !== 'true') fail(w + ': button not marked as done');
   await p.evaluate(() => navigator.clipboard.writeText('something else'));
   await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(300);
   if ((await p.evaluate(() => navigator.clipboard.readText())) !== 'something else') fail(w + ': second click copied again');
   const cursor = await p.evaluate(() => getComputedStyle(document.querySelector('.copy-button')).cursor);
   if (cursor !== 'default') fail(w + ': button still looks clickable after copying (' + cursor + ')');
   await p.reload({ waitUntil: 'networkidle' }); s = await pop(p);
   if (s.label !== 'Copy' || s.icon !== '📋' || s.status !== '') fail(w + ': not back to "Copy" after reload ' + JSON.stringify(s));
   console.log(w + 'px: hover, move into box, copy (clipboard = ' + clip + '), "Copied!" stays, no second copy, reset on reload: OK');
   await ctx.close(); }
 // 2. keyboard
 { const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }); await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
   const p = await ctx.newPage(); await p.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' });
   let found = false; for (let i = 0; i < 40; i++) { await p.keyboard.press('Tab'); if (await p.evaluate(() => document.activeElement.matches('.has-popover > a'))) { found = true; break; } }
   await p.waitForTimeout(300); if (!found || (await pop(p)).op !== 1) fail('keyboard: popover not shown on focus');
   await p.keyboard.press('Tab'); const onBtn = await p.evaluate(() => document.activeElement.classList.contains('copy-button'));
   await p.waitForTimeout(300); if (!onBtn || (await pop(p)).op !== 1) fail('keyboard: cannot reach the Copy button');
   await p.keyboard.press('Enter'); await p.waitForTimeout(300);
   if ((await p.evaluate(() => navigator.clipboard.readText())) !== 'cvswomenslc@gmail.com' || (await pop(p)).label !== 'Copied!') fail('keyboard: copy failed');
   else console.log('keyboard: Tab to Email us shows the box, Tab reaches Copy, Enter copies');
   await ctx.close(); }
 // 3. copying blocked: fallback hint and highlighted address
 { const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
   await p.addInitScript(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('blocked')) } }); document.execCommand = () => false; });
   await p.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' });
   await p.locator('.has-popover > a').hover(); await p.waitForTimeout(300); await p.locator('.copy-button').click(); await p.waitForTimeout(300);
   const s = await pop(p); const sel = await p.evaluate(() => String(window.getSelection()));
   if (s.label !== 'Press Ctrl+C' || sel !== 'cvswomenslc@gmail.com') fail('blocked copy: no fallback ' + JSON.stringify([s.label, sel])); else console.log('copy blocked: shows "Press Ctrl+C" and highlights the address');
   await p.waitForTimeout(2200); if ((await pop(p)).label !== 'Copy') fail('blocked copy: button did not come back to "Copy" to try again');
   await p.close(); }
 // 4. phone and no-JS
 { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }); const p = await ctx.newPage();
   await p.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' }); if ((await pop(p)).op !== 0) fail('phone: popover visible'); else console.log('phone: no popover');
   await ctx.close(); }
 { const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, javaScriptEnabled: false }); const p = await ctx.newPage();
   await p.goto('http://localhost:8765/index.html'); const d = await p.evaluate(() => getComputedStyle(document.querySelector('.copy-button')).display);
   if (d !== 'none') fail('no JS: copy button still shown'); else console.log('no JavaScript: Copy button hidden');
   await ctx.close(); }
 // 5. Call us tooltip still works
 { const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); await p.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' });
   await p.locator('a.has-tooltip').hover(); await p.waitForTimeout(300);
   if (+(await p.evaluate(() => getComputedStyle(document.querySelector('.tooltip')).opacity)) !== 1) fail('Call us tooltip broken'); else console.log('Call us tooltip still works');
   await p.close(); }
 console.log(bad ? `${bad} problem(s)` : 'COPY CHECKS PASSED'); await b.close(); })();

// Not a check: full-page screenshots of Home, Classes and Contact (phone and computer), to look at.
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const [port, out] = process.argv.slice(2);
 for (const [w, h, name] of [[390, 844, 'phone'], [1280, 800, 'desktop']]) {
   const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
   for (const pg of ['index', 'classes', 'contact']) {
     const p = await ctx.newPage(); await p.goto(`http://localhost:${port}/${pg}.html`, { waitUntil: 'networkidle' });
     await p.evaluate(() => document.fonts.ready);
     await p.screenshot({ path: `${out}/${name}-${pg}.png`, fullPage: true }); await p.close(); }
   await ctx.close(); }
 await b.close(); })();

// Every page at phone and computer size: no console errors, no broken links or images,
// no sideways scrolling, the current page marked in the menu, the phone menu opens/closes,
// and the "Skip to content" link shows on the first Tab.
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'http://localhost:8765/';
const SHOTS = process.argv[2];
const pages = ['index.html','about.html','classes.html','events.html','support.html','contact.html','privacy.html'];
(async () => {
  const browser = await chromium.launch();
  let problems = 0;
  const report = (m) => { problems++; console.log('PROBLEM:', m); };
  for (const vp of [{name:'phone', width:390, height:844}, {name:'desktop', width:1280, height:800}]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    for (const p of pages) {
      const page = await ctx.newPage();
      page.on('console', m => { if (m.type() === 'error') report(`${vp.name} ${p} console: ${m.text()}`); });
      page.on('pageerror', e => report(`${vp.name} ${p} JS error: ${e.message}`));
      page.on('response', r => { if (r.url().startsWith(BASE) && r.status() >= 400) report(`${vp.name} ${p} ${r.status()} ${r.url()}`); });
      await page.goto(BASE + p, { waitUntil: 'networkidle' });
      // The first Tab shows the "Skip to content" link, on top of everything
      await page.keyboard.press('Tab');
      const skip = await page.evaluate(() => { const a = document.activeElement, r = a.getBoundingClientRect();
        return a.classList.contains('skip-link') && r.top >= 0 && document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === a; });
      if (!skip) report(`${vp.name} ${p} "Skip to content" link not visible on the first Tab`);
      await page.evaluate(() => document.activeElement.blur());
      // No sideways scrolling
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) report(`${vp.name} ${p} horizontal overflow ${overflow}px`);
      // Images loaded
      const broken = await page.evaluate(() => [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src));
      if (broken.length) report(`${vp.name} ${p} broken images ${broken}`);
      // Exactly one current nav item, pointing to this page (privacy has none)
      const cur = await page.$$eval('.site-nav [aria-current="page"]', a => a.map(x => x.getAttribute('href')));
      if (p !== 'privacy.html' && (cur.length !== 1 || cur[0] !== p)) report(`${vp.name} ${p} aria-current wrong: ${cur}`);
      const navVisible = await page.isVisible('.site-nav');
      const btnVisible = await page.isVisible('.menu-toggle');
      if (vp.name === 'phone') {
        if (navVisible || !btnVisible) report(`phone ${p} menu should start closed with button visible (nav ${navVisible}, btn ${btnVisible})`);
        await page.click('.menu-toggle');
        if (!(await page.isVisible('.site-nav')) || (await page.getAttribute('.menu-toggle','aria-expanded')) !== 'true') report(`phone ${p} menu did not open`);
        if (p === 'index.html') await page.screenshot({ path: `${SHOTS}/phone-menu-open.png` });
        await page.click('.menu-toggle');
        if (await page.isVisible('.site-nav')) report(`phone ${p} menu did not close`);
      } else {
        if (!navVisible || btnVisible) report(`desktop ${p} nav should be visible and button hidden`);
      }
      await page.screenshot({ path: `${SHOTS}/${vp.name}-${p.replace('.html','')}.png`, fullPage: true });
      await page.close();
    }
    await ctx.close();
  }
  // Without JavaScript the menu must still be usable on phones
  const nojs = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const np = await nojs.newPage();
  await np.goto(BASE + 'index.html');
  if (!(await np.isVisible('.site-nav')) || await np.isVisible('.menu-toggle')) report('no-JS phone: nav should be visible, button hidden');
  await browser.close();
  // Every internal link in every file points to an existing file
  const root = process.argv[3];
  for (const p of pages) {
    const html = fs.readFileSync(`${root}/${p}`, 'utf8');
    for (const m of html.matchAll(/(?:href|src)="([^"#:?]+)(?=["?#])/g)) {
      if (!fs.existsSync(`${root}/${m[1]}`)) report(`${p} links to missing ${m[1]}`);
    }
  }
  process.exitCode = problems ? 1 : 0;   // tells run_all.sh whether this check passed
  console.log(problems ? `${problems} problem(s)` : 'ALL CHECKS PASSED');
})();

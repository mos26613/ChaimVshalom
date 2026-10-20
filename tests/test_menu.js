const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); let bad = 0;
  const fail = m => { bad++; console.log('PROBLEM:', m); };
  for (const w of [360, 390, 600]) {
    const p = await b.newPage({ viewport: { width: w, height: 800 } });
    await p.goto('http://localhost:8765/classes.html', { waitUntil: 'networkidle' });
    const mainTop = () => p.evaluate(() => document.querySelector('main').getBoundingClientRect().top);
    const before = await mainTop();
    await p.click('.menu-toggle');
    if (!(await p.isVisible('.site-nav'))) fail(`${w}: menu did not open`);
    const after = await mainTop();
    if (Math.abs(after - before) > 0.5) fail(`${w}: page moved down by ${after - before}px`);
    const box = await p.evaluate(() => { const r = document.getElementById('site-nav').getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom }; });
    if (box.l < 0 || box.r > w) fail(`${w}: menu box off screen ${JSON.stringify(box)}`);
    const onTop = await p.evaluate(b => { const el = document.elementFromPoint((b.l + b.r) / 2, b.b - 10); return !!el.closest('#site-nav'); }, box);
    if (!onTop) fail(`${w}: menu box is hidden behind page content`);
    if (w === 390) await p.screenshot({ path: process.argv[2] + '/menu-open-390.png' });
    await p.mouse.click(w / 2, 700);                          // tap outside
    if (await p.isVisible('.site-nav')) fail(`${w}: tap outside did not close`);
    await p.click('.menu-toggle'); await p.keyboard.press('Escape');
    if (await p.isVisible('.site-nav')) fail(`${w}: Escape did not close`);
    const focused = await p.evaluate(() => document.activeElement.className);
    if (focused !== 'menu-toggle') fail(`${w}: focus not returned to button`);
    await p.click('.menu-toggle'); await p.click('.site-nav a[href="about.html"]'); await p.waitForLoadState();
    if (!p.url().endsWith('about.html')) fail(`${w}: menu link did not navigate`);
    await p.close();
  }
  // Wide screen: open on a narrow window, then widen — menu must be a normal row
  const p = await b.newPage({ viewport: { width: 390, height: 800 } });
  await p.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' });
  await p.click('.menu-toggle'); await p.setViewportSize({ width: 1280, height: 800 });
  const pos = await p.evaluate(() => getComputedStyle(document.getElementById('site-nav')).position);
  if (pos !== 'static') fail('desktop after resize: menu still floating');
  await b.close();
  console.log(bad ? `${bad} problem(s)` : 'MENU CHECKS PASSED');
})();

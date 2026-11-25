// Flyer cards. Events page: the Chanukah Chagigah card (flyer, date, Email us +
// WhatsApp us to register). News page: the Living Tehillim post (flyer,
// store-price line, Pre-order button to the Google Form in a new tab), and it
// is no longer on the Events page. Each flyer loads, is not wider than its
// card, and sits above the text on phones and beside it on larger screens.
// Home page: the "New!" quick link fits on screen, and one click shows the
// post on the News page, not hidden under the menu.
const { chromium } = require('playwright');

// Runs in the page: where a flyer card's picture is compared with its text.
async function measure(id) {
  const target = document.getElementById(id);
  if (!target) return null;
  const c = target.closest('.flyer-card') || target.querySelector('.flyer-card');
  const img = c.querySelector('img'), text = c.querySelector('.flyer-text');
  img.loading = 'eager';
  if (!img.complete) await new Promise(res => { img.onload = img.onerror = res; });
  const ir = img.getBoundingClientRect(), tr = text.getBoundingClientRect(), cr = c.getBoundingClientRect();
  return { loaded: img.naturalWidth > 0, alt: img.alt.length > 20,
    inside: ir.left >= cr.left && ir.right <= cr.right + 0.5,
    above: ir.bottom <= tr.top + 1, beside: ir.right <= tr.left + 1 && Math.abs(ir.top - tr.top) < 40 };
}

(async () => { const b = await chromium.launch(); let bad = 0;
 const fail = msg => { console.log('  FAIL:', msg); bad++; };
 for (const [w, h] of [[320, 640], [390, 844], [768, 1024], [1280, 800]]) {
   const p = await b.newPage({ viewport: { width: w, height: h } });
   const wide = w >= 768, probs = [];
   const checkFlyer = (name, x) => {
     if (!x) return probs.push(`${name} card is missing`);
     if (!x.loaded || !x.alt || !x.inside) probs.push(`${name} flyer ${JSON.stringify(x)}`);
     if (wide ? !x.beside : !x.above) probs.push(`${name} flyer should be ${wide ? 'beside' : 'above'} the text`);
   };
   const overflow = () => p.evaluate(() => document.documentElement.scrollWidth - innerWidth);

   // Events page
   await p.goto('http://localhost:8765/events.html', { waitUntil: 'networkidle' });
   if (await overflow() > 0) probs.push('Events page scrolls sideways');
   checkFlyer('Chagigah', await p.evaluate(measure, 'chanukah-chagigah'));
   const chagigah = await p.evaluate(() => {
     const c = document.getElementById('chanukah-chagigah');
     return c && {
       date: /Tuesday, December 8th/.test(c.textContent),
       hebrewDate: [...c.querySelectorAll('.details [lang="he"][dir="rtl"]')].some(e => e.textContent === 'כ״ח כסלו'),
       email: !!c.querySelector('.actions a[href^="mailto:cvswomenslc@gmail.com"]'),
       whatsapp: !!c.querySelector('.actions a[href^="https://wa.me/972509332205"][target="_blank"]') }; });
   if (chagigah && !Object.values(chagigah).every(Boolean)) probs.push('Chagigah ' + JSON.stringify(chagigah));
   if (await p.evaluate(() => !!document.getElementById('living-tehillim')))
     probs.push('the Living Tehillim post is still on the Events page');
   if (process.argv[2]) await p.screenshot({ path: `${process.argv[2]}/events-${w}.png`, fullPage: true });

   // News page
   await p.goto('http://localhost:8765/news.html', { waitUntil: 'networkidle' });
   if (await overflow() > 0) probs.push('News page scrolls sideways');
   checkFlyer('Living Tehillim', await p.evaluate(measure, 'living-tehillim'));
   const tehillim = await p.evaluate(() => {
     const t = document.getElementById('living-tehillim'), btn = t && t.querySelector('.actions a');
     return t && {
       price: /less than store prices, with an additional discount on the boxed set/.test(t.textContent),
       form: !!btn && btn.href === 'https://forms.gle/JW86rpxwvfvWYJGw6' && btn.target === '_blank' }; });
   if (tehillim && !Object.values(tehillim).every(Boolean)) probs.push('Living Tehillim ' + JSON.stringify(tehillim));
   if (process.argv[2]) await p.screenshot({ path: `${process.argv[2]}/news-${w}.png`, fullPage: true });

   // Home page quick link
   await p.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' });
   if (await overflow() > 0) probs.push('Home page scrolls sideways');
   const quick = await p.evaluate(() => {
     const a = document.querySelector('.quick-link'), r = a && a.getBoundingClientRect();
     return a && { href: a.getAttribute('href'), inside: r.left >= 0 && r.right <= innerWidth,
       text: /Living Tehillim, Volume 5/.test(a.textContent) }; });
   if (!quick || quick.href !== 'news.html#living-tehillim' || !quick.inside || !quick.text) probs.push('quick link ' + JSON.stringify(quick));
   else {
     await p.click('.quick-link'); await p.waitForURL('**/news.html#living-tehillim'); await p.waitForTimeout(300);
     const seen = await p.evaluate(() => {
       // the "New Release" heading of the post must be in view
       const top = document.querySelector('#living-tehillim h2').getBoundingClientRect().top;
       const nav = document.querySelector('.site-header').getBoundingClientRect();
       const covered = getComputedStyle(document.querySelector('.site-header')).position === 'sticky' ? nav.bottom : 0;
       return { top, covered, h: innerHeight }; });
     if (seen.top < seen.covered - 1 || seen.top > seen.h / 2) probs.push('quick link: post not shown well ' + JSON.stringify(seen));
   }
   if (process.argv[2]) await p.screenshot({ path: `${process.argv[2]}/home-quick-${w}.png` });

   if (probs.length) probs.forEach(m => fail(`${w}px: ${m}`));
   else console.log(String(w).padStart(5), 'px: Events and News flyer cards, Home quick link OK');
   await p.close(); }
 process.exitCode = bad ? 1 : 0;   // tells run_all.sh whether this check passed
 console.log(bad ? `${bad} FLYER CARD PROBLEM(S)` : 'FLYER CARD CHECKS PASSED'); await b.close(); })();

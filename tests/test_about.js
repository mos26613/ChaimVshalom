// About page: Mission, Story, Vision (then teachers) in order, with no placeholders left in them;
// the two Hebrew names in the dedication marked as Hebrew and never split across lines.
// Every page: the first mention of the name is the full name (the short form is fine after that).
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); let bad = 0;
 const fail = msg => { console.log('  FAIL:', msg); bad++; };
 for (const [w, h] of [[320, 640], [390, 844], [1280, 800]]) {
   const p = await b.newPage({ viewport: { width: w, height: h } });
   await p.goto('http://localhost:8765/about.html', { waitUntil: 'networkidle' });
   const r = await p.evaluate(() => {
     const h2 = [...document.querySelectorAll('main h2')].map(e => e.textContent.trim());
     const secs = [...document.querySelectorAll('main section')].slice(0, 3);
     return { h2, placeholders: secs.some(s => s.querySelector('.placeholder')),
       hebrew: [...document.querySelectorAll('.about-dedication .hebrew-name[lang="he"][dir="rtl"]')].length,
       split: [...document.querySelectorAll('.hebrew-name')].some(e => e.getClientRects().length > 1),
       closing: !!document.querySelector('.closing-line'), overflow: document.documentElement.scrollWidth - innerWidth }; });
   if (r.h2.slice(0, 4).join(' | ') !== 'Our Mission | Our Story | Our Vision | Our teachers' || r.placeholders || r.hebrew !== 2 || r.split || !r.closing || r.overflow > 0)
     fail(`${w}px About: ${JSON.stringify(r)}`);
   else console.log(String(w).padStart(5), 'px: About page OK');
   if (process.argv[2] && w !== 320) await p.screenshot({ path: `${process.argv[2]}/about-${w}.png`, fullPage: true });
   await p.close(); }
 const p = await b.newPage();
 for (const pg of ['index', 'about', 'classes', 'events', 'support', 'contact', 'privacy']) {
   await p.goto(`http://localhost:8765/${pg}.html`, { waitUntil: 'networkidle' });
   const first = await p.evaluate(() => { const t = document.querySelector('main').innerText.replace(/[‘’]/g, "'");
     const i = t.indexOf("Chaim V'Shalom"); return i < 0 ? 'none' : t.substr(i, 38); });
   if (first !== 'none' && first !== "Chaim V'Shalom Women's Learning Center") fail(`${pg}: first mention is short: "${first}"`); }
 console.log(bad ? `${bad} ABOUT PAGE PROBLEM(S)` : 'ABOUT PAGE CHECKS PASSED'); await b.close(); })();

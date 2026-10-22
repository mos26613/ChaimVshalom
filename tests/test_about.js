// About page: Mission, Story, Vision (then teachers) in order;
// the two Hebrew names in the dedication marked as Hebrew and never split across lines;
// both teacher cards have their real descriptions.
// (How the name is written in page text is the maintainer's choice, so it isn't checked here.)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); let bad = 0;
 const fail = msg => { console.log('  FAIL:', msg); bad++; };
 for (const [w, h] of [[320, 640], [390, 844], [1280, 800]]) {
   const p = await b.newPage({ viewport: { width: w, height: h } });
   await p.goto('http://localhost:8765/about.html', { waitUntil: 'networkidle' });
   const r = await p.evaluate(() => {
     const h2 = [...document.querySelectorAll('main h2')].map(e => e.textContent.trim());
     return { h2,
       hebrew: [...document.querySelectorAll('.about-dedication .hebrew-name[lang="he"][dir="rtl"]')].length,
       split: [...document.querySelectorAll('.hebrew-name')].some(e => e.getClientRects().length > 1),
       teachers: [['Fayge Grossman', /Emunah and Shalom Bayis/], ['Rivka Segal', /Living Tehillim/]].every(([name, text]) =>
         [...document.querySelectorAll('.card')].some(c => c.querySelector('h3').textContent.includes(name) && text.test(c.textContent))),
       closing: !!document.querySelector('.closing-line'), overflow: document.documentElement.scrollWidth - innerWidth }; });
   if (r.h2.slice(0, 4).join(' | ') !== 'Our Mission | Our Story | Our Vision | Our teachers' || r.hebrew !== 2 || r.split || !r.closing || !r.teachers || r.overflow > 0)
     fail(`${w}px About: ${JSON.stringify(r)}`);
   else console.log(String(w).padStart(5), 'px: About page OK');
   if (process.argv[2] && w !== 320) await p.screenshot({ path: `${process.argv[2]}/about-${w}.png`, fullPage: true });
   await p.close(); }
 process.exitCode = bad ? 1 : 0;   // tells run_all.sh whether this check passed
 console.log(bad ? `${bad} ABOUT PAGE PROBLEM(S)` : 'ABOUT PAGE CHECKS PASSED'); await b.close(); })();

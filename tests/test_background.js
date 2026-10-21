// Page background: soft color washes on every screen size, the little leaves only on
// large screens (768px and up), fixed in place behind everything; the header lets it show through.
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); let bad = 0;
 const fail = msg => { console.log('  FAIL:', msg); bad++; };
 for (const [w, h, leaves] of [[320, 640, false], [390, 844, false], [600, 900, false], [768, 1024, true], [1280, 800, true], [1920, 1080, true]]) {
   const p = await b.newPage({ viewport: { width: w, height: h } });
   for (const pg of ['index', 'about', 'classes', 'contact']) {
     await p.goto(`http://localhost:8765/${pg}.html`, { waitUntil: 'load' });
     const r = await p.evaluate(() => { const s = getComputedStyle(document.body, '::before');
       const hdr = getComputedStyle(document.querySelector('.site-header')).backgroundColor;
       const hit = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
       return { img: s.backgroundImage, fixed: s.position === 'fixed', z: s.zIndex, washes: (s.backgroundImage.match(/radial-gradient/g) || []).length,
         leaves: s.backgroundImage.includes('svg'), headerSeeThrough: /rgba?\(.*,\s*0?\.\d+\)$|\/\s*0?\.\d+\)$/.test(hdr) || hdr.startsWith('color('),
         clickable: !!hit && hit !== document.documentElement, overflow: document.documentElement.scrollWidth - innerWidth }; });
     if (!r.fixed || r.z !== '-1' || r.washes !== 3 || r.leaves !== leaves || !r.clickable || r.overflow > 0)
       fail(`${w}px ${pg}: ${JSON.stringify({ ...r, img: undefined })}`);
     if (!r.headerSeeThrough) fail(`${w}px ${pg}: header is not see-through`);
   }
   console.log(String(w).padStart(5), `px: washes${leaves ? ' + leaves' : ', no leaves'}`);
   await p.close(); }
 console.log(bad ? `${bad} BACKGROUND PROBLEM(S)` : 'BACKGROUND CHECKS PASSED'); await b.close(); })();

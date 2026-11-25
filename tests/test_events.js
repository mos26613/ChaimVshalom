// Events page: the Chanukah Chagigah card (flyer, date, Email us + WhatsApp us
// to register) and the Living Tehillim card (flyer, store-price line, Pre-order
// button to the Google Form in a new tab). Each flyer loads, is not wider than
// the card, and sits above the text on phones and beside it on larger screens.
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); let bad = 0;
 const fail = msg => { console.log('  FAIL:', msg); bad++; };
 for (const [w, h] of [[320, 640], [390, 844], [768, 1024], [1280, 800]]) {
   const p = await b.newPage({ viewport: { width: w, height: h } });
   await p.goto('http://localhost:8765/events.html', { waitUntil: 'networkidle' });
   const r = await p.evaluate(async () => {
     const card = id => {
       const c = document.getElementById(id), img = c.querySelector('img'), text = c.querySelector('.flyer-text');
       img.loading = 'eager'; return { c, img, text }; };
     const out = { overflow: document.documentElement.scrollWidth - innerWidth };
     for (const id of ['chanukah-chagigah', 'living-tehillim']) {
       const { c, img, text } = card(id);
       if (!img.complete) await new Promise(res => { img.onload = img.onerror = res; });
       const ir = img.getBoundingClientRect(), tr = text.getBoundingClientRect(), cr = c.getBoundingClientRect();
       out[id] = { loaded: img.naturalWidth > 0, alt: img.alt.length > 20,
         inside: ir.left >= cr.left && ir.right <= cr.right + 0.5,
         above: ir.bottom <= tr.top + 1, beside: ir.right <= tr.left + 1 && Math.abs(ir.top - tr.top) < 40 };
     }
     const c = document.getElementById('chanukah-chagigah');
     out.chagigah = {
       date: /Tuesday, December 8th/.test(c.textContent),
       email: !!c.querySelector('.actions a[href^="mailto:cvswomenslc@gmail.com"]'),
       whatsapp: !!c.querySelector('.actions a[href^="https://wa.me/972509332205"][target="_blank"]') };
     const t = document.getElementById('living-tehillim'), btn = t.querySelector('.actions a');
     out.tehillim = {
       price: /less than store prices, with an additional discount on the boxed set/.test(t.textContent),
       form: btn && btn.href === 'https://forms.gle/JW86rpxwvfvWYJGw6' && btn.target === '_blank' };
     return out; });
   const wide = w >= 768, probs = [];
   if (r.overflow > 0) probs.push('sideways scrolling');
   for (const id of ['chanukah-chagigah', 'living-tehillim']) {
     const x = r[id];
     if (!x.loaded || !x.alt || !x.inside) probs.push(`${id} flyer ${JSON.stringify(x)}`);
     if (wide ? !x.beside : !x.above) probs.push(`${id} flyer should be ${wide ? 'beside' : 'above'} the text`);
   }
   if (!Object.values(r.chagigah).every(Boolean)) probs.push('Chagigah ' + JSON.stringify(r.chagigah));
   if (!Object.values(r.tehillim).every(Boolean)) probs.push('Living Tehillim ' + JSON.stringify(r.tehillim));
   if (probs.length) probs.forEach(m => fail(`${w}px: ${m}`));
   else console.log(String(w).padStart(5), 'px: Events page OK');
   if (process.argv[2]) await p.screenshot({ path: `${process.argv[2]}/events-${w}.png`, fullPage: true });
   await p.close(); }
 process.exitCode = bad ? 1 : 0;   // tells run_all.sh whether this check passed
 console.log(bad ? `${bad} EVENTS PAGE PROBLEM(S)` : 'EVENTS PAGE CHECKS PASSED'); await b.close(); })();

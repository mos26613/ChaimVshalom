// Classes page "Add to my calendar:" buttons. Apple downloads files/inaugural-program.ics;
// Android opens Google Calendar with the same event. Both buttons fit on one row on every
// screen, their emojis are skipped by screen readers, and the Google link has the same start,
// end, weekly repeat and title as the calendar file (so the two can't drift apart).
const { chromium } = require('playwright');
const fs = require('fs');
(async () => { const b = await chromium.launch(); let bad = 0;
 const fail = msg => { console.log('  FAIL:', msg); bad++; };
 for (const w of [320, 390, 768, 1280]) {
   const p = await b.newPage({ viewport: { width: w, height: 800 } });
   await p.goto('http://localhost:8765/classes.html', { waitUntil: 'networkidle' });
   const r = await p.evaluate(() => { const label = document.querySelector('.calendar-label'); const row = label && label.nextElementSibling;
     const btns = row ? [...row.querySelectorAll('a.button')] : []; const box = e => e.getBoundingClientRect();
     return { label: label && label.textContent.trim(), names: btns.map(a => a.textContent.trim()),
       apple: btns[0] && { href: btns[0].getAttribute('href'), download: btns[0].hasAttribute('download') },
       android: btns[1] && { href: btns[1].href, target: btns[1].target, rel: btns[1].rel },
       oneRow: btns.length === 2 && Math.abs(box(btns[0]).top - box(btns[1]).top) < 1 && btns.every(a => box(a).height < 60),
       emojisHidden: btns.every(a => a.querySelector('[aria-hidden="true"]')),
       overflow: document.documentElement.scrollWidth - innerWidth }; });
   if (r.label !== 'Add to my calendar:' || r.names.join(' | ') !== '🍎 Apple | 🤖 Android' || !r.oneRow || !r.emojisHidden || r.overflow > 0
       || r.apple.href !== 'files/inaugural-program.ics' || !r.apple.download
       || !r.android.href.startsWith('https://calendar.google.com/calendar/render?action=TEMPLATE') || r.android.target !== '_blank' || !r.android.rel.includes('noopener'))
     fail(`${w}px: ${JSON.stringify(r)}`);
   else console.log(String(w).padStart(5), 'px: Apple and Android buttons OK, on one row');
   if (w === 1280) {
     // The Google link and the calendar file describe the same event
     const ics = fs.readFileSync(`${__dirname}/../files/inaugural-program.ics`, 'utf8').replace(/\r\n /g, '');
     const get = k => (ics.match(new RegExp(`^${k}:(.*)$`, 'm')) || [])[1].trim();
     const q = new URL(r.android.href).searchParams;
     const want = { dates: `${get('DTSTART')}/${get('DTEND')}`, recur: `RRULE:${get('RRULE')}`, text: get('SUMMARY') };
     const differ = Object.entries(want).filter(([k, v]) => q.get(k) !== v);
     differ.forEach(([k, v]) => fail(`Google link ${k} is "${q.get(k)}" but the calendar file says "${v}"`));
     if (!differ.length) console.log('Google link matches the calendar file:', want.dates, want.recur);
   }
   await p.close(); }
 process.exitCode = bad ? 1 : 0;   // tells run_all.sh whether this check passed
 console.log(bad ? `${bad} CALENDAR PROBLEM(S)` : 'CALENDAR CHECKS PASSED'); await b.close(); })();

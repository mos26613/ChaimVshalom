// Loaded before the browser checks (see run_all.sh): every page they open behaves as if
// the Home page logo intro was already seen in this tab, so the intro doesn't cover the
// page they are checking. test_intro.js runs without this, to check the intro itself.
const pw = require('playwright');
const launch = pw.chromium.launch.bind(pw.chromium);
const seen = () => { try { window.sessionStorage.setItem('intro-seen', 'yes'); } catch (e) {} };
pw.chromium.launch = async (...args) => {
  const b = await launch(...args);
  const newContext = b.newContext.bind(b);
  b.newContext = async (...opts) => { const ctx = await newContext(...opts); await ctx.addInitScript(seen); return ctx; };
  b.newPage = async (...opts) => {
    const ctx = await b.newContext(...opts); const p = await ctx.newPage();
    const close = p.close.bind(p); p.close = async (...a) => { await close(...a); await ctx.close(); };
    return p; };
  return b; };

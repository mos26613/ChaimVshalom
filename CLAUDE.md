# CLAUDE.md — project rules for Claude

Website for **Chaim V'Shalom Women's Learning Center**, a new organization in
Ramat Beit Shemesh, Israel, that gives Torah classes to religious women. It is
run entirely by women. Full plan and decisions: `SITE_PLAN.md`. File guide:
`README.md`.

## Who you are working with

The maintainer is a computer science student who is new to web development.
- Explain changes in plain language; don't assume web-framework knowledge.
- **Work in small, careful steps.** Do only what was asked. Don't redesign,
  restructure, or add features that weren't requested — suggest them instead.
- If a request is unclear or needs a decision (content, design, halacha), ask
  rather than guess.

## How we work (learned in earlier sessions)

- **Branch:** the live site publishes from
  `claude/nonprofit-website-planning-21uvpw` (GitHub Pages, branch deploy, root
  folder). Commit and push there unless the maintainer says otherwise; work on
  any other branch does not appear on the site. Live address: the custom
  domain **https://chaimvshalom.org/** (set by the `CNAME` file, which the
  maintainer added; never delete or rename it, or the domain stops working).
  The old address https://mos26613.github.io/ChaimVshalom/ forwards there.
  Repository: mos26613/ChaimVshalom.
- **Pull first.** The maintainer sometimes edits files directly on GitHub, so
  start every task with `git pull` and build on their changes.
- **One change at a time.** For a list of changes: do one, test it fully, commit
  and push it, then start the next. Clear commit messages.
- **Design ideas get a preview first.** When proposing new looks or features,
  build them in a scratch copy, send before/after screenshots, and only add the
  approved ones to the real site. Direct requests ("move the button", "rename
  X") can be done, tested and pushed, then shown.
- **Test thoroughly** with `bash tests/run_all.sh` (see `tests/README.md`), and
  add a focused test for anything new (e.g. tooltips, fade-in, copy button).
  Check phone (~390px), very narrow phones (320px), tablets and computers.
- **Show, don't just tell:** send screenshots (and short recordings for motion)
  of the result, and say what to check on the live site.
- Browsers cache old files: `css/style.css` and `js/main.js` are loaded with a
  build-time `?v=` tag in `_layouts/default.html`; keep that for any new
  stylesheet or script.

## Content rules (must follow)

- **The name: "Chaim V'Shalom Women's Learning Center"**, all five words
  written together in the same font and style (never split into a name plus a
  smaller tagline). Use the full name in page titles, headings, the header and
  footer, and the first time a text mentions it. **In running text the short
  form "Chaim V'Shalom" is fine** when it is mentioned again (the maintainer's
  decision, Oct 21, 2026); never "correct" it to the full name. The official
  round logo (`images/logo.png`) shows the name in its own artwork style.
- **Keep the maintainer's text exactly as sent** when adding it to the site
  (wording, short name, order). Don't reword or "fix" it; if something seems
  off, point it out and ask instead.
- **No photos or images of people**, not even silhouettes. Visuals come from the
  logo, colors, typography, decorations, and photos of places without people.
  Standard symbols and emojis (e.g. ♿) are fine.
- **Soft pastel theme** (a specific request from the organization). Pastels are
  for backgrounds, cards, borders and decorations only — **all text stays dark
  navy** for readability. Colors are defined once in `:root` in `css/style.css`;
  reuse those variables instead of adding new hard-coded colors.
- **English only** for now. Hebrew appears only in short items (בס״ד, the
  dedication, Hebrew dates), marked with `lang="he" dir="rtl"`.
- **Modest, warm tone.** Placeholder text uses `class="placeholder"`; never invent
  facts (names, dates, prices, biographies) — use a placeholder and say so.
- **Donations:** the organization is not yet a registered amuta. Don't add live
  donation or payment features unless explicitly asked, and **never** describe
  donations as tax-deductible (that requires Section 46 approval, not yet granted).
- **Shabbos closing** is planned but waiting on rabbinic answers — don't build it
  unless asked.

## How the site is built

- Plain HTML + CSS + a little vanilla JavaScript. **No frameworks, no npm build.**
- **Jekyll** (run automatically by GitHub Pages) assembles the pages:
  - `_layouts/default.html` — page frame (`<head>`, header, content, footer)
  - `_includes/header.html`, `_includes/footer.html` — shared on every page;
    change them only there
  - `_data/navigation.yml` — the menu items
  - Each page (`index.html`, `about.html`, …) has front matter (`layout`,
    `title`, `description`) followed by only its own content.
- Links are relative (`about.html`, `css/style.css`). Keep them relative, so
  the site works at both its own domain and the old GitHub address.
- **Mobile first:** base CSS is for phones; `@media (min-width: 48rem)` adapts
  for larger screens. Every change must work at phone width (~390px) with no
  sideways scrolling.
- Accessibility: alt text on meaningful images (`alt=""` on decorative ones),
  keyboard-usable controls, `aria-current="page"` on the active menu item.
- Files listed under `exclude` in `_config.yml` are not published.

## Before finishing a change

- Re-read your diff: valid HTML, nothing broken on other pages, no new colors or
  fonts outside the variables, no images of people.
- Run `bash tests/run_all.sh` (builds the site with GitHub Pages' Jekyll,
  validates the HTML, and runs all browser checks); everything must pass.
- In your reply, summarize what changed in plain language and what the
  maintainer should check on the live site.

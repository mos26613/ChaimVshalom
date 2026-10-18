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

## Content rules (must follow)

- **The name is always all five words: "Chaim V'Shalom Women's Learning Center"**,
  written together in the same font and style (never split into a name plus a
  smaller tagline, never shortened to "Chaim V'Shalom" on the site).
- **No photos or images of people**, not even silhouettes. Visuals come from the
  logo, colors, typography, decorations, and photos of places without people.
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
- Links are relative (`about.html`, `css/style.css`) because the site is served
  from a sub-path (`/Chaim_Veshalom/`). Keep them relative.
- **Mobile first:** base CSS is for phones; `@media (min-width: 48rem)` adapts
  for larger screens. Every change must work at phone width (~390px) with no
  sideways scrolling.
- Accessibility: alt text on meaningful images (`alt=""` on decorative ones),
  keyboard-usable controls, `aria-current="page"` on the active menu item.
- Files listed under `exclude` in `_config.yml` are not published.

## Before finishing a change

- Re-read your diff: valid HTML, nothing broken on other pages, no new colors or
  fonts outside the variables, no images of people.
- If you can build the site (`bundle exec jekyll build`), do so and check the
  output for errors.
- In your reply, summarize what changed in plain language and what the
  maintainer should check on the live site.

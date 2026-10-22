# Chaim V'Shalom Women's Learning Center website

A simple website made of plain HTML, CSS and a little JavaScript, published with
GitHub Pages.

See [`SITE_PLAN.md`](SITE_PLAN.md) for the full plan and decisions.

## How the pages are put together

The header and footer live in **one place each** and are shared by every page.
GitHub Pages has a built-in tool called **Jekyll** that assembles the pages
automatically every time changes are pushed — there is nothing to install or
run for the live site.

```
_layouts/default.html    the page frame: <head>, header, page content, footer
_includes/header.html    the header (בס״ד, logo, menu)   ← edit once, every page updates
_includes/footer.html    the footer (contact, dedication) ← edit once, every page updates
_data/navigation.yml     the list of menu items
_data/contact.yml        the email address and phone numbers  ← used on every page
_config.yml              site settings (and files that should not be published)
```

Each page file (like `about.html`) contains only its own content, with a small
block at the top:

```
---
layout: default
title: "About Us"
description: "About Chaim V'Shalom Women's Learning Center."
---
      <h1>About Us</h1>
      ...
```

- `layout: default` — wrap this page in `_layouts/default.html`.
- `title` — shown in the browser tab (as "About Us | Chaim V'Shalom Women's Learning Center").
- `description` — the summary search engines and WhatsApp link previews show.

## Common tasks

- **Change the header or footer:** edit `_includes/header.html` or
  `_includes/footer.html`.
- **Add a new page:** copy an existing page (e.g. `privacy.html`), give it a new
  file name, and change its title, description and content.
- **Add a page to the menu:** add its name and file to `_data/navigation.yml`.
- **Change the email address or phone number:** edit `_data/contact.yml`. The
  footer, Contact, Classes and Privacy pages all use it, written as e.g.
  `{{ site.data.contact.email }}` in the page files.
- **Change colors:** edit the `:root` section at the top of `css/style.css`.
- **Change a drawing** (the leaf flourish, the background leaves, the footer
  wave): edit its file in `images/` (`.svg` files are plain text). Don't write
  two hyphens in a row (`--`) inside their comments: that breaks the drawing.
- **Placeholder text:** all pages have their real text now, so the grey-italic
  placeholder style was removed. If a new page needs a placeholder, add this
  to `css/style.css` again and use `<p class="placeholder">…</p>`:
  `.placeholder { color: var(--color-muted); font-style: italic; }`
  (the tests flag any placeholder left on the site).

## Files

| File | What it is |
|---|---|
| `index.html` | Home page |
| `about.html` | About Us |
| `classes.html` | Classes (current program details) |
| `events.html` | Events & Trips |
| `support.html` | Support Us (donations — "coming soon" for now) |
| `contact.html` | Contact details (email, phone, WhatsApp) |
| `privacy.html` | Privacy Policy |
| `css/style.css` | All the styling. Mobile first: the `@media (min-width: 48rem)` section adjusts for wider screens. |
| `js/main.js` | The "Menu" button on phones (it stays in the top-right corner while scrolling), the scroll fade-in, the footer "Copy" button, the page-links row that stays at the top on large screens, and the Home page logo intro (first visit in a tab only) |
| `tests/` | Automatic checks run after every change (`bash tests/run_all.sh`); not published |
| `_data/contact.yml` | The email address and phone numbers, used on every page |
| `.github/workflows/claude.yml` | Lets you ask Claude for changes from GitHub (see below; not set up yet) |
| `CNAME` | Connects the custom domain `chaimvshalom.org` to the site. Don't delete or rename it. |
| `files/inaugural-program.ics` | Calendar file for the "Add to my calendar" button on the Classes page (8 Tuesdays) |
| `images/logo.png` | The official round logo, shown centered in the header |
| `images/flourish.svg` | The three-leaf flourish under page titles (and the leaf divider) |
| `images/background-leaves.svg` | The little leaves scattered over the page background on large screens |
| `images/footer-wave.svg` | The shape of the wave along the top of the footer |
| `images/leaf-sprig.svg` | The three-leaf flower alone, in the middle of the vertical divider on the Classes page |
| `images/logo-emblem.png` | The book emblem, used as the small browser-tab icon |

## Previewing

Because the pages are assembled by Jekyll, opening a page file directly in a
browser shows it without its header and footer. To see the real site, push the
changes and open https://chaimvshalom.org/. It updates once GitHub's "pages
build and deployment" run (the repository's Actions tab) has finished, usually
within a few minutes; then refresh with Ctrl+Shift+R. Or run Jekyll locally
(`bundle exec jekyll serve`, requires Ruby).

## Asking Claude from GitHub

Write `@claude` followed by a request in a new issue (title or description), an
issue comment, or a pull request comment, e.g.
`@claude change the welcome sentence on the home page to "..."`.
Claude replies in the same thread and proposes changes as a pull request.

- Set up by `.github/workflows/claude.yml`. It needs a repository secret named
  `CLAUDE_CODE_OAUTH_TOKEN` (created with `claude setup-token`, added under
  Settings → Secrets and variables → Actions).
- Claude starts fresh each time and follows the rules in `CLAUDE.md`.
- Only people with write access to the repository can trigger it.

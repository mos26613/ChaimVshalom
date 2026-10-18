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
_includes/header.html    the header (logo, name, menu)   ← edit once, every page updates
_includes/footer.html    the footer (contact, dedication) ← edit once, every page updates
_data/navigation.yml     the list of menu items
_config.yml              site settings (and files that should not be published)
```

Each page file (like `about.html`) contains only its own content, with a small
block at the top:

```
---
layout: default
title: "About"
description: "About Chaim V'Shalom Women's Learning Center."
---
      <h1>About Us</h1>
      ...
```

- `layout: default` — wrap this page in `_layouts/default.html`.
- `title` — shown in the browser tab (as "About | Chaim V'Shalom Women's Learning Center").
- `description` — the summary search engines and WhatsApp link previews show.

## Common tasks

- **Change the header or footer:** edit `_includes/header.html` or
  `_includes/footer.html`.
- **Add a new page:** copy an existing page (e.g. `privacy.html`), give it a new
  file name, and change its title, description and content.
- **Add a page to the menu:** add its name and file to `_data/navigation.yml`.
- **Change colors:** edit the `:root` section at the top of `css/style.css`.
- **Placeholder text** is shown in grey italics (`class="placeholder"`). Replace
  it with real text and remove the `class="placeholder"` part.

## Files

| File | What it is |
|---|---|
| `index.html` | Home page |
| `about.html` | About Us |
| `classes.html` | Classes (current program details) |
| `events.html` | Events & Trips |
| `support.html` | Support Us (donations — "coming soon" for now) |
| `contact.html` | Contact details (email, phone, WhatsApp, location) |
| `privacy.html` | Privacy Policy |
| `css/style.css` | All the styling. Mobile first: the `@media (min-width: 48rem)` section adjusts for wider screens. |
| `js/main.js` | The "Menu" button on phones |
| `images/logo-emblem.png` | The logo emblem |

## Previewing

Because the pages are assembled by Jekyll, opening a page file directly in a
browser shows it without its header and footer. To see the real site, push the
changes and open the live GitHub Pages address (it updates within a minute or
two), or run Jekyll locally (`bundle exec jekyll serve`, requires Ruby).

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

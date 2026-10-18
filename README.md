# Chaim V'Shalom — Women's Learning Center website

A simple website made of plain HTML, CSS and a little JavaScript. There is no
build step and nothing to install: open any `.html` file in a browser to see it.

See [`SITE_PLAN.md`](SITE_PLAN.md) for the full plan and decisions.

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
| `css/style.css` | All the styling for every page. Colors are defined at the top. |
| `js/main.js` | The "Menu" button on phones |
| `images/logo-emblem.png` | The logo emblem |

## Things to know when editing

- **Header and footer are copied into every page.** Each page is a complete,
  standalone file. If you change the menu, contact details or the footer,
  change it in **all seven** `.html` files.
- **Placeholder text** is shown in grey italics (`class="placeholder"`). Replace
  it with real text and remove the `class="placeholder"` part.
- **Colors** live at the top of `css/style.css` (the `:root` section). Changing a
  color there changes it everywhere.
- **Mobile first:** the CSS is written for phones first; the section that starts
  with `@media (min-width: 48rem)` adjusts the layout for wider screens.

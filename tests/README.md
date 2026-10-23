# Tests

Checks that are run after every change to the site. Run them all with:

```
bash tests/run_all.sh
```

| Script | What it checks |
|---|---|
| `run_all.sh` | Builds the site with GitHub Pages' Jekyll, validates the HTML and the drawings in `images/*.svg`, then runs everything below. Ends with **ALL TESTS PASSED**, or lists the checks that failed |
| `test_pages.js` | Every page at phone and computer size: no errors, no broken links or images, no sideways scrolling, menu basics, "Skip to content" link visible on the first Tab, no placeholder text left, no leftover `{{ }}` Jekyll code, no empty links (e.g. from a mistyped `{{ site.data.contact... }}`), the contact links from `_data/contact.yml` in the footer |
| `test_menu.js` | The floating phone menu: doesn't move the page, fits on screen, closes on outside tap / Escape |
| `test_fade.js` | The scroll fade-in: gradual, never fades back out, nothing left hidden at the bottom of any page; reduced motion, no JavaScript and printing show everything |
| `test_copy.js` | Footer "Email us" pop-up and Copy button (clipboard; "Copied!" stays and no second copy until the page is reloaded; keyboard; fallback), "Call us" tooltip |
| `test_footer.js` | Footer Contact/Pages columns are symmetric and nothing overflows |
| `test_register.js` | The floating "Register for classes" button: on every page, on screen, never covers the footer links, one click shows the Registration section, keyboard, hidden when printing; the Classes page "Sign up here" button opens the Google Form in a new tab; Registration layout (Sign up, leaf divider, questions); the peach share box with its white button: beside Registration with a vertical leaf divider on larger screens, underneath on phones |
| `test_nav_hover.js` | Header menu links get a pink underline while the mouse is over them (computer, tablet, open phone menu), and lose it after |
| `test_about.js` | About page: Mission, Story, Vision, teachers in order, both teachers' descriptions, Hebrew names marked and never split across lines |
| `test_sticky.js` | Large screens: only the row of page links stays at the top while scrolling, stays clickable, and doesn't cover a section you jump to; phones: the header scrolls away but the Menu button stays in the top-right corner (no jump) and its menu opens under it |
| `test_background.js` | Page background: soft color washes on every screen, the little leaves only from 768px up, fixed behind everything; the header lets it show through |
| `test_calendar.js` | Classes page "Add to my calendar:" buttons: 🍎 Apple (the calendar file) and 🤖 Android (Google Calendar) on one row at every size; the Google link has the same dates, weekly repeat and title as the calendar file |
| `test_arc.js` | The pesukim arc over the logo: on larger screens its text starts exactly at "Home" and ends exactly at "Contact Us", diamond centered over the logo, clear of the logo and links; on phones the small arc fits and clears the Menu button; navy text, gold diamond |
| `test_header_decor.js` | Header washes on every screen; open-book medallions on each side of the arc on computers (1024px+), mirrored exactly and clear of the arc; the stuck links row is plain (no washes) once scrolled |
| `test_intro.js` | Home page logo intro: shows on the first visit to Home in a tab, big logo centered; the first scroll/tap/key glides it exactly onto the header logo and the page stays at the top; never repeats in that tab (other pages, back to Home, reload); skipped for "reduce motion" |
| `skip_intro.js` | Helper, not a check: makes the other checks behave as if the intro was already seen |
| `screenshots.js` | Full-page screenshots of Home, Classes and Contact at phone and computer size |

Requirements: Ruby with Bundler, Node.js with Playwright and a Chromium browser,
and Python 3 (for a small local web server on port 8765). The `tests` folder is
not published on the website.

# Tests

Checks that are run after every change to the site. Run them all with:

```
bash tests/run_all.sh
```

| Script | What it checks |
|---|---|
| `run_all.sh` | Builds the site with GitHub Pages' Jekyll, validates the HTML, then runs everything below |
| `test_pages.js` | Every page at phone and computer size: no errors, no broken links or images, no sideways scrolling, menu basics |
| `test_menu.js` | The floating phone menu: doesn't move the page, fits on screen, closes on outside tap / Escape |
| `test_fade.js` | The scroll fade-in: gradual, never fades back out, nothing left hidden at the bottom of any page; reduced motion, no JavaScript and printing show everything |
| `test_copy.js` | Footer "Email us" pop-up and Copy button (clipboard, "Copied!", keyboard, fallback), "Call us" tooltip |
| `test_footer.js` | Footer Contact/Pages columns are symmetric and nothing overflows |
| `test_register.js` | The floating "Register for classes" button: on every page, on screen, never covers the footer links, one click shows the Registration section, keyboard, hidden when printing; the Classes page "Sign up here" button opens the Google Form in a new tab; Registration layout (Sign up, leaf divider, questions) and the narrow centered share box |
| `test_nav_hover.js` | Header menu links get a pink underline while the mouse is over them (computer, tablet, open phone menu), and lose it after |
| `test_about.js` | About page: Mission, Story, Vision, teachers in order, no placeholders left, Hebrew names marked and never split across lines; on every page the first mention of the name is the full name |
| `screenshots.js` | Full-page screenshots of Home, Classes and Contact at phone and computer size |

Requirements: Ruby with Bundler, Node.js with Playwright and a Chromium browser,
and Python 3 (for a small local web server on port 8765). The `tests` folder is
not published on the website.

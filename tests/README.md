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
| `screenshots.js` | Full-page screenshots of Home, Classes and Contact at phone and computer size |

Requirements: Ruby with Bundler, Node.js with Playwright and a Chromium browser,
and Python 3 (for a small local web server on port 8765). The `tests` folder is
not published on the website.

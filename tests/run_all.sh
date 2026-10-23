#!/bin/bash
# Builds the site exactly like GitHub Pages does and runs every check.
# Usage (from the repository folder):  bash tests/run_all.sh
# Needs: Ruby + Bundler, Node.js with Playwright (and a Chromium browser), Python 3.
# It ends with "ALL TESTS PASSED", or with the list of checks that failed (and
# then exits with an error code).
set -u
REPO="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${TMPDIR:-/tmp}/chaim-site-tests"
mkdir -p "$WORK/shots"
export BUNDLE_GEMFILE="$REPO/tests/Gemfile" BUNDLE_PATH="$WORK/gems" LANG=C.UTF-8 LC_ALL=C.UTF-8
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"

FAILED=()
# Runs one check; if it fails (or crashes), remembers its name for the summary.
check() {
  local name="$1"; shift
  "$@" || FAILED+=("$name")
}

echo "== Installing Jekyll (first run only) =="
bundle install --quiet >/dev/null 2>&1 || { echo "bundle install failed"; exit 1; }

echo "== Building the site =="
rm -rf "$WORK/site"
if ! bundle exec jekyll build --source "$REPO" --destination "$WORK/site" > "$WORK/build.log" 2>&1; then
  cat "$WORK/build.log"; echo "!! The site did not build, so nothing else was checked."; exit 1
fi
grep -E "done|rror" "$WORK/build.log"

echo "== Checking the HTML =="
check "HTML validation" npx --yes html-validate@8 "$WORK"/site/*.html && echo "HTML VALID"

echo "== Checking the drawings (images/*.svg) =="
# A broken drawing (e.g. "--" inside a comment) silently shows nothing in the browser
check "SVG drawings" python3 -c '
import sys, xml.dom.minidom
for f in sys.argv[1:]:
    xml.dom.minidom.parse(f)
print("SVG VALID")' "$REPO"/images/*.svg

echo "== Checking the site icon (favicon) =="
# Google looks for favicon.ico in the main folder; every icon a page points to
# must exist and be square
check "Site icon" python3 -c '
import sys, re, os
from PIL import Image
site = sys.argv[1]
assert os.path.isfile(os.path.join(site, "favicon.ico")), "favicon.ico is missing"
for page in [f for f in os.listdir(site) if f.endswith(".html")]:
    html = open(os.path.join(site, page)).read()
    links = re.findall(r"<link rel=\"(?:icon|apple-touch-icon)\" href=\"([^\"]+)\"", html)
    assert len(links) == 3, (page, links)
    for href in links:
        w, h = Image.open(os.path.join(site, href)).size
        assert w == h and w >= 48, (page, href, w, h)
print("SITE ICON OK")' "$WORK/site"

echo "== Browser checks =="
python3 -m http.server 8765 --directory "$WORK/site" >/dev/null 2>&1 & SERVER=$!
sleep 1
check test_intro      node "$REPO/tests/test_intro.js" "$WORK/shots"        # Home page logo intro (first visit only)
# For all other checks, the intro counts as already seen (see skip_intro.js)
export NODE_OPTIONS="--require $REPO/tests/skip_intro.js"
check test_pages      node "$REPO/tests/test_pages.js" "$WORK/shots" "$WORK/site"   # every page, phone + computer, links, menu basics
check test_menu       node "$REPO/tests/test_menu.js" "$WORK/shots"         # floating phone menu
check test_fade       node "$REPO/tests/test_fade.js"                       # scroll fade-in
check test_copy       node "$REPO/tests/test_copy.js" "$WORK/shots"         # footer Email us pop-up + Copy, Call us tooltip
check test_footer     node "$REPO/tests/test_footer.js"                     # footer columns symmetric, no overflow
check test_register   node "$REPO/tests/test_register.js" "$WORK/shots"     # floating "Register for classes" button, Registration section
check test_nav_hover  node "$REPO/tests/test_nav_hover.js" "$WORK/shots"    # pink underline on header links when hovered
check test_about      node "$REPO/tests/test_about.js" "$WORK/shots"        # About page sections and dedication
check test_sticky     node "$REPO/tests/test_sticky.js" "$WORK/shots"       # sticky links row (large screens), Menu button (phones)
check test_background node "$REPO/tests/test_background.js"                 # page background: washes everywhere, leaves on large screens
check test_calendar   node "$REPO/tests/test_calendar.js"                   # Classes page Apple / Android calendar buttons
check test_arc        node "$REPO/tests/test_arc.js" "$WORK/shots"          # pesukim arc over the logo
check test_header_decor node "$REPO/tests/test_header_decor.js" "$WORK/shots"  # header washes, book medallions, plain stuck row
check screenshots     node "$REPO/tests/screenshots.js" 8765 "$WORK/shots"  # full-page screenshots (phone + computer)
kill $SERVER
echo "Screenshots are in $WORK/shots"

echo
if [ ${#FAILED[@]} -eq 0 ]; then
  echo "ALL TESTS PASSED"
else
  echo "!! ${#FAILED[@]} CHECK(S) FAILED: ${FAILED[*]}"
  exit 1
fi

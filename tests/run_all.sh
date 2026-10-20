#!/bin/bash
# Builds the site exactly like GitHub Pages does and runs every check.
# Usage (from the repository folder):  bash tests/run_all.sh
# Needs: Ruby + Bundler, Node.js with Playwright (and a Chromium browser), Python 3.
set -u
REPO="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${TMPDIR:-/tmp}/chaim-site-tests"
mkdir -p "$WORK/shots"
export BUNDLE_GEMFILE="$REPO/tests/Gemfile" BUNDLE_PATH="$WORK/gems" LANG=C.UTF-8 LC_ALL=C.UTF-8
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"

echo "== Installing Jekyll (first run only) =="
bundle install --quiet >/dev/null 2>&1 || { echo "bundle install failed"; exit 1; }

echo "== Building the site =="
rm -rf "$WORK/site"
bundle exec jekyll build --source "$REPO" --destination "$WORK/site" 2>&1 | grep -E "done|rror"

echo "== Checking the HTML =="
npx --yes html-validate@8 "$WORK"/site/*.html && echo "HTML VALID"

echo "== Browser checks =="
python3 -m http.server 8765 --directory "$WORK/site" >/dev/null 2>&1 & SERVER=$!
sleep 1
node "$REPO/tests/test_pages.js" "$WORK/shots" "$WORK/site"   # every page, phone + computer, links, menu basics
node "$REPO/tests/test_menu.js" "$WORK/shots"                 # floating phone menu
node "$REPO/tests/test_fade.js"                               # scroll fade-in
node "$REPO/tests/test_copy.js" "$WORK/shots"                 # footer Email us pop-up + Copy, Call us tooltip
node "$REPO/tests/test_footer.js"                             # footer columns symmetric, no overflow
node "$REPO/tests/test_register.js" "$WORK/shots"             # floating "Register for classes" button
node "$REPO/tests/screenshots.js" 8765 "$WORK/shots"          # full-page screenshots (phone + computer)
kill $SERVER
echo "Screenshots are in $WORK/shots"

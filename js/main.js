// Chaim V'Shalom Women's Learning Center — small site scripts:
// 1. The "Menu" button on phones, which opens the menu as a small floating box
//    on top of the page.
// 2. A gentle fade-in for page sections as they scroll into view.
// 3. "Copy" buttons (e.g. copying the email address in the footer).
// 4. On large screens, the row of page links stays at the top while scrolling;
//    on phones, the "Menu" button stays in the top-right corner.
// 5. The Home page logo intro, the first time the Home page is opened in a tab.

// Tell the CSS that JavaScript is running, so the phone menu can start closed.
document.documentElement.classList.add("js");

// Home page intro: the first time the Home page is opened in a browser tab, the
// logo is shown large in the middle of the screen; as soon as the visitor
// scrolls (or taps, or presses a key) it glides up into its place in the
// header. This part runs before the page is drawn, so nothing flickers: it
// only decides whether to show the intro ("intro-on"), and remembers for the
// rest of the visit that it was shown, so going back to Home doesn't repeat
// it. Skipped when the device is set to reduce motion.
(function () {
  try {
    var isHome = /\/(index\.html)?$/.test(window.location.pathname);
    var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isHome && !calm && !window.location.hash && !window.sessionStorage.getItem("intro-seen")) {
      window.sessionStorage.setItem("intro-seen", "yes");
      document.documentElement.classList.add("intro-on");
    }
  } catch (e) {
    // Browser storage not available (e.g. some private modes): no intro.
  }
})();

document.addEventListener("DOMContentLoaded", function () {
  var button = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");

  if (!button || !nav) {
    return;
  }

  function setOpen(isOpen) {
    nav.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  // Open or close the menu when the button is pressed.
  button.addEventListener("click", function () {
    setOpen(!nav.classList.contains("is-open"));
  });

  // Close the menu when tapping anywhere outside it.
  document.addEventListener("click", function (event) {
    if (!nav.contains(event.target) && !button.contains(event.target)) {
      setOpen(false);
    }
  });

  // Close the menu with the Escape key, and put the focus back on the button.
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      button.focus();
    }
  });
});

// Fade page content in gradually as it scrolls into view: the further an item
// has come up the screen, the clearer it is. Each item only ever fades in:
// scrolling back up never fades it out again. Items are whole sections, or,
// in sections that contain cards, the section's heading and each card on its
// own. The look is in css/style.css; without this script, or when the
// visitor's device is set to reduce motion, everything simply shows normally.
document.addEventListener("DOMContentLoaded", function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  var items = [];
  Array.prototype.forEach.call(document.querySelectorAll("main section"), function (section) {
    var cards = section.querySelectorAll(".card");
    if (cards.length === 0) {
      items.push(section);
    } else {
      Array.prototype.forEach.call(section.children, function (child) {
        if (/^H[1-6]$/.test(child.tagName)) {
          items.push(child);
        }
      });
      Array.prototype.forEach.call(cards, function (card) {
        items.push(card);
      });
    }
  });

  var shown = items.map(function () { return 0; });   // how far each item has faded in so far
  var waiting = false;
  var pageOpened = false;        // true once the opening glide has finished

  // How far an item should be faded in right now, from 0 (hidden) to 1 (fully
  // shown). It starts when the item's top enters the bottom of the screen and
  // is complete when its top reaches 70% of the way down. An item near the end
  // of the page that can never get that high is complete when the page is
  // scrolled all the way down, so nothing is ever left half-faded.
  function fadeAmount(item, i) {
    var screen = window.innerHeight;
    // Where the item really is, leaving out the small downward shift that is
    // part of the fade (20px when hidden, 0 when fully shown).
    var top = item.getBoundingClientRect().top - (1 - shown[i]) * 20;
    var scrollLeft = document.documentElement.scrollHeight - screen - window.scrollY;
    var lowestTop = top - Math.max(0, scrollLeft);   // its top once fully scrolled down
    var start = screen;
    var end = Math.max(screen * 0.7, lowestTop);
    if (top <= end || end >= start) {
      return 1;
    }
    if (top >= start) {
      return 0;
    }
    return (start - top) / (start - end);
  }

  function update() {
    waiting = false;
    items.forEach(function (item, i) {
      if (shown[i] === null) {
        return;                  // finished: fully shown for good
      }
      var amount = Math.max(shown[i], fadeAmount(item, i));   // never fade back out
      shown[i] = amount;
      if (amount === 1 && pageOpened) {
        // Fully shown: remove the fade settings so the item goes back to its
        // normal styles (e.g. cards lifting on hover).
        item.style.opacity = "";
        item.style.transform = "";
        item.classList.remove("reveal", "is-scroll-linked");
        shown[i] = null;
      } else {
        item.style.opacity = amount;
        item.style.transform = "translateY(" + ((1 - amount) * 20) + "px)";
      }
    });
  }

  // Update at most once per screen refresh while scrolling.
  function onScroll() {
    if (!waiting) {
      waiting = true;
      window.requestAnimationFrame(update);
    }
  }

  items.forEach(function (item) {
    item.classList.add("reveal");
  });

  // When the page opens, let the items on screen glide into place, then
  // switch to following the scrolling directly.
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      update();
      window.setTimeout(function () {
        pageOpened = true;
        items.forEach(function (item) {
          item.classList.add("is-scroll-linked");
        });
        update();
      }, 650);
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
});

// "Copy" buttons: copy the text in the button's data-copy attribute, then show
// "Copied!" with a check mark for a moment. If the browser doesn't allow
// copying, highlight the text so the visitor can copy it themselves.
document.addEventListener("DOMContentLoaded", function () {
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Older browsers: copy through a temporary, invisible text box.
    return new Promise(function (resolve, reject) {
      var box = document.createElement("textarea");
      box.value = text;
      box.setAttribute("readonly", "");
      box.style.position = "fixed";
      box.style.opacity = "0";
      document.body.appendChild(box);
      box.select();
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (error) {
        ok = false;
      }
      document.body.removeChild(box);
      if (ok) {
        resolve();
      } else {
        reject();
      }
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".copy-button"), function (button) {
    var icon = button.querySelector(".copy-icon");
    var label = button.querySelector(".copy-label");
    var item = button.closest("li");
    var status = item ? item.querySelector(".copy-status") : null;
    var timer = null;

    function show(iconText, labelText, statusText, copied) {
      icon.textContent = iconText;
      label.textContent = labelText;
      button.classList.toggle("is-copied", copied);
      if (status) {
        status.textContent = statusText;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        icon.textContent = "📋";
        label.textContent = "Copy";
        button.classList.remove("is-copied");
        if (status) {
          status.textContent = "";
        }
      }, 2000);
    }

    button.addEventListener("click", function () {
      var text = button.getAttribute("data-copy");
      copyText(text).then(function () {
        show("✅", "Copied!", "Email address copied", true);
      }, function () {
        // Couldn't copy: highlight the address so it can be copied by hand.
        var textEl = button.parentNode.querySelector(".popover-text");
        if (textEl && window.getSelection) {
          var range = document.createRange();
          range.selectNodeContents(textEl);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
        }
        show("⌨️", "Press Ctrl+C", "Press Control C to copy the email address", false);
      });
    });
  });
});

// On large screens the header is "sticky", but moved up by the height of
// everything above the page links (בס״ד and the logo), so only the row of
// links (and the pastel line under it) stays at the top while scrolling. The
// stickiness itself is in css/style.css; this only measures how far to move it.
document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector(".site-header");
  var nav = document.getElementById("site-nav");
  if (!header || !nav) {
    return;
  }

  function measure() {
    var above = nav.getBoundingClientRect().top - header.getBoundingClientRect().top;
    header.style.top = (-Math.max(0, above)) + "px";
  }

  measure();
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);   // after the logo and fonts have loaded
});

// On phones, the "Menu" button stays in the top-right corner while scrolling.
// It starts in its usual place next to the logo; just as it would scroll off
// the top of the screen, it is pinned to the corner (the "menu-floating"
// class), so it never jumps. The opened menu box then appears right under it.
document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector(".site-header");
  var bar = document.querySelector(".header-bar");
  var button = document.querySelector(".menu-toggle");
  if (!header || !bar || !button) {
    return;
  }
  var wide = window.matchMedia("(min-width: 48rem)");
  var waiting = false;

  function update() {
    waiting = false;
    var gap = parseFloat(getComputedStyle(bar).paddingBottom) || 0;   // 0.75rem
    // Where the button's top would be if it simply scrolled with the header
    var usualTop = bar.getBoundingClientRect().bottom - gap - button.offsetHeight;
    var floating = !wide.matches && usualTop < gap;
    header.classList.toggle("menu-floating", floating);
    if (floating) {
      header.style.setProperty("--menu-bottom", button.getBoundingClientRect().bottom + "px");
    }
  }

  function onScroll() {
    if (!waiting) {
      waiting = true;
      window.requestAnimationFrame(update);
    }
  }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
});

// The Home page intro (see the top of this file): waits for the first scroll,
// tap or key press, then slides the big logo onto the header logo and fades the
// intro away. The page itself doesn't scroll until the logo has landed.
document.addEventListener("DOMContentLoaded", function () {
  var root = document.documentElement;
  var intro = document.querySelector(".intro");
  if (!intro) {
    return;
  }
  if (!root.classList.contains("intro-on")) {
    intro.parentNode.removeChild(intro);
    return;
  }
  var big = intro.querySelector(".intro-logo");
  var target = document.querySelector(".brand-logo");
  var started = false;
  var scrollKeys = [" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "End", "Home"];

  window.scrollTo(0, 0);

  function hold(event) {
    // Keep the page still until the logo has landed
    if (event.cancelable && (event.type !== "keydown" || scrollKeys.indexOf(event.key) !== -1)) {
      event.preventDefault();
    }
    start();
  }

  function start() {
    if (started) {
      return;
    }
    started = true;
    var from = big.getBoundingClientRect();
    var to = target.getBoundingClientRect();
    var dx = (to.left + to.width / 2) - (from.left + from.width / 2);
    var dy = (to.top + to.height / 2) - (from.top + from.height / 2);
    big.style.transform = "translate(" + dx + "px, " + dy + "px) scale(" + (to.width / from.width) + ")";
    intro.classList.add("is-leaving");
    // Remove the intro once the logo has landed (or after 2 seconds, just in case)
    big.addEventListener("transitionend", finish);
    window.setTimeout(finish, 2000);
  }

  function finish() {
    if (!root.classList.contains("intro-on")) {
      return;
    }
    root.classList.remove("intro-on");
    if (intro.parentNode) {
      intro.parentNode.removeChild(intro);
    }
    window.removeEventListener("wheel", hold);
    window.removeEventListener("touchmove", hold);
    window.removeEventListener("keydown", hold);
  }

  window.addEventListener("wheel", hold, { passive: false });
  window.addEventListener("touchmove", hold, { passive: false });
  window.addEventListener("keydown", hold);
  intro.addEventListener("click", start);
  intro.addEventListener("touchstart", start, { passive: true });
});

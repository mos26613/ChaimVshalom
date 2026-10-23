# Chaim V'Shalom — Website Plan

The plan and the decisions for the organization's website. The site is built
and live; `README.md` explains how its files work, and section 11 below has
the current status.

## 1. About the organization

- **What:** Torah lessons (shiurim) for religious women. Run entirely by women.
- **Activities:** classes, events, trips, and (later) accepting donations.
- **Where:** Israel.
- **Legal status:** not yet registered. Plan is to register as an *amuta*
  (Israeli nonprofit) later.
- **Language:** English only for now. Hebrew may be added later.
- **Maintainer:** the project volunteer (technical side, keeping the site running).

## 2. Goals for the site

1. Explain who the organization is and what it offers, warmly and clearly.
2. Let women find the class schedule and upcoming events/trips easily.
3. Let people sign up for events and get in touch.
4. Accept donations (added once the basics are working — see section 6).
5. Look good and be easy to use on **phones first**, then tablets and desktops.

## 3. Pages (sitemap)

| Page | Purpose | Notes |
|---|---|---|
| **Home** | First impression | Logo, one-line mission, next upcoming class/event, buttons: "See our classes", "Contact us" |
| **About** | Who we are | Mission, the story of how it started, founder & teachers (text only, no photos) |
| **Classes** | The weekly shiurim | Day, time, topic, teacher, location or online link |
| **Events & Trips** | What's coming up | Date, place, cost, sign-up link; later an archive of past events |
| **Support Us** | Donations | Starts as "coming soon / contact us", becomes a real donate page later |
| **Contact** | Get in touch | Contact form, email, phone, WhatsApp link |
| **Privacy Policy** | Legal | Needed once we collect form submissions or donations |
| **Footer (every page)** | Basics | Name, email, phone, WhatsApp, later the amuta registration number |

Possible later additions: online classes, recorded lessons (audio/video),
newsletter sign-up, Hebrew version.

## 4. Technical approach

- **Plain HTML + CSS + a little JavaScript.** No React, no Node.js.
- **Shared header and footer** via Jekyll, which GitHub Pages runs automatically
  on every push (`_includes/header.html`, `_includes/footer.html`). See README.
- **Mobile-first, responsive design.** The layout is designed for a phone screen
  first, then expands for larger screens. Includes a collapsible "hamburger"
  menu on phones.
- **Hosting:** GitHub Pages (free), published directly from this repository.
- **Accessibility:** readable font sizes, good color contrast, alt text on
  images, works with keyboard navigation.
- **Basic SEO:** page titles, descriptions, and preview images for when links
  are shared on WhatsApp/Facebook.

The files and folders are described in `README.md`.

## 5. Outside services (no servers to run ourselves)

| Need | Approach |
|---|---|
| Contact form | A free form service (e.g. Formspree or Web3Forms) that emails submissions |
| Event / trip sign-ups | Start simple: a Google Form linked from each event |
| Donations | An Israeli donation platform (options in section 6) |
| Domain name | **`chaimvshalom.org`** (connected Oct 20, 2026 via the `CNAME` file) |
| Email | Free at first; Google Workspace for Nonprofits once registered |

## 6. Donations — phased

**Important (Israel-specific):** until the amuta is registered and has its own
bank account, donations would legally go to a private person. Confirm with an
accountant before accepting money. Also, donations only give Israeli donors a
tax credit once the amuta receives **Section 46** approval, which comes
separately and usually later — the site must not claim donations are
tax-deductible until then.

- **Phase A (now):** "Support Us" page explains the mission and says
  "online donations coming soon — contact us."
- **Phase B (after registration + bank account):** connect a donation platform.
  Platforms commonly used by Israeli nonprofits include Nedarim Plus, JGive,
  Israel Toremet, and CauseMatch (for campaigns). We'll compare fees and features
  at that point.
- **Phase C (after Section 46):** add the tax-credit wording and registration
  numbers.

## 7. Build phases

1. **Skeleton** — all pages with placeholder text, shared header/footer, mobile
   menu. Published to a free GitHub Pages address so it can be viewed on a phone.
2. **Design** — colors and fonts based on the logo; layout polish.
3. **Real content** — mission, story, class schedule, upcoming events.
4. **Forms** — contact form and event sign-ups working.
5. **Donations** — per section 6.
6. **Launch** — custom domain, final checks on phone and desktop.

## 8. Decisions

- **No photos of people.** The site is modest by design. Visuals come from the
  logo, colors, typography, simple illustrations/patterns, and photos of places
  (e.g. trip destinations) with no people in them.
- **Classes are in person.** Online classes may be added later — the Classes
  page will be structured so an "Online" option is easy to add.
- **Recorded lessons** exist but are not on the site for now. Possible later
  addition.
- **Contact channels:** email, phone, and WhatsApp. No social media for now.

## 9. Branding (from the first flyer)

- **Full name:** Chaim V'Shalom Women's Learning Center. All five words are the
  name and appear together, in the same font and style, in titles, headings,
  the header and the footer. In running text the short form "Chaim V'Shalom"
  is fine (the maintainer's decision, Oct 21, 2026).
- **Logo:** an open book under a pink arch with a small leaf sprig, the name in
  a classic serif typeface, "WOMEN'S LEARNING CENTER" in serif capitals below.
- **Official logo:** `images/logo.png` — the round logo with the book and the full
  name inside (from the administrator; source PDF is 1254×1254 px). Shown
  centered in the header on every page (8rem wide on phones, 10rem on larger
  screens), with the area outside the circle transparent.
- **Logo emblem file:** `images/logo-emblem.png`, used only as the browser-tab
  icon (512×512, no text, watercolor style, off-white background `#faf8f2`,
  not transparent).
- **Theme: soft pastels** (a specific request from the organization).
  Colors sampled from the logo emblem. The site uses them through the color
  variables at the top of `css/style.css`; lavender and sage are used there in
  lighter shades, and the sampled ones appear in the little leaf drawings.

  | Role | Color | Sampled | On the site (`css/style.css`) |
  |---|---|---|---|
  | Page background | Warm off-white (same as the logo's background) | `#faf8f2` | `--color-bg` `#faf8f2` |
  | Pastel accent | Blush pink (watercolor wash) | `#fad4d2` | `--color-blush` `#fad4d2` |
  | Pastel accent | Dusty rose (center leaf) | `#e9b5af` | `--color-rose` `#e9b5af` |
  | Pastel accent | Lavender (watercolor wash) | `#d8d4e3` | `--color-lavender` `#e7e3f0` (lighter) |
  | Pastel accent | Sage green (left leaf) | `#bac9c1` | `--color-sage` `#dde7e1` (lighter) |
  | Pastel accent | Soft gold (page edges) | `#f4d3ad` | `--color-gold` `#f4d3ad` |
  | Text and headings | Deep navy (book cover / flyer name) | `#0f1f50` | `--color-heading` `#0f1f50`; body text `--color-text` `#1b2440` |

- **Readability rule:** pastels are used for backgrounds, cards, borders and
  decorations — never for text. All text stays dark navy (or near-black) so it
  is easy to read, including for older visitors and on phones in sunlight.
- **Overall feel:** soft, warm and elegant. Mostly off-white and white space,
  pastel bands and cards to separate sections, serif headings like the flyer.

## 10. First program (content for Classes / Events)

- Inaugural learning program, Tuesdays, Oct 27 – Dec 15, 2026
  (15 Cheshvan – 8 Teves), 9–11 a.m., 8 sessions.
- Speakers: Mrs. Fayge Grossman ("Climbing the Ladder of Kirvas Elokim") and
  Mrs. Rivka Segal (Shirei Hama'alos, an in-depth study).
- Location: Sorek 30/2, Ramat Beit Shemesh Aleph (white door on the left).
  This is a **temporary venue** for the classes, not the organization's address,
  so it appears only with the program (Classes page), not on the Contact page.
  When the center has its own building, that becomes the real address.
  Google Maps link (shared from the exact place): https://maps.app.goo.gl/TCkJrz72iCcvFxEPA
  Map position (used by the Waze link): 31.7152846, 34.9878998.
  Displayed as "Sorek" (how it's known locally), not "Nahal Sorek".
  Wheelchair accessible.
- 400₪ for the program or 60₪ per day; early-bird 5% off by Oct 25.
- Coffee and light refreshments; includes a Chanukah chagiga.
- Registration and contact details as listed on the flyer.

## 11. Status and next steps

The maintainer approves every change before it is considered done. The site is
not public yet.

### To do (planned, not started; wait for the maintainer's go-ahead)

The maintainer will say when to start each item. Design items get a preview
first (see `CLAUDE.md`).

1. ~~Fill up the header a bit (it feels a little empty).~~ **Done (Oct 22,
   2026):** two pesukim in an arc over the logo, in navy (Frank Ruhl Libre)
   with a gold ✦ exactly at the top: עץ חיים היא למחזיקים בה (Mishlei 3:18)
   on the right, ה׳ יברך את עמו בשלום (Tehillim 29:11) on the left, no
   nekudos, ה׳ written as the maintainer wrote it. On larger screens the text
   starts exactly at the word "Home" and ends exactly at "Contact Us" (fitted
   by js/main.js); on phones a smaller arc goes around the logo. The Home page
   intro shows only the big logo; the arc appears as the intro screen fades and
   the logo glides into place under it.
2. ~~On large screens, make the header's page links sticky (they stay at the
   top while scrolling). On phones, possibly a sticky "Menu" button as well.~~
   **Done (Oct 21, 2026):** on large screens only the row of page links
   stays at the top; on phones the Menu button stays in the top-right corner.
3. ~~When hovering over a page link in the header, underline it in pink.~~
   **Done (Oct 21, 2026).**
4. ~~Fill up the background of the pages a bit more.~~ **Done (Oct 21,
   2026):** very soft pink/lavender/sage washes on every page, plus the logo's
   little leaves scattered on large screens only (not on phones). The
   maintainer may still adjust it after seeing it live.
5. ~~Fill in the rest of the texts that still need writing (the grey
   placeholders).~~ **Done (Oct 22, 2026):** every page has its real text; the
   last one was Mrs. Fayge Grossman's description. The placeholder style was
   removed from the stylesheet.

### On hold (don't start without the maintainer's go-ahead)

- **`@claude` from GitHub:** the workflow file and `CLAUDE.md` exist, but the
  token/secret setup and test are paused. Working in a Claude session is enough
  for now.
- **Online donations:** waiting for amuta registration and a bank account
  (section 6).

### Waiting on the maintainer / organization

- Nice to have: a **larger `images/logo.png`** (the round logo), about 800×800
  px, exported from the 1254×1254 source PDF. The current file is 320×320, but
  the Home page intro shows the logo up to 384 px wide, so on sharp phone
  screens it can look slightly soft.

### Done

- Site skeleton (7 pages), shared header/footer (Jekyll), pastel design, phone
  menu as a floating box, official round logo centered in the header.
- Upgrades 1–7: pastel hero and header line, soft shadows and hover/press
  effects, icons on cards and class details, leaf flourish under titles, wavy
  footer, scroll fade-in (gradual, cards individually, fades in only once),
  Classes page buttons (Add to calendar, Register on WhatsApp, Call us, Share
  with a friend).
- Footer: short and symmetric on phones (Email us · Call us · WhatsApp | Pages);
  on computers, hovering "Call us" shows the number and "Email us" shows the
  address with a Copy button.
- Directions: Google Maps share link and Waze coordinates for the venue.
- "Add to my calendar:" on the Classes page (Oct 22, 2026): 🍎 Apple (the
  calendar file; confirmed working on an iPhone) and 🤖 Android (a Google
  Calendar link, since on Android the file only went to Downloads).
- About page: real Mission, Story (with the L'Ilui Nishmas dedication)
  and Vision text from the maintainer (Oct 21, 2026), kept exactly as written,
  including the short form "Chaim V'Shalom" where it is mentioned again.
- Home page logo intro (Oct 21, 2026): the first time the Home page is opened
  in a browser tab, the logo shows large in the middle with a "scroll down"
  arrow; the first scroll, tap or key glides it into the header. It doesn't
  repeat in that tab (other pages, back to Home, reload), and is skipped for
  "reduce motion".
- Classes page Registration: "📝 Sign up here" button to the Google Form
  (https://forms.gle/sbRKyN59JcLqJEvbA; the maintainer confirmed it works), a leaf divider, then "Have a
  question?" with WhatsApp us / Call us. "Share with a friend" is in a small
  peach box ("Know someone who'd enjoy this?"): on tablets and computers to
  the right of Registration, with a vertical leaf divider between them; on
  phones underneath.
- Floating "✍️ Register for classes" button in the bottom-right corner of every
  page; one click goes to the Registration section of the Classes page
  (`classes.html#registration`). It may cover the copyright line at the very
  bottom of a page; the maintainer decided that's fine (no extra footer space).

- Code review and tidy-up (Oct 21, 2026), no visible change: the tests now
  fail properly when something breaks; "Skip to content" fixed on computers;
  contact details in `_data/contact.yml`; stylesheet sections, shared pop-up
  styles and named layers; drawings moved to `images/*.svg`.

- Batsheva Singer reviewed the site and had no objection. Her name was later
  removed from the Contact page at the maintainer's request (the phone number
  stays). The Classes page no longer names her either; its Registration text
  is now a short invitation to ask questions.

### Reminders

- After **December 15, 2026** the home page banner ("Now running: our first
  learning program") and the Classes page will be out of date — update them,
  including the calendar file `files/inaugural-program.ics` (a new program
  needs a new calendar file) and the Google Calendar link of the 🤖 Android
  button in `classes.html` (the tests check that the two match).
  Also update or remove the floating "Register for classes" button
  (`_layouts/default.html`) if there is no program open for registration.

### Before going public

- ~~Custom domain~~ **Done (Oct 20, 2026):** the site's address is now
  `chaimvshalom.org` (spelled without an "e" after the "v"). The maintainer
  added the `CNAME` file; it must stay in the repository.
- ~~Update `_config.yml`~~ **Done (Oct 20, 2026):** `url:
  https://chaimvshalom.org` and an empty `baseurl` (used by the "Share with a
  friend" link).
- ~~Switch publishing to `main`~~ **Done (Oct 23, 2026):** the maintainer
  created `main` from `claude/nonprofit-website-planning-21uvpw` and set
  GitHub Pages to publish from it. Changes now go live only when a pull
  request is merged into `main`. The old branch can be deleted once everything
  is confirmed working.
- Final check of every page on phone and computer.

## 12. Other decisions

- **Shabbos (decided Oct 21, 2026):** the site stays on over Shabbos and Yom
  Tov; no closing is needed, as long as nothing is sold on the site. Online
  donations are fine too. If the site ever starts selling things, the
  question comes back
  (the earlier idea for that case: a saved yearly list of Beit Shemesh times
  checked by a small script).

- The L'Ilui Nishmas dedication goes at the bottom of every page, in the footer
  (and on the About page). Spelling (Oct 21, 2026): ישעי' is written with a
  plain apostrophe ', not a geresh ׳.

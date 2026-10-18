# Chaim V'Shalom — Website Plan

A planning document for the organization's website. No code yet — this is the
blueprint we'll build from.

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
| **Home** | First impression | Logo, one-line mission, next upcoming class/event, buttons: "See classes", "Support us" |
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

Planned folder layout:

```
index.html          ← Home
about.html
classes.html
events.html
support.html
contact.html
privacy.html
css/style.css       ← one shared stylesheet
js/main.js          ← small scripts (mobile menu, etc.)
images/             ← logo, photos
```

## 5. Outside services (no servers to run ourselves)

| Need | Approach |
|---|---|
| Contact form | A free form service (e.g. Formspree or Web3Forms) that emails submissions |
| Event / trip sign-ups | Start simple: a Google Form linked from each event |
| Donations | An Israeli donation platform (options in section 6) |
| Domain name | e.g. `chaimveshalom.org` / `.org.il` — roughly $10–20/year |
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
  name and always appear together, in the same font and style.
- **Logo:** an open book under a pink arch with a small leaf sprig, the name in
  a classic serif typeface, "WOMEN'S LEARNING CENTER" in serif capitals below.
- **Logo emblem file:** `images/logo-emblem.png` (512×512, no text, watercolor
  style, off-white background `#faf8f2`, not transparent). The name and
  the full name will be real text next to/under it.
- **Theme: soft pastels** (a specific request from the organization).
  Colors sampled from the logo emblem:

  | Role | Color | Hex (approx.) |
  |---|---|---|
  | Page background | Warm off-white (same as the logo's background) | `#faf8f2` |
  | Pastel accent | Blush pink (watercolor wash) | `#fad4d2` |
  | Pastel accent | Dusty rose (center leaf) | `#e9b5af` |
  | Pastel accent | Lavender (watercolor wash) | `#d8d4e3` |
  | Pastel accent | Sage green (left leaf) | `#bac9c1` |
  | Pastel accent | Soft gold (page edges) | `#f4d3ad` |
  | Text and headings | Deep navy (book cover / flyer name) | `#0f1f50` |

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
  Wheelchair accessible.
- 400₪ for the program or 60₪ per day; early-bird 5% off by Oct 25.
- Coffee and light refreshments; includes a Chanukah chagiga.
- Registration and contact details as listed on the flyer.

## 11. Still open

- Nice to have: a **larger version of the logo emblem** (at least 1024 px wide,
  or SVG), ideally with a transparent background. The current file works for the
  header, but the drawing itself is only about 440×220 px, so it would look soft
  if shown large (e.g. in a big banner on the home page).

## 12. Other decisions

- The L'Ilui Nishmas dedication goes at the bottom of every page, in the footer.

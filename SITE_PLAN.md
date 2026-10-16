# Chaim VeShalom — Website Plan

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

- **Plain HTML + CSS + a little JavaScript.** No React, no Node.js, no build step.
  Every file can be opened and read directly.
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

## 9. Still open

- Logo file (to be attached) — ideally SVG or a high-resolution PNG. Site colors
  will be taken from it.
- Class location(s) and schedule details (can be placeholders until known).

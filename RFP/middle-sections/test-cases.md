# Middle Sections — Test Cases

- Feature: `middle-sections`
- Date: 2026-10-24
- Status: **approved**
- Suite: `tests/middle-sections.spec.ts` + updated interaction/landing specs
- Browsers: Chromium, Firefox, WebKit

## Coverage summary

| Requirement | Test cases |
| --- | --- |
| R-45 | TC-49 |
| R-46 | TC-51 |
| R-47 | TC-52 |
| R-48 | TC-53 |
| R-49 | TC-50 |
| R-50, R-54 | TC-54 |
| R-51 | TC-55, TC-56 |
| R-53 | TC-57, TC-58 |
| R-55, R-56 | TC-59, TC-60 |
| R-57 | TC-61, TC-62 |
| R-58, R-59 | TC-63, TC-64 |
| R-60 | TC-57, TC-60, TC-67 |
| R-61, R-62 | TC-66 |
| R-63 | TC-67, TC-68 |
| R-64 | TC-69 |
| R-65 | TC-71 |
| R-66 | TC-70 |
| R-67 | TC-65 |

## Test cases

| ID | Title | Traces to | Steps | Expected result |
| --- | --- | --- | --- | --- |
| TC-49 | Hero text and visuals are both clear | R-45 | Desktop 1280: open `/` | Panel background is transparent, canvas visible, heading/lead readable |
| TC-50 | Hero layout on mobile | R-45, R-49 | 360px: open `/` | CTA full-width, no overlap, no horizontal scroll |
| TC-51 | Slides advance and can be driven manually | R-46 | Wait for auto-advance; click next/prev/dots | Counter changes, dots update `aria-current` |
| TC-52 | Explore Centres opens the listing | R-47 | Click hero primary CTA | URL `/centres`, heading + 12 cards |
| TC-53 | Visuals never block clicks | R-48 | Click CTA with canvas behind | Navigation happens (no interception) |
| TC-54 | Exactly five service categories | R-50, R-54 | Inspect landing services | Five cards: Yoga, Meditation, Ayurveda, Panchkarma, Spa; no Natural Wellness card |
| TC-55 | Each category opens its centres | R-51 | Click each of the five cards | `/services/<slug>` with matching heading |
| TC-56 | Spa maps to Ayurvedic Spa | R-51, D-6 | Open `/services/spa` | Every card lists Ayurvedic Spa; heading "Spa centres" |
| TC-57 | Category and centre grids reflow | R-53, R-60 | 360/768/1280 | 1/2/3 columns, no horizontal scroll |
| TC-58 | Category cards are keyboard operable | R-53 | Tab to a card, press Enter | Correct category page opens, focus ring visible |
| TC-59 | Featured card shows every field | R-55, R-56 | Inspect first featured card | Photo, name, city, services, rating, price, demo badge |
| TC-60 | Featured cards on mobile | R-55, R-60 | 360px | Photo renders with 4:3 ratio, text not clipped, card full-width |
| TC-61 | View Profile opens the right centre | R-57 | Click "View Profile" on the first card | `/centres/<id>` and the heading matches that centre |
| TC-62 | Every card opens its own profile | R-57 | Loop all six cards | Each profile heading matches the card name |
| TC-63 | Profile page content | R-58 | Open a profile | Name, city, photo, services, rating, price, description, Enquire CTA, breadcrumb |
| TC-64 | Broken photo falls back gracefully | R-59 | Force the image to fail | Placeholder with centre initial; no broken-image icon; alt text present |
| TC-65 | Enquiry from a profile | R-67 | Click Enquire on a profile, submit | Dialog prefilled with the centre and service; success state |
| TC-66 | Exactly three ordered steps | R-61, R-62 | Inspect How It Works | Three items in order: Find a centre, Compare profiles, Send an enquiry; numbers 01-03; `ol` element |
| TC-67 | Steps stack on mobile | R-63 | 360px | One column, no clipping |
| TC-68 | Steps are three columns on desktop | R-63 | 1280px | Three equal columns in one row |
| TC-69 | No navigation regressions | R-64 | Visit `/`, `/centres`, `/services/yoga`, `/centres/sattva-house`, `/nope` | All render correctly; 404 still offers home |
| TC-70 | Accessibility scan | R-66 | axe on `/`, `/centres`, profile | No serious/critical violations |
| TC-71 | Per-page metadata | R-65 | Read titles | Landing, category and profile titles are all distinct |

## Manual checks

| ID | Title | Traces to | Expected result |
| --- | --- | --- | --- |
| MC-1 | Photo quality and crop | R-55 | Images look intentional, faces/text not cropped awkwardly |
| MC-2 | Hero blend | R-45, R-48 | Visuals blend into the background without distracting from text |
| MC-3 | Mobile feel | R-49, R-60, R-63 | Comfortable spacing and tap targets on a real phone |

## Sign-off

- Requirements approved: 2026-10-24
- Test cases approved: 2026-10-24
- Last run: `npm test` — 261 passed, 6 skipped (Chromium, Firefox, WebKit; workers=3)
- Middle suite: 75/75 (25 × 3 browsers); headed pass 25/25
- Production build: `npm run build` — pass
- Deployed: `welltogether-77546` — hosting

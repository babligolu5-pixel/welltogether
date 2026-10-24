# Header Navigation — Test Cases

- Feature: `header-navigation`
- Date: 2026-10-24
- Status: **approved**
- Suites: `tests/header-navigation.spec.ts`, updated `tests/interactions.spec.ts`
- Browsers: Chromium, Firefox, WebKit

## Coverage summary

| Requirement | Test cases |
| --- | --- |
| R-1, R-2 | TC-1, TC-2 |
| R-3 | TC-3 |
| R-4, R-5 | TC-4 |
| R-6 | TC-5, TC-6 |
| R-7 | TC-7 |
| R-8, R-10 | TC-8, TC-9 |
| R-9 | TC-9 |
| R-11 | TC-21 (manual) |
| R-12 | TC-10, TC-11, TC-17 |
| R-13 | TC-12, TC-13 |
| R-14 | TC-14 |
| R-15 | TC-15 |
| R-16 | TC-18 |
| R-17 | TC-16 |
| D-1 | TC-20 |

## Test cases

| ID | Title | Traces to | Steps | Expected result |
| --- | --- | --- | --- | --- |
| TC-1 | Wordmark returns home from a sub-page | R-1 | Open `/centres` → click wordmark | URL `/`, hero visible |
| TC-2 | Wordmark scrolls to top on home | R-2 | Home → scroll down → click wordmark | `scrollY` 0, no reload |
| TC-3 | Wordmark is keyboard accessible | R-3 | Tab to wordmark → Enter | Focus visible, Enter navigates home, accessible name "WellTogether" |
| TC-4 | Explore Centres opens the listing | R-4, R-5 | Click "Explore Centres" | `/centres`, H1 + count, ≥ 12 cards, each with city/price/demo badge |
| TC-5 | Deep link to the listing | R-6 | Open `/centres` directly and reload | Page renders, no 404 |
| TC-6 | Active page state | R-6 | Inspect header on `/centres` | "Explore Centres" has `aria-current="page"` |
| TC-7 | Services menu items | R-7 | Click "Services" | Menu opens with exactly Yoga, Meditation, Ayurveda, Panchkarma, Spa |
| TC-8 | Yoga category filters correctly | R-8, R-10 | Menu → Yoga | `/services/yoga`; heading "Yoga"; every card's chips include Yoga; renaming count matches |
| TC-9 | All five categories work | R-8, R-9, R-10 | Visit all five categories | Each has its own heading/intro, ≥ 3 centres, and only matching services |
| TC-10 | Menu closes | R-12 | Open menu → outside click; reopen → Escape | Menu hidden, `aria-expanded="false"`, focus returns to the button on Escape |
| TC-11 | Keyboard navigation | R-12 | Focus "Services" → Enter → ArrowDown ×2 → Enter | Third item focused then category page opens |
| TC-12 | Deep link to a category | R-13 | Open `/services/ayurveda` directly | Renders, page scrolled to top |
| TC-13 | Unknown route | R-13 | Open `/random-xyz` | 404 page with "Back to home" that navigates to `/` |
| TC-14 | Header consistency | R-14 | Check header on `/`, `/centres`, `/services/yoga` | Same items; mobile menu opens/closes on each |
| TC-15 | Enquiry from category page | R-15 | `/services/yoga` → Enquire | Dialog opens with that centre's name and service, submit succeeds |
| TC-16 | Responsive layout | R-17 | 360/768/1280 on `/centres` and `/services/yoga` | No horizontal overflow; cards 1/2/3 columns |
| TC-17 | Mobile menu accordion | R-12, R-17 | 360px → hamburger → Services | Five items expand, tapping one navigates and closes the menu |
| TC-18 | Per-route metadata | R-16 | Read document titles | `/`, `/centres`, each category have distinct titles + meta description |
| TC-19 | Accessibility scan | R-12, R-14 | axe-core on `/`, `/centres`, `/services/yoga` | No serious/critical violations |
| TC-20 | Data integrity | D-1, D-2 | Inspect dataset | Every centre's services are valid categories; each menu category has ≥ 3 centres; "Spa" maps to "Ayurvedic Spa" |
| TC-21 | Empty category | R-11 | Manual: point a category at an empty service set | "No centres listed yet" + working "Browse all centres" |

## Manual checks

| ID | Title | Traces to | Expected result |
| --- | --- | --- | --- |
| MC-1 | Empty state | R-11 | Message + link visible and usable |
| MC-2 | Menu visual feel | R-12 | Dropdown aligns under the trigger, no layout jump |
| MC-3 | Mobile touch feel | R-17 | Accordion rows are comfortable tap targets |

## Sign-off

- Requirements approved: 2026-10-24
- Test cases approved: 2026-10-24
- Last run: `npm test` — 186 passed, 6 skipped (Chromium, Firefox, WebKit; workers=3)
- Header suite: 66/66 passed (22 × 3 browsers); headed pass 22/22
- Production build: `npm run build` — pass
- Deployed: `welltogether-77546` — hosting

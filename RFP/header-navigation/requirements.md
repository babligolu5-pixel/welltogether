# Header Navigation — Requirements

- Feature: `header-navigation`
- Branch: `feature/header-navigation` (from `develop`)
- Date: 2026-10-24
- Status: **approved**
- Approved by: user ("Approved 1-3") — 2026-10-24
- Covers: header features 1–3 (Logo/Home, Explore Centres, Services menu)

## Goal

The header becomes real navigation: the wordmark returns home, "Explore Centres"
opens a centres listing page, and a Services menu opens category pages that show
only the centres offering that service.

## Scope

### In scope

- Client-side routing (`/`, `/centres`, `/services/:slug`, 404).
- Wordmark → home behaviour.
- "Explore Centres" nav item + `/centres` listing page.
- Services dropdown menu with 5 categories + filtered category pages.
- Demo dataset expanded so every category has at least three centres.
- Header active states, deep links, per-route titles, enquiry flow from new pages.

### Out of scope

Search, city filter, authentication, provider onboarding, admin, images,
Firestore-backed centres (all deferred to later approved batches).

## Requirements

| ID | Requirement | Acceptance criteria | Priority |
| --- | --- | --- | --- |
| R-1 | Wordmark (logo + "WellTogether") links to home | From any page, a click lands on `/` | critical |
| R-2 | Wordmark on home scrolls to top | No reload; `window.scrollY` becomes 0 | high |
| R-3 | Wordmark is accessible | Name "WellTogether", Enter/Space works, visible focus, ≥ 44px target | high |
| R-4 | Header item "Explore Centres" | Click navigates to `/centres` | critical |
| R-5 | `/centres` lists all centres | Same card design (name, city, services, rating, price, demo badge); heading shows the count | critical |
| R-6 | Deep link + active state | `/centres` opens directly on refresh; header marks it `aria-current="page"`; demo disclosure visible | critical |
| R-7 | Services menu opens | Items exactly: Yoga, Meditation, Ayurveda, Panchkarma, Spa | critical |
| R-8 | Category selection | `/services/yoga`, `/services/meditation`, `/services/ayurveda`, `/services/panchkarma`, `/services/spa` | critical |
| R-9 | Category page content | Category title + one-line intro + centres filtered by that service | critical |
| R-10 | Filter correctness | Only centres offering the service appear; no cross-category leakage; count matches | critical |
| R-11 | Empty state | "No centres listed yet" + working "Browse all centres" link | medium |
| R-12 | Menu accessibility | `aria-expanded`, arrow-key navigation, `Escape` closes and restores focus, outside click closes, mobile accordion | critical |
| R-13 | SPA routing | Unknown route → 404 page with working "Back to home"; top-of-page scroll on navigation; Hosting rewrite serves deep links | high |
| R-14 | Header consistency | Same header on every page; current page indicated; mobile menu behaviour unchanged | high |
| R-15 | Enquiry flow intact | Card "Enquire" on new pages opens the dialog with centre prefill and submits | critical |
| R-16 | Per-route SEO | `/centres` and each category have distinct title + meta description | medium |
| R-17 | Responsive | 360 / 768 / 1280: no horizontal scroll, cards reflow, menu usable | critical |

## Data rules

| Rule | Detail |
| --- | --- |
| D-1 | Demo dataset grows to 12 centres so each of the 5 menu categories has ≥ 3 centres |
| D-2 | "Spa" in the menu maps to the existing "Ayurvedic Spa" service (slug `spa`) |
| D-3 | "Natural Wellness" stays on the landing categories and in `/centres`, but is not in the Services menu |
| D-4 | Data stays static in `src/data/` for this batch; a data-access module isolates it so Firestore can replace it later without touching pages |

## Decisions

| Suggestion | Decision |
| --- | --- |
| S-1 React Router for SPA routes | accepted |
| S-2 `/services/<slug>` path instead of query param | accepted |
| S-3 Rename "Centres" nav item to "Explore Centres" | accepted |
| S-4 Expand demo dataset to 12 centres | accepted |
| S-5 Category page intro + Enquire CTA | accepted |
| S-6 Route-level lazy loading | accepted |

## Known impact

- Existing header links "Services" and "Centres" are replaced (Services becomes a
  menu button), so the interaction suite is updated to the new behaviour.

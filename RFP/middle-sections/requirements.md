# Middle Sections — Requirements

- Feature: `middle-sections`
- Branch: `feature/middle-sections` (from `develop`)
- Date: 2026-10-24
- Status: **approved**
- Approved by: user ("Approved middle-sections") — 2026-10-24
- Covers: hero, explore services, featured centres, how it works

## Goal

Tighten the landing page narrative: the hero leads to the centres listing, the
services grid opens category pages, featured centres expose a profile route with
photographs, and "How It Works" explains the marketplace in exactly three steps.

## What changes vs the current site

| Section | Before | After |
| --- | --- | --- |
| Hero | CTAs "Explore Wellness" + "Find a Centre" | Primary "Explore Centres" → `/centres`; secondary "Find a Centre" opens the enquiry dialog |
| Explore services | 6 cards, click opened the enquiry dialog | 5 cards (Yoga, Meditation, Ayurveda, Panchkarma, Spa), click opens `/services/<slug>` |
| Featured centres | Text cards + "Enquire" | Photo + details + "View Profile" → `/centres/<id>` (Enquire stays) |
| How it works | 4 steps | 3 steps: Find a centre → Compare profiles → Send an enquiry |

## Requirements

| ID | Requirement | Acceptance criteria | Priority |
| --- | --- | --- | --- |
| R-45 | Transparent content panel over the 3D visuals | No fill/blur, visuals visible through it, text contrast ≥ 4.5:1 | critical |
| R-46 | Hero content slides | ≥ 3 slides; auto-advance; prev/next; dots with `aria-current` | critical |
| R-47 | Primary CTA "Explore Centres" | Navigates to `/centres`; ≥ 44px; Enter/Space works | critical |
| R-48 | Visuals never block reading or clicking | Canvas `pointer-events: none`; static under reduced motion; lightweight on mobile | critical |
| R-49 | Hero responsive | 360/768/1280: no overlap, no horizontal scroll, CTA full-width on mobile | critical |
| R-50 | Exactly five service categories | Yoga, Meditation, Ayurveda, Panchkarma, Spa (Spa = Ayurvedic Spa) | critical |
| R-51 | Category click opens related centres | `/services/<slug>` listing filtered to that service | critical |
| R-52 | Category card content | Icon, name, one-line description, "View centres" hint; hover/focus state | high |
| R-53 | Category grid responsive + keyboard | 1/2/3 columns; Enter activates; visible focus | high |
| R-54 | Natural Wellness removed from landing | Still present in `/centres` data and listings | medium |
| R-55 | Centre card photo | 4:3 image, `alt="<name>, <city>"`, `loading="lazy"`, demo badge kept | high |
| R-56 | Centre card details | Name, city, services, rating, starting price | critical |
| R-57 | "View Profile" navigation | Opens `/centres/<centre-id>` for that exact centre | critical |
| R-58 | Centre profile page | Name, city, photo, services, rating, price, description, Enquire CTA, breadcrumb | critical |
| R-59 | Image fallback | Broken image shows a branded placeholder with the centre initial; no broken icon | medium |
| R-60 | Responsive cards and profile | 1/2/3 columns; profile readable at 360/768/1280 | high |
| R-61 | Exactly three steps in How It Works | Find a centre → Compare profiles → Send an enquiry | critical |
| R-62 | Step order and numbering | Visual order matches, `01/02/03` visible, semantic ordered list | high |
| R-63 | Steps responsive | Stacked on mobile, three columns on desktop, even heights | high |
| R-64 | No navigation regressions | Header, `/centres`, `/services/*`, 404 still work | critical |
| R-65 | Per-page metadata | Landing, category, profile each have distinct title + description | medium |
| R-66 | Accessibility | axe: no serious/critical violations on `/`, `/centres`, profile | high |
| R-67 | Enquiry from a profile | Dialog opens prefilled with the centre and its service; submit succeeds | critical |

## Data

| Rule | Detail |
| --- | --- |
| D-5 | Centre photos are bundled demo artwork (`public/centres/<id>.svg`) generated for this preview; real photography can replace them later without code changes |
| D-6 | "Spa" maps to the `Ayurvedic Spa` service, as on the services menu |
| D-7 | Steps copy lives in `src/data/site.ts`; three entries only |

## Decisions

| Suggestion | Decision |
| --- | --- |
| S-14 Dedicated `/centres/:id` profile route | accepted |
| S-15 Bundled placeholder artwork now, real photos later | accepted |
| S-16 "View centres" hint on category cards | accepted |
| S-17 Keep a secondary "Find a Centre" CTA | accepted |
| S-18 Similar centres on the profile | deferred |
| S-19 Semantic ordered list for steps | accepted |

## Known test impact

Existing interaction tests change: hero CTA label, category click behaviour,
centre card buttons and the number of steps.

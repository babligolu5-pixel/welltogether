# WellTogether — Test Cases

- Feature: `welltogether-marketplace`
- Date: 2026-10-24
- Status: **approved**
- Suite: `tests/welltogether.spec.ts`, `tests/welltogether-a11y.spec.ts`
- Browsers: Chromium, Firefox, WebKit

## Coverage summary

| Requirement | Test cases | Automated |
| --- | --- | --- |
| R-1 | TC-24 | partially (contrast via tokens) + manual |
| R-2 | TC-22 | yes |
| R-3 | TC-1 | yes |
| R-4 | TC-2 | yes |
| R-5 | TC-3, TC-4 | yes (structure/motion state) |
| R-6 | TC-5, TC-6, TC-7 | yes |
| R-7 | TC-8 | partial + manual |
| R-8 | TC-8, TC-9 | yes |
| R-9 | TC-10 | yes |
| R-10 | TC-11 | yes |
| R-11 | TC-12, TC-15 | yes |
| R-12 | TC-13 | yes |
| R-13 | TC-14, TC-15 | yes |
| R-14 | TC-15 | yes |
| R-15 | TC-16, TC-17 | yes |
| R-16 | TC-18, TC-19 | yes (UI); Firestore write blocked |
| R-17 | TC-21 | partial |
| R-18 | TC-20, TC-22, TC-23 | yes |
| R-19 | TC-24 | yes |
| R-20 | TC-15 | yes |

## Test cases

| ID | Title | Traces to | Priority | Expected result |
| --- | --- | --- | --- | --- |
| TC-1 | Hero starts directly under the header | R-3 | critical | Hero top offset equals header height at 360/768/1280 |
| TC-2 | Hero canvas is full-bleed and unframed | R-4 | critical | Canvas spans viewport width; no card/section border; `pointer-events: none` |
| TC-3 | Visual layer does not block the CTAs | R-5 | critical | Both hero CTAs receive clicks and are visible |
| TC-4 | Reduced motion disables the animation | R-5 | critical | With `prefers-reduced-motion: reduce`, canvas is marked static and no animation loop runs |
| TC-5 | Frosted panel shows heading, description and ≥3 slides | R-6 | critical | Panel visible, `backdrop-filter` applied, slide counter ≥ 3 |
| TC-6 | Manual navigation works | R-6 | critical | Next/prev/dots and ArrowRight/ArrowLeft change the active slide |
| TC-7 | Autoplay can be paused | R-6 | high | Pause button toggles `aria-pressed`; slide stops advancing while paused |
| TC-8 | Palette tokens and contrast | R-7, R-8 | critical | Computed styles use token hexes; button text contrast ≥ 4.5:1 |
| TC-9 | Primary actions use Muted Olive | R-8 | high | Hero CTA and submit button background is `rgb(95, 107, 69)` |
| TC-10 | Hero CTAs scroll to their sections | R-9 | high | "Explore Wellness" scrolls to services, "Find a Centre" to centres; targets ≥ 44px |
| TC-11 | Six service categories with exact labels | R-10 | high | Yoga, Meditation, Ayurveda, Panchkarma, Ayurvedic Spa, Natural Wellness |
| TC-12 | Featured centres show required fields | R-11 | high | ≥ 6 cards, each with name, city, services, rating, price, demo badge |
| TC-13 | How It Works shows ordered steps | R-12 | medium | 3–4 steps in numbered order |
| TC-14 | Reviews render with demo label | R-13 | medium | ≥ 4 reviews with author, rating, text and demo label |
| TC-15 | Demo data is disclosed | R-14, R-20 | high | Page-level note present; every demo card carries a badge; ₹ and Indian cities appear |
| TC-16 | Responsive layout has no overflow | R-15 | critical | At 360/768/1280 `scrollWidth <= clientWidth`; category grid column count adapts |
| TC-17 | Small screens get the lightweight visual mode | R-15 | high | At 360 px the scene is flagged lightweight (reduced particle count / DPR cap) |
| TC-18 | Enquiry validation | R-16 | critical | Empty submit shows required errors; invalid email shows email error; no request is sent |
| TC-19 | Enquiry success and duplicate guard | R-16 | critical | Valid submit shows success state; submit disabled while pending; second submit blocked |
| TC-20 | Enquiry service contract | R-16 | critical | Adapter rejects missing required fields and rate-limits repeated submits |
| TC-21 | 3D loads lazily and pauses when hidden | R-17 | medium | Canvas mounts after first paint; paused state set when page hidden or offscreen |
| TC-22 | Keyboard journey | R-18 | critical | Tabbing reaches header nav, both CTAs, carousel controls, category card, form submit |
| TC-23 | Accessibility scan | R-18 | high | axe-core: no serious/critical violations; single h1; labelled inputs |
| TC-24 | SEO metadata | R-19 | medium | Title, meta description, OG tags, favicon link, `lang="en"` |

## Fixtures and rules checks

| TC | Seed data | Cleanup | Rule exercised | Expected for forbidden access |
| --- | --- | --- | --- | --- |
| TC-19 | No Firestore write in E2E (adapter mock via `VITE_E2E_MODE=1`) | n/a | client validation only | friendly error state, never a raw Firebase error |
| TC-20 | In-memory adapter | n/a | field validation, rate limit | rejected with a user-readable message |
| Rules (blocked) | `enquiries` documents via emulator | emulator reset | create allowed; read/update/delete denied | blocked: Java not installed |

## Manual checks

| ID | Title | Traces to | Steps | Expected result |
| --- | --- | --- | --- | --- |
| MC-1 | 3D aesthetic blend | R-4, R-5, R-7 | Open hero on desktop, watch for 30s | Elements blend into the background, motion is slow and never distracts from reading |
| MC-2 | Cross-device visual review | R-15 | Open on a real phone and tablet | Layout is comfortable, no crowding, motion stays light |
| MC-3 | Panel contrast over bright frames | R-7 | Watch the brightest ripple frame behind the panel | Text stays comfortably readable |

## Sign-off

- Requirements approved: 2026-10-24
- Test cases approved: 2026-10-24
- Last full run: _(filled after the green run)_
- Production build: _(filled after `npm run build`)_
- Deployed: _(filled after deploy)_

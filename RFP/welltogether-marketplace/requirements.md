# WellTogether — Requirements

- Feature: `welltogether-marketplace`
- Branch: `feature/welltogether-marketplace`
- Date: 2026-10-24
- Status: **approved**
- Approved by: user ("Approved") — 2026-10-24
- Firebase project: `welltogether-77546`
- Target URL: https://welltogether-77546.web.app

## Goal

A modern, professional and calming marketing site for **WellTogether**, a
third-party wellness marketplace. Visitors explore, compare and enquire with
wellness centres and service providers. No bookings or payments in v1.

## Stack

| Layer | Choice |
| --- | --- |
| UI | React 19 + Vite |
| Hosting | Firebase Hosting |
| Database | Cloud Firestore (enquiries only in v1) |
| Files | Cloud Storage for Firebase (not used in v1 — no uploads) |
| Access | Firebase **client** SDK from the browser only |

No additional backend: no Cloud Functions, no API server, no third-party BaaS.

## Scope

### In scope

- Single landing page: header, hero, service categories, featured centres,
  how it works, reviews, footer.
- 3D wellness hero background with frosted-glass content panel.
- Enquiry form writing to `enquiries` (create only).
- Responsive layouts for mobile, tablet and desktop.
- Demo data for centres and reviews, clearly labelled.

### Out of scope

Payments and booking, user accounts/login, admin dashboard, multi-language,
custom domain, transactional email, real partner onboarding, blog, individual
centre detail routes (cards + enquiry modal only), Cloud Storage uploads.

## Requirements

| ID | Requirement | Acceptance criteria | Priority |
| --- | --- | --- | --- |
| R-1 | Modern, professional, calming brand feel; clean layout with clearly readable text | Body text ≥ 16px; calm spacing; WCAG AA contrast for all text | critical |
| R-2 | Header with wordmark, nav (Services, Centres, How It Works, Reviews) and "Find a Centre" CTA | Sticky header; mobile hamburger menu; keyboard operable | high |
| R-3 | Hero section sits immediately below the header | Hero starts at header bottom (no gap, no intermediate section) | critical |
| R-4 | Full-bleed 3D background: zen stones, water ripples, leaves, meditation elements | Canvas spans viewport width; no card/box frame; elements blend into open background | critical |
| R-5 | Slow floating motion with subtle depth that never blocks reading or clicking | Canvas is `pointer-events: none`; `prefers-reduced-motion` renders a static scene | critical |
| R-6 | Transparent hero panel (no fill, no blur): heading, short description, service info slides, manual navigation | Auto-advance + prev/next + dots + keyboard arrows + touch swipe; pause/play control; 3D visuals visible through the panel area | critical |
| R-7 | Visuals remain visible through the panel while text contrast stays clear | Panel background fully transparent; copy sits on an open gradient wash (no box); text ≥ 4.5:1 (≥ 3:1 for large) | critical |
| R-8 | Palette: English Sage, Warm Ivory, Dusty Blue, Soft Taupe; Muted Olive for buttons/actions | Tokens defined in CSS variables; primary actions use Muted Olive only | critical |
| R-9 | Hero CTAs: "Explore Wellness" and "Find a Centre" | Scroll to Service Categories / Featured Centres; ≥ 44px targets; visible focus | critical |
| R-10 | Service Categories: Yoga, Meditation, Ayurveda, Panchkarma, Ayurvedic Spa, Natural Wellness | Exactly six cards with these labels; card opens enquiry with service preselected | high |
| R-11 | Featured Centres section | ≥ 6 demo cards: name, city, services, rating, price range, visible "Demo" badge | high |
| R-12 | How It Works section | 3–4 numbered steps, plain language | medium |
| R-13 | Reviews section | ≥ 4 demo testimonials with author, rating and text, plus visible demo label | medium |
| R-14 | Sample centres and reviews clearly marked as demo | Per-card badge on every demo item + page-level illustrative-data note | high |
| R-15 | Layout correct on mobile, tablet and desktop | 360 / 768 / 1280 px: no horizontal scroll, correct reflow; simplified lightweight 3D on small screens | critical |
| R-16 | Enquiry form: name, email, phone (optional), service, centre (optional), message | Validation with inline errors; loading, success and error states; duplicate submit blocked; Firestore `enquiries` create-only | critical |
| R-17 | Performance budget | 3D lazy-loaded after first paint; paused when offscreen or tab hidden; CLS < 0.1; cap DPR at 1.5 | high |
| R-18 | Accessibility | Semantic landmarks, single h1, keyboard journey, visible focus, labelled inputs, carousel `aria-*`, reduced motion honoured | high |
| R-19 | SEO and metadata | Title, description, OG/Twitter tags, favicon, `lang="en"` | medium |
| R-20 | Content in English with India context | Cities and ₹ pricing in demo data; copy in English | medium |

## Data model and access

| Path | Fields | Read | Write | Rules note |
| --- | --- | --- | --- | --- |
| `enquiries/{autoId}` | `name`, `email`, `phone?`, `service`, `centreId?`, `message`, `source`, `createdAt` | nobody (client) | anyone (create) | Field/type/length validation; update and delete denied; read denied |

Demo centres and reviews are static TypeScript data in `src/data/` for v1 —
not stored in Firestore, therefore no read rules needed for them.

Config values come from environment variables (names only):
`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
`VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`,
`VITE_FIREBASE_APP_ID`.

## Design tokens

| Token | Hex | Use |
| --- | --- | --- |
| Warm Ivory | `#F7F2E8` | page background |
| English Sage | `#9CAF88` | accents, soft fills |
| Dusty Blue | `#7C94A6` | secondary accent, ratings |
| Soft Taupe | `#C8B9A9` | borders, muted surfaces |
| Muted Olive | `#5F6B45` | primary buttons and actions |
| Ink | `#2E3328` | headings, body text |
| Muted Ink | `#5A5F55` | secondary text |

Fonts: Fraunces (headings) and Inter (body), self-hosted via `@fontsource`.

## Decisions on suggestions

| Suggestion | Decision | Reason |
| --- | --- | --- |
| S-1 Static content, Firestore only for enquiries | accepted | fast launch, minimal rules surface |
| S-2 three.js + `@react-three/fiber`, procedural geometry | accepted | open-background blend without external assets |
| S-3 Static CSS/SVG composition on mobile and reduced motion, DPR cap 1.5 | accepted | requirement 9, battery and performance |
| S-4 Category card opens enquiry with service preselected | accepted | marketplace conversion |
| S-5 Autoplay carousel with pause/play, hover/focus pause | accepted | WCAG 2.2.2 |
| S-6 Honeypot + client-side rate limit on the form | accepted | spam guard without a backend |
| S-7 Deploy v1 on `web.app`, custom domain later | accepted | ship now |

## Assumptions

- Language is English only.
- Enquiries are stored in Firestore; no email notification (would need a backend).
- Cloud Firestore is enabled (Native mode) in `welltogether-77546` and the rules
  from `firestore.rules` are deployed.
- Java is not installed, so emulator-based rules unit tests are unavailable on
  this machine; rules are verified against the live project instead.

## Resolved prerequisites

1. Cloud Firestore enabled (Native mode) — done.
2. Firebase Web App registered (`welltogether-web`) — done, config in
   `.env.local` (gitignored) and `.env.example` documents the names.

# RFP templates

Copy these structures into `RFP/<feature-name>/requirements.md` and
`RFP/<feature-name>/test-cases.md`. Keep the IDs stable — the test file refers
to them.

## requirements.md

```markdown
# <Feature Name> — Requirements

- Feature: <feature-name>
- Branch: feature/<feature-name>
- Date: <YYYY-MM-DD>
- Status: draft | approved
- Approved by: <user note + date>

## Goal

One or two sentences: the problem and the outcome.

## Scope

### In scope

- ...

### Out of scope

- ...

## Requirements

| ID  | Requirement | Acceptance criteria | Priority |
| --- | ----------- | ------------------- | -------- |
| R-1 | ...         | ...                 | critical |
| R-2 | ...         | ...                 | high     |

## Stack

- UI: React
- Hosting: Firebase Hosting
- Database: Cloud Firestore
- Files: Cloud Storage for Firebase
- Access: Firebase client SDK from React only — no extra backend or service

## Data model and access

| Path (collection / storage prefix) | Fields or files | Read by | Written by | Rules note |
| ---------------------------------- | --------------- | ------- | ---------- | ---------- |
| `items/{id}`                       | ...             | public  | author     | ...        |

Config values consumed from env (names only, never values):
`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, ...

## Constraints

Supported browsers, accessibility level, performance budget, SEO/metadata needs,
image size/format limits for Storage uploads, and emulator usage for tests.

## Assumptions

- ...

## Open questions

- ... (must be empty or explicitly accepted before approval)

## Suggestions and decisions

| Suggestion | Decision | Reason |
| ---------- | -------- | ------ |
| ...        | accepted / dropped | ... |
```

## test-cases.md

```markdown
# <Feature Name> — Test Cases

- Feature: <feature-name>
- Date: <YYYY-MM-DD>
- Status: draft | approved
- Suite: tests/<feature-name>.spec.ts

## Coverage summary

| Requirement | Test cases | Automated |
| ----------- | ---------- | --------- |
| R-1         | TC-1, TC-2 | yes       |

## Test cases

| ID   | Title | Traces to | Priority | Steps | Expected result |
| ---- | ----- | --------- | -------- | ----- | --------------- |
| TC-1 | ...   | R-1       | critical | 1. ...<br>2. ... | ... |

## Fixtures and rules checks

| TC   | Seed data (Firestore / Storage) | Cleanup | Rule exercised | Expected for forbidden access |
| ---- | ------------------------------- | ------- | -------------- | ----------------------------- |
| TC-2 | ...                             | ...     | ...            | denied + friendly UI error    |

## Interaction coverage

Every interactive control appears once. Assert the effect, never the render.

| Control | Action | Expected effect | TC |
| ------- | ------ | --------------- | -- |
| Header nav link | click | Section in view + `location.hash` updates | ... |
| Header CTA | click | Dialog opens; X / Esc / backdrop all close it | ... |
| Mobile menu toggle | click | `aria-expanded` flips, panel opens, a link closes it | ... |
| Hero CTAs | click | Correct section scrolled, ≥ 44px, keyboard reachable | ... |
| Carousel prev/next | click | Counter advances and wraps at the ends | ... |
| Carousel dots | click | Target slide active, other dots inactive | ... |
| Carousel pause | click | Play state flips both ways (`aria-pressed`) | ... |
| Service card | click | Dialog opens with that service preselected | ... |
| Centre card | click | Dialog carries the centre name + first service | ... |
| Form fields | type invalid | Inline errors appear; fixing them clears the errors | ... |
| Submit | click | Disabled while pending, success view, duplicate blocked | ... |
| Dialog focus | open | Autofocus first field; Esc closes | ... |
| Live write | deployed URL | Real Firestore write succeeds, client read denied | ... |

## Manual checks

| ID   | Title | Traces to | Steps | Expected result |
| ---- | ----- | --------- | ----- | --------------- |
| TC-9 | ...   | R-3       | ...   | ...             |

## Sign-off

- Requirements approved: <date>
- Test cases approved: <date>
- Last full run: `npm test` — <passed>/<total> (chromium, firefox, webkit)
- Production build: `npm run build` — pass/fail
- Deployed: not deployed | `<project-id>` (<date>)
```

## Conventions

- One requirement, one primary acceptance criterion; split rather than stack.
- Every `R-*` appears at least once in the `traces to` column.
- Every `TC-*` is either automated in `tests/` or listed under manual checks.
- IDs are never reused after a rename; retire them and add new ones.
- File names stay exactly `requirements.md` and `test-cases.md`.

---
name: Website Feature Workflow
description: End-to-end workflow for building a React + Firebase website feature (Firebase Hosting, Cloud Firestore, Cloud Storage via the client SDK) — gather requirements, agree on test cases, get explicit user approval, branch and save RFP docs, then implement and test autonomously until green. Use when the user asks to build, add, change, or rework any website feature, page, section, or component.
---

# Website Feature Workflow

Five phases, in this order. Never skip a phase and never reorder them.

```
1. Requirements  ->  2. Test cases  ->  3. USER APPROVAL  ->  4. Branch + RFP docs  ->  5. Build & test loop
```

**Hard gate:** nothing from phase 4 or 5 happens until the user has explicitly
approved *both* the requirements and the test cases in the current conversation.
A vague "ok" about one document is not approval for both — ask for the missing one.

## Fixed stack — do not substitute

This product is **React + Firebase**. The stack is locked; it is not a
discussion point and not a place to improvise.

| Layer       | Choice                                                                    |
| ----------- | ------------------------------------------------------------------------- |
| UI          | React (existing scaffold; if none exists, Vite + React — and say so)      |
| Hosting     | Firebase Hosting                                                          |
| Database    | Cloud Firestore                                                           |
| Files       | Cloud Storage for Firebase                                                |
| Data access | Firebase **client** SDK, called directly from React                       |

Rules:

- **No additional backend or service.** No Cloud Functions, Cloud Run,
  Express/Node API, serverless handlers, another BaaS, headless CMS, or proxy.
- React talks to Firebase through the client SDK only — `firebase/app`,
  `firebase/firestore`, `firebase/storage` (plus `firebase/auth` only if the
  user explicitly approves it).
- No Admin SDK, service account keys, or privileged credentials in the browser
  or the repo. All traffic is treated as an untrusted client.
- If a requirement genuinely needs trusted server-side logic (secret API keys,
  payments, email sending, cross-user aggregation, moderation), that is a
  blocker — stop and ask. Do not introduce a backend to satisfy it.
- Firebase config comes from environment variables (`VITE_FIREBASE_*`);
  `.env*` stays gitignored. Never hardcode project credentials in source.
- Every Firestore and Storage path needs security rules that assume the client
  is hostile. Shipping a feature without its rules is incomplete work.
- Firebase CLI is available (`firebase --version` → 15.x). Use it for the
  emulator suite, rules deploy, and hosting deploy.

## Branching model

```
master   → production. Only receives merges from develop (releases).
develop  → integration. Every feature merges here first.
feature/<feature-name> → one feature, cut from develop, merged back to develop.
fix/<name>, docs/<name>, chore/<name> → same rule for non-feature work.
```

- One branch per feature, never mix two features in one branch.
- `master` only advances on a release: `git switch master && git merge --ff-only develop`.
- Delete the branch after merge (local and remote).

## Phase 1 — Requirements

Ask questions, do not assume. Keep it to one round of focused questions, then
propose improvements.

Cover:

- Goal and the single problem this feature solves.
- Audience and the pages/routes affected.
- Content and data: where does it come from, what is static vs dynamic.
- Behaviour: states (empty, loading, error, success), validation, edge cases.
- Design: reference sites, layout expectations, responsive breakpoints,
  existing components or design system to reuse.
- Stack is fixed (see above). Still ask about: the data model and where each
  field comes from, who may read and write what (this decides the security
  rules), whether the feature needs login (Firebase Auth is *not* in the
  approved stack — ask explicitly before assuming it), SEO/metadata, analytics,
  accessibility level, supported browsers, and image size/format limits for
  Storage uploads.
- Out of scope — say it explicitly so later scope creep is visible.
- Localisation and copy ownership.

Then **suggest improvements** the user did not ask for: simpler alternatives,
accessibility wins, performance concerns, reusable patterns, risk callouts.
Mark each suggestion clearly as a recommendation and let the user accept or drop it.

Produce a draft requirements list with stable IDs (`R-1`, `R-2`, ...) and one
acceptance criterion per requirement. Keep it short enough to actually read.

## Phase 2 — Test cases

Derive every test case from a requirement ID. No orphan test cases and no
uncovered requirement — if a requirement cannot be tested, flag it now.

For each case record: `TC-<n>`, title, traces-to (`R-<n>`), priority
(critical / high / medium), preconditions, steps, expected result, and the
project file that will assert it.

Split coverage into:

- Happy path per requirement.
- Validation and error states.
- Boundary/edge cases (empty, very long, special characters, duplicate submit).
- Responsive and cross-browser checks where the requirement implies them.
- Accessibility checks (keyboard reachability, labels, focus order, contrast).
- Data and rules coverage: a seed/cleanup strategy for Firestore and Storage
  fixtures, plus at least one negative case per security rule — the client must
  not read or write what the rules forbid, and must not surface a raw Firebase
  permission error to the user.
- Interaction coverage: one case per control (link, button, menu, card, form
  field, submit) that asserts its *effect* — navigation, dialog prefill, error
  text, success state, disabled state — not just that it renders.

Automated cases are Playwright specs under `tests/` and follow the `playwright-cli`
skill. Thumbnail/manual-only checks must be labelled manual with the exact
steps — never silently dropped.

## Phase 3 — Approval

Present both documents together (requirements + test case table) and ask for
explicit approval. List any open questions and assumptions above the ask.

Rules:

- Wait for the answer. Do not start phase 4 in the same turn as the ask.
- If the user changes something, update the docs, show the diff summary, ask again.
- Record the approval in the RFP docs (`Approved: <date>` + approver note).

## Phase 4 — Branch and RFP docs

Only after approval.

1. Pick `<feature-name>`: lowercase kebab-case, 2–4 words, derived from the
   feature itself (`contact-form`, `pricing-section`, `blog-search`). Same name
   for the folder and the branch.
2. Create the branch from `develop` (never from another feature branch):

```bash
git switch develop
git pull
git switch -c feature/<feature-name>
git push -u origin feature/<feature-name>
```

   Check `git status` first and keep unrelated work out of the branch. If the
   repo has no commits yet, create the baseline commit before branching.
3. Save exactly two Markdown files:

```
RFP/<feature-name>/requirements.md   # goal, scope, R-*, data model, security rules, acceptance criteria
RFP/<feature-name>/test-cases.md     # TC-* table with traces-to column + fixtures
```

In `requirements.md` also pin down the Firebase surface the feature touches:
Firestore collections/fields, Storage paths, the security rules that will guard
them, and which config values come from environment variables. No Firebase
project IDs or secrets inside the RFP files — reference the env var name only.

Use `references/rfp-templates.md` as the starting structure. Commit both files
with a message like `docs(<feature-name>): add RFP requirements and test cases`
before writing product code, so the approved scope is reviewable on its own.

## Phase 5 — Build and test loop

Work autonomously. No check-ins for routine decisions; make the reasonable call
and note it.

Loop:

1. Implement the smallest increment that satisfies the next `R-*` item, using
   only React + the Firebase client SDK — no server-side code appears anywhere.
2. Wire the matching Firestore/Storage security rules in the same increment; a
   read/write path without rules is not implemented.
3. Run the relevant specs: `npx playwright test tests/<spec>.spec.ts`, then the
   full `npm test` once the file is green (all three browsers).
4. On failure, read the reporter output, HTML report, or trace; fix the cause in
   the product code or the test harness — not the expectation.
5. Re-run. Repeat until every test case passes, then do a final full run and a
   production build check: `npm run build` must succeed — Firebase Hosting
   serves that bundle, not the dev server.

### Interaction verification — mandatory, not optional

Rendering is not proof. A page that "looks right" can still have dead buttons,
links that go nowhere, a menu that never closes, or a form that silently fails.
Every feature ends with **browser-driven end-to-end interaction checks** using
the `playwright-cli` skill.

Run order for every feature:

1. After coding, run the interaction spec first — it catches broken wiring.
2. Then the full suite in all browsers.
3. Fix, rerun. Repeat until green.
4. Do one **headed** pass (`npx playwright test --headed --workers=1`) so the
   flow is watched in a real browser, and keep screenshots as evidence.

What "interacted" means — assert the effect, never the pixel:

| Control | Must be proven |
| --- | --- |
| Nav / anchor links | Section actually scrolls into view; `location.hash` matches; no dead `#` anchors |
| Header CTA | Opens the dialog; every close path works (X, `Escape`, backdrop) |
| Mobile hamburger | `aria-expanded` flips, panel opens, a link closes it and scrolls |
| Hero CTAs | Both reach their section, ≥ 44px, keyboard reachable |
| Carousel | Prev/next/dots wrap correctly, active dot moves, arrows work, pause changes the play state both ways |
| Cards | Each card opens the dialog with its own name/service prefilled |
| Form fields | Typing updates state; invalid values show inline errors; fixing clears them |
| Submit | Button disables while pending; success view appears; duplicate submit is rate-limited; server errors are human-readable |
| Focus | Dialog autofocus lands in the first field; `Escape` closes |
| Rules (live) | A real write succeeds and a client read is denied (run against the deployed URL with `PLAYWRIGHT_BASE_URL`) |

Flake policy: stabilize with `expect.poll`, explicit waits on state, or a slower
test adapter — never by loosening the assertion. A test that only passes when
run alone is a blocked item, not a pass.

Evidence to keep in `test-results/evidence/`: hero/panel, dialog prefilled,
validation errors, success state. Name them by step so the report can cite them.

Test data: prefer the Firebase Emulator Suite (`firebase emulators:start`) for
deterministic Firestore/Storage state and clean rules testing. If the emulators
cannot run on this machine, use a dedicated test project with explicit seed and
cleanup per spec — never test against live user data.

Non-negotiable rules:

- Never weaken a test to make it pass: no deleting assertions, no `test.skip`,
  no `waitForTimeout` padding, no snapshot re-baselining to hide a regression.
  If an expectation was genuinely wrong, the *requirement* changes first —
  with user approval.
- Never mark a requirement done that has no passing test.
- Never leave rules more permissive than the approved requirement just to make a
  test pass (`allow read, write: if true` is never acceptable).
- Keep unrelated files out of the branch; no drive-by refactors.
- Stay inside the approved scope. A new idea goes to the report as "deferred".
- Update `test-cases.md` only to add cases discovered while building; note why.

### Deployment — only when the user asks to ship

```bash
npm run build
firebase deploy --only hosting,firestore:rules,storage:rules --project <id>
```

Deploy to the named project only; never use `--force`, never create a second
Firebase project on your own, and treat a rules-only change as a deploy that
needs the same review as code. Without an explicit shipping request, stop at a
green `npm test` + successful build and report that it is ready to deploy.

## Blockers — stop and report

Stop the loop and tell the user, briefly and with the exact need, when:

- A requirement is ambiguous or two requirements contradict each other.
- Credentials, API keys, third-party access, or content is missing.
- A requirement needs trusted server-side logic or an extra service — the stack
  forbids it, so ask instead of adding one.
- Login is required but the user has not approved Firebase Auth.
- The Firebase project, client config values (`VITE_FIREBASE_*`), or deploy
  access is missing.
- Firestore/Storage emulators are needed but cannot run on this machine.
- A test environment is broken (browser download, port clash, dev server down)
  and the fix needs a decision or elevated permission.
- The same fix has been attempted about 3 times without progress.
- Passing requires changing approved scope.

Do not guess past a blocker and do not leave the tree in a half-broken state
without saying so.

## Final report

End with: branch name, RFP file paths, requirement-to-test coverage table,
`npm test` result per browser, `npm run build` result, interaction verification
summary (control groups proven, headed pass done, evidence paths), files changed
(code and rules), stack compliance note (client SDK only, no extra service),
deploy status (not deployed / deployed to `<project>`), deferred items, and
anything the user must review manually.

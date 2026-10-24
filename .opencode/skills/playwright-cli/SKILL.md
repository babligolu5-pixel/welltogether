---
name: Playwright CLI
description: Playwright browser testing in this project — run tests, generate tests with codegen, install browsers, debug failures, and read HTML/trace reports with the Playwright CLI. Use when asked to test the site/UI in a browser, write or fix Playwright specs, record a test, or debug a failing test.
---

# Playwright CLI

Project-local Playwright setup. `@playwright/test` is installed as a dev
dependency, browsers (Chromium, Firefox, WebKit) are downloaded, and
`playwright.config.ts` sits at the repo root with `testDir: './tests'`.

## Workflow

1. Read `playwright.config.ts` before running anything — it defines the
   projects, reporter, and whether a `webServer` block is active.
2. Run the smallest useful scope first: `npx playwright test tests/<file>.spec.ts`.
3. On failure, read the list output, then open the HTML report or trace.
4. Only expand to all projects (`npm test`) once the single browser passes.

## Everyday commands

| Goal                    | Command                                          |
| ----------------------- | ------------------------------------------------ |
| All browsers            | `npm test`                                       |
| One file                | `npx playwright test tests/example.spec.ts`      |
| Single browser          | `npx playwright test --project=chromium`         |
| Watch the browser       | `npx playwright test --headed`                   |
| Interactive UI mode     | `npm run test:ui`                                |
| Step debugger           | `npm run test:debug`                             |
| Record a test           | `npm run codegen -- https://example.com`         |
| Open last HTML report   | `npm run report`                                 |
| List tests without run  | `npx playwright test --list`                     |
| Check CLI + browsers    | `npx playwright --version` / `npx playwright install --list` |

## Writing tests

- Put specs in `tests/`, name them `*.spec.ts`.
- Import from `@playwright/test` only: `import { test, expect } from '@playwright/test'`.
- Prefer role/label locators (`getByRole`, `getByLabel`, `getByText`) over CSS.
- Prefer web-first assertions (`toBeVisible`, `toHaveText`) over `waitForTimeout`.
- Keep tests independent; no shared mutable state between specs.

## Rules

- Never commit generated artifacts (`test-results/`, `playwright-report/`,
  `blob-report/`) — they are already in `.gitignore`.
- Do not delete browser downloads; re-downloading is slow. Repair with
  `npx playwright install --force <browser>` instead.
- Do not bypass a failing test by adding `test.skip` unless the user agrees.

## Troubleshooting

- `npm`/`npx` blocked by PowerShell execution policy: use `npm.cmd` /
  `npx.cmd`, or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- `Executable doesn't exist` / missing browser: `npx playwright install <browser>`.
- Timeouts on a local app: the `webServer` block in the config may be missing or
  pointing at the wrong `url`/port.
- Flaky only on WebKit/Firefox: check `--project=<name>` in isolation before
  touching the config.

See `references/commands.md` for the full flag and environment variable list.

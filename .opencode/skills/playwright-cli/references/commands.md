# Playwright CLI reference

All commands run from the project root (`D:\final site`) through `npx playwright`
(or the `npm run` aliases defined in `package.json`).

## test

```bash
npx playwright test                      # every project, headless
npx playwright test --project=webkit     # one project
npx playwright test tests/login.spec.ts:42   # one test by line
npx playwright test -g "checkout"        # filter by title
npx playwright test --headed             # show the browser
npx playwright test --debug              # Playwright Inspector
npx playwright test --ui                 # UI mode
npx playwright test --repeat-each=3      # flake detection
npx playwright test --last-failed        # rerun failures only
npx playwright test --list               # collect without running
npx playwright test --update-snapshots   # refresh screenshots
```

Useful reporters/flags: `--reporter=line|list|html|json`, `--workers=N`,
`--timeout=30000`, `--retries=2`, `--grep-invert`, `--max-failures=1`.

## codegen

```bash
npx playwright codegen                       # record against about:blank
npx playwright codegen http://localhost:3000 # record against the app
npx playwright codegen --target=javascript   # emit JS instead of TS
npx playwright codegen --device="iPhone 13"  # emulated device
npx playwright codegen --save-storage=auth.json   # save session state
npx playwright codegen --load-storage=auth.json   # reuse session state
```

## install

```bash
npx playwright install                # all browsers from the config
npx playwright install chromium       # one browser
npx playwright install --with-deps    # + OS libraries (Linux/CI)
npx playwright install --list         # installed versions and paths
npx playwright install --force        # repair a corrupted download
npx playwright uninstall              # remove downloaded browsers
```

Downloads land in `%LOCALAPPDATA%\ms-playwright` on Windows.

## show-report / show-trace

```bash
npx playwright show-report                     # HTML report (default dir)
npx playwright show-report custom-report-dir   # explicit dir
npx playwright show-trace test-results/<test>/trace.zip
```

## open / screenshot helpers

```bash
npx playwright open https://example.com          # interactive page inspector
npx playwright screenshot <url> shot.png          # quick screenshot
npx playwright pdf <url> page.pdf                 # page to PDF
npx playwright cr <url>                           # shorthand for codegen
```

## Environment variables

| Variable                    | Effect                                        |
| --------------------------- | --------------------------------------------- |
| `CI`                        | Enables retries and single worker in config   |
| `PLAYWRIGHT_BROWSERS_PATH`  | Alternate browser download directory          |
| `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` | Skip postinstall browser download      |
| `DEBUG=pw:api`              | Log every API call                            |
| `PWDEBUG=1`                 | Force Inspector / step mode                   |
| `PLAYWRIGHT_JSON_OUTPUT_NAME` | JSON reporter target file                   |

## Artifacts

| Path                | Contents                                      |
| ------------------- | --------------------------------------------- |
| `test-results/`     | Per-test traces, screenshots, videos          |
| `playwright-report/`| HTML report (`npm run report` to open)        |
| `blob-report/`      | Sharded blob reports for merge-reports        |

Config defaults here: `trace: 'on-first-retry'`, `screenshot:
'only-on-failure'`, `video: 'retain-on-failure'`, reporter `list` + `html`
(never auto-opens).

import { test, expect } from '@playwright/test';

/**
 * Live Firestore checks against the deployed site.
 * Run with:
 *   $env:PLAYWRIGHT_BASE_URL='https://welltogether-77546.web.app'; npx playwright test tests/firestore-live.spec.ts
 * They are skipped in the normal local run because the E2E adapter short-circuits writes.
 */
const live = Boolean(process.env.PLAYWRIGHT_BASE_URL);

test.describe('live Firestore enquiry', () => {
  test.skip(!live, 'Needs PLAYWRIGHT_BASE_URL pointing at the deployed site');

  test('TC-19L a real enquiry is accepted by Firestore', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('centre-enquire').first().click();

    const unique = `e2e+${Date.now()}@example.com`;
    await page.getByTestId('enquiry-name').fill('E2E Check');
    await page.getByTestId('enquiry-email').fill(unique);
    await page.getByTestId('enquiry-message').fill(
      'Automated verification of the production enquiry pipeline.',
    );
    await page.getByTestId('enquiry-submit').click();

    await expect(page.getByTestId('enquiry-success')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByTestId('enquiry-error')).toHaveCount(0);
  });

  test('TC-20L client reads of enquiries are denied by security rules', async ({ request }) => {
    const projectId = 'welltogether-77546';
    const apiKey = 'AIzaSyBvMD3cjImDLtF81Ck_knbkEsGnfCGVRSQ';
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/enquiries?key=${apiKey}`;

    const response = await request.get(url);
    expect([401, 403]).toContain(response.status());

    const body = await response.text();
    expect(body).toMatch(/PERMISSION_DENIED|permission|Missing or insufficient/i);
  });
});

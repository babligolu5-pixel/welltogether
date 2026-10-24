import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('TC-23 accessibility scan finds no serious or critical violations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero-panel')).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const blocking = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  );

  const summary = blocking.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.map((node) => node.target.join(' ')).slice(0, 3),
  }));

  expect(summary).toEqual([]);
});
